import type { DrawingPath } from '@components/DrawingCanvas.shared';
import { floodFillPixels, type FloodFillSpan, hexToRgb } from './FloodFillService';
import { createWhitePixelBuffer, rasterizePathIntoBuffer } from './SoftwareRasterizer';

export interface NativeFillLayer {
  color: string;
  spans: FloodFillSpan[];
}

/**
 * Wendet einen Pfad auf den Pixelpuffer an: Striche werden gerastert, Fills per Flood-Fill
 * angewendet (und als Span-Layer zurückgegeben).
 */
function applyPath(
  buffer: Uint8ClampedArray,
  path: DrawingPath,
  w: number,
  h: number,
  scale: number,
  offsetX: number,
  offsetY: number,
  fillLayers: NativeFillLayer[],
): void {
  if (path.type === 'fill' && path.points.length > 0) {
    const fillX = path.points[0].x * scale + offsetX;
    const fillY = path.points[0].y * scale + offsetY;
    const spans: FloodFillSpan[] = [];
    const changed = floodFillPixels(buffer, w, h, fillX, fillY, hexToRgb(path.color), spans);

    if (changed && spans.length > 0) {
      fillLayers.push({ color: path.color, spans });
    }
    return;
  }

  rasterizePathIntoBuffer(buffer, path, w, h, scale, offsetX, offsetY);
}

export function computeNativeFillLayers(
  paths: DrawingPath[],
  width: number,
  height: number,
  scale: number,
  offsetX: number,
  offsetY: number,
): NativeFillLayer[] {
  // Canvas dimensions must be integers — float widths (e.g. 363.428...) corrupt
  // buffer addressing and cause floodFillPixels to always return false.
  const w = Math.floor(width);
  const h = Math.floor(height);
  const buffer = createWhitePixelBuffer(w, h);
  const fillLayers: NativeFillLayer[] = [];

  for (const path of paths) {
    applyPath(buffer, path, w, h, scale, offsetX, offsetY, fillLayers);
  }

  return fillLayers;
}

/** Zwischenstand für {@link computeNativeFillLayersIncremental}. */
export interface NativeFillCache {
  key: string;
  /** Bereits angewendete Pfade (alle außer dem jeweils letzten der letzten Berechnung). */
  paths: DrawingPath[];
  /** Pixelpuffer nach Anwendung von `paths`. */
  buffer: Uint8ClampedArray;
  /** Fill-Layer, die aus `paths` entstanden sind. */
  layers: NativeFillLayer[];
}

/**
 * Wie {@link computeNativeFillLayers}, aber mit Wiederverwendung: Der letzte Pfad gilt als
 * "flüchtig" (im Replay der gerade wachsende Strich) und wird auf einer Kopie des Puffers
 * angewendet. Alle davor bleiben im Cache, solange sie referenzgleich und Größe/Skalierung
 * unverändert sind — ein Replay mit N Fills braucht so pro Frame höchstens 2 statt N Flood-Fills.
 * Das Ergebnis ist identisch zu `computeNativeFillLayers(paths, ...)` (Issue #366).
 */
export function computeNativeFillLayersIncremental(
  paths: DrawingPath[],
  width: number,
  height: number,
  scale: number,
  offsetX: number,
  offsetY: number,
  cache: NativeFillCache | null,
): { layers: NativeFillLayer[]; cache: NativeFillCache } {
  const w = Math.floor(width);
  const h = Math.floor(height);
  const key = `${w}x${h}|${scale}|${offsetX}|${offsetY}`;
  const committed = paths.slice(0, -1);
  const last = paths.length > 0 ? paths[paths.length - 1] : null;

  let buffer: Uint8ClampedArray;
  let layers: NativeFillLayer[];
  let start: number;
  if (
    cache &&
    cache.key === key &&
    cache.paths.length <= committed.length &&
    cache.paths.every((p, i) => p === committed[i])
  ) {
    buffer = cache.buffer;
    layers = cache.layers;
    start = cache.paths.length;
  } else {
    buffer = createWhitePixelBuffer(w, h);
    layers = [];
    start = 0;
  }

  for (let i = start; i < committed.length; i++) {
    applyPath(buffer, committed[i], w, h, scale, offsetX, offsetY, layers);
  }

  const nextCache: NativeFillCache = { key, paths: committed, buffer, layers };

  const resultLayers = layers.slice();
  if (last) {
    // Flüchtigen letzten Pfad auf einer Kopie anwenden, damit der Cache unberührt bleibt
    applyPath(buffer.slice(), last, w, h, scale, offsetX, offsetY, resultLayers);
  }

  return { layers: resultLayers, cache: nextCache };
}
