// Maximum pixels for flood-fill to limit runtime/memory usage and guard against
// runaway fills (the fill may stop early when this limit is hit).
// Reduced from 500 000 to 150 000 to prevent OOM on low-memory Android devices
// (e.g. Nexus 6 with ~3 GB RAM).
export const MAX_FLOOD_FILL_PIXELS = 150000;

// When the canvas exceeds this many total pixels, downsample before flood-filling.
// Nexus 6 canvas is ~1392×400 = 556 800 px — at that size the pixel buffer alone
// is 2.2 MB, plus visited bitmap + Skia allocations → OOM.
// Threshold set so that typical phone-sized canvases (≤360 px wide) skip
// downsampling entirely, while Quad-HD devices always downsample.
const DOWNSAMPLE_PIXEL_THRESHOLD = 200000;

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
 * Core scanline flood-fill on a pixel buffer.
 *
 * Instead of pushing every single pixel onto a stack (which can grow to
 * hundreds of thousands of entries on large canvases), this algorithm
 * processes entire horizontal runs at once. The stack only holds one entry
 * per scanline segment, reducing peak stack size from O(pixels) to O(rows)
 * — a ~1000× reduction on a 1440×400 canvas.
 */
function scanlineFill(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  x0: number,
  y0: number,
  targetColor: RGBAColor
): boolean {
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

  // Bit-packed visited bitmap — 1 bit per pixel instead of 1 byte.
  // For a 1392×400 canvas this uses ~68 KB instead of ~557 KB.
  const visitedBits = new Uint32Array(Math.ceil((width * height) / 32));

  const markVisited = (idx: number) => {
    visitedBits[idx >>> 5] |= 1 << (idx & 31);
  };
  const isVisited = (idx: number): boolean => {
    return (visitedBits[idx >>> 5] & (1 << (idx & 31))) !== 0;
  };

  // Scanline stack: each entry is [x, y] — one per horizontal segment found.
  // Peak size is bounded by O(height) instead of O(pixels).
  const stack: [number, number][] = [[x0, y0]];
  markVisited(y0 * width + x0);
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
    while (left > 0 && !isVisited(rowStart + left - 1) &&
           matchesStart(pixels, (rowStart + left - 1) * 4, startR, startG, startB, startA)) {
      left--;
    }

    // Expand right from seed
    let right = seedX;
    while (right < width - 1 && !isVisited(rowStart + right + 1) &&
           matchesStart(pixels, (rowStart + right + 1) * 4, startR, startG, startB, startA)) {
      right++;
    }

    // Fill the entire horizontal span [left..right]
    for (let x = left; x <= right && filledCount < MAX_FLOOD_FILL_PIXELS; x++) {
      const idx = rowStart + x;
      markVisited(idx);
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
        while (x <= right && (isVisited(nRowStart + x) ||
               !matchesStart(pixels, (nRowStart + x) * 4, startR, startG, startB, startA))) {
          x++;
        }
        if (x > right) break;
        // Found the start of a matching segment — push one seed.
        stack.push([x, ny]);
        markVisited(nRowStart + x);
        x++;
        // Skip the rest of this matching segment so we don't push duplicate seeds.
        while (x <= right &&
               !isVisited(nRowStart + x) &&
               matchesStart(pixels, (nRowStart + x) * 4, startR, startG, startB, startA)) {
          x++;
        }
      }
    }
  }

  return filledCount > 0;
}

/**
 * Downsample an RGBA pixel buffer by the given factor using min-pooling.
 *
 * Nearest-neighbor loses thin strokes (1–2 px wide) when the sampled corner
 * of a block happens to be background. Min-pooling instead picks the darkest
 * (most-drawn) pixel in each block, so every stroke survives regardless of
 * where it falls within the block.
 *
 * "Darkest" = lowest sum of RGB channels (black stroke on white background).
 */
