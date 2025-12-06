import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';

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

      // Zeichne alle fertigen Pfade
      paths.forEach((path) => {
        if (path.points.length < 2) return;

        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(path.points[0].x, path.points[0].y);

        for (let i = 1; i < path.points.length; i++) {
          ctx.lineTo(path.points[i].x, path.points[i].y);
        }

        ctx.stroke();
      });

      // Zeichne aktuellen Pfad
      if (currentPath.length > 1) {
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
  }, [paths, currentPath, strokeColor, strokeWidth, width, height]);

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

  // Native version (Placeholder - wird später mit react-native-skia implementiert)
  return (
    <View style={[styles.container, { width, height }]}>
      <View style={styles.placeholder}>
        {/* Native drawing wird später implementiert */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
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
