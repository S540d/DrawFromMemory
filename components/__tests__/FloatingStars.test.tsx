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
    withDelay: (_d: any, v: any) => v,
    withRepeat: (v: any) => v,
    withSequence: (...args: any[]) => args[args.length - 1],
    Easing: {
      ease: (t: number) => t,
      inOut: (fn: any) => fn,
      out: (fn: any) => fn,
    },
  };
});

import { FloatingStars } from '../FloatingStars';

describe('FloatingStars', () => {
  it('renders without crashing', async () => {
    expect(() => render(<FloatingStars />)).not.toThrow();
    await act(async () => {});
  });

  it('renders the container with testID', async () => {
    const { getByTestId } = render(<FloatingStars />);
    await act(async () => {});
    expect(getByTestId('floating-stars')).toBeTruthy();
  });

  it('renders all decor items', async () => {
    const { getAllByTestId } = render(<FloatingStars />);
    await act(async () => {});
    const items = getAllByTestId('floating-decor-item');
    expect(items.length).toBe(8);
  });

  it('is not interactive (pointerEvents none)', async () => {
    const { getByTestId } = render(<FloatingStars />);
    await act(async () => {});
    const container = getByTestId('floating-stars');
    expect(container.props.pointerEvents).toBe('none');
  });
});
