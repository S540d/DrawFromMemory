import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform, useWindowDimensions } from 'react-native';
import { t } from '@services/i18n';
import { styles, DEFAULT_CANVAS_WIDTH } from './DrawingCanvas.shared';
import type { DrawingPath } from './DrawingCanvas.shared';
import { captureException } from '@services/SentryService';
import { floodFillPixels, hexToRgb } from '@services/FloodFillService';

// Re-export shared API so '@components/DrawingCanvas' provides a complete module on native
export type { DrawingPath } from './DrawingCanvas.shared';
export { useDrawingCanvas } from './DrawingCanvas.hooks';

// Lazy-load Skia only on native platforms to prevent crash on Android
// The top-level import initializes native modules immediately, which can crash
let SkiaCanvas: any = null;
let SkiaPath: any = null;
let SkiaModule: any = null;
let SkiaImage: any = null;
let SkiaAlphaType: any = null;
let SkiaColorType: any = null;
let SkiaPaintStyle: any = null;
let SkiaStrokeCap: any = null;
let SkiaStrokeJoin: any = null;
let skiaLoadError: Error | null = null;

function tryLoadSkia(): boolean {
  if (SkiaCanvas && SkiaModule) return true;

  skiaLoadError = null;

  try {
    const skia = require('@shopify/react-native-skia');
    SkiaCanvas = skia.Canvas;
    SkiaPath = skia.Path;
    SkiaModule = skia.Skia;
    SkiaImage = skia.Image;
    SkiaAlphaType = skia.AlphaType;
    SkiaColorType = skia.ColorType;
    SkiaPaintStyle = skia.PaintStyle;
    SkiaStrokeCap = skia.StrokeCap;
    SkiaStrokeJoin = skia.StrokeJoin;

    // Verify that the native module is actually ready (not just exported)
    if (!SkiaModule?.Path?.Make) {
      throw new Error('Skia native module not fully initialized');
    }

    return true;
  } catch (e) {
    SkiaCanvas = null;
    SkiaPath = null;
    SkiaModule = null;
    SkiaImage = null;
    SkiaAlphaType = null;
    SkiaColorType = null;
    SkiaPaintStyle = null;
    SkiaStrokeCap = null;
    SkiaStrokeJoin = null;
    skiaLoadError = e instanceof Error ? e : new Error(String(e));
    console.error('[DrawingCanvas] Failed to load @shopify/react-native-skia:', {
      message: skiaLoadError.message,
      platform: Platform.OS,
      version: Platform.Version,
    });
    captureException(skiaLoadError, {
      component: 'DrawingCanvas',
      platform: String(Platform.OS),
      platformVersion: String(Platform.Version),
    });
    return false;
  }
}

// Attempt initial load at module level
tryLoadSkia();

/**
 * Renders all paths to an offscreen Skia surface and returns the resulting image.
 * Fill paths are handled via pixel-level flood fill (same algorithm as web).
 * Returns null if the surface cannot be created or Skia is unavailable.
 */
