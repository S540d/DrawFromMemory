// Mock for @shopify/react-native-skia
module.exports = {
  Canvas: 'Canvas',
  Path: 'Path',
  Circle: 'Circle',
  Skia: {
    Path: {
      Make: jest.fn(() => ({
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        close: jest.fn(),
      })),
    },
  },
  useCanvasRef: jest.fn(),
  useTouchHandler: jest.fn(),
};
