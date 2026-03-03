import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { floodFillPixels, hexToRgb } from '../services/FloodFillService';

// Lazy-load Skia only on native platforms to prevent crash on Android
// The top-level import initializes native modules immediately, which can crash
let SkiaCanvas: any = null;
let SkiaPath: any = null;
let SkiaModule: any = null;
let SkiaCircle: any = null;

if (Platform.OS !== 'web') {
  try {
    const skia = require('@shopify/react-native-skia');
    SkiaCanvas = skia.Canvas;
    SkiaPath = skia.Path;
    SkiaModule = skia.Skia;
    SkiaCircle = skia.Circle;
  } catch (e) {
    console.error('Failed to load @shopify/react-native-skia:', e);
  }
}

// Default width for SSR (will be overridden by actual window dimensions on client)
const DEFAULT_CANVAS_WIDTH = 300;


interface Props {
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  tool?: 'brush' | 'fill'; // Current tool selection
  paths?: DrawingPath[];
  onDrawingChange?: (paths: DrawingPath[]) => void;
}

export interface DrawingPath {
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
  type?: 'stroke' | 'fill'; // Optional: default = 'stroke'
}

/**
 * Einfache Zeichenkomponente
 * Web: HTML5 Canvas
 * Native: react-native-skia (später)
 */
