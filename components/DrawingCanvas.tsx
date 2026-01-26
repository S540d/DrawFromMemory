import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { Canvas, Path, Skia, Circle } from '@shopify/react-native-skia';

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
  width = Dimensions.get('window').width - 48,
  height = 400,
  strokeColor = '#000000',
  strokeWidth = 3,
  tool = 'brush',
  paths = [],
  onDrawingChange,
}: Props) {
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Flood-Fill Algorithmus für Web
  const floodFill = (startX: number, startY: number, fillColor: string) => {
    if (Platform.OS !== 'web' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    // Konvertiere Hex-Farbe zu RGBA
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 255
      } : { r: 0, g: 0, b: 0, a: 255 };
    };

    const targetColor = hexToRgb(fillColor);
    const startPos = (Math.floor(startY) * width + Math.floor(startX)) * 4;
    const startR = pixels[startPos];
    const startG = pixels[startPos + 1];
    const startB = pixels[startPos + 2];
    const startA = pixels[startPos + 3];

    // Prüfe ob Zielfarbe bereits die Startfarbe ist
    if (startR === targetColor.r && startG === targetColor.g &&
        startB === targetColor.b && startA === targetColor.a) {
      return;
    }

    // Stack-basierter Flood-Fill (effizienter als Rekursion)
    const stack: { x: number; y: number }[] = [{ x: Math.floor(startX), y: Math.floor(startY) }];
    const visited = new Set<number>();

    while (stack.length > 0) {
      const { x, y } = stack.pop()!;

      if (x < 0 || x >= width || y < 0 || y >= height) continue;

      const pos = (y * width + x) * 4;
      if (visited.has(pos)) continue;

      const r = pixels[pos];
      const g = pixels[pos + 1];
      const b = pixels[pos + 2];
      const a = pixels[pos + 3];

      // Farbtoleranz für besseres Ergebnis (±2 RGB-Werte)
      if (Math.abs(r - startR) > 2 || Math.abs(g - startG) > 2 ||
          Math.abs(b - startB) > 2 || Math.abs(a - startA) > 2) {
        continue;
      }

      visited.add(pos);
      pixels[pos] = targetColor.r;
      pixels[pos + 1] = targetColor.g;
      pixels[pos + 2] = targetColor.b;
      pixels[pos + 3] = targetColor.a;

      // Füge Nachbarn hinzu (4-Richtungen)
      stack.push({ x: x + 1, y });
      stack.push({ x: x - 1, y });
      stack.push({ x, y: y + 1 });
      stack.push({ x, y: y - 1 });
    }

    ctx.putImageData(imageData, 0, 0);
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
        if (path.type === 'fill' && path.points.length > 0) {
          // Fill-Pfad: Nutze Flood-Fill am gespeicherten Punkt
          const point = {
            x: path.points[0].x * scale + offsetX,
            y: path.points[0].y * scale + offsetY
          };

          // Temporär den Canvas-Kontext wiederherstellen für Flood-Fill
          const tempCanvas = document.createElement('canvas'); // platform-safe: web-only code block
          tempCanvas.width = width;
          tempCanvas.height = height;
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            tempCtx.drawImage(canvas, 0, 0);
            // Flood-Fill direkt ausführen
            const imageData = ctx.getImageData(0, 0, width, height);
            const pixels = imageData.data;

            const hexToRgb = (hex: string) => {
              const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
              return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
                a: 255
              } : { r: 0, g: 0, b: 0, a: 255 };
            };

            const targetColor = hexToRgb(path.color);
            const startX = Math.floor(point.x);
            const startY = Math.floor(point.y);
            const startPos = (startY * width + startX) * 4;
            const startR = pixels[startPos];
            const startG = pixels[startPos + 1];
            const startB = pixels[startPos + 2];
            const startA = pixels[startPos + 3];

            if (!(startR === targetColor.r && startG === targetColor.g &&
                  startB === targetColor.b && startA === targetColor.a)) {
              const stack: { x: number; y: number }[] = [{ x: startX, y: startY }];
              const visited = new Set<number>();

              while (stack.length > 0) {
                const { x, y } = stack.pop()!;
                if (x < 0 || x >= width || y < 0 || y >= height) continue;

                const pos = (y * width + x) * 4;
                if (visited.has(pos)) continue;

                const r = pixels[pos];
                const g = pixels[pos + 1];
                const b = pixels[pos + 2];
                const a = pixels[pos + 3];

                if (Math.abs(r - startR) > 2 || Math.abs(g - startG) > 2 ||
                    Math.abs(b - startB) > 2 || Math.abs(a - startA) > 2) {
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

              ctx.putImageData(imageData, 0, 0);
            }
          }
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
      onDrawingChange?.(newPaths);
    } else {
      // Brush-Tool: Starte Zeichnung
      setCurrentPath([pos]);
      setIsDrawing(true);
    }
  };

  const handleMove = (event: any) => {
    if (!isDrawing || tool === 'fill') return;
    const pos = getPosition(event);
    setCurrentPath([...currentPath, pos]);
  };

  const handleEnd = () => {
    if (tool === 'fill') return;

    if (isDrawing && currentPath.length > 0) {
      const newPaths = [
        ...paths,
        {
          points: currentPath,
          color: strokeColor,
          strokeWidth: strokeWidth,
          type: 'stroke' as const,
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

  const handleTouchMove = (event: any) => {
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
          // Fill-Pfade als gefüllte Kreise rendern (vereinfachte Native-Implementierung)
          if (pathData.type === 'fill' && pathData.points.length > 0) {
            const point = {
              x: pathData.points[0].x * scale + offsetX,
              y: pathData.points[0].y * scale + offsetY
            };
            return (
              <Circle
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