function computeCanvasImage(
  paths: DrawingPath[],
  w: number,
  h: number,
  scale: number,
  offsetX: number,
  offsetY: number
): any | null {
  if (!SkiaModule?.Surface?.MakeOffscreen) return null;

  const surface = SkiaModule.Surface.MakeOffscreen(w, h);
  if (!surface) return null;

  const canvas = surface.getCanvas();

  // White background
  const bgPaint = SkiaModule.Paint();
  bgPaint.setColor(SkiaModule.Color('#FFFFFF'));
  canvas.drawRect(SkiaModule.XYWHRect(0, 0, w, h), bgPaint);

  for (const path of paths) {
    if (path.type === 'fill' && path.points.length > 0) {
      // Flood fill: take snapshot, run fill algorithm, redraw.
      // Wrapped in try/catch so an OOM on low-memory devices
      // skips the fill gracefully instead of crashing the app.
      try {
        surface.flush();
        const snapshot = surface.makeImageSnapshot();
        const imageInfo = {
          colorType: SkiaColorType?.RGBA_8888 ?? 4,
          alphaType: SkiaAlphaType?.Unpremul ?? 3,
          width: w,
          height: h,
        };
        const pixels = snapshot.readPixels(0, 0, imageInfo);
        if (pixels instanceof Uint8Array) {
          // Create a clamped view over the existing pixel buffer (no copy)
          const pixelData = new Uint8ClampedArray(
            pixels.buffer,
            pixels.byteOffset,
            pixels.byteLength
          );
          const fillX = path.points[0].x * scale + offsetX;
          const fillY = path.points[0].y * scale + offsetY;
          const changed = floodFillPixels(pixelData, w, h, fillX, fillY, hexToRgb(path.color));
          if (changed) {
            // Reuse the original Uint8Array view; it reflects changes via pixelData
            const skData = SkiaModule.Data.fromBytes(pixels);
            const filledImage = SkiaModule.Image.MakeImage(imageInfo, skData, w * 4);
            if (filledImage) {
              canvas.clear(SkiaModule.Color('transparent'));
              canvas.drawImage(filledImage, 0, 0);
            }
          }
        }
      } catch (e) {
        // OOM or other allocation failure — skip this fill silently
        captureException(e instanceof Error ? e : new Error(String(e)), {
          component: 'DrawingCanvas',
          operation: 'floodFill',
          canvasSize: `${w}x${h}`,
        });
      }
    } else if (path.type !== 'fill' && path.points.length >= 2) {
      const skiaPath = SkiaModule.Path.Make();
      skiaPath.moveTo(
        path.points[0].x * scale + offsetX,
        path.points[0].y * scale + offsetY
      );
      for (let i = 1; i < path.points.length; i++) {
        skiaPath.lineTo(
          path.points[i].x * scale + offsetX,
          path.points[i].y * scale + offsetY
        );
      }
      const paint = SkiaModule.Paint();
      paint.setColor(SkiaModule.Color(path.color));
      paint.setStrokeWidth(path.strokeWidth * scale);
      paint.setStyle(SkiaPaintStyle?.Stroke ?? 1);
      paint.setStrokeCap(SkiaStrokeCap?.Round ?? 1);
      paint.setStrokeJoin(SkiaStrokeJoin?.Round ?? 1);
      paint.setAntiAlias(true);
      canvas.drawPath(skiaPath, paint);
    }
  }

  surface.flush();
  return surface.makeImageSnapshot();
}

interface Props {
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  tool?: 'brush' | 'fill';
  paths?: DrawingPath[];
  onDrawingChange?: (paths: DrawingPath[]) => void;
}

/**
 * Fallback UI when Skia fails to load, with retry capability.
 * On some Android devices, the native module isn't ready on first load
 * but works after a short delay or app restart.
 */
function SkiaFallback({ width, height, onRetrySuccess }: {
  width: number;
  height: number;
  onRetrySuccess: () => void;
}) {
  const [retrying, setRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const onRetrySuccessRef = useRef(onRetrySuccess);
  const manualRetryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const MAX_AUTO_RETRIES = 3;
  const RETRY_DELAY_MS = 1000;

  // Keep callback ref stable to avoid resetting the auto-retry timer
  useEffect(() => {
    onRetrySuccessRef.current = onRetrySuccess;
  }, [onRetrySuccess]);

  // Auto-retry a few times on mount – the native module may just need time to init
  useEffect(() => {
    if (retryCount >= MAX_AUTO_RETRIES) return;

    const timer = setTimeout(() => {
      if (tryLoadSkia()) {
        onRetrySuccessRef.current();
      } else {
        setRetryCount((c) => c + 1);
      }
    }, RETRY_DELAY_MS);

    return () => clearTimeout(timer);
  }, [retryCount]);

  // Cleanup manual retry timeout on unmount
  useEffect(() => {
    return () => {
      if (manualRetryRef.current) clearTimeout(manualRetryRef.current);
    };
  }, []);

  const handleManualRetry = () => {
    setRetrying(true);
    // Small delay to let native bridge settle
    manualRetryRef.current = setTimeout(() => {
      if (tryLoadSkia()) {
        onRetrySuccessRef.current();
      }
      setRetrying(false);
    }, 500);
  };

  const showAutoRetrying = retryCount < MAX_AUTO_RETRIES;

  return (
    <View style={[styles.container, styles.fallbackContainer, { width, height }]}>
      {showAutoRetrying ? (
        <>
          <ActivityIndicator size="large" color="#4ECDC4" />
          <Text style={styles.fallbackMessage}>{t('errors.skiaLoading')}</Text>
        </>
      ) : (
        <>
          <Text style={styles.fallbackEmoji}>⚠️</Text>
          <Text style={styles.fallbackTitle}>{t('errors.skiaUnavailableTitle')}</Text>
          <Text style={styles.fallbackMessage}>{t('errors.skiaUnavailableMessage')}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleManualRetry}
            disabled={retrying}
          >
            {retrying ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.retryButtonText}>{t('errors.skiaRetry')}</Text>
            )}
          </TouchableOpacity>
          {__DEV__ && skiaLoadError && (
            <Text style={styles.fallbackErrorDetail}>{skiaLoadError.message}</Text>
          )}
        </>
      )}
    </View>
  );
}

