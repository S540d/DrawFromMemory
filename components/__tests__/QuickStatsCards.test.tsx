import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text } from 'react-native';

jest.mock('expo-router', () => ({
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
        return Object.entries(params).reduce((s, [k, v]) => s.replace(`{{${k}}}`, v), key);
      }
      return key;
    },
  }),
}));

const getAllTexts = (getAllByType: (type: any) => any[]) =>
  getAllByType(Text)
    .map((n: any) => n.props.children)
    .flat();

import QuickStatsCards from '../QuickStatsCards';

describe('QuickStatsCards', () => {
  it('renders a single compact text line with stars and level progress', async () => {
    const { UNSAFE_getAllByType } = render(<QuickStatsCards />);
    await act(async () => {});
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toHaveLength(1);
    // Total stars: 4 + 3 = 7; levels completed = 2 of 10
    expect(texts[0]).toBe('7 home.stats.stars · 2 home.stats.levelOf home.stats.levels');
  });

  it('no longer shows the streak (lives in the mascot greeting only)', async () => {
    const { UNSAFE_getAllByType } = render(<QuickStatsCards />);
    await act(async () => {});
    const texts = getAllTexts(UNSAFE_getAllByType).join(' ');
    expect(texts).not.toContain('streak');
  });
});
