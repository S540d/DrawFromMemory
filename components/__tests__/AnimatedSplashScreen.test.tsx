import React from 'react';
import { render, act } from '@testing-library/react-native';
import AnimatedSplashScreen from '../AnimatedSplashScreen';

// Mock i18n
jest.mock('../../services/i18n', () => ({
  t: (key: string) => key,
}));

// Mock Dimensions
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn(() => ({ width: 390, height: 844 })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

describe('AnimatedSplashScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render without crashing', () => {
    const onFinish = jest.fn();
    expect(() => render(<AnimatedSplashScreen onFinish={onFinish} />)).not.toThrow();
  });

  it('should render title and subtitle text nodes', () => {
    const onFinish = jest.fn();
    const { UNSAFE_getAllByType } = render(<AnimatedSplashScreen onFinish={onFinish} />);
    const { Animated } = require('react-native');
    const textNodes = UNSAFE_getAllByType(Animated.Text);
    const texts = textNodes.map((n: any) => n.props.children);
    expect(texts).toContain('home.title');
    expect(texts).toContain('home.subtitle');
  });

  it('should call onFinish after all timers run', () => {
    const onFinish = jest.fn();
    render(<AnimatedSplashScreen onFinish={onFinish} />);

    act(() => {
      jest.runAllTimers();
    });

    expect(onFinish).toHaveBeenCalled();
  });

  it('should stop animation on unmount without crashing', () => {
    const onFinish = jest.fn();
    const { unmount } = render(<AnimatedSplashScreen onFinish={onFinish} />);

    expect(() => {
      unmount();
      act(() => {
        jest.runAllTimers();
      });
    }).not.toThrow();
  });

  it('should render at least 3 background decorative views', () => {
    const onFinish = jest.fn();
    const { UNSAFE_getAllByType } = render(<AnimatedSplashScreen onFinish={onFinish} />);
    const { View } = require('react-native');
    const views = UNSAFE_getAllByType(View);
    expect(views.length).toBeGreaterThanOrEqual(3);
  });

  it('should not crash when rerendered with a different onFinish', () => {
    const firstFinish = jest.fn();
    const secondFinish = jest.fn();

    const { rerender } = render(<AnimatedSplashScreen onFinish={firstFinish} />);

    expect(() => {
      rerender(<AnimatedSplashScreen onFinish={secondFinish} />);
      act(() => {
        jest.runAllTimers();
      });
    }).not.toThrow();
  });
});
