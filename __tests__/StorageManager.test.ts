/**
 * StorageManager Tests
 * Tests für AsyncStorage-basiertes Persistence-Management
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import storageManager, { AppProgress } from '../services/StorageManager';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
}));

describe('StorageManager', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Progress Management', () => {
    it('should return default progress when no data exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const progress = await storageManager.getProgress();

      expect(progress).toEqual({
        levels: {},
        lastPlayedLevel: 1,
        totalLevelsCompleted: 0,
        averageRating: 0,
      });
    });

    it('should save level progress correctly', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await storageManager.saveLevelProgress(1, 5);

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
      const [key, value] = (AsyncStorage.setItem as jest.Mock).mock.calls[0];

      expect(key).toBe('@merke_male:progress');
      const savedData = JSON.parse(value);

      expect(savedData.levels[1]).toMatchObject({
        levelNumber: 1,
        rating: 5,
        bestRating: 5,
      });
      expect(savedData.lastPlayedLevel).toBe(1);
      expect(savedData.totalLevelsCompleted).toBe(1);
      expect(savedData.averageRating).toBe(5);
    });

    it('should update existing level progress with better rating', async () => {
      const existingProgress: AppProgress = {
        levels: {
          1: {
            levelNumber: 1,
            rating: 3,
            completedAt: '2025-01-01T00:00:00.000Z',
            bestRating: 3,
          },
        },
        lastPlayedLevel: 1,
        totalLevelsCompleted: 1,
        averageRating: 3,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existingProgress));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await storageManager.saveLevelProgress(1, 5);

      const [, value] = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
      const savedData = JSON.parse(value);

      expect(savedData.levels[1].rating).toBe(5);
      expect(savedData.levels[1].bestRating).toBe(5);
      expect(savedData.averageRating).toBe(5);
    });

    it('should keep best rating when saving worse rating', async () => {
      const existingProgress: AppProgress = {
        levels: {
          1: {
            levelNumber: 1,
            rating: 5,
            completedAt: '2025-01-01T00:00:00.000Z',
            bestRating: 5,
          },
        },
        lastPlayedLevel: 1,
        totalLevelsCompleted: 1,
        averageRating: 5,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existingProgress));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await storageManager.saveLevelProgress(1, 3);

      const [, value] = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
      const savedData = JSON.parse(value);

      expect(savedData.levels[1].rating).toBe(3);
      expect(savedData.levels[1].bestRating).toBe(5); // Should keep best
    });

    it('should calculate average rating correctly across multiple levels', async () => {
      // Start with empty progress
      let currentProgress: AppProgress = {
        levels: {},
        lastPlayedLevel: 1,
        totalLevelsCompleted: 0,
        averageRating: 0,
      };

      (AsyncStorage.getItem as jest.Mock).mockImplementation(() =>
        Promise.resolve(JSON.stringify(currentProgress))
      );

      (AsyncStorage.setItem as jest.Mock).mockImplementation((key: string, value: string) => {
        if (key === '@merke_male:progress') {
          currentProgress = JSON.parse(value);
        }
        return Promise.resolve();
      });

      await storageManager.saveLevelProgress(1, 5);
      await storageManager.saveLevelProgress(2, 3);
      await storageManager.saveLevelProgress(3, 4);

      expect(currentProgress.totalLevelsCompleted).toBe(3);
      expect(currentProgress.averageRating).toBe((5 + 3 + 4) / 3);
    });

    it('should get level rating correctly', async () => {
      const existingProgress: AppProgress = {
        levels: {
          1: {
            levelNumber: 1,
            rating: 4,
            completedAt: '2025-01-01T00:00:00.000Z',
            bestRating: 5,
          },
        },
        lastPlayedLevel: 1,
        totalLevelsCompleted: 1,
        averageRating: 5,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existingProgress));

      const rating = await storageManager.getLevelRating(1);
      expect(rating).toBe(5); // Should return bestRating
    });

    it('should return null for non-existent level rating', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const rating = await storageManager.getLevelRating(999);
      expect(rating).toBeNull();
    });

    it('should reset progress correctly', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

      await storageManager.resetProgress();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@merke_male:progress');
    });

    it('should handle corrupt JSON data gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('{ invalid json }');
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

      const progress = await storageManager.getProgress();

      expect(progress).toEqual({
        levels: {},
        lastPlayedLevel: 1,
        totalLevelsCompleted: 0,
        averageRating: 0,
      });
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@merke_male:progress');
    });
  });

  describe('Settings Management', () => {
    it('should return default settings when no data exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const settings = await storageManager.getSettings();

      expect(settings).toEqual({
        theme: 'system',
        language: 'de',
        soundEnabled: true,
        musicEnabled: false,
        extraTimeMode: false,
      });
    });

    it('should save settings correctly', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await storageManager.saveSettings({
        theme: 'dark',
        language: 'en',
        soundEnabled: false,
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@merke_male:theme', 'dark');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@merke_male:language', 'en');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@merke_male:sound_enabled', 'false');
    });

    it('should merge partial settings with existing settings', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        const map: Record<string, string> = {
          '@merke_male:theme': 'light',
          '@merke_male:language': 'de',
          '@merke_male:sound_enabled': 'true',
          '@merke_male:music_enabled': 'false',
          '@merke_male:extra_time_mode': 'false',
        };
        return Promise.resolve(map[key] || null);
      });

      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await storageManager.saveSettings({ theme: 'dark' });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@merke_male:theme', 'dark');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@merke_male:language', 'de');
    });

    it('should get and set individual setting', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await storageManager.setSetting('theme', 'dark');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@merke_male:theme', 'dark');

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('dark');

      const theme = await storageManager.getSetting('theme');
      expect(theme).toBe('dark');
    });

    it('should handle corrupt boolean settings gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@merke_male:sound_enabled') {
          return Promise.resolve('invalid boolean');
        }
        return Promise.resolve(null);
      });

      const settings = await storageManager.getSettings();

      expect(settings.soundEnabled).toBe(true); // Should fallback to default
    });
  });

  describe('Error Handling & Fallback', () => {
    it('should use in-memory fallback when AsyncStorage fails', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage full'));
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage unavailable'));

      // Save should not throw
      await expect(storageManager.saveLevelProgress(1, 5)).resolves.not.toThrow();

      // Should use in-memory fallback
      const progress = await storageManager.getProgress();
      expect(progress.levels[1]).toBeDefined();
    });

    it('should clear all data correctly', async () => {
      (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);

      await storageManager.clearAllData();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(
        expect.arrayContaining([
          '@merke_male:progress',
          '@merke_male:theme',
          '@merke_male:language',
          '@merke_male:sound_enabled',
          '@merke_male:music_enabled',
          '@merke_male:extra_time_mode',
        ])
      );
    });

    it('should not throw on clearAllData failure', async () => {
      (AsyncStorage.multiRemove as jest.Mock).mockRejectedValue(new Error('Failed'));

      await expect(storageManager.clearAllData()).resolves.not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle level number 0', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await storageManager.saveLevelProgress(0, 3);

      const [, value] = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
      const savedData = JSON.parse(value);

      expect(savedData.levels[0]).toBeDefined();
    });

    it('should handle very high level numbers', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await storageManager.saveLevelProgress(9999, 4);

      const [, value] = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
      const savedData = JSON.parse(value);

      expect(savedData.levels[9999]).toBeDefined();
    });

    it('should handle rating boundaries (1-5)', async () => {
      let currentProgress: AppProgress = {
        levels: {},
        lastPlayedLevel: 1,
        totalLevelsCompleted: 0,
        averageRating: 0,
      };

      (AsyncStorage.getItem as jest.Mock).mockImplementation(() =>
        Promise.resolve(JSON.stringify(currentProgress))
      );

      (AsyncStorage.setItem as jest.Mock).mockImplementation((key: string, value: string) => {
        if (key === '@merke_male:progress') {
          currentProgress = JSON.parse(value);
        }
        return Promise.resolve();
      });

      await storageManager.saveLevelProgress(1, 1);
      await storageManager.saveLevelProgress(2, 5);

      expect(currentProgress.levels[1].rating).toBe(1);
      expect(currentProgress.levels[2].rating).toBe(5);
    });

    it('should update timestamp on each save', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const before = new Date().toISOString();
      await storageManager.saveLevelProgress(1, 5);
      const after = new Date().toISOString();

      const [, value] = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
      const savedData = JSON.parse(value);
      const timestamp = savedData.levels[1].completedAt;

      expect(timestamp >= before).toBe(true);
      expect(timestamp <= after).toBe(true);
    });
  });
});