export default function DrawingCanvas({
  width: propWidth,
  height = 400,
  strokeColor = '#000000',
  strokeWidth = 3,
  tool = 'brush',
  paths = [],
  onDrawingChange,
}: Props) {
  // Use hook for responsive dimensions (SSR-safe)
  const { width: windowWidth } = useWindowDimensions();
  const width = propWidth ?? (windowWidth > 0 ? windowWidth - 48 : DEFAULT_CANVAS_WIDTH);

  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  // Refs mirror state so event handlers always read the latest value without stale closures
  const isDrawingRef = useRef(false);
  const currentPathRef = useRef<{ x: number; y: number }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Native-specific state (must be declared unconditionally for React Rules of Hooks)
  const [nativePaths, setNativePaths] = useState(paths);
  const [currentNativePath, setCurrentNativePath] = useState<{ x: number; y: number }[]>([]);

  // Update native paths when paths change
  useEffect(() => {
    setNativePaths(paths);
  }, [paths]);

  // Flood-Fill Algorithmus für Web
  const floodFill = (startX: number, startY: number, fillColor: string) => {
    if (Platform.OS !== 'web' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, width, height);
    const changed = floodFillPixels(imageData.data, width, height, startX, startY, hexToRgb(fillColor));
    if (changed) ctx.putImageData(imageData, 0, 0);
  };

  // Zeichne alle Pfade auf dem Canvas
  useEffect(() => {
    if (Platform.OS === 'web' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // Berechne Skalierung (nur wenn nicht im Zeichenmodus)
      let scale = 1, offsetX = 0, offsetY = 0;
      if (!onDrawingChange && paths.length > 0) {
        // Finde min/max Koordinaten
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        paths.forEach(path => {
          if (path.type === 'fill') return; // Skip fill paths für Bounding Box
          path.points.forEach(point => {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
          });
        });

        const drawingWidth = maxX - minX;
        const drawingHeight = maxY - minY;
        const padding = 10;

        // Guard against division by zero when all points are at the same position
        if (drawingWidth > 0 && drawingHeight > 0) {
          const scaleX = (width - 2 * padding) / drawingWidth;
          const scaleY = (height - 2 * padding) / drawingHeight;
          scale = Math.min(scaleX, scaleY, 1);

          const scaledWidth = drawingWidth * scale;
          const scaledHeight = drawingHeight * scale;
          offsetX = (width - scaledWidth) / 2 - minX * scale;
          offsetY = (height - scaledHeight) / 2 - minY * scale;
        }
      }

      // Zeichne alle fertigen Pfade
      paths.forEach((path) => {
        if (path.type === 'fill' && path.points.length > 0) {
          // Fill-Pfad: Nutze Flood-Fill am gespeicherten Punkt
          const point = {
            x: path.points[0].x * scale + offsetX,
            y: path.points[0].y * scale + offsetY
          };

          const imageData = ctx.getImageData(0, 0, width, height);
          const changed = floodFillPixels(imageData.data, width, height, point.x, point.y, hexToRgb(path.color));
          if (changed) ctx.putImageData(imageData, 0, 0);
        } else if (path.points.length >= 2) {
          // Stroke-Pfad
          ctx.strokeStyle = path.color;
          ctx.lineWidth = path.strokeWidth * scale;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          ctx.beginPath();
          const firstPoint = {
            x: path.points[0].x * scale + offsetX,
            y: path.points[0].y * scale + offsetY
          };
          ctx.moveTo(firstPoint.x, firstPoint.y);

          for (let i = 1; i < path.points.length; i++) {
            const point = {
              x: path.points[i].x * scale + offsetX,
              y: path.points[i].y * scale + offsetY
            };
            ctx.lineTo(point.x, point.y);
          }

          ctx.stroke();
        }
      });

      // Zeichne aktuellen Pfad (nur im Zeichenmodus, keine Skalierung)
      if (onDrawingChange && currentPath.length > 1 && tool === 'brush') {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(currentPath[0].x, currentPath[0].y);

        for (let i = 1; i < currentPath.length; i++) {
          ctx.lineTo(currentPath[i].x, currentPath[i].y);
        }

        ctx.stroke();
      }
    }
  }, [paths, currentPath, strokeColor, strokeWidth, width, height, onDrawingChange, tool]);

  const getPosition = (event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    if (Platform.OS === 'web' && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      let clientX: number;
      let clientY: number;

      if ('touches' in event && event.touches.length > 0) {
        // Touch event
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else if ('clientX' in event) {
        // Mouse event
        clientX = event.clientX;
        clientY = event.clientY;
      } else {
        return { x: 0, y: 0 };
      }

      const x = clientX - rect.left;
      const y = clientY - rect.top;
      return { x, y };
    }
    return { x: 0, y: 0 };
  };

  const handleStart = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!onDrawingChange) return; // read-only canvas (gallery/result view)
    const pos = getPosition(event);

    if (tool === 'fill') {
      // Fill-Tool: Sofort Flood-Fill ausführen
      floodFill(pos.x, pos.y, strokeColor);

      // Füge Fill-Pfad zu Paths hinzu (für Undo/Redo)
      const newPaths = [
        ...paths,
        {
          points: [pos],
          color: strokeColor,
          strokeWidth: 0,
          type: 'fill' as const,
        },
      ];
      onDrawingChange(newPaths);
    } else {
      // Brush-Tool: Starte Zeichnung
      const initial = [pos];
      currentPathRef.current = initial;
      isDrawingRef.current = true;
      setCurrentPath(initial);
    }
  };

  const handleMove = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!onDrawingChange) return; // read-only canvas
    // Use refs instead of state to avoid stale closures in rapid event sequences
    if (!isDrawingRef.current || tool === 'fill') return;
    const pos = getPosition(event);
    const next = [...currentPathRef.current, pos];
    currentPathRef.current = next;
    setCurrentPath(next);
  };

  const handleEnd = () => {
    if (!onDrawingChange) return; // read-only canvas
    // Reset refs on tool switch mid-stroke (e.g. fill selected while brush was active)
    if (tool === 'fill') {
      isDrawingRef.current = false;
      currentPathRef.current = [];
      setCurrentPath([]);
      return;
    }

    if (isDrawingRef.current && currentPathRef.current.length > 1) {
      const newPaths = [
        ...paths,
        {
          points: currentPathRef.current,
          color: strokeColor,
          strokeWidth: strokeWidth,
          type: 'stroke' as const,
        },
      ];
      currentPathRef.current = [];
      isDrawingRef.current = false;
      setCurrentPath([]);
      onDrawingChange(newPaths);
    } else {
      // Discard single-point taps – they can't render and pollute undo history
      currentPathRef.current = [];
      isDrawingRef.current = false;
      setCurrentPath([]);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { width, height }]}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{
            border: '2px solid #E0E0E0',
            borderRadius: '12px',
            cursor: 'crosshair',
            touchAction: 'none',
          }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => {
            e.preventDefault();
            handleStart(e);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            handleMove(e);
          }}
          onTouchEnd={handleEnd}
        />
      </View>
    );
  }

  // Native version mit react-native-skia
  const handleTouchStart = (event: { nativeEvent: { locationX: number; locationY: number } }) => {
    if (!onDrawingChange) return; // Nur interaktiv wenn onDrawingChange vorhanden
    const { locationX, locationY } = event.nativeEvent;

    if (tool === 'fill') {
      // Fill-Tool: Speichere Fill-Aktion
      // Für Native wird Fill anders umgesetzt (siehe Rendering-Code)
      const newPaths = [
        ...nativePaths,
        {
          points: [{ x: locationX, y: locationY }],
          color: strokeColor,
          strokeWidth: 0,
          type: 'fill' as const,
        },
      ];
      setNativePaths(newPaths);
      onDrawingChange(newPaths);
    } else {
      // Brush-Tool: Starte Zeichnung
      setCurrentNativePath([{ x: locationX, y: locationY }]);
    }
  };

  const handleTouchMove = (event: { nativeEvent: { locationX: number; locationY: number } }) => {
    if (!onDrawingChange || currentNativePath.length === 0 || tool === 'fill') return;
    const { locationX, locationY } = event.nativeEvent;
    setCurrentNativePath([...currentNativePath, { x: locationX, y: locationY }]);
  };

  const handleTouchEnd = () => {
    if (!onDrawingChange || currentNativePath.length === 0 || tool === 'fill') return;
    const newPaths = [
      ...nativePaths,
      {
        points: currentNativePath,
        color: strokeColor,
        strokeWidth: strokeWidth,
        type: 'stroke' as const,
      },
    ];
    setNativePaths(newPaths);
    setCurrentNativePath([]);
    onDrawingChange(newPaths);
  };

  // Berechne Bounding Box und Skalierung für alle Pfade
  const getScaledPaths = () => {
    if (nativePaths.length === 0) return { scaledPaths: [], scale: 1, offsetX: 0, offsetY: 0 };

    // Finde min/max Koordinaten über alle Pfade
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    nativePaths.forEach(path => {
      path.points.forEach(point => {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
      });
    });

    // Berechne die Dimensionen der Zeichnung
    const drawingWidth = maxX - minX;
    const drawingHeight = maxY - minY;

    // Guard against division by zero when all points are at the same position
    if (drawingWidth <= 0 || drawingHeight <= 0) {
      return { scaledPaths: nativePaths, scale: 1, offsetX: 0, offsetY: 0 };
    }

    // Berechne Skalierungsfaktor (mit etwas Padding)
    const padding = 10;
    const scaleX = (width - 2 * padding) / drawingWidth;
    const scaleY = (height - 2 * padding) / drawingHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Nicht vergrößern, nur verkleinern

    // Berechne Offset um die Zeichnung zu zentrieren
    const scaledWidth = drawingWidth * scale;
    const scaledHeight = drawingHeight * scale;
    const offsetX = (width - scaledWidth) / 2 - minX * scale;
    const offsetY = (height - scaledHeight) / 2 - minY * scale;

    return { scaledPaths: nativePaths, scale, offsetX, offsetY };
  };

  // Konvertiere Punkte zu Skia Path mit Skalierung
  const createSkiaPath = (
    points: { x: number; y: number }[],
    color: string,
    width: number,
    scale: number = 1,
    offsetX: number = 0,
    offsetY: number = 0
  ) => {
    if (points.length < 2) return null;

    const path = SkiaModule.Path.Make();
    const firstPoint = {
      x: points[0].x * scale + offsetX,
      y: points[0].y * scale + offsetY
    };
    path.moveTo(firstPoint.x, firstPoint.y);

    for (let i = 1; i < points.length; i++) {
      const scaledPoint = {
        x: points[i].x * scale + offsetX,
        y: points[i].y * scale + offsetY
      };
      path.lineTo(scaledPoint.x, scaledPoint.y);
    }

    return { path, color, width: width * scale };
  };

  // Berechne Skalierung (nur wenn nicht im Zeichenmodus)
  const { scale, offsetX, offsetY } = !onDrawingChange ? getScaledPaths() : { scale: 1, offsetX: 0, offsetY: 0 };

  // If Skia failed to load, show a fallback
  if (!SkiaCanvas || !SkiaModule) {
    return (
      <View style={[styles.container, { width, height, justifyContent: 'center', alignItems: 'center' }]}>
        <View style={{ flex: 1, backgroundColor: '#f0f0f0' }} />
      </View>
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
        {/* Zeichne alle fertigen Pfade */}
        {nativePaths.map((pathData, index) => {
          // Fill-Pfade als gefüllte Kreise rendern (vereinfachte Native-Implementierung)
          if (pathData.type === 'fill' && pathData.points.length > 0) {
            const point = {
              x: pathData.points[0].x * scale + offsetX,
              y: pathData.points[0].y * scale + offsetY
            };
            return (
              <SkiaCircle
                key={index}
                cx={point.x}
                cy={point.y}
                r={30} // Fester Radius für Fill-Kreise
                color={pathData.color}
              />
            );
          }

          // Stroke-Pfade normal rendern
          const skiaPath = createSkiaPath(
            pathData.points,
            pathData.color,
            pathData.strokeWidth,
            scale,
            offsetX,
            offsetY
          );
          if (!skiaPath) return null;
          return (
            <SkiaPath
              key={index}
              path={skiaPath.path}
              color={skiaPath.color}
              style="stroke"
              strokeWidth={skiaPath.width}
              strokeCap="round"
              strokeJoin="round"
            />
          );
        })}

        {/* Zeichne aktuellen Pfad (nur im Zeichenmodus, keine Skalierung) */}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
});

