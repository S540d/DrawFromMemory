// Mock for @shopify/react-native-skia
const mockSurface = {
  getCanvas: jest.fn(() => ({
    drawRect: jest.fn(),
    drawImage: jest.fn(),
    drawPath: jest.fn(),
    drawColor: jest.fn(),
    clear: jest.fn(),
  })),
  flush: jest.fn(),
  makeImageSnapshot: jest.fn(() => ({
    readPixels: jest.fn(() => null),
    width: jest.fn(() => 0),
    height: jest.fn(() => 0),
  })),
};

module.exports = {
  Canvas: 'Canvas',
  Path: 'Path',
  Circle: 'Circle',
  Image: 'Image',
  AlphaType: { Unknown: 0, Opaque: 1, Premul: 2, Unpremul: 3 },
  ColorType: { Unknown: 0, RGBA_8888: 4, BGRA_8888: 6 },
  PaintStyle: { Fill: 0, Stroke: 1 },
  StrokeCap: { Butt: 0, Round: 1, Square: 2 },
  StrokeJoin: { Miter: 0, Round: 1, Bevel: 2 },
  Skia: {
    Path: {
      Make: jest.fn(() => ({
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        close: jest.fn(),
      })),
    },
    Paint: jest.fn(() => ({
      setColor: jest.fn(),
      setStrokeWidth: jest.fn(),
      setStyle: jest.fn(),
      setStrokeCap: jest.fn(),
      setStrokeJoin: jest.fn(),
      setAntiAlias: jest.fn(),
      setAlphaf: jest.fn(),
    })),
    Color: jest.fn((c) => c),
    XYWHRect: jest.fn((x, y, w, h) => ({ x, y, width: w, height: h })),
    Surface: {
      Make: jest.fn(() => mockSurface),
      MakeOffscreen: jest.fn(() => mockSurface),
    },
    Data: {
      fromBytes: jest.fn(() => ({})),
    },
    Image: {
      MakeImage: jest.fn(() => null),
    },
  },
  useCanvasRef: jest.fn(),
  useTouchHandler: jest.fn(),
};
