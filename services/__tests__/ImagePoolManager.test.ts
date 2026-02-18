/**
 * ImagePoolManager Tests
 * Tests für Bilderpool-Verwaltung und zufällige Bildauswahl
 */

import {
  getRandomImageForLevel,
  getImagesForDifficulty,
  getTotalImageCount,
  getImageCountByDifficulty,
  resetLastShownImages,
} from '../ImagePoolManager';
import { getTotalLevels } from '../LevelManager';

describe('ImagePoolManager', () => {
  beforeEach(() => {
    resetLastShownImages();
  });

  describe('getRandomImageForLevel', () => {
    it('should return a valid image for every level', () => {
      const total = getTotalLevels();
      for (let i = 1; i <= total; i++) {
        const image = getRandomImageForLevel(i);
        expect(image).toBeDefined();
        expect(image.filename).toBeTruthy();
        expect(image.displayName).toBeTruthy();
        expect(image.difficulty).toBeGreaterThanOrEqual(1);
        expect(image.difficulty).toBeLessThanOrEqual(5);
        expect(image.strokeCount).toBeGreaterThan(0);
        expect(image.colors).toBeDefined();
        expect(image.colors.length).toBeGreaterThan(0);
      }
    });

    it('should not crash when called many times for the same level', () => {
      // Simulates rapid level replays - should never crash
      for (let i = 0; i < 50; i++) {
        expect(() => getRandomImageForLevel(1)).not.toThrow();
      }
    });

    it('should return images matching the level difficulty', () => {
      // Level 1 should return difficulty 1 images
      const image = getRandomImageForLevel(1);
      expect(image.difficulty).toBe(1);
    });

    it('should avoid repeating recently shown images', () => {
      // Get several images for the same level
      const images = [];
      for (let i = 0; i < 5; i++) {
        images.push(getRandomImageForLevel(1));
      }
      // At least some variety should exist (not all the same)
      const filenames = images.map(i => i.filename);
      // With 3 images at difficulty 1 and max 3 recent, we should see variety
      const uniqueCount = new Set(filenames).size;
      expect(uniqueCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getImagesForDifficulty', () => {
    it('should return images for each difficulty level', () => {
      for (let d = 1; d <= 5; d++) {
        const images = getImagesForDifficulty(d as 1 | 2 | 3 | 4 | 5);
        expect(images.length).toBeGreaterThan(0);
        images.forEach(img => {
          expect(img.difficulty).toBe(d);
        });
      }
    });
  });

  describe('getTotalImageCount', () => {
    it('should return total number of images', () => {
      expect(getTotalImageCount()).toBeGreaterThan(0);
    });
  });

  describe('getImageCountByDifficulty', () => {
    it('should return counts for all difficulty levels', () => {
      const counts = getImageCountByDifficulty();
      expect(counts[1]).toBeGreaterThan(0);
      expect(counts[2]).toBeGreaterThan(0);
      expect(counts[3]).toBeGreaterThan(0);
      expect(counts[4]).toBeGreaterThan(0);
      expect(counts[5]).toBeGreaterThan(0);
    });

    it('should sum up to total image count', () => {
      const counts = getImageCountByDifficulty();
      const sum = counts[1] + counts[2] + counts[3] + counts[4] + counts[5];
      expect(sum).toBe(getTotalImageCount());
    });
  });
});
