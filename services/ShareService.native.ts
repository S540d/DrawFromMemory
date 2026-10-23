/**
 * ShareService — Native implementation (iOS / Android)
 * Renders DrawingPath[] to an off-screen Skia surface and shares the PNG
 * via expo-sharing. Metro loads this file on native, ShareService.ts on web.
 */
import type { DrawingPath } from '@components/DrawingCanvas.shared';
// Expo SDK 54+ verschob die klassische Datei-API (cacheDirectory, writeAsStringAsync,
// EncodingType) nach `expo-file-system/legacy`. Der Default-Export bietet stattdessen
// die neue File/Paths-Klassen-API (Issue: TS-Fehler in ShareService.native.ts).
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Skia, ImageFormat, PaintStyle, StrokeCap, StrokeJoin } from '@shopify/react-native-skia';
import { computeFitTransform } from '@utils/drawingTransform';
import { computeNativeFillLayers } from './NativeFillLayerService';

const EXPORT_SIZE = 600;

export async function shareDrawing(paths: DrawingPath[], title?: string): Promise<void> {
  const size = EXPORT_SIZE;
  const surface = Skia.Surface.Make(size, size);
  if (!surface) throw new Error('Could not create Skia surface for export');

  const canvas = surface.getCanvas();

  // White background
  const bgPaint = Skia.Paint();
  bgPaint.setColor(Skia.Color('#FFFFFF'));
  canvas.drawRect(Skia.XYWHRect(0, 0, size, size), bgPaint);

  const { scale, offsetX, offsetY } = computeFitTransform(paths, size, size, 40);

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
