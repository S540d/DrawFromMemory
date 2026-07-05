/**
 * StreakManager Tests
 * Prüft Streak-Logik: Tag-Übergang, DST-Wechsel, Streak-Bruch nach Pause
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getLocalDateKey,
  getStreakData,
  updateStreakAfterGame,
  resetStreakData,
} from '../StreakManager';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('StreakManager', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await resetStreakData();
  });

  describe('getLocalDateKey', () => {
    it('formats date as YYYY-MM-DD in local time', () => {
      const date = new Date(2026, 4, 23); // May 23, 2026
      expect(getLocalDateKey(date)).toBe('2026-05-23');
    });

    it('pads month and day with leading zeros', () => {
      const date = new Date(2026, 0, 5); // January 5, 2026
      expect(getLocalDateKey(date)).toBe('2026-01-05');
    });
  });

  describe('initial state', () => {
    it('starts with zero streak and no lastPlayedDate', async () => {
      const data = await getStreakData();
      expect(data.currentStreak).toBe(0);
      expect(data.longestStreak).toBe(0);
      expect(data.lastPlayedDate).toBeNull();
    });
  });

  describe('updateStreakAfterGame', () => {
    it('sets streak to 1 on first game', async () => {
      await updateStreakAfterGame(new Date(2026, 4, 1));
      const data = await getStreakData();
      expect(data.currentStreak).toBe(1);
      expect(data.longestStreak).toBe(1);
      expect(data.lastPlayedDate).toBe('2026-05-01');
    });

    it('does not increment streak when playing twice the same day', async () => {
      await updateStreakAfterGame(new Date(2026, 4, 1));
      await updateStreakAfterGame(new Date(2026, 4, 1));
      const data = await getStreakData();
      expect(data.currentStreak).toBe(1);
    });

    it('increments streak on consecutive day', async () => {
      await updateStreakAfterGame(new Date(2026, 4, 1));
      await updateStreakAfterGame(new Date(2026, 4, 2));
      const data = await getStreakData();
      expect(data.currentStreak).toBe(2);
      expect(data.longestStreak).toBe(2);
    });

    it('builds streak across multiple consecutive days', async () => {
      for (let day = 10; day <= 14; day++) {
        await updateStreakAfterGame(new Date(2026, 4, day));
      }
      const data = await getStreakData();
      expect(data.currentStreak).toBe(5);
      expect(data.longestStreak).toBe(5);
    });

    it('resets streak to 1 after a 1-day gap', async () => {
      await updateStreakAfterGame(new Date(2026, 4, 1));
      await updateStreakAfterGame(new Date(2026, 4, 3)); // skip day 2
      const data = await getStreakData();
      expect(data.currentStreak).toBe(1);
    });

    it('resets streak to 1 after 2 days pause', async () => {
      await updateStreakAfterGame(new Date(2026, 4, 1));
      await updateStreakAfterGame(new Date(2026, 4, 2));
      await updateStreakAfterGame(new Date(2026, 4, 3));
      // 2-day pause
      await updateStreakAfterGame(new Date(2026, 4, 6));
      const data = await getStreakData();
      expect(data.currentStreak).toBe(1);
    });

    it('preserves longestStreak after reset', async () => {
      // Build streak of 3
      await updateStreakAfterGame(new Date(2026, 4, 1));
      await updateStreakAfterGame(new Date(2026, 4, 2));
      await updateStreakAfterGame(new Date(2026, 4, 3));
      // Break streak
      await updateStreakAfterGame(new Date(2026, 4, 5));
      const data = await getStreakData();
      expect(data.currentStreak).toBe(1);
      expect(data.longestStreak).toBe(3);
    });

    it('handles month boundary correctly', async () => {
      await updateStreakAfterGame(new Date(2026, 3, 30)); // Apr 30
      await updateStreakAfterGame(new Date(2026, 4, 1)); // May 1
      const data = await getStreakData();
      expect(data.currentStreak).toBe(2);
    });

    it('handles year boundary correctly', async () => {
      await updateStreakAfterGame(new Date(2025, 11, 31)); // Dec 31
      await updateStreakAfterGame(new Date(2026, 0, 1)); // Jan 1
      const data = await getStreakData();
      expect(data.currentStreak).toBe(2);
    });

    it('DST spring-forward: treats local days correctly (Apr 1 → Apr 2)', async () => {
      // Simulate playing on consecutive local days near DST change
      // Local date strings are used, so DST does not affect the result
      const day1 = new Date(2026, 2, 29); // March 29 (near DST in Europe)
      const day2 = new Date(2026, 2, 30); // March 30
      await updateStreakAfterGame(day1);
      await updateStreakAfterGame(day2);
      const data = await getStreakData();
      expect(data.currentStreak).toBe(2);
    });
  });
});
