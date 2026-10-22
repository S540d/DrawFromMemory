import type { DrawingPath } from '../../components/DrawingCanvas.shared';
import {
  computeNativeFillLayers,
  computeNativeFillLayersIncremental,
  type NativeFillCache,
} from '../NativeFillLayerService';

describe('computeNativeFillLayers', () => {
  it('builds rect spans for a bounded fill region', () => {
    const paths: DrawingPath[] = [
      {
        points: [
          { x: 1, y: 1 },
          { x: 8, y: 1 },
          { x: 8, y: 8 },
          { x: 1, y: 8 },
          { x: 1, y: 1 },
        ],
        color: '#000000',
        strokeWidth: 1,
        type: 'stroke',
      },
      {
        points: [{ x: 4, y: 4 }],
        color: '#FF0000',
        strokeWidth: 0,
        type: 'fill',
      },
    ];

    const layers = computeNativeFillLayers(paths, 10, 10, 1, 0, 0);

    expect(layers).toEqual([
      {
        color: '#FF0000',
        spans: [
          { x: 3, y: 3, width: 4 },
          { x: 3, y: 4, width: 4 },
          { x: 3, y: 5, width: 4 },
          { x: 3, y: 6, width: 4 },
        ],
      },
    ]);
  });

  it('preserves fill order when later fills repaint an earlier region', () => {
    const paths: DrawingPath[] = [
      {
        points: [{ x: 1, y: 1 }],
        color: '#FF0000',
        strokeWidth: 0,
        type: 'fill',
      },
      {
        points: [{ x: 1, y: 1 }],
        color: '#0000FF',
        strokeWidth: 0,
        type: 'fill',
      },
    ];

    const layers = computeNativeFillLayers(paths, 3, 2, 1, 0, 0);

    expect(layers).toEqual([
      {
        color: '#FF0000',
        spans: [
          { x: 0, y: 0, width: 3 },
          { x: 0, y: 1, width: 3 },
        ],
      },
      {
        color: '#0000FF',
        spans: [
          { x: 0, y: 0, width: 3 },
          { x: 0, y: 1, width: 3 },
        ],
      },
    ]);
  });

  it('uses later strokes as boundaries for later fills only', () => {
    const paths: DrawingPath[] = [
      {
        points: [{ x: 1, y: 1 }],
        color: '#FF0000',
        strokeWidth: 0,
        type: 'fill',
      },
      {
        points: [
          { x: 2, y: 0 },
          { x: 2, y: 3 },
        ],
        color: '#000000',
        strokeWidth: 1,
        type: 'stroke',
      },
      {
        points: [{ x: 4, y: 1 }],
        color: '#0000FF',
        strokeWidth: 0,
        type: 'fill',
      },
    ];

    const layers = computeNativeFillLayers(paths, 5, 3, 1, 0, 0);

    expect(layers).toEqual([
      {
        color: '#FF0000',
        spans: [
          { x: 0, y: 0, width: 5 },
          { x: 0, y: 1, width: 5 },
          { x: 0, y: 2, width: 5 },
        ],
      },
      {
        color: '#0000FF',
        spans: [
          { x: 4, y: 0, width: 1 },
          { x: 4, y: 1, width: 1 },
          { x: 4, y: 2, width: 1 },
        ],
      },
    ]);
  });
});

