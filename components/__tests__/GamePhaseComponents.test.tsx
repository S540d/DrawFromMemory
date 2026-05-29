import React from 'react';
import { render } from '@testing-library/react-native';

// ─── Shared mocks ────────────────────────────────────────────────────────────

jest.mock('../../services/i18n', () => ({
  t: (key: string) => key,
  getLanguage: () => 'en',
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../services/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      background: '#f7f2eb',
      surface: '#ffffff',
      surfaceAlt: '#ede7dd',
      border: '#e8e0d5',
      text: { primary: '#2c2c2c', secondary: '#9c8b7a', light: '#717171' },
      primary: '#7C5CFF',
    },
    theme: 'light',
  }),
}));

jest.mock('../../services/LevelManager', () => ({
  getTotalLevels: () => 10,
}));

jest.mock('../../components/LevelImageDisplay', () => {
  const { View } = require('react-native');
  return function LevelImageDisplay() { return <View testID="level-image-display" />; };
});

jest.mock('../../components/DrawingCanvas', () => {
  const { View } = require('react-native');
  const DrawingCanvas = (props: any) => <View testID="drawing-canvas" />;
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
    AnimatedStar: ({ onPress, accessibilityLabel, index }: any) => {
      const { TouchableOpacity, Text } = require('react-native');
      return (
        <TouchableOpacity onPress={onPress} accessibilityLabel={accessibilityLabel} index={index}>
          <Text>★</Text>
        </TouchableOpacity>
      );
    },
  };
});

// ─── MemorizePhase ────────────────────────────────────────────────────────────

import MemorizePhase from '../../components/game/MemorizePhase';

const mockImage = {
  id: 'sun',
  displayName: 'Sonne',
  displayNameEn: 'Sun',
  strokeCount: 5,
  difficulty: 1,
  component: null,
  width: 200,
  height: 200,
} as any;

const getAllTexts = (UNSAFE_getAllByType: any): any[] => {
  const { Text } = require('react-native');
  return UNSAFE_getAllByType(Text).map((n: any) => n.props.children).flat();
};

describe('MemorizePhase', () => {
  const baseProps = {
    timeRemaining: 5,
    currentImage: null,
    levelNumber: 1,
    currentLang: 'en',
    memorizeImageSize: 200,
    imagePlaceholderMinSize: 160,
    revealStep: 0,
  };

  it('renders timer with i18n translation key', () => {
    const { UNSAFE_getAllByType } = render(<MemorizePhase {...baseProps} timeRemaining={3} />);
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('game.memorize.timeLeft');
  });

  it('renders title translation key', () => {
    const { UNSAFE_getAllByType } = render(<MemorizePhase {...baseProps} />);
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('game.memorize.title');
  });

  it('renders image info when image is provided', () => {
    const { UNSAFE_getAllByType } = render(<MemorizePhase {...baseProps} currentImage={mockImage} />);
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('Sun');
  });

  it('shows displayName when lang is de', () => {
    const { UNSAFE_getAllByType } = render(
      <MemorizePhase {...baseProps} currentImage={mockImage} currentLang="de" />
    );
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('Sonne');
  });
});

// ─── DrawPhase ───────────────────────────────────────────────────────────────

import DrawPhase from '../../components/game/DrawPhase';

const drawProps = {
  currentImage: mockImage,
  currentLang: 'en',
  hasUsedHint: false,
  onUseHint: jest.fn(),
  onShowHintModal: jest.fn(),
  drawing: {
    color: '#000',
    strokeWidth: 2,
    tool: 'brush' as const,
    paths: [],
    setPaths: jest.fn(),
    setColor: jest.fn(),
    setTool: jest.fn(),
    setStrokeWidth: jest.fn(),
    undo: jest.fn(),
  },
  layout: {
    canvasMaxHeight: 400,
    canvasMinHeight: 200,
    canvasMarginVertical: 8,
    toolbarMarginVertical: 8,
    toolbarButtonMinHeight: 44,
    toolbarButtonPaddingVertical: 8,
    buttonMinHeight: 44,
    buttonPaddingVertical: 8,
    isSmall: false,
  },
  onDone: jest.fn(),
};

