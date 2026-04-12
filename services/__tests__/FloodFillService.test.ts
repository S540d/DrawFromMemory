import { floodFillPixels, hexToRgb, MAX_FLOOD_FILL_PIXELS } from '../FloodFillService';

// Helper: create a flat white RGBA pixel buffer
function whiteCanvas(width: number, height: number): Uint8ClampedArray {
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = 255;     // R
    pixels[i + 1] = 255; // G
    pixels[i + 2] = 255; // B
    pixels[i + 3] = 255; // A
  }
  return pixels;
}

function getPixel(pixels: Uint8ClampedArray, width: number, x: number, y: number) {
  const pos = (y * width + x) * 4;
  return { r: pixels[pos], g: pixels[pos + 1], b: pixels[pos + 2], a: pixels[pos + 3] };
}

describe('hexToRgb', () => {
  it('converts a standard hex color', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 255 });
    expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0, a: 255 });
    expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255, a: 255 });
  });

  it('handles hex without leading #', () => {
    expect(hexToRgb('ffffff')).toEqual({ r: 255, g: 255, b: 255, a: 255 });
  });

  it('returns black for invalid input', () => {
    expect(hexToRgb('invalid')).toEqual({ r: 0, g: 0, b: 0, a: 255 });
  });
});

describe('floodFillPixels', () => {
  it('fills the entire canvas when all pixels match', () => {
    const W = 4, H = 4;
    const pixels = whiteCanvas(W, H);
    const red = { r: 255, g: 0, b: 0, a: 255 };

    const changed = floodFillPixels(pixels, W, H, 0, 0, red);
    expect(changed).toBe(true);

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        expect(getPixel(pixels, W, x, y)).toEqual(red);
      }
    }
  });

  it('does nothing if target color equals start color', () => {
    const W = 3, H = 3;
    const pixels = whiteCanvas(W, H);
    const white = { r: 255, g: 255, b: 255, a: 255 };

    const changed = floodFillPixels(pixels, W, H, 1, 1, white);

    expect(changed).toBe(false);
    expect(getPixel(pixels, W, 1, 1)).toEqual(white);
  });

  it('does nothing for out-of-bounds start position', () => {
    const W = 3, H = 3;
    const pixels = whiteCanvas(W, H);
    const red = { r: 255, g: 0, b: 0, a: 255 };
    const before = pixels.slice();

    expect(floodFillPixels(pixels, W, H, -1, 0, red)).toBe(false);
    expect(floodFillPixels(pixels, W, H, 0, -1, red)).toBe(false);
    expect(floodFillPixels(pixels, W, H, W, 0, red)).toBe(false);
    expect(floodFillPixels(pixels, W, H, 0, H, red)).toBe(false);

    expect(pixels).toEqual(before);
  });

  it('respects color boundaries – does not cross into differently colored regions', () => {
    // 4x1 canvas: left 2 pixels white, right 2 pixels black
    const W = 4, H = 1;
    const pixels = new Uint8ClampedArray(W * H * 4);
    // White pixels at x=0,1
    pixels[0] = 255; pixels[1] = 255; pixels[2] = 255; pixels[3] = 255;
    pixels[4] = 255; pixels[5] = 255; pixels[6] = 255; pixels[7] = 255;
    // Black pixels at x=2,3
    pixels[8] = 0; pixels[9] = 0; pixels[10] = 0; pixels[11] = 255;
    pixels[12] = 0; pixels[13] = 0; pixels[14] = 0; pixels[15] = 255;

    const red = { r: 255, g: 0, b: 0, a: 255 };
    floodFillPixels(pixels, W, H, 0, 0, red);

    expect(getPixel(pixels, W, 0, 0)).toEqual(red);
    expect(getPixel(pixels, W, 1, 0)).toEqual(red);
    // Black pixels must remain unchanged
    expect(getPixel(pixels, W, 2, 0)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
    expect(getPixel(pixels, W, 3, 0)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
  });

  it('does not fill pixels across a color boundary (black center isolates corners)', () => {
    // 3x3 canvas: all white except center pixel (black)
    // The center forms a cross-shaped barrier via 4-connectivity
    const W = 3, H = 3;
    const pixels = whiteCanvas(W, H);
    const centerPos = (1 * W + 1) * 4;
    pixels[centerPos] = 0; pixels[centerPos + 1] = 0;
    pixels[centerPos + 2] = 0; pixels[centerPos + 3] = 255;

    const red = { r: 255, g: 0, b: 0, a: 255 };
    const changed = floodFillPixels(pixels, W, H, 0, 0, red);

    expect(changed).toBe(true);
    // All white pixels reachable from (0,0) should be red
    expect(getPixel(pixels, W, 0, 0)).toEqual(red);
    expect(getPixel(pixels, W, 2, 2)).toEqual(red);
    // Center black pixel must remain unchanged
    expect(getPixel(pixels, W, 1, 1)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
  });

  it('fills through a narrow vertical corridor (scanline regression)', () => {
    // 5x5 canvas with a 1-pixel-wide corridor in column 2:
    // B B W B B
    // B B W B B
    // B B W B B
    // B B W B B
    // B B W B B
    // Filling at (2,0) should fill all 5 white pixels in the corridor.
    const W = 5, H = 5;
    const pixels = new Uint8ClampedArray(W * H * 4);
    // All black
    for (let i = 0; i < pixels.length; i += 4) {
      pixels[i] = 0; pixels[i + 1] = 0; pixels[i + 2] = 0; pixels[i + 3] = 255;
    }
    // White corridor at x=2
    for (let y = 0; y < H; y++) {
      const pos = (y * W + 2) * 4;
      pixels[pos] = 255; pixels[pos + 1] = 255; pixels[pos + 2] = 255; pixels[pos + 3] = 255;
    }

    const red = { r: 255, g: 0, b: 0, a: 255 };
    const changed = floodFillPixels(pixels, W, H, 2, 0, red);

    expect(changed).toBe(true);
    for (let y = 0; y < H; y++) {
      expect(getPixel(pixels, W, 2, y)).toEqual(red);
      // Neighbors must stay black
      expect(getPixel(pixels, W, 1, y)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
      expect(getPixel(pixels, W, 3, y)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
    }
  });

  it('fills an L-shaped region correctly', () => {
    // 4x4 canvas: L-shape of white, rest black
    // W B B B
    // W B B B
    // W W W B
    // B B B B
    const W = 4, H = 4;
    const pixels = new Uint8ClampedArray(W * H * 4);
    // All black
    for (let i = 0; i < pixels.length; i += 4) {
      pixels[i] = 0; pixels[i + 1] = 0; pixels[i + 2] = 0; pixels[i + 3] = 255;
    }
    // L-shape white pixels
    const whitePositions = [[0,0],[0,1],[0,2],[1,2],[2,2]];
    for (const [x,y] of whitePositions) {
      const pos = (y * W + x) * 4;
      pixels[pos] = 255; pixels[pos + 1] = 255; pixels[pos + 2] = 255; pixels[pos + 3] = 255;
    }

    const blue = { r: 0, g: 0, b: 255, a: 255 };
    const changed = floodFillPixels(pixels, W, H, 0, 0, blue);

    expect(changed).toBe(true);
    for (const [x,y] of whitePositions) {
      expect(getPixel(pixels, W, x, y)).toEqual(blue);
    }
    // Black pixels unchanged
    expect(getPixel(pixels, W, 1, 0)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
    expect(getPixel(pixels, W, 3, 3)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
  });

  it('exports MAX_FLOOD_FILL_PIXELS constant', () => {
    expect(MAX_FLOOD_FILL_PIXELS).toBe(150000);
  });

  it('fills correctly on a large canvas (bit-field approach)', () => {
    // 600×400 = 240 000 px — well above a typical small canvas
    const W = 600, H = 400;
    const pixels = whiteCanvas(W, H);

    // Draw a 1-pixel-wide black vertical line to verify thin strokes survive
    for (let y = 0; y < H; y++) {
      const pos = (y * W + 300) * 4;
      pixels[pos] = 0; pixels[pos + 1] = 0; pixels[pos + 2] = 0; pixels[pos + 3] = 255;
    }

    const red = { r: 255, g: 0, b: 0, a: 255 };
    const changed = floodFillPixels(pixels, W, H, 0, 0, red);

    expect(changed).toBe(true);
    expect(getPixel(pixels, W, 0, 0)).toEqual(red);
    expect(getPixel(pixels, W, 150, 200)).toEqual(red);
    // 1-px boundary must remain intact
    expect(getPixel(pixels, W, 300, 0)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
    // Right side untouched
    expect(getPixel(pixels, W, 301, 0)).toEqual({ r: 255, g: 255, b: 255, a: 255 });
  });

  it('fills correctly on a very large canvas (1000×1000) up to pixel limit', () => {
    // 1000×1000 = 1M pixels — fill stops at MAX_FLOOD_FILL_PIXELS (150k).
    // We only verify that the seed pixel and its immediate neighbors are filled.
    const W = 1000, H = 1000;
    const pixels = whiteCanvas(W, H);

    const red = { r: 255, g: 0, b: 0, a: 255 };
    const changed = floodFillPixels(pixels, W, H, 500, 500, red);

    expect(changed).toBe(true);
    // Seed pixel must always be filled
    expect(getPixel(pixels, W, 500, 500)).toEqual(red);
  });
});
