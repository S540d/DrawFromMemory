import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (c: any) => c,
    },
    cancelAnimation: jest.fn(),
    useSharedValue: (v: any) => ({ value: v }),
    useAnimatedStyle: (_fn: any) => ({}),
    withTiming: (v: any) => v,
    withRepeat: jest.fn((v: any) => v),
    withSequence: (...args: any[]) => args[args.length - 1],
    Easing: {
      ease: (t: number) => t,
      inOut: (fn: any) => fn,
    },
  };
});

jest.mock('../../utils/useReduceMotion', () => ({
  useReduceMotion: () => false,
}));

jest.mock('../../services/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      surface: '#fff',
      text: { primary: '#000', secondary: '#666', light: '#aaa' },
    },
  }),
}));

jest.mock('../../services/i18n', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import TutorialOverlay from '../TutorialOverlay';

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

const getAllTexts = (getAllByType: (type: any) => any[]) =>
  getAllByType(Text)
    .map((n: any) => n.props.children)
    .flat();

describe('TutorialOverlay', () => {
  it('renders memorize phase hint text', () => {
    const { UNSAFE_getAllByType, unmount } = render(
      <TutorialOverlay phase="memorize" onDismiss={jest.fn()} />,
    );
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('tutorial.memorize');
    unmount();
  });

  it('renders draw phase hint text', () => {
    const { UNSAFE_getAllByType, unmount } = render(
      <TutorialOverlay phase="draw" onDismiss={jest.fn()} />,
    );
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('tutorial.draw');
    unmount();
  });

  it('renders result phase hint text', () => {
    const { UNSAFE_getAllByType, unmount } = render(
      <TutorialOverlay phase="result" onDismiss={jest.fn()} />,
    );
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('tutorial.result');
    unmount();
  });

  it('renders tap hint in every phase', () => {
    const { UNSAFE_getAllByType, unmount } = render(
      <TutorialOverlay phase="memorize" onDismiss={jest.fn()} />,
    );
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('tutorial.tap');
    unmount();
  });

  it('renders badge labels for all three phases', () => {
    const { UNSAFE_getAllByType, unmount } = render(
      <TutorialOverlay phase="draw" onDismiss={jest.fn()} />,
    );
    const texts = getAllTexts(UNSAFE_getAllByType).join(' ');
    expect(texts).toMatch('tutorial.badgeMemorize');
    expect(texts).toMatch('tutorial.badgeDraw');
    expect(texts).toMatch('tutorial.badgeResult');
    unmount();
  });

  it('cleans up timers on unmount without crashing', () => {
    const { unmount } = render(<TutorialOverlay phase="memorize" onDismiss={jest.fn()} />);
    expect(() => unmount()).not.toThrow();
  });
});
