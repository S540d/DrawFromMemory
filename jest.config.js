module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.js' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'services/**/*.{ts,tsx}',
    'utils/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!app/**/_layout.tsx',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/__mocks__/**',
  ],
  // Auf dem gemessenen Stand minus kleinem Puffer. Die vorherigen Werte (25 /
  // branches 15) stammten aus einer fruehen Projektphase und lagen ~32 Punkte
  // unter der tatsaechlichen Abdeckung - ein Einbruch waere unbemerkt geblieben.
  coverageThreshold: {
    global: {
      branches: 49,
      functions: 45,
      lines: 54,
      statements: 52,
    },
  },
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^@shopify/react-native-skia$': '<rootDir>/__mocks__/@shopify/react-native-skia.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@expo-google-fonts|@shopify/react-native-skia)/)',
  ],
  globals: {
    __DEV__: true,
  },
  testTimeout: 10000,
  verbose: true,
};
