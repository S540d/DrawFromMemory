/**
 * LevelManager Tests
 * Tests für Level-Konfiguration und Validierung
 */

import {
  getLevel,
  getTotalLevels,
  getDifficultyForLevel,
  getDisplayDuration,
  isValidLevel,
  getAllLevels,
} from '../LevelManager';

describe('LevelManager', () => {
  describe('getTotalLevels', () => {
    it('should return a positive number', () => {
      expect(getTotalLevels()).toBeGreaterThan(0);
    });

    it('should return 20', () => {
      expect(getTotalLevels()).toBe(20);
    });
  });

  describe('getLevel', () => {
    it('should return a valid level object for level 1', () => {
      const level = getLevel(1);
      expect(level).toEqual({
        number: 1,
        difficulty: expect.any(Number),
        displayDuration: expect.any(Number),
      });
    });

    it('should return valid level objects for all levels', () => {
      const total = getTotalLevels();
      for (let i = 1; i <= total; i++) {
        const level = getLevel(i);
        expect(level.number).toBe(i);
        expect(level.difficulty).toBeGreaterThanOrEqual(1);
        expect(level.difficulty).toBeLessThanOrEqual(5);
        expect(level.displayDuration).toBeGreaterThan(0);
      }
    });

    it('should not crash for out-of-range level numbers', () => {
      // These shouldn't crash even if the level doesn't exist
      expect(() => getLevel(0)).not.toThrow();
      expect(() => getLevel(-1)).not.toThrow();
      expect(() => getLevel(999)).not.toThrow();
    });
  });

  describe('getDifficultyForLevel', () => {
    it('should return difficulty 1 for level 1', () => {
      expect(getDifficultyForLevel(1)).toBe(1);
    });

    it('should return difficulty 4 for level 10 (monotone Steigerung)', () => {
      expect(getDifficultyForLevel(10)).toBe(4);
    });

    it('should return valid difficulty range (1-5)', () => {
      for (let i = 1; i <= getTotalLevels(); i++) {
        const diff = getDifficultyForLevel(i);
        expect(diff).toBeGreaterThanOrEqual(1);
        expect(diff).toBeLessThanOrEqual(5);
      }
    });

    it('should use monotone mapping: levels 9–13 → difficulty 4', () => {
      expect(getDifficultyForLevel(9)).toBe(4);
      expect(getDifficultyForLevel(11)).toBe(4);
      expect(getDifficultyForLevel(12)).toBe(4);
      expect(getDifficultyForLevel(13)).toBe(4);
    });

    it('should use monotone mapping: levels 14–20 → difficulty 5', () => {
      expect(getDifficultyForLevel(14)).toBe(5);
      expect(getDifficultyForLevel(15)).toBe(5);
      expect(getDifficultyForLevel(16)).toBe(5);
      expect(getDifficultyForLevel(17)).toBe(5);
      expect(getDifficultyForLevel(18)).toBe(5);
      expect(getDifficultyForLevel(19)).toBe(5);
      expect(getDifficultyForLevel(20)).toBe(5);
    });
  });

  describe('getDisplayDuration', () => {
    it('should return a positive duration for all levels', () => {
      for (let i = 1; i <= getTotalLevels(); i++) {
        expect(getDisplayDuration(i)).toBeGreaterThan(0);
      }
    });

    it('should return difficulty-based durations without extraTimeMode', () => {
      expect(getDisplayDuration(1)).toBe(5);  // difficulty 1
      expect(getDisplayDuration(2)).toBe(4);  // difficulty 2
      expect(getDisplayDuration(5)).toBe(3);  // difficulty 3
      expect(getDisplayDuration(9)).toBe(2);  // difficulty 4
      expect(getDisplayDuration(14)).toBe(2); // difficulty 5
    });

    it('should add exactly +3 s with extraTimeMode for each difficulty', () => {
      expect(getDisplayDuration(1, true)).toBe(8);  // 5 + 3
      expect(getDisplayDuration(2, true)).toBe(7);  // 4 + 3
      expect(getDisplayDuration(5, true)).toBe(6);  // 3 + 3
      expect(getDisplayDuration(9, true)).toBe(5);  // 2 + 3
      expect(getDisplayDuration(14, true)).toBe(5); // 2 + 3
    });

    it('should return same value as without extraTimeMode when extraTimeMode is false', () => {
      for (let i = 1; i <= getTotalLevels(); i++) {
        expect(getDisplayDuration(i, false)).toBe(getDisplayDuration(i));
      }
    });
  });

  describe('isValidLevel', () => {
    it('should return true for valid levels', () => {
      expect(isValidLevel(1)).toBe(true);
      expect(isValidLevel(getTotalLevels())).toBe(true);
    });

    it('should return false for invalid levels', () => {
      expect(isValidLevel(0)).toBe(false);
      expect(isValidLevel(-1)).toBe(false);
      expect(isValidLevel(getTotalLevels() + 1)).toBe(false);
    });
  });

  describe('getAllLevels', () => {
    it('should return all levels', () => {
      const levels = getAllLevels();
      expect(levels).toHaveLength(getTotalLevels());
    });

    it('should return levels in order', () => {
      const levels = getAllLevels();
      for (let i = 0; i < levels.length; i++) {
        expect(levels[i].number).toBe(i + 1);
      }
    });
  });
});