/**
 * Hook für Canvas-Steuerung (wird vom Parent verwendet)
 */
export function useDrawingCanvas() {
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [tool, setTool] = useState<'brush' | 'fill'>('brush');
  const [paths, setPaths] = useState<DrawingPath[]>([]);

  const clearCanvas = () => {
    setPaths([]);
  };

  const undo = () => {
    if (paths.length > 0) {
      setPaths(paths.slice(0, -1));
    }
  };

  // Custom setPaths that auto-switches from fill to brush after fill is used
  const setPathsWithAutoSwitch = (newPaths: DrawingPath[] | ((prev: DrawingPath[]) => DrawingPath[])) => {
    setPaths((prevPaths) => {
      const updatedPaths = typeof newPaths === 'function' ? newPaths(prevPaths) : newPaths;

      // Check if a new fill path was just added (Issue #45)
      if (tool === 'fill' && updatedPaths.length > prevPaths.length) {
        const lastPath = updatedPaths[updatedPaths.length - 1];
        if (lastPath?.type === 'fill') {
          // Auto-switch to brush after fill is used (synchronously, to avoid timer race conditions)
          setTool('brush');
        }
      }

      return updatedPaths;
    });
  };

  return {
    color,
    setColor,
    strokeWidth,
    setStrokeWidth,
    tool,
    setTool,
    paths,
    setPaths: setPathsWithAutoSwitch,
    clearCanvas,
    undo,
  };
}
