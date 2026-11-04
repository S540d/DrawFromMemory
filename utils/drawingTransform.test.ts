import { computeFitTransform, IDENTITY_TRANSFORM, type FitPath } from './drawingTransform';

const stroke = (...pts: [number, number][]): FitPath => ({
  points: pts.map(([x, y]) => ({ x, y })),
  type: 'stroke',
});
const fill = (x: number, y: number): FitPath => ({ points: [{ x, y }], type: 'fill' });

/** Referenz: die bisherige, in vier Dateien kopierte Implementierung (Stand vor #359). */
function legacyFit(paths: FitPath[], width: number, height: number, padding: number) {
  let scale = 1,
    offsetX = 0,
    offsetY = 0;
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
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
  if (drawingWidth > 0 && drawingHeight > 0) {
    scale = Math.min(
      (width - 2 * padding) / drawingWidth,
      (height - 2 * padding) / drawingHeight,
      1,
    );
    offsetX = (width - drawingWidth * scale) / 2 - minX * scale;
    offsetY = (height - drawingHeight * scale) / 2 - minY * scale;
  }
  return { scale, offsetX, offsetY };
}

describe('computeFitTransform', () => {
  it('liefert Identität ohne Pfade', () => {
    expect(computeFitTransform([], 200, 200, 10)).toEqual(IDENTITY_TRANSFORM);
  });

  it('liefert Identität, wenn es nur Fills gibt', () => {
    expect(computeFitTransform([fill(5, 5), fill(9, 9)], 200, 200, 10)).toEqual(IDENTITY_TRANSFORM);
  });

  it('liefert Identität bei Einzelpunkt und bei waagerechter/senkrechter Linie', () => {
    expect(computeFitTransform([stroke([5, 5])], 200, 200, 10)).toEqual(IDENTITY_TRANSFORM);
    expect(computeFitTransform([stroke([0, 5], [50, 5])], 200, 200, 10)).toEqual(
      IDENTITY_TRANSFORM,
    );
    expect(computeFitTransform([stroke([5, 0], [5, 50])], 200, 200, 10)).toEqual(
      IDENTITY_TRANSFORM,
    );
  });

  it('skaliert nie über 1 hinaus und zentriert eine kleine Zeichnung', () => {
    const t = computeFitTransform([stroke([0, 0], [20, 10])], 100, 100, 10);
    expect(t.scale).toBe(1);
    // Zeichnung 20×10 mittig in 100×100: x 40..60, y 45..55
    expect(0 * t.scale + t.offsetX).toBe(40);
    expect(20 * t.scale + t.offsetX).toBe(60);
    expect(0 * t.scale + t.offsetY).toBe(45);
    expect(10 * t.scale + t.offsetY).toBe(55);
  });

  it('verkleinert eine große Zeichnung auf Fläche minus Padding', () => {
    const t = computeFitTransform([stroke([0, 0], [400, 200])], 100, 100, 10);
    expect(t.scale).toBeCloseTo(80 / 400);
    expect(400 * t.scale + t.offsetX).toBeCloseTo(90);
    expect(0 * t.scale + t.offsetX).toBeCloseTo(10);
  });

  it('ignoriert Fills bei der Bounding Box', () => {
    const withFar = computeFitTransform([stroke([0, 0], [40, 40]), fill(9999, 9999)], 100, 100, 10);
    const without = computeFitTransform([stroke([0, 0], [40, 40])], 100, 100, 10);
    expect(withFar).toEqual(without);
  });

  it('nutzt das übergebene Padding (Canvas 10, Export 40)', () => {
    const paths = [stroke([0, 0], [1000, 1000])];
    expect(computeFitTransform(paths, 600, 600, 10).scale).toBeCloseTo(0.58);
    expect(computeFitTransform(paths, 600, 600, 40).scale).toBeCloseTo(0.52);
  });

  it('entspricht der bisherigen Implementierung für zufällige Zeichnungen', () => {
    // Deterministischer Pseudozufall (LCG), damit der Test reproduzierbar bleibt
    let seed = 12345;
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    for (let i = 0; i < 300; i++) {
      const paths: FitPath[] = [];
      const count = Math.floor(rnd() * 6);
      for (let p = 0; p < count; p++) {
        if (rnd() < 0.3) {
          paths.push(fill(rnd() * 400, rnd() * 400));
        } else {
          const n = 1 + Math.floor(rnd() * 8);
          paths.push({
            points: Array.from({ length: n }, () => ({
              x: rnd() * 600 - 100,
              y: rnd() * 600 - 100,
            })),
            type: rnd() < 0.5 ? 'stroke' : undefined,
          });
        }
      }
      const width = 100 + rnd() * 500;
      const height = 100 + rnd() * 500;
      const padding = rnd() < 0.5 ? 10 : 40;
      expect(computeFitTransform(paths, width, height, padding)).toEqual(
        legacyFit(paths, width, height, padding),
      );
    }
  });
});
