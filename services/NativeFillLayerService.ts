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
  const buffer = createWhitePixelBuffer(width, height);
  const fillLayers: NativeFillLayer[] = [];

  for (const path of paths) {
    if (path.type === 'fill' && path.points.length > 0) {
      const spans: FloodFillSpan[] = [];
      const changed = floodFillPixels(
        buffer,
        width,
        height,
        path.points[0].x * scale + offsetX,
        path.points[0].y * scale + offsetY,
        hexToRgb(path.color),
        spans
      );

      if (changed && spans.length > 0) {
        fillLayers.push({ color: path.color, spans });
      }
      continue;
    }

    rasterizePathIntoBuffer(buffer, path, width, height, scale, offsetX, offsetY);
  }

  return fillLayers;
}
