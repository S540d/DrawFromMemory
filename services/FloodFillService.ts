// Maximum pixels for flood-fill to limit runtime/memory usage and guard against
// runaway fills (the fill may stop early when this limit is hit).
// Reduced from 500 000 to 200 000 to prevent OOM on low-memory Android devices.
export const MAX_FLOOD_FILL_PIXELS = 200000;

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
 * Stack-based flood-fill on a pixel buffer.
 * Fills connected pixels matching the color at (startX, startY) with targetColor.
 * Uses a tolerance of ±2 per channel for anti-aliased edges.
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

  // Use a flat Uint8Array as a visited bitmap – one byte per pixel index.
  // This is ~8× smaller than a Set<number> and avoids GC pressure on old Android devices.
  const totalPixels = width * height;
  const visited = new Uint8Array(totalPixels);

  // Use flat pixel indices (not byte offsets) throughout to keep the bitmap compact.
  const stack: number[] = [y0 * width + x0];
  visited[y0 * width + x0] = 1;
  let filledCount = 0;

  while (stack.length > 0 && filledCount < MAX_FLOOD_FILL_PIXELS) {
    const idx = stack.pop()!;
    const x = idx % width;
    const y = (idx - x) / width;

    const pos = idx * 4;
    const r = pixels[pos];
    const g = pixels[pos + 1];
    const b = pixels[pos + 2];
    const a = pixels[pos + 3];

    // Color tolerance ±2 per channel for anti-aliased edges
    if (
      Math.abs(r - startR) > 2 ||
      Math.abs(g - startG) > 2 ||
      Math.abs(b - startB) > 2 ||
      Math.abs(a - startA) > 2
    ) {
      continue;
    }

    pixels[pos] = targetColor.r;
    pixels[pos + 1] = targetColor.g;
    pixels[pos + 2] = targetColor.b;
    pixels[pos + 3] = targetColor.a;
    filledCount++;

    // Push neighbours only if in-bounds and not yet visited.
    // Checking before pushing keeps the stack small (avoids quadratic blowup).
    if (x + 1 < width  && !visited[idx + 1])     { visited[idx + 1] = 1;     stack.push(idx + 1); }
    if (x - 1 >= 0     && !visited[idx - 1])     { visited[idx - 1] = 1;     stack.push(idx - 1); }
    if (y + 1 < height && !visited[idx + width]) { visited[idx + width] = 1; stack.push(idx + width); }
    if (y - 1 >= 0     && !visited[idx - width]) { visited[idx - width] = 1; stack.push(idx - width); }
  }

  return filledCount > 0;
}
