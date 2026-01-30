/**
 * StorageManager - AsyncStorage Handler with Web Fallback
 * Speichert und lädt Spielfortschritt, Einstellungen und Zeichnungen
 * Fallback auf In-Memory Storage für Web/GitHub Pages
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Keys
const KEYS = {
  PROGRESS: '@merke_male:progress',
  THEME: '@merke_male:theme',
  LANGUAGE: '@merke_male:language',
  SOUND_ENABLED: '@merke_male:sound_enabled',
  MUSIC_ENABLED: '@merke_male:music_enabled',
  EXTRA_TIME_MODE: '@merke_male:extra_time_mode',
};

// In-memory fallback for Web when localStorage is unavailable
const MEMORY_STORE: Record<string, string> = {};

// Safe storage operations with Web fallback
const safeStorageOps = {
  async getItem(key: string): Promise<string | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        MEMORY_STORE[key] = value;
      }
      return value;
    } catch (error) {
      // Fallback to in-memory store
      return MEMORY_STORE[key] ?? null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    // Always update in-memory store
    MEMORY_STORE[key] = value;

    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // AsyncStorage failed, but in-memory store was updated
      // This is acceptable for Web sessions
      if (__DEV__) {
        console.warn(`AsyncStorage setItem failed for ${key}, using in-memory store`, error);
      }
    }
  },

  async removeItem(key: string): Promise<void> {
    delete MEMORY_STORE[key];

    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      if (__DEV__) {
        console.warn(`AsyncStorage removeItem failed for ${key}`, error);
      }
    }
  },

  async multiRemove(keys: string[]): Promise<void> {
    keys.forEach(key => {
      delete MEMORY_STORE[key];
    });

    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      if (__DEV__) {
        console.warn(`AsyncStorage multiRemove failed`, error);
      }
    }
  },
};

export interface LevelProgress {
  levelNumber: number;
  rating: number; // 1-5 stars
  completedAt: string; // ISO timestamp
  bestRating: number; // Best rating for this level
}

export interface AppProgress {
  levels: Record<number, LevelProgress>;
  lastPlayedLevel: number;
  totalLevelsCompleted: number;
  averageRating: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'de' | 'en';
  soundEnabled: boolean;
  musicEnabled: boolean;
  extraTimeMode: boolean; // Add 5 seconds to all timers
}

class StorageManager {
  // ========== Progress Management ==========

  /**
   * Speichert Fortschritt für ein Level
   */
  async saveLevelProgress(
    levelNumber: number,
    rating: number
  ): Promise<void> {
    try {
      const progress = await this.getProgress();

      if (!progress.levels[levelNumber]) {
        progress.levels[levelNumber] = {
          levelNumber,
          rating,
          completedAt: new Date().toISOString(),
          bestRating: rating,
        };
      } else {
        const existing = progress.levels[levelNumber];
        existing.rating = rating;
        existing.completedAt = new Date().toISOString();
        existing.bestRating = Math.max(existing.bestRating, rating);
      }

      // Update metadata
      progress.lastPlayedLevel = levelNumber;
      progress.totalLevelsCompleted = Object.keys(progress.levels).length;

      // Calculate average rating
      const ratings = Object.values(progress.levels).map(l => l.bestRating);
      progress.averageRating =
        ratings.reduce((a, b) => a + b, 0) / ratings.length;

      await safeStorageOps.setItem(KEYS.PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving level progress:', error);
    }
  }

  /**
   * Lädt Fortschritt
   */
  async getProgress(): Promise<AppProgress> {
    try {
      const data = await safeStorageOps.getItem(KEYS.PROGRESS);
      if (data) {
        try {
          return JSON.parse(data);
        } catch (parseError) {
          // Invalid JSON, return default and clear corrupt data
          console.error('Failed to parse progress data, resetting:', parseError);
          await safeStorageOps.removeItem(KEYS.PROGRESS);
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }

    // Return default progress
    return {
      levels: {},
      lastPlayedLevel: 1,
      totalLevelsCompleted: 0,
      averageRating: 0,
    };
  }

  /**
   * Lädt Bewertung für ein Level
   */
  async getLevelRating(levelNumber: number): Promise<number | null> {
    try {
      const progress = await this.getProgress();
      return progress.levels[levelNumber]?.bestRating ?? null;
    } catch (error) {
      console.error('Error loading level rating:', error);
      return null;
    }
  }

  /**
   * Setzt Fortschritt zurück
   */
  async resetProgress(): Promise<void> {
    try {
      await safeStorageOps.removeItem(KEYS.PROGRESS);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  }

  // ========== Settings Management ==========

  /**
   * Speichert Einstellungen
   */
  async saveSettings(settings: Partial<AppSettings>): Promise<void> {
    try {
      const current = await this.getSettings();
      const updated = { ...current, ...settings };
      await safeStorageOps.setItem(KEYS.THEME, updated.theme);
      await safeStorageOps.setItem(KEYS.LANGUAGE, updated.language);
      await safeStorageOps.setItem(
        KEYS.SOUND_ENABLED,
        JSON.stringify(updated.soundEnabled)
      );
      await safeStorageOps.setItem(
        KEYS.MUSIC_ENABLED,
        JSON.stringify(updated.musicEnabled)
      );
      await safeStorageOps.setItem(
        KEYS.EXTRA_TIME_MODE,
        JSON.stringify(updated.extraTimeMode)
      );
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  /**
   * Lädt Einstellungen
   */
  async getSettings(): Promise<AppSettings> {
    try {
      const [theme, language, sound, music, extraTime] = await Promise.all([
        safeStorageOps.getItem(KEYS.THEME),
        safeStorageOps.getItem(KEYS.LANGUAGE),
        safeStorageOps.getItem(KEYS.SOUND_ENABLED),
        safeStorageOps.getItem(KEYS.MUSIC_ENABLED),
        safeStorageOps.getItem(KEYS.EXTRA_TIME_MODE),
      ]);

      // Safe JSON parsing with fallback
      const parseSafely = (value: string | null, defaultValue: boolean): boolean => {
        if (!value) return defaultValue;
        try {
          return JSON.parse(value);
        } catch {
          return defaultValue;
        }
      };

      return {
        theme: (theme as 'light' | 'dark' | 'system') || 'system',
        language: (language as 'de' | 'en') || 'de',
        soundEnabled: parseSafely(sound, true),
        musicEnabled: parseSafely(music, false),
        extraTimeMode: parseSafely(extraTime, false),
      };
    } catch (error) {
      console.error('Error loading settings:', error);
    }

    // Return defaults
    return {
      theme: 'system',
      language: 'de',
      soundEnabled: true,
      musicEnabled: false,
      extraTimeMode: false,
    };
  }

  /**
   * Speichert einzelne Einstellung
   */
  async setSetting<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ): Promise<void> {
    await this.saveSettings({ [key]: value });
  }

  /**
   * Lädt einzelne Einstellung
   */
  async getSetting<K extends keyof AppSettings>(
    key: K
  ): Promise<AppSettings[K]> {
    const settings = await this.getSettings();
    return settings[key];
  }

  // ========== General Cleanup ==========

  /**
   * Löscht alle Daten (nur für Testing)
   */
  async clearAllData(): Promise<void> {
    try {
      await safeStorageOps.multiRemove(Object.values(KEYS));
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

// Export singleton instance
export const storageManager = new StorageManager();
export default storageManager;
