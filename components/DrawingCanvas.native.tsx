import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform, useWindowDimensions } from 'react-native';
import { t } from '@services/i18n';
import { styles, DEFAULT_CANVAS_WIDTH } from './DrawingCanvas.shared';
import type { DrawingPath } from './DrawingCanvas.shared';
import { captureException } from '@services/SentryService';
import { floodFillPixels, hexToRgb } from '@services/FloodFillService';
import { rasterizeStrokes } from '@services/SoftwareRasterizer';

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
 * Computes a canvas image with flood fills applied, using pure CPU rendering.
 *
 * Previous approach used a GPU offscreen surface (MakeOffscreen → readPixels →
 * floodFill → canvas.clear → drawImage). This failed on old Adreno GPUs
 * (Nexus 6, Android 6) because:
 *   1. readPixels returned corrupt/white data
 *   2. canvas.clear() destroyed strokes irrecoverably
 *   3. drawImage/MakeImage on the GPU-backed surface silently failed
 * No amount of readPixels fixes helped because the destructive canvas.clear()
 * was the actual point of no return — see issue #132.
 *
 * New approach: build everything on CPU via SoftwareRasterizer, apply fills
 * directly on the CPU buffer, and create a Skia image from the result.
 * Strokes are always rendered separately as native <SkiaPath> components
 * for visual quality — this image only provides the fill background.
 */
function computeCanvasImage(
  paths: DrawingPath[],
  w: number,
  h: number,
  scale: number,
  offsetX: number,
  offsetY: number
): any | null {
  if (!SkiaModule) return null;

  try {
    const firstFillIdx = paths.findIndex(p => p.type === 'fill');
    if (firstFillIdx === -1) return null;

    // Rasterize all strokes before the first fill into a CPU buffer.
    // This gives us stroke boundaries for the flood fill without any GPU
    // involvement — completely avoids the broken readPixels pipeline.
    const buffer = rasterizeStrokes(paths.slice(0, firstFillIdx), w, h, scale, offsetX, offsetY);

    // Process remaining paths in order so fills see correct stroke boundaries
    for (let idx = firstFillIdx; idx < paths.length; idx++) {
      const path = paths[idx];
      if (path.type === 'fill' && path.points.length > 0) {
        const fillX = path.points[0].x * scale + offsetX;
        const fillY = path.points[0].y * scale + offsetY;
        floodFillPixels(buffer, w, h, fillX, fillY, hexToRgb(path.color));
      } else if (path.type !== 'fill' && path.points.length >= 2) {
        // Stroke after a fill: composite onto the CPU buffer so subsequent
        // fills see it as a boundary
        const strokeBuf = rasterizeStrokes([path], w, h, scale, offsetX, offsetY);
        for (let i = 0; i < strokeBuf.length; i += 4) {
          if (strokeBuf[i] < 255 || strokeBuf[i + 1] < 255 || strokeBuf[i + 2] < 255) {
            buffer[i] = strokeBuf[i];
            buffer[i + 1] = strokeBuf[i + 1];
            buffer[i + 2] = strokeBuf[i + 2];
            buffer[i + 3] = strokeBuf[i + 3];
          }
        }
      }
    }

    // Create Skia image directly from CPU buffer — no offscreen surface needed
    const imageInfo = {
      colorType: SkiaColorType?.RGBA_8888 ?? 4,
      alphaType: SkiaAlphaType?.Unpremul ?? 3,
      width: w,
      height: h,
    };
    const pixelBytes = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    const skData = SkiaModule.Data.fromBytes(pixelBytes);
    return SkiaModule.Image.MakeImage(imageInfo, skData, w * 4);
  } catch (e) {
    captureException(e instanceof Error ? e : new Error(String(e)), {
      component: 'DrawingCanvas',
      operation: 'computeCanvasImage',
      canvasSize: `${w}x${h}`,
    });
    return null;
  }
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
        {/* Fill result as background layer (CPU-rendered, GPU-independent).
            Strokes are always rendered as native SkiaPath on top — so even if
            this image fails to display on old GPUs, strokes remain visible
            instead of the canvas going white (issue #132). */}
        {canvasImage && SkiaImage && (
          <SkiaImage
            image={canvasImage}
            x={0}
            y={0}
            width={width}
            height={height}
          />
        )}
        {/* All strokes always rendered natively by Skia for quality.
            No mode-switching — strokes never disappear, regardless of fill state. */}
        {nativePaths.map((pathData, index) => {
          if (pathData.type === 'fill') return null;
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
        })}

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
