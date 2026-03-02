// Maximum pixels for flood-fill to prevent stack overflow / infinite loops
export const MAX_FLOOD_FILL_PIXELS = 500000;

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
): void {
  const x0 = Math.floor(startX);
  const y0 = Math.floor(startY);

  if (x0 < 0 || x0 >= width || y0 < 0 || y0 >= height) return;

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
    return;
  }

  const stack: { x: number; y: number }[] = [{ x: x0, y: y0 }];
  const visited = new Set<number>();

  while (stack.length > 0 && visited.size < MAX_FLOOD_FILL_PIXELS) {
    const { x, y } = stack.pop()!;

    if (x < 0 || x >= width || y < 0 || y >= height) continue;

    const pos = (y * width + x) * 4;
    if (visited.has(pos)) continue;

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

    visited.add(pos);
    pixels[pos] = targetColor.r;
    pixels[pos + 1] = targetColor.g;
    pixels[pos + 2] = targetColor.b;
    pixels[pos + 3] = targetColor.a;

    stack.push({ x: x + 1, y });
    stack.push({ x: x - 1, y });
    stack.push({ x, y: y + 1 });
    stack.push({ x, y: y - 1 });
  }
}
