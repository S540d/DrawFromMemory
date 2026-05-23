import React from 'react';
import { render, act } from '@testing-library/react-native';

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
    withRepeat: (v: any) => v,
    withSequence: (...args: any[]) => args[args.length - 1],
    Easing: {
      ease: (t: number) => t,
      inOut: (fn: any) => fn,
      out: (fn: any) => fn,
    },
  };
});

import { AnimatedHero } from '../AnimatedHero';
import { Text } from 'react-native';

const getAllTexts = (getAllByType: (t: any) => any[]) =>
  getAllByType(Text).map((n: any) => n.props.children).flat().map(String);

describe('AnimatedHero', () => {
  it('renders without crashing', async () => {
    expect(() => render(<AnimatedHero />)).not.toThrow();
    await act(async () => {});
  });

  it('renders with testID', async () => {
    const { getByTestId } = render(<AnimatedHero />);
    await act(async () => {});
    expect(getByTestId('animated-hero')).toBeTruthy();
  });

  it('renders brain and pencil emojis', async () => {
    const { UNSAFE_getAllByType } = render(<AnimatedHero />);
    await act(async () => {});
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('🧠');
    expect(texts).toContain('✏️');
  });
});