function downsample(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  factor: number
): { pixels: Uint8ClampedArray; width: number; height: number } {
  const dw = Math.floor(width / factor);
  const dh = Math.floor(height / factor);
  const out = new Uint8ClampedArray(dw * dh * 4);

  for (let dy = 0; dy < dh; dy++) {
    for (let dx = 0; dx < dw; dx++) {
      // Find the darkest pixel in the factor×factor block
      let bestPos = (dy * factor * width + dx * factor) * 4;
      let bestBrightness = pixels[bestPos] + pixels[bestPos + 1] + pixels[bestPos + 2];

      for (let by = 0; by < factor; by++) {
        const sy = dy * factor + by;
        if (sy >= height) break;
        for (let bx = 0; bx < factor; bx++) {
          const sx = dx * factor + bx;
          if (sx >= width) break;
          const pos = (sy * width + sx) * 4;
          const brightness = pixels[pos] + pixels[pos + 1] + pixels[pos + 2];
          if (brightness < bestBrightness) {
            bestBrightness = brightness;
            bestPos = pos;
          }
        }
      }

      const dstPos = (dy * dw + dx) * 4;
      out[dstPos] = pixels[bestPos];
      out[dstPos + 1] = pixels[bestPos + 1];
      out[dstPos + 2] = pixels[bestPos + 2];
      out[dstPos + 3] = pixels[bestPos + 3];
    }
  }
  return { pixels: out, width: dw, height: dh };
}

/**
 * Upsample a filled RGBA buffer back to the original size.
 * Only pixels that differ from the original are written (i.e. only filled pixels).
 */
function upsampleFill(
  original: Uint8ClampedArray,
  filled: Uint8ClampedArray,
  origWidth: number,
  origHeight: number,
  smallWidth: number,
  smallHeight: number,
  factor: number
): void {
  for (let dy = 0; dy < smallHeight; dy++) {
    for (let dx = 0; dx < smallWidth; dx++) {
      const dstPos = (dy * smallWidth + dx) * 4;
      const fr = filled[dstPos];
      const fg = filled[dstPos + 1];
      const fb = filled[dstPos + 2];
      const fa = filled[dstPos + 3];

      // Check if this small pixel was actually filled (differs from source)
      const srcSample = (dy * factor * origWidth + dx * factor) * 4;
      if (
        original[srcSample] === fr &&
        original[srcSample + 1] === fg &&
        original[srcSample + 2] === fb &&
        original[srcSample + 3] === fa
      ) {
        continue; // not filled
      }

      // Paint the corresponding block in the original buffer
      const startY = dy * factor;
      const startX = dx * factor;
      const endY = Math.min(startY + factor, origHeight);
      const endX = Math.min(startX + factor, origWidth);
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const pos = (y * origWidth + x) * 4;
          original[pos] = fr;
          original[pos + 1] = fg;
          original[pos + 2] = fb;
          original[pos + 3] = fa;
        }
      }
    }
  }
}

/**
 * Flood-fill on a pixel buffer with automatic downsampling for large canvases.
 *
 * On high-resolution devices (e.g. Nexus 6 at 1440×400 = 576K pixels), the
 * full-resolution pixel buffer + visited bitmap can exceed available JS heap
 * memory. When the canvas exceeds DOWNSAMPLE_PIXEL_THRESHOLD, we:
 * 1. Downsample the pixel buffer (nearest-neighbor, factor 2–4×)
 * 2. Run scanline flood-fill on the smaller buffer
 * 3. Upsample the filled pixels back to the original buffer
 *
 * This trades slight edge precision for a 4–16× reduction in memory usage.
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

  const totalPixels = width * height;

  if (totalPixels <= DOWNSAMPLE_PIXEL_THRESHOLD) {
    // Small canvas — fill at full resolution
    return scanlineFill(pixels, width, height, x0, y0, targetColor);
  }

  // Large canvas — downsample to reduce memory pressure
  const factor = totalPixels > DOWNSAMPLE_PIXEL_THRESHOLD * 4 ? 4 : 2;
  const small = downsample(pixels, width, height, factor);
  const smallX = Math.floor(x0 / factor);
  const smallY = Math.floor(y0 / factor);

  if (smallX < 0 || smallX >= small.width || smallY < 0 || smallY >= small.height) return false;

  const changed = scanlineFill(small.pixels, small.width, small.height, smallX, smallY, targetColor);

  if (changed) {
    upsampleFill(pixels, small.pixels, width, height, small.width, small.height, factor);
  }

  return changed;
}
