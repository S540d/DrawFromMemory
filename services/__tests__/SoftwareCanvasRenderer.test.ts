import { renderPathsToPixelBuffer } from '../SoftwareCanvasRenderer';

function getPixel(pixels: Uint8ClampedArray, width: number, x: number, y: number) {
  const idx = (y * width + x) * 4;
  return {
    r: pixels[idx],
    g: pixels[idx + 1],
    b: pixels[idx + 2],
    a: pixels[idx + 3],
  };
}

describe('renderPathsToPixelBuffer', () => {
  it('returns white background for empty path list', () => {
    const pixels = renderPathsToPixelBuffer([], 4, 4, 1, 0, 0);

    expect(getPixel(pixels, 4, 0, 0)).toEqual({ r: 255, g: 255, b: 255, a: 255 });
    expect(getPixel(pixels, 4, 3, 3)).toEqual({ r: 255, g: 255, b: 255, a: 255 });
  });

  it('draws stroke paths into the buffer', () => {
    const pixels = renderPathsToPixelBuffer(
      [{
        type: 'stroke',
        color: '#000000',
        strokeWidth: 2,
        points: [{ x: 1, y: 1 }, { x: 8, y: 1 }],
      }],
      10,
      10,
      1,
      0,
      0
    );

    const strokePixel = getPixel(pixels, 10, 4, 1);
    expect(strokePixel.r).toBe(0);
    expect(strokePixel.g).toBe(0);
    expect(strokePixel.b).toBe(0);
    expect(strokePixel.a).toBe(255);
  });

  it('fills enclosed area without leaking through stroke boundary', () => {
    const pixels = renderPathsToPixelBuffer(
      [
        {
          type: 'stroke',
          color: '#000000',
          strokeWidth: 3,
          points: [
            { x: 2, y: 2 },
            { x: 17, y: 2 },
            { x: 17, y: 17 },
            { x: 2, y: 17 },
            { x: 2, y: 2 },
          ],
        },
        {
          type: 'fill',
          color: '#FF0000',
          strokeWidth: 0,
          points: [{ x: 10, y: 10 }],
        },
      ],
      20,
      20,
      1,
      0,
      0
    );

    expect(getPixel(pixels, 20, 10, 10)).toEqual({ r: 255, g: 0, b: 0, a: 255 });
    expect(getPixel(pixels, 20, 0, 0)).toEqual({ r: 255, g: 255, b: 255, a: 255 });
  });
});
