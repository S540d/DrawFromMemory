/**
 * DailyChallengeManager Tests
 * Prüft Determinismus, Countdown und Completion-Tracking
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getDailyChallengeKey,
  getDailyChallengeLevel,
  getSecondsUntilMidnight,
  isTodayCompleted,
  markTodayCompleted,
} from '../DailyChallengeManager';
import { getTotalLevels } from '../LevelManager';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('DailyChallengeManager', () => {
  describe('getDailyChallengeKey', () => {
    it('formats date as YYYY-MM-DD', () => {
      const date = new Date(2026, 4, 21); // May 21, 2026
      expect(getDailyChallengeKey(date)).toBe('2026-05-21');
    });

    it('pads month and day with leading zeros', () => {
      const date = new Date(2026, 0, 5); // January 5, 2026
      expect(getDailyChallengeKey(date)).toBe('2026-01-05');
    });
  });

  describe('getDailyChallengeLevel', () => {
    it('returns a level within valid range (1 to totalLevels)', () => {
      const total = getTotalLevels();
      const dates = [
        new Date(2026, 0, 1),
        new Date(2026, 5, 15),
        new Date(2026, 11, 31),
        new Date(2025, 6, 4),
      ];
      for (const d of dates) {
        const level = getDailyChallengeLevel(d);
        expect(level).toBeGreaterThanOrEqual(1);
        expect(level).toBeLessThanOrEqual(total);
      }
    });

    it('returns the same level for the same date (deterministic)', () => {
      const date = new Date(2026, 4, 21);
      const level1 = getDailyChallengeLevel(date);
      const level2 = getDailyChallengeLevel(new Date(2026, 4, 21));
      expect(level1).toBe(level2);
    });

    it('returns different levels for different dates', () => {
      const levels = new Set<number>();
      for (let day = 1; day <= 10; day++) {
        levels.add(getDailyChallengeLevel(new Date(2026, 4, day)));
      }
      // At least 2 distinct levels across 10 consecutive days
      expect(levels.size).toBeGreaterThan(1);
    });

    it('is consistent across multiple date constructions', () => {
      const dates = [
        [2026, 5, 21],
        [2026, 1, 1],
        [2025, 12, 25],
        [2027, 3, 15],
      ] as const;
      for (const [y, m, d] of dates) {
        const a = getDailyChallengeLevel(new Date(y, m - 1, d));
        const b = getDailyChallengeLevel(new Date(y, m - 1, d));
        expect(a).toBe(b);
      }
    });
  });

  describe('getSecondsUntilMidnight', () => {
    it('returns a value between 0 and 86400', () => {
      const now = new Date(2026, 4, 21, 15, 30, 0); // 15:30:00
      const seconds = getSecondsUntilMidnight(now);
      expect(seconds).toBeGreaterThan(0);
      expect(seconds).toBeLessThanOrEqual(86400);
    });

    it('returns close to 86400 seconds just after midnight', () => {
      const justAfterMidnight = new Date(2026, 4, 21, 0, 0, 1); // 00:00:01
      const seconds = getSecondsUntilMidnight(justAfterMidnight);
      expect(seconds).toBeCloseTo(86399, -2); // within ~100s
    });

    it('returns close to 0 just before midnight', () => {
      const justBeforeMidnight = new Date(2026, 4, 21, 23, 59, 59); // 23:59:59
      const seconds = getSecondsUntilMidnight(justBeforeMidnight);
      expect(seconds).toBeLessThanOrEqual(2);
    });

    it('never returns a negative value', () => {
      const midnightExact = new Date(2026, 4, 21, 24, 0, 0);
      expect(getSecondsUntilMidnight(midnightExact)).toBeGreaterThanOrEqual(0);
    });
  });

  describe('isTodayCompleted / markTodayCompleted', () => {
    beforeEach(async () => {
      await AsyncStorage.clear();
    });

    it('returns false when no challenge has been completed', async () => {
      const date = new Date(2026, 4, 21);
      const result = await isTodayCompleted(date);
      expect(result).toBe(false);
    });

    it('returns true after markTodayCompleted', async () => {
      const date = new Date(2026, 4, 22);
      await markTodayCompleted(date);
      const result = await isTodayCompleted(date);
      expect(result).toBe(true);
    });

    it('returns false for a different day even after completion', async () => {
      const completedDate = new Date(2026, 4, 22);
      const otherDate = new Date(2026, 4, 23);
      await markTodayCompleted(completedDate);
      const result = await isTodayCompleted(otherDate);
      expect(result).toBe(false);
    });
  });
});
