import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import { TouchableOpacity } from 'react-native';

// Der echte react-native Modal lässt sich unter react-test-renderer/jsdom nicht
// sichtbar mounten (parentInstance.children.indexOf) — gleiches Muster wie in
// OnboardingModal.test.tsx. Nur Modal wird zu einem Passthrough.
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  const ReactLocal = require('react');
  return new Proxy(RN, {
    get(target, prop) {
      if (prop === 'Modal') {
        return ({ children, visible = true }: any) =>
          visible ? ReactLocal.createElement(target.View, null, children) : null;
      }
      return target[prop as keyof typeof target];
    },
  });
});

// testID maps to data-testid on the react-native-web host element, not the
// React Test Instance's testID prop — getByTestId can't find it (see
// CLAUDE.md testing notes). Filter TouchableOpacity instances by their
// testID prop instead.
const pressByTestId = (UNSAFE_getAllByType: (type: any) => any[], testID: string) => {
  const match = UNSAFE_getAllByType(TouchableOpacity).find((n: any) => n.props.testID === testID);
  if (!match) throw new Error(`No TouchableOpacity with testID "${testID}" found`);
  fireEvent.press(match);
};

// getByText also can't reliably match text under the mocked Modal/react-native-web
// stack here — find the Text instance by its exact children, then walk up to the
// nearest pressable ancestor (mirrors the testID workaround above).
const pressByLabel = (UNSAFE_getAllByType: (type: any) => any[], label: string) => {
  const { Text } = require('react-native');
  const textNode = UNSAFE_getAllByType(Text).find((n: any) => n.props.children === label);
  if (!textNode) throw new Error(`No Text with children "${label}" found`);
  let node = textNode.parent;
  while (node && typeof node.props?.onPress !== 'function') {
    node = node.parent;
  }
  if (!node) throw new Error(`No pressable ancestor found for text "${label}"`);
  fireEvent.press(node);
};

const mockRouterReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn(), replace: mockRouterReplace }),
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
  return function LevelImageDisplay() {
    return <View />;
  };
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
  return function SettingsModal() {
    return <View />;
  };
});

jest.mock('../../components/game/ResultPhase', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return function ResultPhase(props: any) {
    return (
      <TouchableOpacity testID="mock-next-level" onPress={props.onNextLevel}>
        <Text>next-level</Text>
      </TouchableOpacity>
    );
  };
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
    AnimatedFeedback: ({ children, visible }: any) => (visible ? <View>{children}</View> : null),
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

jest.mock('../../components/game/TimerArc', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => <View testID="timer-arc" />,
    TimerArc: () => <View testID="timer-arc" />,
  };
});

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: { View, createAnimatedComponent: (c: any) => c },
    useSharedValue: (v: any) => ({ value: v }),
    useAnimatedStyle: (_fn: any) => ({}),
    withTiming: (_v: any, _config?: any, cb?: (finished: boolean) => void) => {
      if (cb) cb(true);
      return _v;
    },
    runOnJS: (fn: any) => fn,
    Easing: { out: (fn: any) => fn, cubic: (t: number) => t, linear: (t: number) => t },
  };
});

jest.mock('../../utils/useReduceMotion', () => ({
  useReduceMotion: () => false,
}));

jest.mock('../../components/BadgeUnlockToast', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: () => <View testID="badge-unlock-toast" /> };
});

jest.mock('../../services/AchievementManager', () => ({
  checkAndUnlock: jest.fn(async () => []),
  ACHIEVEMENTS: [],
}));

jest.mock('../../services/StreakManager', () => ({
  getStreakData: jest.fn(async () => ({
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedDate: null,
  })),
}));

jest.mock('../../services/StorageManager', () => ({
  __esModule: true,
  default: {
    getGallery: jest.fn(async () => []),
    getProgress: jest.fn(async () => ({ levels: {}, totalLevelsCompleted: 0, averageRating: 0 })),
    getSetting: jest.fn(async () => true),
  },
}));

