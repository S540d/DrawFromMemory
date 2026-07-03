/**
 * ShareService — Native implementation (iOS / Android)
 * Renders DrawingPath[] to an off-screen Skia surface and shares the PNG
 * via expo-sharing. Metro loads this file on native, ShareService.ts on web.
 */
import type { DrawingPath } from '@components/DrawingCanvas.shared';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Skia, ImageFormat, PaintStyle, StrokeCap, StrokeJoin } from '@shopify/react-native-skia';
import { computeNativeFillLayers } from './NativeFillLayerService';

const EXPORT_SIZE = 600;

function computeScaleOffset(
  paths: DrawingPath[],
  size: number
): { scale: number; offsetX: number; offsetY: number } {
  const strokePaths = paths.filter(p => p.type !== 'fill');
  if (strokePaths.length === 0) return { scale: 1, offsetX: 0, offsetY: 0 };

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const path of strokePaths) {
    for (const pt of path.points) {
      if (pt.x < minX) minX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y > maxY) maxY = pt.y;
    }
  }

  const dw = maxX - minX;
  const dh = maxY - minY;
  if (dw <= 0 || dh <= 0) return { scale: 1, offsetX: 0, offsetY: 0 };

  const padding = 40;
  const scale = Math.min((size - 2 * padding) / dw, (size - 2 * padding) / dh, 1);
  const sw = dw * scale;
  const sh = dh * scale;
  return {
    scale,
    offsetX: (size - sw) / 2 - minX * scale,
    offsetY: (size - sh) / 2 - minY * scale,
  };
}

export async function shareDrawing(paths: DrawingPath[], title?: string): Promise<void> {
  const size = EXPORT_SIZE;
  const surface = Skia.Surface.Make(size, size);
  if (!surface) throw new Error('Could not create Skia surface for export');

  const canvas = surface.getCanvas();

  // White background
  const bgPaint = Skia.Paint();
  bgPaint.setColor(Skia.Color('#FFFFFF'));
  canvas.drawRect(Skia.XYWHRect(0, 0, size, size), bgPaint);

  const { scale, offsetX, offsetY } = computeScaleOffset(paths, size);

  // Fill regions via NativeFillLayerService (same pipeline as DrawingCanvas.native.tsx)
  const fillLayers = computeNativeFillLayers(paths, size, size, scale, offsetX, offsetY);
  for (const layer of fillLayers) {
    const fillPaint = Skia.Paint();
    fillPaint.setColor(Skia.Color(layer.color));
    for (const span of layer.spans) {
      canvas.drawRect(Skia.XYWHRect(span.x, span.y, span.width, 1), fillPaint);
    }
  }

  // Stroke paths
  for (const pathData of paths) {
    if (pathData.type === 'fill' || pathData.points.length < 2) continue;
    const paint = Skia.Paint();
    paint.setColor(Skia.Color(pathData.color));
    paint.setStyle(PaintStyle.Stroke);
    paint.setStrokeWidth(pathData.strokeWidth * scale);
    paint.setStrokeCap(StrokeCap.Round);
    paint.setStrokeJoin(StrokeJoin.Round);
    paint.setAntiAlias(true);

    const skPath = Skia.Path.Make();
    skPath.moveTo(pathData.points[0].x * scale + offsetX, pathData.points[0].y * scale + offsetY);
    for (let i = 1; i < pathData.points.length; i++) {
      skPath.lineTo(pathData.points[i].x * scale + offsetX, pathData.points[i].y * scale + offsetY);
    }
    canvas.drawPath(skPath, paint);
  }

  const image = surface.makeImageSnapshot();
  const base64 = image.encodeToBase64(ImageFormat.PNG, 100);

  const fileUri = `${FileSystem.cacheDirectory}drawing-${Date.now()}.png`;
  await FileSystem.writeAsStringAsync(fileUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  await Sharing.shareAsync(fileUri, {
    mimeType: 'image/png',
    dialogTitle: title ?? 'Zeichnung teilen',
    UTI: 'public.png',
  });
}