export default function DrawingCanvas({
  width: propWidth,
  height = 400,
  strokeColor = '#000000',
  strokeWidth = 3,
  tool = 'brush',
  paths = [],
  onDrawingChange,
}: Props) {
  const { width: windowWidth } = useWindowDimensions();
  const width = propWidth ?? (windowWidth > 0 ? windowWidth - 48 : DEFAULT_CANVAS_WIDTH);

  const [nativePaths, setNativePaths] = useState(paths);
  const [currentNativePath, setCurrentNativePath] = useState<{ x: number; y: number }[]>([]);
  // Pre-computed canvas image used when paths contain fill operations
  const [canvasImage, setCanvasImage] = useState<any>(null);

  useEffect(() => {
    setNativePaths(paths);
  }, [paths]);

  const handleTouchStart = (event: { nativeEvent: { locationX: number; locationY: number } }) => {
    if (!onDrawingChange) return;
    const { locationX, locationY } = event.nativeEvent;

    if (tool === 'fill') {
      const newPath = { points: [{ x: locationX, y: locationY }], color: strokeColor, strokeWidth: 0, type: 'fill' as const };
      setNativePaths((prev) => {
        const newPaths = [...prev, newPath];
        onDrawingChange(newPaths);
        return newPaths;
      });
    } else {
      setCurrentNativePath([{ x: locationX, y: locationY }]);
    }
  };

  const handleTouchMove = (event: { nativeEvent: { locationX: number; locationY: number } }) => {
    if (!onDrawingChange || currentNativePath.length === 0 || tool === 'fill') return;
    const { locationX, locationY } = event.nativeEvent;
    setCurrentNativePath((prev) => [...prev, { x: locationX, y: locationY }]);
  };

  const handleTouchEnd = () => {
    if (!onDrawingChange || currentNativePath.length === 0 || tool === 'fill') return;
    const finishedPath = { points: currentNativePath, color: strokeColor, strokeWidth, type: 'stroke' as const };
    setNativePaths((prev) => {
      const newPaths = [...prev, finishedPath];
      onDrawingChange(newPaths);
      return newPaths;
    });
    setCurrentNativePath([]);
  };

  const getScaledPaths = () => {
    // Exclude fill paths from bounding box – they only have a single click point
    const strokePaths = nativePaths.filter(p => p.type !== 'fill');
    if (strokePaths.length === 0) return { scale: 1, offsetX: 0, offsetY: 0 };

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    strokePaths.forEach(path => {
      path.points.forEach(point => {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
      });
    });

    const drawingWidth = maxX - minX;
    const drawingHeight = maxY - minY;

    if (drawingWidth <= 0 || drawingHeight <= 0) return { scale: 1, offsetX: 0, offsetY: 0 };

    const padding = 10;
    const scale = Math.min((width - 2 * padding) / drawingWidth, (height - 2 * padding) / drawingHeight, 1);
    const scaledWidth = drawingWidth * scale;
    const scaledHeight = drawingHeight * scale;
    const offsetX = (width - scaledWidth) / 2 - minX * scale;
    const offsetY = (height - scaledHeight) / 2 - minY * scale;

    return { scale, offsetX, offsetY };
  };

  const createSkiaPath = (
    points: { x: number; y: number }[],
    color: string,
    strokeW: number,
    scale: number = 1,
    offsetX: number = 0,
    offsetY: number = 0
  ) => {
    if (points.length < 2) return null;

    const path = SkiaModule.Path.Make();
    path.moveTo(points[0].x * scale + offsetX, points[0].y * scale + offsetY);
    for (let i = 1; i < points.length; i++) {
      path.lineTo(points[i].x * scale + offsetX, points[i].y * scale + offsetY);
    }

    return { path, color, width: strokeW * scale };
  };

  const { scale, offsetX, offsetY } = !onDrawingChange ? getScaledPaths() : { scale: 1, offsetX: 0, offsetY: 0 };

  const hasFillPaths = nativePaths.some(p => p.type === 'fill');

  // Recompute the pre-rendered canvas image whenever paths that contain fills change
  useEffect(() => {
    if (!hasFillPaths) {
      setCanvasImage(null);
      return;
    }
    const image = computeCanvasImage(nativePaths, width, height, scale, offsetX, offsetY);
    setCanvasImage(image);
  }, [nativePaths, width, height, scale, offsetX, offsetY, hasFillPaths]);

  if (!SkiaCanvas || !SkiaModule) {
    return (
      <SkiaFallback
        width={width}
        height={height}
        onRetrySuccess={() => setNativePaths([...nativePaths])}
      />
    );
  }

  return (
    <View style={[styles.container, { width, height }]}>
      <SkiaCanvas
        style={{ width, height }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {hasFillPaths ? (
          // When fills are present, render the pre-computed canvas image as the base layer.
          // Additionally overlay any strokes that were added after the last fill path so
          // they remain visible while canvasImage is being regenerated (avoids flicker).
          <>
            {canvasImage && SkiaImage && (
              <SkiaImage
                image={canvasImage}
                x={0}
                y={0}
                width={width}
                height={height}
              />
            )}
            {(() => {
              // Find strokes appended after the last fill entry
              let lastFillIdx = -1;
              for (let i = nativePaths.length - 1; i >= 0; i--) {
                if (nativePaths[i].type === 'fill') { lastFillIdx = i; break; }
              }
              return nativePaths.slice(lastFillIdx + 1).map((pathData, idx) => {
                const skiaPath = createSkiaPath(pathData.points, pathData.color, pathData.strokeWidth, scale, offsetX, offsetY);
                if (!skiaPath) return null;
                return (
                  <SkiaPath
                    key={`overlay-${idx}`}
                    path={skiaPath.path}
                    color={skiaPath.color}
                    style="stroke"
                    strokeWidth={skiaPath.width}
                    strokeCap="round"
                    strokeJoin="round"
                  />
                );
              });
            })()}
          </>
        ) : (
          // No fills – render stroke paths directly as Skia paths (faster, no CPU round-trip)
          nativePaths.map((pathData, index) => {
            const skiaPath = createSkiaPath(pathData.points, pathData.color, pathData.strokeWidth, scale, offsetX, offsetY);
            if (!skiaPath) return null;
            return (
              <SkiaPath
                key={`stroke-${index}`}
                path={skiaPath.path}
                color={skiaPath.color}
                style="stroke"
                strokeWidth={skiaPath.width}
                strokeCap="round"
                strokeJoin="round"
              />
            );
          })
        )}

        {onDrawingChange && currentNativePath.length > 1 && (() => {
          const skiaPath = createSkiaPath(currentNativePath, strokeColor, strokeWidth, 1, 0, 0);
          if (!skiaPath) return null;
          return (
            <SkiaPath
              path={skiaPath.path}
              color={skiaPath.color}
              style="stroke"
              strokeWidth={skiaPath.width}
              strokeCap="round"
              strokeJoin="round"
            />
          );
        })()}
      </SkiaCanvas>
    </View>
  );
}