const mockStartNextLevel = jest.fn();
function createGamePhaseMock(
  overrides: { phase?: 'memorize' | 'draw' | 'result'; levelNumber?: number } = {},
) {
  return {
    phase: 'memorize' as 'memorize' | 'draw' | 'result',
    setPhase: jest.fn(),
    levelNumber: 1,
    currentImage: null,
    timeRemaining: 5,
    displayDuration: 5,
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
    startNextLevel: mockStartNextLevel,
    restartFromLevel1: jest.fn(),
    ...overrides,
  };
}
const mockUseGamePhase = jest.fn(() => createGamePhaseMock());
jest.mock('../../services/useGamePhase', () => ({
  useGamePhase: () => mockUseGamePhase(),
}));

import GameScreen from '../../app/game';

const getAllTexts = (getAllByType: (type: any) => any[]) => {
  const { Text } = require('react-native');
  return getAllByType(Text)
    .map((n: any) => n.props.children)
    .flat();
};

describe('GameScreen', () => {
  beforeEach(() => {
    mockStartNextLevel.mockClear();
    mockRouterReplace.mockClear();
    mockUseGamePhase.mockClear();
  });

  it('renders the level header without the app name', async () => {
    const { UNSAFE_getAllByType } = render(<GameScreen />);
    await act(async () => {});
    const texts = getAllTexts(UNSAFE_getAllByType);
    // useTranslation is mocked to return the key — ensure the app.name key is absent
    expect(texts).not.toContain('app.name');
    // Header shows level info
    expect(texts.some((t: any) => typeof t === 'string' && t.startsWith('Level '))).toBe(true);
  });

  // getTotalLevels() is mocked to 10 above.
  describe('pause prompt every 5 levels (Issue #337)', () => {
    it('shows the pause modal instead of advancing after level 5', async () => {
      mockUseGamePhase.mockReturnValue(createGamePhaseMock({ phase: 'result', levelNumber: 5 }));

      const { UNSAFE_getAllByType } = render(<GameScreen />);
      await act(async () => {});

      pressByTestId(UNSAFE_getAllByType, 'mock-next-level');
      await act(async () => {});

      expect(mockStartNextLevel).not.toHaveBeenCalled();
      expect(getAllTexts(UNSAFE_getAllByType)).toContain('game.pause.title');
    });

    it('navigates to the main menu when "Hauptmenü" is chosen', async () => {
      mockUseGamePhase.mockReturnValue(createGamePhaseMock({ phase: 'result', levelNumber: 5 }));

      const { UNSAFE_getAllByType } = render(<GameScreen />);
      await act(async () => {});
      pressByTestId(UNSAFE_getAllByType, 'mock-next-level');
      await act(async () => {});

      pressByLabel(UNSAFE_getAllByType, 'game.pause.mainMenu');
      await act(async () => {});

      expect(mockRouterReplace).toHaveBeenCalledWith('/');
      expect(mockStartNextLevel).not.toHaveBeenCalled();
    });

    it('advances to the next level when "Weiter" is chosen', async () => {
      mockUseGamePhase.mockReturnValue(createGamePhaseMock({ phase: 'result', levelNumber: 5 }));

      const { UNSAFE_getAllByType } = render(<GameScreen />);
      await act(async () => {});
      pressByTestId(UNSAFE_getAllByType, 'mock-next-level');
      await act(async () => {});

      pressByLabel(UNSAFE_getAllByType, 'game.pause.continue');
      await act(async () => {});

      expect(mockStartNextLevel).toHaveBeenCalledTimes(1);
      expect(mockRouterReplace).not.toHaveBeenCalled();
    });

    it('does not show the pause modal on the last level (no pause after the final level)', async () => {
      mockUseGamePhase.mockReturnValue(createGamePhaseMock({ phase: 'result', levelNumber: 10 }));

      const { UNSAFE_getAllByType } = render(<GameScreen />);
      await act(async () => {});
      pressByTestId(UNSAFE_getAllByType, 'mock-next-level');
      await act(async () => {});

      expect(mockStartNextLevel).toHaveBeenCalledTimes(1);
      expect(getAllTexts(UNSAFE_getAllByType)).not.toContain('game.pause.title');
    });
  });
});
