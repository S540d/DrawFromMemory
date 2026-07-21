import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import { Text, Pressable } from 'react-native';

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
    withSpring: (v: any) => v,
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

import { PressableScale, PulseView } from '../AnimatedPrimitives';

const getAllTexts = (getAllByType: (t: any) => any[]) =>
  getAllByType(Text)
    .map((n: any) => n.props.children)
    .flat()
    .map(String);

describe('PressableScale', () => {
  it('renders its children', () => {
    const { UNSAFE_getAllByType } = render(
      <PressableScale onPress={() => {}}>
        <Text>Los geht&apos;s</Text>
      </PressableScale>,
    );
    expect(getAllTexts(UNSAFE_getAllByType)).toContain("Los geht's");
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { UNSAFE_getAllByType } = render(
      <PressableScale onPress={onPress}>
        <Text>Tap</Text>
      </PressableScale>,
    );
    fireEvent.press(UNSAFE_getAllByType(Pressable)[0]);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('PulseView', () => {
  beforeEach(() => {
    const { useReduceMotion } = require('../../utils/useReduceMotion');
    (useReduceMotion as jest.Mock).mockReturnValue(false);
    withRepeatMock.mockClear();
  });

  it('renders its children', () => {
    const { UNSAFE_getAllByType } = render(
      <PulseView>
        <Text>Pulsing</Text>
      </PulseView>,
    );
    expect(getAllTexts(UNSAFE_getAllByType)).toContain('Pulsing');
  });

  it('starts a repeating pulse when enabled and motion is allowed', async () => {
    render(
      <PulseView>
        <Text>Pulsing</Text>
      </PulseView>,
    );
    await act(async () => {});
    expect(withRepeatMock).toHaveBeenCalled();
  });

  it('does not pulse when disabled', async () => {
    render(
      <PulseView enabled={false}>
        <Text>Static</Text>
      </PulseView>,
    );
    await act(async () => {});
    expect(withRepeatMock).not.toHaveBeenCalled();
  });

  it('does not pulse when prefers-reduced-motion is enabled', async () => {
    const { useReduceMotion } = require('../../utils/useReduceMotion');
    (useReduceMotion as jest.Mock).mockReturnValue(true);

    render(
      <PulseView>
        <Text>Static</Text>
      </PulseView>,
    );
    await act(async () => {});
    expect(withRepeatMock).not.toHaveBeenCalled();
  });
});
