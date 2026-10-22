import React, { useState, useRef, useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { floodFillPixels, hexToRgb } from '@services/FloodFillService';
import { styles, DEFAULT_CANVAS_WIDTH } from './DrawingCanvas.shared';
import type { DrawingPath } from './DrawingCanvas.shared';

// Re-export shared API so '@components/DrawingCanvas' provides a complete module on web
export type { DrawingPath } from './DrawingCanvas.shared';
export { useDrawingCanvas } from './DrawingCanvas.hooks';

const EMPTY_PATHS: DrawingPath[] = [];

interface Props {
  /**
   * Pfade, aus denen die Anpassung der Zeichnung an die Fläche (Skalierung/Offset) berechnet wird.
   * Standard: `paths`. Im Replay die vollständige Zeichnung übergeben, damit die Skalierung über
   * alle Frames stabil bleibt und bereits gerenderte Pfade wiederverwendet werden können (#366).
   */
  scaleReferencePaths?: DrawingPath[];
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  tool?: 'brush' | 'fill';
  paths?: DrawingPath[];
  onDrawingChange?: (paths: DrawingPath[]) => void;
}

function drawPath(
  ctx: CanvasRenderingContext2D,
  path: DrawingPath,
  width: number,
  height: number,
  scale: number,
  offsetX: number,
  offsetY: number,
) {
  if (path.type === 'fill' && path.points.length > 0) {
    const point = {
      x: path.points[0].x * scale + offsetX,
      y: path.points[0].y * scale + offsetY,
    };
    const imageData = ctx.getImageData(0, 0, width, height);
    const changed = floodFillPixels(
      imageData.data,
      width,
      height,
      point.x,
      point.y,
      hexToRgb(path.color),
    );
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
}

export default function DrawingCanvas({
  width: propWidth,
  height: heightProp = 400,
  strokeColor = '#000000',
  strokeWidth = 3,
  tool = 'brush',
  paths = EMPTY_PATHS,
  scaleReferencePaths,
  onDrawingChange,
}: Props) {
  const { width: windowWidth } = useWindowDimensions();
  // Canvas-Pixelmaße müssen ganzzahlig sein: Das canvas-Attribut schneidet Nachkommastellen ab,
  // getImageData/floodFillPixels rechnen aber mit der übergebenen Breite — bei gebrochenen Maßen
  // (z. B. screenWidth * 0.44 = 184,8) stimmt die Zeilenadressierung nicht mehr und Fills
  // verschwinden still.
  const width = Math.floor(
    propWidth ?? (windowWidth > 0 ? windowWidth - 48 : DEFAULT_CANVAS_WIDTH),
  );
  const height = Math.floor(heightProp);

  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const isDrawingRef = useRef(false);
  const currentPathRef = useRef<{ x: number; y: number }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snapshotRef = useRef<HTMLCanvasElement | null>(null);
  // Gerenderter Stand aller Pfade außer dem letzten ("committed"). Wächst `paths` nur am Ende
  // (Malen, Replay), wird dieser Stand wiederverwendet statt alle Fills neu zu berechnen (#366).
  const committedRef = useRef<{
    canvas: HTMLCanvasElement;
    paths: DrawingPath[];
    key: string;
  } | null>(null);

  const floodFill = (startX: number, startY: number, fillColor: string) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, width, height);
    const changed = floodFillPixels(
      imageData.data,
      width,
      height,
      startX,
      startY,
      hexToRgb(fillColor),
    );
    if (changed) ctx.putImageData(imageData, 0, 0);
  };

  // Fertige Zeichnung (Striche + Fills) nur bei Änderung von paths/Größe neu rendern und als
  // Offscreen-Bild cachen. Der Flood-Fill (getImageData → Scan → putImageData über die ganze
  // Fläche) lief vorher bei jedem Touch-Move mit (Issue #358).
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const referencePaths = scaleReferencePaths ?? paths;
    let scale = 1,
      offsetX = 0,
      offsetY = 0;
    if (!onDrawingChange && referencePaths.length > 0) {
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
      referencePaths.forEach(path => {
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

    // Der letzte Pfad gilt als "flüchtig" (im Replay ist er der gerade wachsende Strich) und wird
    // nicht gecacht; alle davor werden einmal gerendert und wiederverwendet, solange sie
    // referenzgleich bleiben und sich Größe/Skalierung nicht ändern.
    const key = `${width}x${height}|${scale}|${offsetX}|${offsetY}`;
    const committed = paths.slice(0, -1);
    const last = paths.length > 0 ? paths[paths.length - 1] : null;

    const cache = committedRef.current;
    let start = 0;
    let reused = false;
    ctx.clearRect(0, 0, width, height);
    if (
      cache &&
      cache.key === key &&
      cache.paths.length <= committed.length &&
      cache.paths.every((p, i) => p === committed[i])
    ) {
      ctx.drawImage(cache.canvas, 0, 0);
      start = cache.paths.length;
      reused = true;
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    }

    for (let i = start; i < committed.length; i++) {
      drawPath(ctx, committed[i], width, height, scale, offsetX, offsetY);
    }

    if (committed.length === 0) {
      committedRef.current = null;
    } else if (!reused || start !== committed.length) {
      // Neuer committed-Stand: Kopie der Zeichenfläche (ohne den flüchtigen letzten Pfad) merken
      const store = cache?.canvas ?? document.createElement('canvas'); // platform-safe
      if (store.width !== width || store.height !== height) {
        store.width = width;
        store.height = height;
      }
      const storeCtx = store.getContext('2d');
      storeCtx?.clearRect(0, 0, width, height);
      storeCtx?.drawImage(canvas, 0, 0);
      committedRef.current = { canvas: store, paths: committed, key };
    }

    if (last) drawPath(ctx, last, width, height, scale, offsetX, offsetY);

    // Snapshot der fertigen Zeichnung für den Live-Strich-Effekt
    let snapshot = snapshotRef.current;
    if (!snapshot) {
      snapshot = document.createElement('canvas'); // platform-safe
      snapshotRef.current = snapshot;
    }
    snapshot.width = width;
    snapshot.height = height;
    snapshot.getContext('2d')?.drawImage(canvas, 0, 0);
  }, [paths, scaleReferencePaths, width, height, onDrawingChange]);

  // Live-Strich: Snapshot zurückkopieren und nur den aktuellen Strich darüberzeichnen.
  // Läuft nach dem Basis-Effekt (gleiche Render-Runde → Snapshot ist aktuell).
  useEffect(() => {
    const canvas = canvasRef.current;
    const snapshot = snapshotRef.current;
    if (!canvas || !snapshot) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(snapshot, 0, 0);

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

  const handleStart = (
    event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!onDrawingChange) return;
    const pos = getPosition(event);

    if (tool === 'fill') {
      floodFill(pos.x, pos.y, strokeColor);
      onDrawingChange([
        ...paths,
        { points: [pos], color: strokeColor, strokeWidth: 0, type: 'fill' },
      ]);
    } else {
      const initial = [pos];
      currentPathRef.current = initial;
      isDrawingRef.current = true;
      setCurrentPath(initial);
    }
  };

  const handleMove = (
    event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
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
      const newPaths = [
        ...paths,
        {
          points: currentPathRef.current,
          color: strokeColor,
          strokeWidth,
          type: 'stroke' as const,
        },
      ];
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
        onTouchStart={e => {
          e.preventDefault();
          handleStart(e);
        }}
        onTouchMove={e => {
          e.preventDefault();
          handleMove(e);
        }}
        onTouchEnd={handleEnd}
      />
    </View>
  );
}
