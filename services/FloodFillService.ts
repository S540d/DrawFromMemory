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

// Bit-field helpers — store 1 bit per pixel in a Uint32Array.
// For a 1392×400 canvas: 556 800 bits = ~68 KB instead of ~557 KB (Uint8Array).
// >>> 0 forces an unsigned 32-bit interpretation, which matters for bit 31
// where (1 << 31) would otherwise produce a negative signed value.
function bfSet(bf: Uint32Array, idx: number): void {
  bf[idx >>> 5] |= (1 << (idx & 31)) >>> 0;
}
function bfGet(bf: Uint32Array, idx: number): boolean {
  return (bf[idx >>> 5] & ((1 << (idx & 31)) >>> 0)) !== 0;
}

/**
 * Flood-fill on a pixel buffer using a 1-bit palette approach.
 *
 * Memory problem on large canvases (e.g. Nexus 6 at 1440px wide):
 *   readPixels buffer alone = width × height × 4 bytes ≈ 2.2 MB
 *   Running the scanline algorithm directly on that buffer keeps a large
 *   working set in the JS heap, which triggers OOM on low-memory devices.
 *
 * Solution — reduce the working set to two compact bit-fields:
 *   matches  (1 bit/pixel) — pre-computed: does pixel match the start color?
 *   filled   (1 bit/pixel) — flood-fill result
 *
 *   For a 1392×400 canvas each bit-field is ~68 KB instead of 2.2 MB.
 *   Total working memory: ~136 KB + small stack, vs. ~2.8 MB before.
 *
 * The scanline algorithm runs entirely on the two bit-fields.
 * Only at the very end do we touch the original pixel buffer once, writing
 * targetColor to every pixel whose filled bit is set.
 *
 * @param pixels      ImageData.data (Uint8ClampedArray, mutated in place)
 * @param width       Canvas width in pixels
 * @param height      Canvas height in pixels
 * @param startX      X coordinate of the fill origin
 * @param startY      Y coordinate of the fill origin
 * @param targetColor The color to fill with
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

  const totalPixels = width * height;
  const bfWords = Math.ceil(totalPixels / 32);

  // Step 1 — build the matches bit-field in a single linear pass over pixels.
  // Tolerance ±2 per channel handles anti-aliased edges.
  // This is the only time we read the full pixel buffer.
  const matches = new Uint32Array(bfWords);
  for (let i = 0; i < totalPixels; i++) {
    const p = i * 4;
    if (
      Math.abs(pixels[p]     - startR) <= 2 &&
      Math.abs(pixels[p + 1] - startG) <= 2 &&
      Math.abs(pixels[p + 2] - startB) <= 2 &&
      Math.abs(pixels[p + 3] - startA) <= 2
    ) {
      bfSet(matches, i);
    }
  }

  // Start pixel must match
  if (!bfGet(matches, y0 * width + x0)) return false;

  // Step 2 — scanline flood-fill on the matches bit-field.
  // filled  — pixels that have been painted (result of fill).
  // queued  — pixels that are on the stack or have been processed as seeds,
  //           used to avoid pushing duplicate seeds. Separate from filled so
  //           that seeded-but-not-yet-expanded pixels are not counted or
  //           painted until their span is actually processed.
  const filled = new Uint32Array(bfWords);
  const queued = new Uint32Array(bfWords);

  // Scanline stack: one [x, y] entry per horizontal segment seed.
  // Peak size O(height) instead of O(pixels).
  const stack: [number, number][] = [[x0, y0]];
  bfSet(queued, y0 * width + x0);
  let filledCount = 0;

  while (stack.length > 0 && filledCount < MAX_FLOOD_FILL_PIXELS) {
    const [seedX, seedY] = stack.pop()!;
    const rowStart = seedY * width;

    if (!bfGet(matches, rowStart + seedX)) continue;

    // Expand left
    let left = seedX;
    while (left > 0 && !bfGet(queued, rowStart + left - 1) && bfGet(matches, rowStart + left - 1)) {
      left--;
    }

    // Expand right
    let right = seedX;
    while (right < width - 1 && !bfGet(queued, rowStart + right + 1) && bfGet(matches, rowStart + right + 1)) {
      right++;
    }

    // Mark the span as filled (and queued to prevent re-seeding)
    for (let x = left; x <= right && filledCount < MAX_FLOOD_FILL_PIXELS; x++) {
      bfSet(filled, rowStart + x);
      bfSet(queued, rowStart + x);
      filledCount++;
    }

    // Seed rows above and below — skip entirely if the limit was already reached
    // inside the span loop to avoid queuing pixels that will never be processed.
    if (filledCount < MAX_FLOOD_FILL_PIXELS) {
      for (const ny of [seedY - 1, seedY + 1]) {
        if (ny < 0 || ny >= height) continue;
        const nRowStart = ny * width;
        let x = left;
        while (x <= right) {
          while (x <= right && (bfGet(queued, nRowStart + x) || !bfGet(matches, nRowStart + x))) {
            x++;
          }
          if (x > right) break;
          stack.push([x, ny]);
          bfSet(queued, nRowStart + x);
          x++;
          while (x <= right && !bfGet(queued, nRowStart + x) && bfGet(matches, nRowStart + x)) {
            x++;
          }
        }
      }
    }
  }

  if (filledCount === 0) return false;

  // Step 3 — scan the buffer once and write targetColor to pixels marked as
  // filled in the bitfield.
  for (let i = 0; i < totalPixels; i++) {
    if (bfGet(filled, i)) {
      const p = i * 4;
      pixels[p]     = targetColor.r;
      pixels[p + 1] = targetColor.g;
      pixels[p + 2] = targetColor.b;
      pixels[p + 3] = targetColor.a;
    }
  }

  return true;
}