describe('computeNativeFillLayersIncremental (#366)', () => {
  const box = (x0: number, y0: number, x1: number, y1: number): DrawingPath => ({
    points: [
      { x: x0, y: y0 },
      { x: x1, y: y0 },
      { x: x1, y: y1 },
      { x: x0, y: y1 },
      { x: x0, y: y0 },
    ],
    color: '#000000',
    strokeWidth: 1,
    type: 'stroke',
  });
  const fillAt = (x: number, y: number, color: string): DrawingPath => ({
    points: [{ x, y }],
    color,
    strokeWidth: 0,
    type: 'fill',
  });

  // Zeichnung mit Strichen, Fills und einem Fill, der eine frühere Fläche überstreicht
  const drawing: DrawingPath[] = [
    box(1, 1, 8, 8),
    fillAt(4, 4, '#FF0000'),
    box(12, 1, 18, 8),
    fillAt(15, 4, '#00FF00'),
    fillAt(4, 4, '#0000FF'),
    box(1, 12, 8, 18),
    fillAt(4, 15, '#FFFF00'),
  ];

  it('liefert für jeden wachsenden Präfix dasselbe wie die Komplettberechnung', () => {
    let cache: NativeFillCache | null = null;
    for (let n = 1; n <= drawing.length; n++) {
      const prefix = drawing.slice(0, n);
      const result = computeNativeFillLayersIncremental(prefix, 20, 20, 1, 0, 0, cache);
      cache = result.cache;
      expect(result.layers).toEqual(computeNativeFillLayers(prefix, 20, 20, 1, 0, 0));
    }
  });

  it('liefert dasselbe, wenn der letzte Pfad pro Frame ein neues, wachsendes Objekt ist (Replay)', () => {
    const stroke = box(1, 1, 8, 8);
    let cache: NativeFillCache | null = null;
    for (let k = 2; k <= stroke.points.length; k++) {
      const partial = { ...stroke, points: stroke.points.slice(0, k) };
      const prefix = [fillAt(15, 15, '#FF0000'), partial];
      const result = computeNativeFillLayersIncremental(prefix, 20, 20, 1, 0, 0, cache);
      cache = result.cache;
      expect(result.layers).toEqual(computeNativeFillLayers(prefix, 20, 20, 1, 0, 0));
    }
  });

  it('verwendet Puffer und committed-Pfade wieder, solange der Präfix gleich bleibt', () => {
    const first = computeNativeFillLayersIncremental(drawing.slice(0, 3), 20, 20, 1, 0, 0, null);
    const second = computeNativeFillLayersIncremental(
      drawing.slice(0, 4),
      20,
      20,
      1,
      0,
      0,
      first.cache,
    );
    expect(second.cache.buffer).toBe(first.cache.buffer);
    expect(second.cache.paths).toEqual(drawing.slice(0, 3));
  });

  it('baut neu auf, wenn sich die Skalierung ändert', () => {
    const first = computeNativeFillLayersIncremental(drawing.slice(0, 4), 20, 20, 1, 0, 0, null);
    const second = computeNativeFillLayersIncremental(
      drawing.slice(0, 4),
      20,
      20,
      0.5,
      2,
      2,
      first.cache,
    );
    expect(second.cache.buffer).not.toBe(first.cache.buffer);
    expect(second.layers).toEqual(computeNativeFillLayers(drawing.slice(0, 4), 20, 20, 0.5, 2, 2));
  });

  it('baut neu auf, wenn Pfade entfernt werden (Undo)', () => {
    const first = computeNativeFillLayersIncremental(drawing, 20, 20, 1, 0, 0, null);
    const shorter = drawing.slice(0, 3);
    const second = computeNativeFillLayersIncremental(shorter, 20, 20, 1, 0, 0, first.cache);
    expect(second.layers).toEqual(computeNativeFillLayers(shorter, 20, 20, 1, 0, 0));
  });

  it('lässt den Cache vom flüchtigen letzten Pfad unberührt', () => {
    const base = drawing.slice(0, 3);
    const withRed = computeNativeFillLayersIncremental(
      [...base, fillAt(4, 4, '#FF0000')],
      20,
      20,
      1,
      0,
      0,
      null,
    );
    const withBlue = computeNativeFillLayersIncremental(
      [...base, fillAt(4, 4, '#0000FF')],
      20,
      20,
      1,
      0,
      0,
      null,
    );
    // Beide haben denselben committed-Stand (base); der letzte Pfad darf ihn nicht verändern
    expect(Array.from(withRed.cache.buffer)).toEqual(Array.from(withBlue.cache.buffer));
    expect(withRed.cache.paths).toHaveLength(3);
  });
});
