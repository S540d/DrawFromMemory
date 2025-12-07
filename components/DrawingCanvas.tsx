import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';

interface Props {
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  paths?: DrawingPath[];
  onDrawingChange?: (paths: DrawingPath[]) => void;
}

export interface DrawingPath {
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
}

/**
 * Einfache Zeichenkomponente
 * Web: HTML5 Canvas
 * Native: react-native-skia (später)
 */
export default function DrawingCanvas({
  width = Dimensions.get('window').width - 48,
  height = 400,
  strokeColor = '#000000',
  strokeWidth = 3,
  paths = [],
  onDrawingChange,
}: Props) {
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Zeichne alle Pfade auf dem Canvas
  useEffect(() => {
    if (Platform.OS === 'web' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Berechne Skalierung (nur wenn nicht im Zeichenmodus)
      let scale = 1, offsetX = 0, offsetY = 0;
      if (!onDrawingChange && paths.length > 0) {
        // Finde min/max Koordinaten
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        paths.forEach(path => {
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
        const scaleX = (width - 2 * padding) / drawingWidth;
        const scaleY = (height - 2 * padding) / drawingHeight;
        scale = Math.min(scaleX, scaleY, 1);

        const scaledWidth = drawingWidth * scale;
        const scaledHeight = drawingHeight * scale;
        offsetX = (width - scaledWidth) / 2 - minX * scale;
        offsetY = (height - scaledHeight) / 2 - minY * scale;
      }

      // Zeichne alle fertigen Pfade
      paths.forEach((path) => {
        if (path.points.length < 2) return;

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
      });

      // Zeichne aktuellen Pfad (nur im Zeichenmodus, keine Skalierung)
      if (onDrawingChange && currentPath.length > 1) {
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
  }, [paths, currentPath, strokeColor, strokeWidth, width, height, onDrawingChange]);

  const getPosition = (event: any) => {
    if (Platform.OS === 'web' && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      return { x, y };
    }
    return { x: 0, y: 0 };
  };

  const handleStart = (event: any) => {
    const pos = getPosition(event);
    setCurrentPath([pos]);
    setIsDrawing(true);
  };

  const handleMove = (event: any) => {
    if (!isDrawing) return;
    const pos = getPosition(event);
    setCurrentPath([...currentPath, pos]);
  };

  const handleEnd = () => {
    if (isDrawing && currentPath.length > 0) {
      const newPaths = [
        ...paths,
        {
          points: currentPath,
          color: strokeColor,
          strokeWidth: strokeWidth,
        },
      ];
      setCurrentPath([]);
      setIsDrawing(false);
      onDrawingChange?.(newPaths);
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
            handleStart(e.touches[0]);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            handleMove(e.touches[0]);
          }}
          onTouchEnd={handleEnd}
        />
      </View>
    );
  }

  // Native version mit react-native-skia
  const [nativePaths, setNativePaths] = useState(paths);
  const [currentNativePath, setCurrentNativePath] = useState<{ x: number; y: number }[]>([]);

  // Update native paths wenn sich paths ändern
  useEffect(() => {
    setNativePaths(paths);
  }, [paths]);

  const handleTouchStart = (event: any) => {
    if (!onDrawingChange) return; // Nur interaktiv wenn onDrawingChange vorhanden
    const { locationX, locationY } = event.nativeEvent;
    setCurrentNativePath([{ x: locationX, y: locationY }]);
  };

  const handleTouchMove = (event: any) => {
    if (!onDrawingChange || currentNativePath.length === 0) return;
    const { locationX, locationY } = event.nativeEvent;
    setCurrentNativePath([...currentNativePath, { x: locationX, y: locationY }]);
  };

  const handleTouchEnd = () => {
    if (!onDrawingChange || currentNativePath.length === 0) return;
    const newPaths = [
      ...nativePaths,
      {
        points: currentNativePath,
        color: strokeColor,
        strokeWidth: strokeWidth,
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

    const path = Skia.Path.Make();
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

  return (
    <View style={[styles.container, { width, height }]}>
      <Canvas
        style={{ width, height }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Zeichne alle fertigen Pfade */}
        {nativePaths.map((pathData, index) => {
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
            <Path
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
            <Path
              path={skiaPath.path}
              color={skiaPath.color}
              style="stroke"
              strokeWidth={skiaPath.width}
              strokeCap="round"
              strokeJoin="round"
            />
          );
        })()}
      </Canvas>
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
  const [paths, setPaths] = useState<DrawingPath[]>([]);

  const clearCanvas = () => {
    setPaths([]);
  };

  const undo = () => {
    if (paths.length > 0) {
      setPaths(paths.slice(0, -1));
    }
  };

  return {
    color,
    setColor,
    strokeWidth,
    setStrokeWidth,
    paths,
    setPaths,
    clearCanvas,
    undo,
  };
}
