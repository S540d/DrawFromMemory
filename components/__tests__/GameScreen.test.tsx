import React from 'react';
import { render, act } from '@testing-library/react-native';

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
  getLanguage: () => 'en',
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
  const { View } = require('react-native');
  return function LevelImageDisplay() { return <View />; };
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
  const { View } = require('react-native');
  return function SettingsModal() { return <View />; };
});

jest.mock('../../components/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: any) => {
    const { View } = require('react-native');
    return <View>{children}</View>;
  },
}));

jest.mock('../../components/AnimatedPrimitives', () => {
  const { View } = require('react-native');
  return {
    AnimatedFeedback: ({ children, visible }: any) => visible ? <View>{children}</View> : null,
  };
});

jest.mock('../../services/SoundManager', () => ({
  __esModule: true,
  default: { init: jest.fn(), playPhaseTransition: jest.fn() },
}));

jest.mock('../../components/ConfettiBurst', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: () => <View testID="confetti-burst" /> };
});

jest.mock('../../components/BadgeUnlockToast', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: () => <View testID="badge-unlock-toast" /> };
});

jest.mock('../../services/AchievementManager', () => ({
  checkAndUnlock: jest.fn(async () => []),
  ACHIEVEMENTS: [],
}));

jest.mock('../../services/StreakManager', () => ({
  getStreakData: jest.fn(async () => ({ currentStreak: 0, longestStreak: 0, lastPlayedDate: null })),
}));

jest.mock('../../services/StorageManager', () => ({
  __esModule: true,
  default: {
    getGallery: jest.fn(async () => []),
    getProgress: jest.fn(async () => ({ levels: {}, totalLevelsCompleted: 0, averageRating: 0 })),
  },
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

const getAllTexts = (getAllByType: (type: any) => any[]) => {
  const { Text } = require('react-native');
  return getAllByType(Text).map((n: any) => n.props.children).flat();
};

describe('GameScreen', () => {
  it('renders the level header without the app name', async () => {
    const { UNSAFE_getAllByType } = render(<GameScreen />);
    await act(async () => {});
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).not.toContain('Merke & Male');
    expect(texts).not.toContain('Merke und Male');
    // Header zeigt jetzt Level-Info statt App-Name
    expect(texts.some((t: any) => typeof t === 'string' && t.startsWith('Level '))).toBe(true);
  });
});
