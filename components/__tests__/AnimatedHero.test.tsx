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
    cancelAnimation: jest.fn(),
    useSharedValue: (v: any) => ({ value: v }),
    useAnimatedStyle: (_fn: any) => ({}),
    withTiming: (v: any) => v,
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

import { AnimatedHero } from '../AnimatedHero';
import { Text } from 'react-native';

const getAllTexts = (getAllByType: (t: any) => any[]) =>
  getAllByType(Text)
    .map((n: any) => n.props.children)
    .flat()
    .map(String);

describe('AnimatedHero', () => {
  beforeEach(() => {
    withRepeatMock.mockClear();
  });

  it('renders without crashing', async () => {
    expect(() => render(<AnimatedHero />)).not.toThrow();
    await act(async () => {});
  });

  it('renders brain and pencil emojis', async () => {
    const { UNSAFE_getAllByType } = render(<AnimatedHero />);
    await act(async () => {});
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('🧠');
    expect(texts).toContain('✏️');
  });

  it('starts repeating animations when reduced motion is off', async () => {
    render(<AnimatedHero />);
    await act(async () => {});

    expect(withRepeatMock).toHaveBeenCalled();
  });

  it('does not start animations when prefers-reduced-motion is enabled', async () => {
    const { useReduceMotion } = require('../../utils/useReduceMotion');
    (useReduceMotion as jest.Mock).mockReturnValueOnce(true);

    render(<AnimatedHero />);
    await act(async () => {});

    expect(withRepeatMock).not.toHaveBeenCalled();
  });
});
