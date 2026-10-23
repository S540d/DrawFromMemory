/**
 * useGameFeedback Hook Tests
 */
import { renderHook, waitFor } from '@testing-library/react-native';

jest.mock('../StorageManager', () => ({
  __esModule: true,
  default: {
    getSetting: jest.fn().mockResolvedValue(true),
    getGallery: jest.fn().mockResolvedValue([]),
    getProgress: jest.fn().mockResolvedValue({ levels: {}, totalLevelsCompleted: 0 }),
  },
}));

jest.mock('../SoundManager', () => ({
  __esModule: true,
  default: { playCelebration: jest.fn() },
}));

jest.mock('../StreakManager', () => ({
  getStreakData: jest.fn().mockResolvedValue({ currentStreak: 0 }),
}));

const mockCheckAndUnlock = jest.fn().mockResolvedValue([]);
jest.mock('../AchievementManager', () => ({
  checkAndUnlock: (...args: unknown[]) => mockCheckAndUnlock(...args),
}));

import SoundManager from '../SoundManager';
import { useGameFeedback } from '../useGameFeedback';

describe('useGameFeedback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('feiert und prüft Abzeichen auch bei gleicher Sternzahl in der nächsten Runde', async () => {
    const { rerender } = renderHook(({ rating }: { rating: number }) => useGameFeedback(rating), {
      initialProps: { rating: 0 },
    });

    rerender({ rating: 5 });
    await waitFor(() => expect(mockCheckAndUnlock).toHaveBeenCalledTimes(1));
    expect(SoundManager.playCelebration).toHaveBeenCalledTimes(1);

    // Nächste Runde: Rating wird zurückgesetzt, dann wieder 5 Sterne
    rerender({ rating: 0 });
    rerender({ rating: 5 });
    await waitFor(() => expect(mockCheckAndUnlock).toHaveBeenCalledTimes(2));
    expect(SoundManager.playCelebration).toHaveBeenCalledTimes(2);
  });

  it('prüft dieselbe Bewertung innerhalb einer Runde nur einmal', async () => {
    const { rerender } = renderHook(({ rating }: { rating: number }) => useGameFeedback(rating), {
      initialProps: { rating: 3 },
    });
    await waitFor(() => expect(mockCheckAndUnlock).toHaveBeenCalledTimes(1));

    rerender({ rating: 3 });
    await waitFor(() => expect(mockCheckAndUnlock).toHaveBeenCalledTimes(1));
  });
});
