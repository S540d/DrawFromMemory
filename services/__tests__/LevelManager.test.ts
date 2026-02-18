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

    it('should return increasing difficulty for higher levels', () => {
      const diff1 = getDifficultyForLevel(1);
      const diff10 = getDifficultyForLevel(10);
      expect(diff10).toBeGreaterThanOrEqual(diff1);
    });

    it('should return valid difficulty range (1-5)', () => {
      for (let i = 1; i <= getTotalLevels(); i++) {
        const diff = getDifficultyForLevel(i);
        expect(diff).toBeGreaterThanOrEqual(1);
        expect(diff).toBeLessThanOrEqual(5);
      }
    });
  });

  describe('getDisplayDuration', () => {
    it('should return a positive duration for all levels', () => {
      for (let i = 1; i <= getTotalLevels(); i++) {
        expect(getDisplayDuration(i)).toBeGreaterThan(0);
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
