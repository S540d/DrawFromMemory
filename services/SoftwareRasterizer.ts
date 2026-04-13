/**
 * SoftwareRasterizer – CPU-side stroke rasterizer for flood-fill boundary detection.
 *
 * Used as a fallback when Skia's readPixels returns corrupt data (e.g. on old
 * Adreno GPUs like the Nexus 6). This rasterizer draws strokes into a
 * Uint8ClampedArray pixel buffer that the flood-fill algorithm can read from.
 *
 * Important: This is NOT used for display — Skia handles all visible rendering.
 * The quality tradeoff (no anti-aliasing) is acceptable because this buffer is
 * only used to determine fill boundaries, never shown to the user.
 */
import type { DrawingPath } from '@components/DrawingCanvas.shared';
import { hexToRgb, type RGBAColor } from './FloodFillService';

/**
 * Rasterize stroke paths into a CPU pixel buffer.
 * Fill paths are skipped — they will be applied via floodFillPixels on this buffer.
 *
 * @returns Uint8ClampedArray with RGBA data (white background, strokes drawn on top)
 */
export function rasterizeStrokes(
  paths: DrawingPath[],
  width: number,
  height: number,
  scale: number,
  offsetX: number,
  offsetY: number
): Uint8ClampedArray {
  const buffer = new Uint8ClampedArray(width * height * 4);

  // White background (all RGBA channels to 255)
  buffer.fill(255);

  for (const path of paths) {
    if (path.type === 'fill') continue;
    if (path.points.length < 2) continue;

    const color = hexToRgb(path.color);
    const radius = Math.max(1, Math.round((path.strokeWidth * scale) / 2));

    // Draw each segment
    for (let i = 0; i < path.points.length - 1; i++) {
      const x0 = Math.round(path.points[i].x * scale + offsetX);
      const y0 = Math.round(path.points[i].y * scale + offsetY);
      const x1 = Math.round(path.points[i + 1].x * scale + offsetX);
      const y1 = Math.round(path.points[i + 1].y * scale + offsetY);
      drawThickLine(buffer, width, height, x0, y0, x1, y1, radius, color);
    }

    // Draw round cap at the start point
    const startX = Math.round(path.points[0].x * scale + offsetX);
    const startY = Math.round(path.points[0].y * scale + offsetY);
    fillCircle(buffer, width, height, startX, startY, radius, color);
  }

  return buffer;
}

/** Bresenham line with filled circles at each step for thickness. */
function drawThickLine(
  buffer: Uint8ClampedArray,
  w: number,
  h: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  radius: number,
  color: RGBAColor
): void {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  let cx = x0;
  let cy = y0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    fillCircle(buffer, w, h, cx, cy, radius, color);

    if (cx === x1 && cy === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      cx += sx;
    }
    if (e2 < dx) {
      err += dx;
      cy += sy;
    }
  }
}

/** Fill a circle into the pixel buffer. */
function fillCircle(
  buffer: Uint8ClampedArray,
  w: number,
  h: number,
  cx: number,
  cy: number,
  radius: number,
  color: RGBAColor
): void {
  const r2 = radius * radius;
  const yMin = Math.max(0, cy - radius);
  const yMax = Math.min(h - 1, cy + radius);
  const xMin = Math.max(0, cx - radius);
  const xMax = Math.min(w - 1, cx + radius);

  for (let y = yMin; y <= yMax; y++) {
    const dy = y - cy;
    const dy2 = dy * dy;
    for (let x = xMin; x <= xMax; x++) {
      const dx = x - cx;
      if (dx * dx + dy2 <= r2) {
        const idx = (y * w + x) * 4;
        buffer[idx] = color.r;
        buffer[idx + 1] = color.g;
        buffer[idx + 2] = color.b;
        buffer[idx + 3] = color.a;
      }
    }
  }
}
