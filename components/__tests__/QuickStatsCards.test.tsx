import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text } from 'react-native';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useFocusEffect: (cb: () => (() => void) | void) => {
    const { useEffect } = require('react');
    useEffect(() => {
      const cleanup = cb();
      return typeof cleanup === 'function' ? cleanup : undefined;
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
  },
}));

jest.mock('../../services/StorageManager', () => ({
  __esModule: true,
  default: {
    getProgress: () =>
      Promise.resolve({
        levels: {
          1: { levelNumber: 1, rating: 4, completedAt: '', bestRating: 4 },
          2: { levelNumber: 2, rating: 3, completedAt: '', bestRating: 3 },
        },
        lastPlayedLevel: 2,
        totalLevelsCompleted: 2,
        averageRating: 3.5,
      }),
  },
}));

jest.mock('../../services/StreakManager', () => ({
  getStreakData: () =>
    Promise.resolve({ currentStreak: 5, longestStreak: 7, lastPlayedDate: '2026-05-23' }),
}));

jest.mock('../../services/LevelManager', () => ({
  getTotalLevels: () => 10,
}));

jest.mock('../../services/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    colors: {
      text: { primary: '#000', secondary: '#666' },
    },
  }),
}));

jest.mock('../../services/i18n', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string>) => {
      if (params) {
        return Object.entries(params).reduce(
          (s, [k, v]) => s.replace(`{{${k}}}`, v),
          key
        );
      }
      return key;
    },
  }),
}));

jest.mock('react-native-reanimated', () => {
  const { View, Text: RNText } = require('react-native');
  return {
    __esModule: true,
    default: {
      View,
      Text: RNText,
      createAnimatedComponent: (c: any) => c,
      call: () => {},
    },
    useSharedValue: (v: any) => ({ value: v }),
    useAnimatedStyle: (_fn: any) => ({}),
    withSpring: (v: any) => v,
    withTiming: (v: any) => v,
    withDelay: (_d: any, v: any) => v,
    withSequence: (...args: any[]) => args[args.length - 1],
    Easing: { out: () => () => {}, ease: {} },
    runOnJS: (fn: any) => fn,
  };
});

const getAllTexts = (getAllByType: (type: any) => any[]) =>
  getAllByType(Text).map((n: any) => n.props.children).flat();

import QuickStatsCards from '../QuickStatsCards';

describe('QuickStatsCards', () => {
  it('renders stat labels for stars, streak, and levels', async () => {
    const { UNSAFE_getAllByType } = render(<QuickStatsCards />);
    await act(async () => {});
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('home.stats.stars');
    expect(texts).toContain('home.stats.streak');
    expect(texts).toContain('home.stats.levels');
  });

  it('displays correct values after data load', async () => {
    const { UNSAFE_getAllByType } = render(<QuickStatsCards />);
    await act(async () => {});
    const texts = getAllTexts(UNSAFE_getAllByType);
    // Total stars: 4 + 3 = 7
    expect(texts).toContain('7');
    // Current streak = 5
    expect(texts).toContain('5');
    // Levels completed = 2
    expect(texts).toContain('2');
  });

  it('shows streak days label when streak > 0', async () => {
    const { UNSAFE_getAllByType } = render(<QuickStatsCards />);
    await act(async () => {});
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('home.stats.streakDays');
  });

  it('shows level-of sub label for the levels card', async () => {
    const { UNSAFE_getAllByType } = render(<QuickStatsCards />);
    await act(async () => {});
    const texts = getAllTexts(UNSAFE_getAllByType);
    // t('home.stats.levelOf', { total: '10' }) → key unchanged since key has no {{total}} placeholder
    expect(texts).toContain('home.stats.levelOf');
  });
});
