/**
 * i18n Service - Merke und Male
 * Einfaches Übersetzungssystem für Deutsch/Englisch
 */

import de from '../locales/de/translations.json';
import en from '../locales/en/translations.json';
import storageManager from './StorageManager';

type Language = 'de' | 'en';
type TranslationKey = string;

const translations = { de, en };
let currentLanguage: Language = 'de';
let isInitialized = false;

/**
 * Initialize language from storage
 */
export async function initLanguage(): Promise<void> {
  if (isInitialized) return;
  
  try {
    const savedLanguage = await storageManager.getSetting('language');
    // Only update if we got a valid language value
    if (savedLanguage === 'de' || savedLanguage === 'en') {
      currentLanguage = savedLanguage;
    }
    isInitialized = true;
  } catch (error) {
    if (__DEV__) {
      console.warn('Failed to load language from storage:', error);
    }
    isInitialized = true; // Mark as initialized even on error to avoid repeated attempts
  }
}

/**
 * Setzt die aktuelle Sprache und speichert sie
 */
export async function setLanguage(lang: Language): Promise<void> {
  currentLanguage = lang;
  try {
    await storageManager.setSetting('language', lang);
  } catch (error) {
    console.error('Failed to save language to storage:', error);
  }
}

/**
 * Gibt die aktuelle Sprache zurück
 */
export function getLanguage(): Language {
  return currentLanguage;
}

/**
 * Übersetzt einen Key
 * Unterstützt verschachtelte Keys mit Punktnotation (z.B. "home.title")
 * Unterstützt Platzhalter (z.B. "{{number}}")
 */
export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  const keys = key.split('.');
  let value: any = translations[currentLanguage];

  // Navigiere durch verschachtelte Objekte
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      if (__DEV__) {
        console.warn(`Translation missing for key: ${key} (language: ${currentLanguage})`);
      }
      return key;
    }
  }

  let result = String(value);

  // Ersetze Platzhalter
  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      result = result.replace(`{{${paramKey}}}`, String(paramValue));
    });
  }

  return result;
}

/**
 * Hook-ähnliche Funktion für React Components
 * Gibt t-Funktion und currentLanguage zurück
 */
export function useTranslation() {
  return {
    t,
    language: currentLanguage,
    setLanguage,
  };
}

export default { t, setLanguage, getLanguage, useTranslation, initLanguage };
