import type { DrawingPath } from '@components/DrawingCanvas.shared';
import { floodFillPixels, type FloodFillSpan, hexToRgb } from './FloodFillService';
import { createWhitePixelBuffer, rasterizePathIntoBuffer } from './SoftwareRasterizer';

export interface NativeFillLayer {
  color: string;
  spans: FloodFillSpan[];
}

export function computeNativeFillLayers(
  paths: DrawingPath[],
  width: number,
  height: number,
  scale: number,
  offsetX: number,
  offsetY: number
): NativeFillLayer[] {
  // Canvas dimensions must be integers — float widths (e.g. 363.428...) corrupt
  // buffer addressing and cause floodFillPixels to always return false.
  const w = Math.floor(width);
  const h = Math.floor(height);
  const buffer = createWhitePixelBuffer(w, h);
  const fillLayers: NativeFillLayer[] = [];

  for (const path of paths) {
    if (path.type === 'fill' && path.points.length > 0) {
      const fillX = path.points[0].x * scale + offsetX;
      const fillY = path.points[0].y * scale + offsetY;
      const spans: FloodFillSpan[] = [];
      const changed = floodFillPixels(
        buffer,
        w,
        h,
        fillX,
        fillY,
        hexToRgb(path.color),
        spans
      );

      if (changed && spans.length > 0) {
        fillLayers.push({ color: path.color, spans });
      }
      continue;
    }

    rasterizePathIntoBuffer(buffer, path, w, h, scale, offsetX, offsetY);
  }

  return fillLayers;
}
