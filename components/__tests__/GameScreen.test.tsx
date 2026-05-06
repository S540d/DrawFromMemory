import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn() }),
  useLocalSearchParams: () => ({}),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../../utils/useScreenLayout', () => ({
  useScreenLayout: () => ({
    screenWidth: 1280,
    isSmall: false,
    headerPaddingHorizontal: 16,
    canvasMaxHeight: 400,
    canvasMinHeight: 250,
    canvasMarginVertical: 12,
    toolbarMarginVertical: 12,
    toolbarButtonMinHeight: 44,
    toolbarButtonPaddingVertical: 8,
    buttonMinHeight: 44,
    buttonPaddingVertical: 8,
    imagePlaceholderMinSize: 180,
    memorizeImageSize: 220,
  }),
}));

jest.mock('../../services/LevelManager', () => ({
  getTotalLevels: () => 10,
}));

jest.mock('../../services/i18n', () => ({
  t: (key: string) => key,
  getCurrentLanguage: () => 'en',
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../services/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      background: '#fff',
      surface: '#f0f0f0',
      primary: '#6200ee',
      text: { primary: '#000', secondary: '#666', light: '#999' },
    },
  }),
}));

jest.mock('../../components/LevelImageDisplay', () => {
  return function LevelImageDisplay() { return null; };
});

jest.mock('../../components/DrawingCanvas', () => {
  const { View } = require('react-native');
  const DrawingCanvas = () => <View testID="drawing-canvas" />;
  return {
    __esModule: true,
    default: DrawingCanvas,
    useDrawingCanvas: () => ({
      color: '#000',
      strokeWidth: 2,
      tool: 'brush',
      paths: [],
      setPaths: jest.fn(),
      clearCanvas: jest.fn(),
      setColor: jest.fn(),
      setTool: jest.fn(),
      setStrokeWidth: jest.fn(),
      undo: jest.fn(),
    }),
  };
});

jest.mock('../../components/SettingsModal', () => {
  return function SettingsModal() { return null; };
});

jest.mock('../../components/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('../../components/AnimatedPrimitives', () => ({
  AnimatedFeedback: ({ children, visible }: any) => (visible ? <>{children}</> : null),
}));

jest.mock('../../services/SoundManager', () => ({
  __esModule: true,
  default: { init: jest.fn(), playPhaseTransition: jest.fn() },
}));

jest.mock('../../services/useGamePhase', () => ({
  useGamePhase: () => ({
    phase: 'memorize',
    setPhase: jest.fn(),
    levelNumber: 1,
    currentImage: null,
    timeRemaining: 5,
    userRating: 0,
    revealStep: 0,
    savedToGallery: false,
    isReplaying: false,
    setIsReplaying: jest.fn(),
    replayPaths: [],
    handleRatingSubmit: jest.fn(),
    saveToGallery: jest.fn(),
    startReplay: jest.fn(),
    restartCurrentLevel: jest.fn(),
    startNextLevel: jest.fn(),
    restartFromLevel1: jest.fn(),
  }),
}));

import GameScreen from '../../app/game';

describe('GameScreen', () => {
  it('renders the app name via translation key, not hardcoded', () => {
    const { getByText, queryByText } = render(<GameScreen />);
    expect(getByText('app.name')).toBeTruthy();
    expect(queryByText('Merke & Male')).toBeNull();
  });
});
