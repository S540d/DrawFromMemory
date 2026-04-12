// Maximum pixels for flood-fill to limit runtime/memory usage and guard against
// runaway fills (the fill may stop early when this limit is hit).
// Reduced from 500 000 to 150 000 to prevent OOM on low-memory Android devices
// (e.g. Nexus 6 with ~3 GB RAM).
export const MAX_FLOOD_FILL_PIXELS = 150000;

export interface RGBAColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export function hexToRgb(hex: string): RGBAColor {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 255,
      }
    : { r: 0, g: 0, b: 0, a: 255 };
}

/**
 * Checks whether the pixel at the given byte offset matches the start color
 * within a tolerance of ±2 per channel (for anti-aliased edges).
 */
function matchesStart(
  pixels: Uint8ClampedArray,
  pos: number,
  startR: number,
  startG: number,
  startB: number,
  startA: number
): boolean {
  return (
    Math.abs(pixels[pos] - startR) <= 2 &&
    Math.abs(pixels[pos + 1] - startG) <= 2 &&
    Math.abs(pixels[pos + 2] - startB) <= 2 &&
    Math.abs(pixels[pos + 3] - startA) <= 2
  );
}

/**
 * Scanline flood-fill on a pixel buffer.
 *
 * Instead of pushing every single pixel onto a stack (which can grow to
 * hundreds of thousands of entries on large canvases), this algorithm
 * processes entire horizontal runs at once. The stack only holds one entry
 * per scanline segment, reducing peak stack size from O(pixels) to O(rows)
 * — a ~1000× reduction on a 1440×400 canvas.
 *
 * This is critical for low-memory Android devices (e.g. Nexus 6) where the
 * per-pixel stack approach caused OOM crashes.
 *
 * @param pixels  ImageData.data (Uint8ClampedArray, mutated in place)
 * @param width   Canvas width in pixels
 * @param height  Canvas height in pixels
 * @param startX  X coordinate of the fill origin
 * @param startY  Y coordinate of the fill origin
 * @param targetColor  The color to fill with
 */
export function floodFillPixels(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  targetColor: RGBAColor
): boolean {
  const x0 = Math.floor(startX);
  const y0 = Math.floor(startY);

  if (x0 < 0 || x0 >= width || y0 < 0 || y0 >= height) return false;

  const startPos = (y0 * width + x0) * 4;
  const startR = pixels[startPos];
  const startG = pixels[startPos + 1];
  const startB = pixels[startPos + 2];
  const startA = pixels[startPos + 3];

  // Already the target color – nothing to do
  if (
    startR === targetColor.r &&
    startG === targetColor.g &&
    startB === targetColor.b &&
    startA === targetColor.a
  ) {
    return false;
  }

  // Visited bitmap — one byte per pixel (much cheaper than Set<number>)
  const visited = new Uint8Array(width * height);

  // Scanline stack: each entry is [x, y] — one per horizontal segment found.
  // Peak size is bounded by O(height) instead of O(pixels).
  const stack: [number, number][] = [[x0, y0]];
  visited[y0 * width + x0] = 1;
  let filledCount = 0;

  while (stack.length > 0 && filledCount < MAX_FLOOD_FILL_PIXELS) {
    const [seedX, seedY] = stack.pop()!;
    const rowStart = seedY * width;

    // Skip if this seed no longer matches (may have been filled by another segment)
    if (!matchesStart(pixels, (rowStart + seedX) * 4, startR, startG, startB, startA)) {
      continue;
    }

    // Expand left from seed
    let left = seedX;
    while (left > 0 && !visited[rowStart + left - 1] &&
           matchesStart(pixels, (rowStart + left - 1) * 4, startR, startG, startB, startA)) {
      left--;
    }

    // Expand right from seed
    let right = seedX;
    while (right < width - 1 && !visited[rowStart + right + 1] &&
           matchesStart(pixels, (rowStart + right + 1) * 4, startR, startG, startB, startA)) {
      right++;
    }

    // Fill the entire horizontal span [left..right]
    for (let x = left; x <= right && filledCount < MAX_FLOOD_FILL_PIXELS; x++) {
      const idx = rowStart + x;
      visited[idx] = 1;
      const pos = idx * 4;
      pixels[pos] = targetColor.r;
      pixels[pos + 1] = targetColor.g;
      pixels[pos + 2] = targetColor.b;
      pixels[pos + 3] = targetColor.a;
      filledCount++;
    }

    // Scan the row above and below for new segments to seed
    for (const ny of [seedY - 1, seedY + 1]) {
      if (ny < 0 || ny >= height) continue;
      const nRowStart = ny * width;
      let x = left;
      while (x <= right) {
        // Skip non-matching / already-visited pixels
        while (x <= right && (visited[nRowStart + x] ||
               !matchesStart(pixels, (nRowStart + x) * 4, startR, startG, startB, startA))) {
          x++;
        }
        if (x > right) break;
        // Found the start of a matching segment — push one seed.
        // Only mark the seed itself as visited; the rest of the segment will be
        // visited when the seed is popped and its row is expanded left/right.
        stack.push([x, ny]);
        visited[nRowStart + x] = 1;
        x++;
        // Skip the rest of this matching segment so we don't push duplicate seeds.
        // Do NOT mark these pixels as visited — the expand-left/right phase needs
        // them unvisited to discover the full span.
        while (x <= right &&
               !visited[nRowStart + x] &&
               matchesStart(pixels, (nRowStart + x) * 4, startR, startG, startB, startA)) {
          x++;
        }
      }
    }
  }

  return filledCount > 0;
}