describe('DrawPhase', () => {
  it('renders done button with translation key', () => {
    const { UNSAFE_getAllByType } = render(<DrawPhase {...drawProps} />);
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('game.draw.done');
  });

  it('renders toolbar reference label', () => {
    const { UNSAFE_getAllByType } = render(<DrawPhase {...drawProps} />);
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('game.draw.referenceLabel');
  });

  it('renders hint button as disabled when hint used', () => {
    const { UNSAFE_getAllByType } = render(<DrawPhase {...drawProps} hasUsedHint={true} />);
    const { TouchableOpacity } = require('react-native');
    const buttons = UNSAFE_getAllByType(TouchableOpacity);
    const hintBtn = buttons.find((b: any) => b.props.accessibilityLabel === 'game.draw.hintUsed');
    expect(hintBtn).toBeTruthy();
    expect(hintBtn.props.disabled).toBe(true);
  });

  it('renders undo and clear buttons', () => {
    const { UNSAFE_getAllByType } = render(<DrawPhase {...drawProps} />);
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('game.draw.undo');
    expect(texts).toContain('game.draw.clear');
  });
});

// ─── ResultPhase ─────────────────────────────────────────────────────────────

import ResultPhase from '../../components/game/ResultPhase';

const resultProps = {
  currentImage: mockImage,
  currentLang: 'en',
  levelNumber: 1,
  userRating: 0,
  savedToGallery: false,
  isReplaying: false,
  replayPaths: [],
  drawingPaths: [],
  screenWidth: 375,
  isSmall: false,
  onRatingSubmit: jest.fn(),
  onSaveToGallery: jest.fn(),
  onStartReplay: jest.fn(),
  onStopReplay: jest.fn(),
  onNextLevel: jest.fn(),
  onRestartFromLevel1: jest.fn(),
};

describe('ResultPhase', () => {
  it('renders comparison cards (template + drawing)', () => {
    const { UNSAFE_getAllByType } = render(<ResultPhase {...resultProps} />);
    const texts = getAllTexts(UNSAFE_getAllByType);
    // t() returns key as-is; .toUpperCase() is applied in JSX, so we match uppercased form
    expect(texts.some((t: any) => typeof t === 'string' && t.includes('GAME.RESULT.TEMPLATE'))).toBeTruthy();
    expect(texts.some((t: any) => typeof t === 'string' && t.includes('GAME.RESULT.YOURDRAWING'))).toBeTruthy();
  });

  it('renders 5 star buttons', () => {
    const { UNSAFE_getAllByType } = render(<ResultPhase {...resultProps} />);
    const { TouchableOpacity } = require('react-native');
    const starButtons = UNSAFE_getAllByType(TouchableOpacity).filter(
      (b: any) => b.props.index !== undefined
    );
    expect(starButtons).toHaveLength(5);
  });

  it('shows next level button when not last level', () => {
    const { UNSAFE_getAllByType } = render(<ResultPhase {...resultProps} levelNumber={1} />);
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('game.result.nextLevel');
  });

  it('shows play again button on last level', () => {
    const { UNSAFE_getAllByType } = render(<ResultPhase {...resultProps} levelNumber={10} />);
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('game.result.playAgain');
  });

  it('shows feedback text when rating > 0', () => {
    const { UNSAFE_getAllByType } = render(<ResultPhase {...resultProps} userRating={5} />);
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('game.result.feedback5');
  });

  it('shows saved label when savedToGallery is true', () => {
    const { UNSAFE_getAllByType } = render(<ResultPhase {...resultProps} savedToGallery={true} />);
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('gallery.saved');
  });
});
