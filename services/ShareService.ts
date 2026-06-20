/**
 * ShareService — Web implementation
 * Renders DrawingPath[] to an off-screen canvas and shares/downloads the PNG.
 * This file is loaded on web; ShareService.native.ts is loaded on native via Metro.
 */
import type { DrawingPath } from '@components/DrawingCanvas.shared';
import { floodFillPixels, hexToRgb } from './FloodFillService';

const EXPORT_SIZE = 600;

function buildOffscreenCanvas(paths: DrawingPath[]): HTMLCanvasElement {
  const canvas = document.createElement('canvas'); // platform-safe
  canvas.width = EXPORT_SIZE;
  canvas.height = EXPORT_SIZE;
  const ctx = canvas.getContext('2d', { willReadFrequently: true }); // platform-safe
  if (!ctx) return canvas;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, EXPORT_SIZE, EXPORT_SIZE);

  if (paths.length === 0) return canvas;

  // Scale/offset: fit drawing into the export canvas (same logic as DrawingCanvas.web.tsx preview mode)
  const strokePaths = paths.filter(p => p.type !== 'fill');
  let scale = 1, offsetX = 0, offsetY = 0;

  if (strokePaths.length > 0) {
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
    if (dw > 0 && dh > 0) {
      const padding = 40;
      scale = Math.min((EXPORT_SIZE - 2 * padding) / dw, (EXPORT_SIZE - 2 * padding) / dh, 1);
      const sw = dw * scale;
      const sh = dh * scale;
      offsetX = (EXPORT_SIZE - sw) / 2 - minX * scale;
      offsetY = (EXPORT_SIZE - sh) / 2 - minY * scale;
    }
  }

  for (const path of paths) {
    if (path.type === 'fill' && path.points.length > 0) {
      const px = path.points[0].x * scale + offsetX;
      const py = path.points[0].y * scale + offsetY;
      const imageData = ctx.getImageData(0, 0, EXPORT_SIZE, EXPORT_SIZE); // platform-safe
      const changed = floodFillPixels(imageData.data, EXPORT_SIZE, EXPORT_SIZE, px, py, hexToRgb(path.color));
      if (changed) ctx.putImageData(imageData, 0, 0); // platform-safe
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

  return canvas;
}

export async function shareDrawing(paths: DrawingPath[], _title?: string): Promise<void> {
  const canvas = buildOffscreenCanvas(paths);
  const filename = `zeichnung-${Date.now()}.png`;

  return new Promise<void>((resolve, reject) => {
    canvas.toBlob(async (blob) => { // platform-safe
      if (!blob) {
        reject(new Error('Canvas export failed'));
        return;
      }

      // Try Web Share API with file support (mobile browsers)
      try {
        const file = new File([blob], filename, { type: 'image/png' }); // platform-safe
        if (
          typeof navigator !== 'undefined' && // platform-safe
          typeof navigator.canShare === 'function' && // platform-safe
          navigator.canShare({ files: [file] }) // platform-safe
        ) {
          await navigator.share({ files: [file] }); // platform-safe
          resolve();
          return;
        }
      } catch (e) {
        if ((e as Error).name === 'AbortError') {
          resolve();
          return;
        }
        // Fall through to download
      }

      // Fallback: trigger a file download
      const url = URL.createObjectURL(blob); // platform-safe
      const a = document.createElement('a'); // platform-safe
      a.href = url;
      a.download = filename;
      document.body.appendChild(a); // platform-safe
      a.click();
      requestAnimationFrame(() => { // platform-safe
        document.body.removeChild(a); // platform-safe
        URL.revokeObjectURL(url); // platform-safe
      });
      resolve();
    }, 'image/png');
  });
}
