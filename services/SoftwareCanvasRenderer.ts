import { floodFillPixels, hexToRgb } from './FloodFillService';

export interface SoftwareCanvasPath {
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
  type?: 'stroke' | 'fill';
}

const WHITE = { r: 255, g: 255, b: 255, a: 255 };

function setPixel(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number,
  color: { r: number; g: number; b: number; a: number }
): void {
  const px = Math.round(x);
  const py = Math.round(y);
  if (px < 0 || px >= width || py < 0 || py >= height) return;

  const idx = (py * width + px) * 4;
  pixels[idx] = color.r;
  pixels[idx + 1] = color.g;
  pixels[idx + 2] = color.b;
  pixels[idx + 3] = color.a;
}

function drawFilledCircle(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  cx: number,
  cy: number,
  radius: number,
  color: { r: number; g: number; b: number; a: number }
): void {
  const minX = Math.max(0, Math.floor(cx - radius));
  const maxX = Math.min(width - 1, Math.ceil(cx + radius));
  const minY = Math.max(0, Math.floor(cy - radius));
  const maxY = Math.min(height - 1, Math.ceil(cy + radius));
  const rSq = radius * radius;

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= rSq) {
        setPixel(pixels, width, height, x, y, color);
      }
    }
  }
}

function drawStrokePath(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  path: SoftwareCanvasPath,
  scale: number,
  offsetX: number,
  offsetY: number
): void {
  if (path.points.length === 0) return;

  const color = hexToRgb(path.color);
  const radius = Math.max(0.5, (path.strokeWidth * scale) / 2);

  if (path.points.length === 1) {
    drawFilledCircle(
      pixels,
      width,
      height,
      path.points[0].x * scale + offsetX,
      path.points[0].y * scale + offsetY,
      radius,
      color
    );
    return;
  }

  for (let i = 1; i < path.points.length; i++) {
    const x0 = path.points[i - 1].x * scale + offsetX;
    const y0 = path.points[i - 1].y * scale + offsetY;
    const x1 = path.points[i].x * scale + offsetX;
    const y1 = path.points[i].y * scale + offsetY;

    const length = Math.hypot(x1 - x0, y1 - y0);
    if (length === 0) {
      drawFilledCircle(pixels, width, height, x0, y0, radius, color);
      continue;
    }

    const steps = Math.max(1, Math.ceil(length));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      drawFilledCircle(
        pixels,
        width,
        height,
        x0 + (x1 - x0) * t,
        y0 + (y1 - y0) * t,
        radius,
        color
      );
    }
  }
}

export function renderPathsToPixelBuffer(
  paths: SoftwareCanvasPath[],
  width: number,
  height: number,
  scale: number,
  offsetX: number,
  offsetY: number
): Uint8ClampedArray {
  const pixels = new Uint8ClampedArray(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const p = i * 4;
    pixels[p] = WHITE.r;
    pixels[p + 1] = WHITE.g;
    pixels[p + 2] = WHITE.b;
    pixels[p + 3] = WHITE.a;
  }

  for (const path of paths) {
    if (path.type === 'fill' && path.points.length > 0) {
      const point = path.points[0];
      floodFillPixels(
        pixels,
        width,
        height,
        point.x * scale + offsetX,
        point.y * scale + offsetY,
        hexToRgb(path.color)
      );
      continue;
    }

    if (path.type !== 'fill') {
      drawStrokePath(pixels, width, height, path, scale, offsetX, offsetY);
    }
  }

  return pixels;
}
