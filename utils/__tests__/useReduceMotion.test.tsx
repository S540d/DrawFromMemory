import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text, AccessibilityInfo } from 'react-native';
import { useReduceMotion } from '../useReduceMotion';

function Probe() {
  const rm = useReduceMotion();
  return <Text>{rm ? 'reduce' : 'animate'}</Text>;
}

describe('useReduceMotion', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('starts as false (safe default)', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({ remove: jest.fn() } as any);
    const { UNSAFE_getAllByType } = render(<Probe />);
    await act(async () => {});
    const text = UNSAFE_getAllByType(Text)[0].props.children;
    expect(text).toBe('animate');
  });

  it('returns true once isReduceMotionEnabled resolves true', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({ remove: jest.fn() } as any);
    const { UNSAFE_getAllByType } = render(<Probe />);
    await act(async () => {});
    const text = UNSAFE_getAllByType(Text)[0].props.children;
    expect(text).toBe('reduce');
  });

  it('subscribes to reduceMotionChanged event', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    const addListener = jest.spyOn(AccessibilityInfo, 'addEventListener')
      .mockReturnValue({ remove: jest.fn() } as any);
    render(<Probe />);
    await act(async () => {});
    expect(addListener).toHaveBeenCalledWith('reduceMotionChanged', expect.any(Function));
  });

  it('cleans up subscription on unmount', async () => {
    const remove = jest.fn();
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({ remove } as any);
    const { unmount } = render(<Probe />);
    await act(async () => {});
    unmount();
    expect(remove).toHaveBeenCalled();
  });
});
