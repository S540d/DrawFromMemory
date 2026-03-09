import React, { useState, useRef, useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { floodFillPixels, hexToRgb } from '@services/FloodFillService';
import { styles, DEFAULT_CANVAS_WIDTH } from './DrawingCanvas';
import type { DrawingPath } from './DrawingCanvas';

interface Props {
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  tool?: 'brush' | 'fill';
  paths?: DrawingPath[];
  onDrawingChange?: (paths: DrawingPath[]) => void;
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

  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const isDrawingRef = useRef(false);
  const currentPathRef = useRef<{ x: number; y: number }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const floodFill = (startX: number, startY: number, fillColor: string) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, width, height);
    const changed = floodFillPixels(imageData.data, width, height, startX, startY, hexToRgb(fillColor));
    if (changed) ctx.putImageData(imageData, 0, 0);
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    let scale = 1, offsetX = 0, offsetY = 0;
    if (!onDrawingChange && paths.length > 0) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      paths.forEach(path => {
        if (path.type === 'fill') return;
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

    paths.forEach((path) => {
      if (path.type === 'fill' && path.points.length > 0) {
        const point = {
          x: path.points[0].x * scale + offsetX,
          y: path.points[0].y * scale + offsetY,
        };
        const imageData = ctx.getImageData(0, 0, width, height);
        const changed = floodFillPixels(imageData.data, width, height, point.x, point.y, hexToRgb(path.color));
        if (changed) ctx.putImageData(imageData, 0, 0);
      } else if (path.points.length >= 2) {
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.strokeWidth * scale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(path.points[0].x * scale + offsetX, path.points[0].y * scale + offsetY);
        for (let i = 1; i < path.points.length; i++) {
          ctx.lineTo(path.points[i].x * scale + offsetX, path.points[i].y * scale + offsetY);
        }
        ctx.stroke();
      }
    });

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
  }, [paths, currentPath, strokeColor, strokeWidth, width, height, onDrawingChange, tool]);

  const getPosition = (event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX: number;
    let clientY: number;

    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      return { x: 0, y: 0 };
    }

    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handleStart = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!onDrawingChange) return;
    const pos = getPosition(event);

    if (tool === 'fill') {
      floodFill(pos.x, pos.y, strokeColor);
      onDrawingChange([...paths, { points: [pos], color: strokeColor, strokeWidth: 0, type: 'fill' }]);
    } else {
      const initial = [pos];
      currentPathRef.current = initial;
      isDrawingRef.current = true;
      setCurrentPath(initial);
    }
  };

  const handleMove = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!onDrawingChange || !isDrawingRef.current || tool === 'fill') return;
    const pos = getPosition(event);
    const next = [...currentPathRef.current, pos];
    currentPathRef.current = next;
    setCurrentPath(next);
  };

  const handleEnd = () => {
    if (!onDrawingChange) return;
    if (tool === 'fill') {
      isDrawingRef.current = false;
      currentPathRef.current = [];
      setCurrentPath([]);
      return;
    }

    if (isDrawingRef.current && currentPathRef.current.length > 1) {
      const newPaths = [...paths, { points: currentPathRef.current, color: strokeColor, strokeWidth, type: 'stroke' as const }];
      currentPathRef.current = [];
      isDrawingRef.current = false;
      setCurrentPath([]);
      onDrawingChange(newPaths);
    } else {
      currentPathRef.current = [];
      isDrawingRef.current = false;
      setCurrentPath([]);
    }
  };

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
        onTouchStart={(e) => { e.preventDefault(); handleStart(e); }}
        onTouchMove={(e) => { e.preventDefault(); handleMove(e); }}
        onTouchEnd={handleEnd}
      />
    </View>
  );
}
