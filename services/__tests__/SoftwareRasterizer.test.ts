import { rasterizeStrokes } from '../SoftwareRasterizer';
import type { DrawingPath } from '../../components/DrawingCanvas.shared';

describe('SoftwareRasterizer', () => {
  const W = 20;
  const H = 20;

  it('returns a white buffer when there are no paths', () => {
    const buffer = rasterizeStrokes([], W, H, 1, 0, 0);
    expect(buffer.length).toBe(W * H * 4);

    // Every pixel should be white (255, 255, 255, 255)
    for (let i = 0; i < buffer.length; i += 4) {
      expect(buffer[i]).toBe(255);
      expect(buffer[i + 1]).toBe(255);
      expect(buffer[i + 2]).toBe(255);
      expect(buffer[i + 3]).toBe(255);
    }
  });

  it('draws a horizontal stroke in the correct color', () => {
    const paths: DrawingPath[] = [
      {
        points: [{ x: 2, y: 10 }, { x: 18, y: 10 }],
        color: '#FF0000',
        strokeWidth: 2,
        type: 'stroke',
      },
    ];

    const buffer = rasterizeStrokes(paths, W, H, 1, 0, 0);

    // The center of the line (x=10, y=10) should be red
    const idx = (10 * W + 10) * 4;
    expect(buffer[idx]).toBe(255);     // R
    expect(buffer[idx + 1]).toBe(0);   // G
    expect(buffer[idx + 2]).toBe(0);   // B
    expect(buffer[idx + 3]).toBe(255); // A
  });

  it('skips fill paths', () => {
    const paths: DrawingPath[] = [
      {
        points: [{ x: 5, y: 5 }],
        color: '#00FF00',
        strokeWidth: 0,
        type: 'fill',
      },
    ];

    const buffer = rasterizeStrokes(paths, W, H, 1, 0, 0);

    // Fill should be ignored — pixel at (5,5) should still be white
    const idx = (5 * W + 5) * 4;
    expect(buffer[idx]).toBe(255);
    expect(buffer[idx + 1]).toBe(255);
    expect(buffer[idx + 2]).toBe(255);
  });

  it('applies scale and offset correctly', () => {
    const paths: DrawingPath[] = [
      {
        points: [{ x: 0, y: 0 }, { x: 5, y: 0 }],
        color: '#0000FF',
        strokeWidth: 2,
        type: 'stroke',
      },
    ];

    // Scale 2x, offset (2, 3) → line goes from (2,3) to (12,3)
    const buffer = rasterizeStrokes(paths, W, H, 2, 2, 3);

    // Pixel at (7, 3) should be blue (center of scaled line)
    const idx = (3 * W + 7) * 4;
    expect(buffer[idx]).toBe(0);       // R
    expect(buffer[idx + 1]).toBe(0);   // G
    expect(buffer[idx + 2]).toBe(255); // B
    expect(buffer[idx + 3]).toBe(255); // A
  });

  it('skips paths with fewer than 2 points', () => {
    const paths: DrawingPath[] = [
      {
        points: [{ x: 5, y: 5 }],
        color: '#FF0000',
        strokeWidth: 4,
        type: 'stroke',
      },
    ];

    const buffer = rasterizeStrokes(paths, W, H, 1, 0, 0);

    // Single-point stroke should be skipped — pixel still white
    const idx = (5 * W + 5) * 4;
    expect(buffer[idx]).toBe(255);
    expect(buffer[idx + 1]).toBe(255);
    expect(buffer[idx + 2]).toBe(255);
  });

  it('does not write outside canvas bounds', () => {
    const paths: DrawingPath[] = [
      {
        points: [{ x: -5, y: 10 }, { x: 25, y: 10 }],
        color: '#FF0000',
        strokeWidth: 4,
        type: 'stroke',
      },
    ];

    // Should not throw — clipping is handled internally
    expect(() => rasterizeStrokes(paths, W, H, 1, 0, 0)).not.toThrow();

    const buffer = rasterizeStrokes(paths, W, H, 1, 0, 0);
    expect(buffer.length).toBe(W * H * 4);
  });
});
