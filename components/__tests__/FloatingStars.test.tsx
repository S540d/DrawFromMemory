import React from 'react';
import { render, act } from '@testing-library/react-native';

jest.mock('../../utils/useReduceMotion', () => ({
  useReduceMotion: jest.fn(() => false),
}));

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (c: any) => c,
    },
    useSharedValue: (v: any) => ({ value: v }),
    useAnimatedStyle: (_fn: any) => ({}),
    withTiming: (v: any) => v,
    withDelay: (_d: any, v: any) => v,
    withRepeat: jest.fn((v: any) => v),
    withSequence: (...args: any[]) => args[args.length - 1],
    Easing: {
      ease: (t: number) => t,
      inOut: (fn: any) => fn,
      out: (fn: any) => fn,
    },
  };
});

const Reanimated = require('react-native-reanimated');
const withRepeatMock = Reanimated.withRepeat as jest.Mock;

import { FloatingStars } from '../FloatingStars';
import { Text } from 'react-native';

describe('FloatingStars', () => {
  beforeEach(() => {
    withRepeatMock.mockClear();
  });

  it('renders without crashing', async () => {
    expect(() => render(<FloatingStars />)).not.toThrow();
    await act(async () => {});
  });

  it('renders all 8 decor glyphs', async () => {
    const { UNSAFE_getAllByType } = render(<FloatingStars />);
    await act(async () => {});
    const texts = UNSAFE_getAllByType(Text);
    expect(texts.length).toBe(8);
  });

  it('starts repeating animations on mount when reduced motion is off', async () => {
    const { AccessibilityInfo } = require('react-native');
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValueOnce(false);

    render(<FloatingStars />);
    await act(async () => {});

    expect(withRepeatMock).toHaveBeenCalled();
  });

  it('does not start animations when prefers-reduced-motion is enabled', async () => {
    const { useReduceMotion } = require('../../utils/useReduceMotion');
    (useReduceMotion as jest.Mock).mockReturnValueOnce(true);

    render(<FloatingStars />);
    await act(async () => {});

    expect(withRepeatMock).not.toHaveBeenCalled();
  });

  it('renders glyphs as non-accessible', async () => {
    const { UNSAFE_getAllByType } = render(<FloatingStars />);
    await act(async () => {});
    const texts = UNSAFE_getAllByType(Text);
    texts.forEach((t: any) => {
      expect(t.props.accessible).toBe(false);
    });
  });
});
