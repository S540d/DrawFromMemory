import type { DrawingPath } from '../../components/DrawingCanvas.shared';
import { computeNativeFillLayers } from '../NativeFillLayerService';

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
        points: [{ x: 2, y: 0 }, { x: 2, y: 3 }],
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
