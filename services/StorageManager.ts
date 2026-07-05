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
  CELEBRATION_ENABLED: '@merke_male:celebration_enabled',
  GALLERY: '@merke_male:gallery',
  REVIEW_LAST_SHOWN: '@merke_male:review_last_shown',
  REVIEW_DAILY_COUNT: '@merke_male:review_daily_count',
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
  language: 'de' | 'en' | 'es' | 'fr' | 'it' | 'nl' | 'pl';
  soundEnabled: boolean;
  musicEnabled: boolean;
  extraTimeMode: boolean; // Add 5 seconds to all timers
  celebrationEnabled: boolean; // Konfetti + Jubel-Sound bei 4-5 Sternen
}

export interface GalleryEntry {
  id: string;
  levelNumber: number;
  imageFilename: string;
  imageName: string;
  paths: {
    points: { x: number; y: number }[];
    color: string;
    strokeWidth: number;
    type?: 'stroke' | 'fill';
  }[];
  rating: number;
  savedAt: string; // ISO timestamp
  isDailyChallenge?: boolean;
}

// Type-guard for defensively-loaded gallery entries. Validates every required
// field so downstream UI code (e.g. `'★'.repeat(entry.rating)`) can't crash on
// malformed persisted data. `isDailyChallenge` is optional and not checked.
function isValidGalleryEntry(e: unknown): e is GalleryEntry {
  if (!e || typeof e !== 'object') return false;
  const r = e as Record<string, unknown>;
  return (
    typeof r.id === 'string' &&
    typeof r.levelNumber === 'number' &&
    typeof r.imageFilename === 'string' &&
    typeof r.imageName === 'string' &&
    Array.isArray(r.paths) &&
    typeof r.rating === 'number' &&
    typeof r.savedAt === 'string'
  );
}

class StorageManager {
  // ========== Progress Management ==========

  /**
   * Speichert Fortschritt für ein Level
   */
  async saveLevelProgress(levelNumber: number, rating: number): Promise<void> {
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
      progress.averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

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
          // Invalid JSON — return defaults but KEEP the raw data so a later
          // version or manual recovery can still access it. Don't wipe.
          console.error(
            'Failed to parse progress data, using defaults (raw data kept):',
            parseError,
          );
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
      await safeStorageOps.setItem(KEYS.SOUND_ENABLED, JSON.stringify(updated.soundEnabled));
      await safeStorageOps.setItem(KEYS.MUSIC_ENABLED, JSON.stringify(updated.musicEnabled));
      await safeStorageOps.setItem(KEYS.EXTRA_TIME_MODE, JSON.stringify(updated.extraTimeMode));
      await safeStorageOps.setItem(
        KEYS.CELEBRATION_ENABLED,
        JSON.stringify(updated.celebrationEnabled),
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
      const [theme, language, sound, music, extraTime, celebration] = await Promise.all([
        safeStorageOps.getItem(KEYS.THEME),
        safeStorageOps.getItem(KEYS.LANGUAGE),
        safeStorageOps.getItem(KEYS.SOUND_ENABLED),
        safeStorageOps.getItem(KEYS.MUSIC_ENABLED),
        safeStorageOps.getItem(KEYS.EXTRA_TIME_MODE),
        safeStorageOps.getItem(KEYS.CELEBRATION_ENABLED),
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
        theme: (theme as 'light' | 'dark' | 'system') || 'dark',
        language: (language as 'de' | 'en') || 'de',
        soundEnabled: parseSafely(sound, true),
        musicEnabled: parseSafely(music, false),
        extraTimeMode: parseSafely(extraTime, false),
        celebrationEnabled: parseSafely(celebration, true),
      };
    } catch (error) {
      console.error('Error loading settings:', error);
    }

    // Return defaults
    return {
      theme: 'dark',
      language: 'de',
      soundEnabled: true,
      musicEnabled: false,
      extraTimeMode: false,
      celebrationEnabled: true,
    };
  }

  /**
   * Speichert einzelne Einstellung
   */
  async setSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): Promise<void> {
    await this.saveSettings({ [key]: value });
  }

  /**
   * Lädt einzelne Einstellung
   */
  async getSetting<K extends keyof AppSettings>(key: K): Promise<AppSettings[K]> {
    const settings = await this.getSettings();
    return settings[key];
  }

  // ========== Gallery Management ==========

  /**
   * Speichert eine Zeichnung in der Galerie
   */
  async saveToGallery(entry: Omit<GalleryEntry, 'id' | 'savedAt'>): Promise<void> {
    try {
      const gallery = await this.getGallery();
      const newEntry: GalleryEntry = {
        ...entry,
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        savedAt: new Date().toISOString(),
      };
      gallery.unshift(newEntry); // Newest first
      // Limit gallery to 50 entries to keep storage manageable
      if (gallery.length > 50) {
        gallery.length = 50;
      }
      await safeStorageOps.setItem(KEYS.GALLERY, JSON.stringify(gallery));
    } catch (error) {
      console.error('Error saving to gallery:', error);
    }
  }

  /**
   * Lädt alle Galerie-Einträge
   */
  async getGallery(): Promise<GalleryEntry[]> {
    try {
      const data = await safeStorageOps.getItem(KEYS.GALLERY);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            // Defensive: skip entries that don't match the expected shape,
            // but keep the rest. Never wipe the entire gallery.
            return parsed.filter(isValidGalleryEntry);
          }
        } catch (parseError) {
          // Invalid JSON — return empty but KEEP the raw data so a later
          // version or manual recovery can still access it. Don't wipe.
          console.error(
            'Failed to parse gallery data, using empty list (raw data kept):',
            parseError,
          );
        }
      }
    } catch (error) {
      console.error('Error loading gallery:', error);
    }
    return [];
  }

  /**
   * Löscht einen Galerie-Eintrag
   */
  async deleteFromGallery(id: string): Promise<void> {
    try {
      const gallery = await this.getGallery();
      const filtered = gallery.filter(e => e.id !== id);
      await safeStorageOps.setItem(KEYS.GALLERY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting gallery entry:', error);
    }
  }

  // ========== Store Review Tracking ==========

  async getReviewLastShown(): Promise<string | null> {
    return safeStorageOps.getItem(KEYS.REVIEW_LAST_SHOWN);
  }

  async setReviewLastShown(): Promise<void> {
    await safeStorageOps.setItem(KEYS.REVIEW_LAST_SHOWN, new Date().toISOString());
  }

  async getReviewDailyCount(): Promise<number> {
    const raw = await safeStorageOps.getItem(KEYS.REVIEW_DAILY_COUNT);
    return raw ? parseInt(raw, 10) || 0 : 0;
  }

  async incrementReviewDailyCount(): Promise<number> {
    const current = await this.getReviewDailyCount();
    const next = current + 1;
    await safeStorageOps.setItem(KEYS.REVIEW_DAILY_COUNT, String(next));
    return next;
  }

  async resetReviewDailyCount(): Promise<void> {
    await safeStorageOps.setItem(KEYS.REVIEW_DAILY_COUNT, '0');
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
