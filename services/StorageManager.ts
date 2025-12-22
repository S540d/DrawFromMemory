/**
 * StorageManager - AsyncStorage Handler
 * Speichert und lädt Spielfortschritt, Einstellungen und Zeichnungen
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

      await AsyncStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving level progress:', error);
    }
  }

  /**
   * Lädt Fortschritt
   */
  async getProgress(): Promise<AppProgress> {
    try {
      const data = await AsyncStorage.getItem(KEYS.PROGRESS);
      if (data) {
        return JSON.parse(data);
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
      await AsyncStorage.removeItem(KEYS.PROGRESS);
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
      await AsyncStorage.setItem(KEYS.THEME, updated.theme);
      await AsyncStorage.setItem(KEYS.LANGUAGE, updated.language);
      await AsyncStorage.setItem(
        KEYS.SOUND_ENABLED,
        JSON.stringify(updated.soundEnabled)
      );
      await AsyncStorage.setItem(
        KEYS.MUSIC_ENABLED,
        JSON.stringify(updated.musicEnabled)
      );
      await AsyncStorage.setItem(
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
        AsyncStorage.getItem(KEYS.THEME),
        AsyncStorage.getItem(KEYS.LANGUAGE),
        AsyncStorage.getItem(KEYS.SOUND_ENABLED),
        AsyncStorage.getItem(KEYS.MUSIC_ENABLED),
        AsyncStorage.getItem(KEYS.EXTRA_TIME_MODE),
      ]);

      return {
        theme: (theme as 'light' | 'dark' | 'system') || 'light',
        language: (language as 'de' | 'en') || 'de',
        soundEnabled: sound ? JSON.parse(sound) : true,
        musicEnabled: music ? JSON.parse(music) : false,
        extraTimeMode: extraTime ? JSON.parse(extraTime) : false,
      };
    } catch (error) {
      console.error('Error loading settings:', error);
    }

    // Return defaults
    return {
      theme: 'light',
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
      await AsyncStorage.multiRemove(Object.values(KEYS));
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

// Export singleton instance
export const storageManager = new StorageManager();
export default storageManager;
