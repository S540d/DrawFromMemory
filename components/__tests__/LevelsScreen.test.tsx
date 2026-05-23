import React from 'react';
import { render, act } from '@testing-library/react-native';

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
}));

jest.mock('../../services/i18n', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: any) => (opts?.number !== null && opts?.number !== undefined ? `Level ${opts.number}` : key),
  }),
}));

jest.mock('../../services/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    colors: {
      background: '#fff',
      surface: '#f0f0f0',
      primary: '#6200ee',
      text: { primary: '#000', secondary: '#666', light: '#999' },
      stars: { filled: '#FFD700', empty: '#E0E0E0' },
    },
  }),
}));

jest.mock('../../services/LevelManager', () => ({
  getAllLevels: () => [
    { number: 1, difficulty: 1, displayDuration: 5 },
    { number: 2, difficulty: 2, displayDuration: 4 },
    { number: 3, difficulty: 2, displayDuration: 4 },
  ],
}));

jest.mock('../../services/StorageManager', () => ({
  __esModule: true,
  default: {
    getLevelRating: jest.fn(),
  },
}));

jest.mock('../../components/AnimatedPrimitives', () => {
  const { View } = require('react-native');
  return {
    AnimatedCard: ({ children }: any) => <View>{children}</View>,
    GlassCard: ({ children, style }: any) => <View style={style}>{children}</View>,
  };
});

jest.mock('../../components/Badge', () => {
  const { View } = require('react-native');
  return { Badge: () => <View /> };
});

import LevelsScreen from '../../app/levels';

const getStarNodes = (UNSAFE_getAllByProps: (props: any) => any[], testID: string) => {
  try {
    return UNSAFE_getAllByProps({ testID });
  } catch {
    return [];
  }
};

describe('LevelsScreen', () => {
  let storageManager: any;

  beforeEach(() => {
    storageManager = require('../../services/StorageManager').default;
    storageManager.getLevelRating.mockReset();
  });

  it('shows only empty stars for levels not yet played', async () => {
    storageManager.getLevelRating.mockResolvedValue(null);
    const { UNSAFE_getAllByProps } = render(<LevelsScreen />);
    await act(async () => {});
    const emptyStars = getStarNodes(UNSAFE_getAllByProps, 'star-empty');
    const filledStars = getStarNodes(UNSAFE_getAllByProps, 'star-filled');
    expect(emptyStars.length).toBe(9); // 3 levels × 3 stars
    expect(filledStars.length).toBe(0);
  });

  it('shows filled stars based on getLevelRating result', async () => {
    // rating 5 → Math.ceil(5/2) = 3 filled stars per level
    storageManager.getLevelRating.mockResolvedValue(5);
    const { UNSAFE_getAllByProps } = render(<LevelsScreen />);
    await act(async () => {});
    const filledStars = getStarNodes(UNSAFE_getAllByProps, 'star-filled');
    const emptyStars = getStarNodes(UNSAFE_getAllByProps, 'star-empty');
    expect(filledStars.length).toBe(9); // 3 levels × 3 stars
    expect(emptyStars.length).toBe(0);
  });

  it('calls getLevelRating for each level', async () => {
    storageManager.getLevelRating.mockResolvedValue(null);
    render(<LevelsScreen />);
    await act(async () => {});
    expect(storageManager.getLevelRating).toHaveBeenCalledWith(1);
    expect(storageManager.getLevelRating).toHaveBeenCalledWith(2);
    expect(storageManager.getLevelRating).toHaveBeenCalledWith(3);
  });

  it('renders a star container for each level', async () => {
    storageManager.getLevelRating.mockResolvedValue(null);
    const { UNSAFE_getAllByProps } = render(<LevelsScreen />);
    await act(async () => {});
    const containers = [1, 2, 3].map(n =>
      getStarNodes(UNSAFE_getAllByProps, `stars-level-${n}`)
    );
    expect(containers.every(c => c.length === 1)).toBe(true);
  });

  it('maps rating correctly: 3 → 2 filled stars per level', async () => {
    // rating 3 → Math.ceil(3/2) = 2 filled stars per level
    storageManager.getLevelRating.mockResolvedValue(3);
    const { UNSAFE_getAllByProps } = render(<LevelsScreen />);
    await act(async () => {});
    const filledStars = getStarNodes(UNSAFE_getAllByProps, 'star-filled');
    const emptyStars = getStarNodes(UNSAFE_getAllByProps, 'star-empty');
    expect(filledStars.length).toBe(6); // 3 levels × 2 stars
    expect(emptyStars.length).toBe(3);  // 3 levels × 1 star
  });
});
