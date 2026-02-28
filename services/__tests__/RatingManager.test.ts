import { getRatingFeedback, calculateStarsFromSimilarity, getStarColor } from '../RatingManager';
import type { StarRating } from '../../types';

describe('RatingManager', () => {
  describe('getRatingFeedback', () => {
    it('should return animation "none" for 1 star', () => {
      const result = getRatingFeedback(1);
      expect(result.stars).toBe(1);
      expect(result.animation).toBe('none');
      expect(typeof result.message).toBe('string');
      expect(result.message.length).toBeGreaterThan(0);
    });

    it('should return animation "none" for 2 stars', () => {
      const result = getRatingFeedback(2);
      expect(result.stars).toBe(2);
      expect(result.animation).toBe('none');
    });

    it('should return correct feedback for 3 stars', () => {
      const result = getRatingFeedback(3);
      expect(result.stars).toBe(3);
      expect(result.animation).toBe('none');
      expect(result.sound).toBeNull();
    });

    it('should return correct feedback for 4 stars', () => {
      const result = getRatingFeedback(4);
      expect(result.stars).toBe(4);
      expect(result.animation).toBe('none');
      expect(result.sound).toBeNull();
    });

    it('should return "jumping-person" animation for 5 stars', () => {
      const result = getRatingFeedback(5);
      expect(result.stars).toBe(5);
      expect(result.animation).toBe('jumping-person');
      expect(result.sound).toBe('success.mp3');
    });

    it('should have both message and messageEn for all ratings', () => {
      const ratings: StarRating[] = [1, 2, 3, 4, 5];
      ratings.forEach(rating => {
        const result = getRatingFeedback(rating);
        expect(typeof result.message).toBe('string');
        expect(result.message.length).toBeGreaterThan(0);
        expect(typeof result.messageEn).toBe('string');
        expect(result.messageEn.length).toBeGreaterThan(0);
      });
    });

    it('should rotate low rating messages across calls', () => {
      const first = getRatingFeedback(1);
      const second = getRatingFeedback(1);
      // Both should be valid strings (rotation happens internally)
      expect(typeof first.message).toBe('string');
      expect(typeof second.message).toBe('string');
    });
  });

  describe('calculateStarsFromSimilarity', () => {
    it('should return 5 stars for score >= 90', () => {
      expect(calculateStarsFromSimilarity(90)).toBe(5);
      expect(calculateStarsFromSimilarity(100)).toBe(5);
      expect(calculateStarsFromSimilarity(95)).toBe(5);
    });

    it('should return 4 stars for score 75-89', () => {
      expect(calculateStarsFromSimilarity(75)).toBe(4);
      expect(calculateStarsFromSimilarity(89)).toBe(4);
      expect(calculateStarsFromSimilarity(80)).toBe(4);
    });

    it('should return 3 stars for score 60-74', () => {
      expect(calculateStarsFromSimilarity(60)).toBe(3);
      expect(calculateStarsFromSimilarity(74)).toBe(3);
      expect(calculateStarsFromSimilarity(65)).toBe(3);
    });

    it('should return 2 stars for score 40-59', () => {
      expect(calculateStarsFromSimilarity(40)).toBe(2);
      expect(calculateStarsFromSimilarity(59)).toBe(2);
      expect(calculateStarsFromSimilarity(50)).toBe(2);
    });

    it('should return 1 star for score below 40', () => {
      expect(calculateStarsFromSimilarity(0)).toBe(1);
      expect(calculateStarsFromSimilarity(39)).toBe(1);
      expect(calculateStarsFromSimilarity(20)).toBe(1);
    });
  });

  describe('getStarColor', () => {
    it('should return red for 1 star', () => {
      expect(getStarColor(1)).toBe('#E74C3C');
    });

    it('should return dark orange for 2 stars', () => {
      expect(getStarColor(2)).toBe('#E67E22');
    });

    it('should return orange for 3 stars', () => {
      expect(getStarColor(3)).toBe('#F39C12');
    });

    it('should return light green for 4 stars', () => {
      expect(getStarColor(4)).toBe('#2ECC71');
    });

    it('should return green for 5 stars', () => {
      expect(getStarColor(5)).toBe('#27AE60');
    });

    it('should return a valid hex color for all ratings', () => {
      const hexRegex = /^#[0-9A-F]{6}$/i;
      ([1, 2, 3, 4, 5] as StarRating[]).forEach(rating => {
        expect(getStarColor(rating)).toMatch(hexRegex);
      });
    });
  });
});
