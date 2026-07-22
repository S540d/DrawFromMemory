/**
 * MascotManager Tests (Issue #279, 1.1)
 */
import {
  getTotalStars,
  getUnlockedMascotAccessories,
  getNextMascotUnlock,
  getNewlyUnlockedAccessories,
  getHomeGreetingKey,
  getResultMoodForStars,
  MASCOT_UNLOCKS,
} from '../MascotManager';

describe('MascotManager', () => {
  describe('getTotalStars', () => {
    it('sums bestRating across all levels', () => {
      const progress = {
        levels: {
          1: { levelNumber: 1, rating: 4, completedAt: '', bestRating: 4 },
          2: { levelNumber: 2, rating: 3, completedAt: '', bestRating: 5 },
        },
      };
      expect(getTotalStars(progress)).toBe(9);
    });

    it('returns 0 for no completed levels', () => {
      expect(getTotalStars({ levels: {} })).toBe(0);
    });
  });

  describe('getUnlockedMascotAccessories / getNextMascotUnlock', () => {
    it('unlocks nothing below the first threshold', () => {
      expect(getUnlockedMascotAccessories(5)).toEqual([]);
      expect(getNextMascotUnlock(5)?.id).toBe(MASCOT_UNLOCKS[0].id);
    });

    it('unlocks accessories at and above their threshold', () => {
      const unlocked = getUnlockedMascotAccessories(40);
      expect(unlocked.map(u => u.id)).toEqual(['hat', 'glasses']);
    });

    it('returns null next unlock once everything is unlocked', () => {
      expect(getNextMascotUnlock(9999)).toBeNull();
    });
  });

  describe('getNewlyUnlockedAccessories', () => {
    it('detects accessories crossed between before/after totals', () => {
      const newly = getNewlyUnlockedAccessories(10, 42);
      expect(newly.map(u => u.id)).toEqual(['hat', 'glasses']);
    });

    it('returns empty when no threshold was crossed', () => {
      expect(getNewlyUnlockedAccessories(20, 25)).toEqual([]);
    });
  });

  describe('getHomeGreetingKey', () => {
    it('escalates the greeting with streak length', () => {
      expect(getHomeGreetingKey(0)).toBe('mascot.greeting.default');
      expect(getHomeGreetingKey(3)).toBe('mascot.greeting.streak');
      expect(getHomeGreetingKey(7)).toBe('mascot.greeting.streakLong');
    });
  });

  describe('getResultMoodForStars', () => {
    it('maps star ratings to a mascot mood', () => {
      expect(getResultMoodForStars(5)).toBe('excited');
      expect(getResultMoodForStars(4)).toBe('happy');
      expect(getResultMoodForStars(3)).toBe('neutral');
      expect(getResultMoodForStars(1)).toBe('encouraging');
    });
  });
});
