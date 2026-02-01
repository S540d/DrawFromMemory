/**
 * i18n Service - Merke und Male
 * Einfaches Übersetzungssystem für Deutsch/Englisch
 */

import de from '../locales/de/translations.json';
import en from '../locales/en/translations.json';
import storageManager from './StorageManager';
import * as Localization from 'expo-localization';

type Language = 'de' | 'en';
type TranslationKey = string;

const translations = { de, en };
let currentLanguage: Language = 'de';
let isInitialized = false;

/**
 * Detects the device's locale and returns a supported language
 * Falls back to 'de' if the device locale is not supported
 * 
 * @returns {Language} The detected language code ('de' or 'en')
 * @example
 * // Device set to English
 * getDeviceLanguage() // returns 'en'
 * 
 * // Device set to French (unsupported)
 * getDeviceLanguage() // returns 'de' (fallback)
 */
export function getDeviceLanguage(): Language {
  try {
    // Get the device locale (e.g., "en-US", "de-DE", "fr-FR")
    const deviceLocale = Localization.getLocales()[0];
    const languageCode = deviceLocale?.languageCode;
    
    // Check if the language code is supported
    if (languageCode === 'de' || languageCode === 'en') {
      return languageCode as Language;
    }
    
    // Default to German if language is not supported
    return 'de';
  } catch (error) {
    if (__DEV__) {
      console.warn('Failed to detect device language:', error);
    }
    // Default to German on error
    return 'de';
  }
}

/**
 * Initialize language from storage or device locale
 * If no language is saved, detects and uses the device's locale
 */
export async function initLanguage(): Promise<void> {
  if (isInitialized) return;
  
  try {
    const savedLanguage = await storageManager.getSetting('language');
    // Only update if we got a valid language value
    if (savedLanguage === 'de' || savedLanguage === 'en') {
      currentLanguage = savedLanguage;
    } else {
      // No saved language found, detect device language
      currentLanguage = getDeviceLanguage();
      // Save the detected language for future launches
      await storageManager.setSetting('language', currentLanguage);
    }
    isInitialized = true;
  } catch (error) {
    if (__DEV__) {
      console.warn('Failed to load language from storage:', error);
    }
    // Fallback to device language
    currentLanguage = getDeviceLanguage();
    // Attempt to save detected language even on error for consistency
    try {
      await storageManager.setSetting('language', currentLanguage);
    } catch (saveError) {
      if (__DEV__) {
        console.warn('Failed to save detected language:', saveError);
      }
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

export default { t, setLanguage, getLanguage, useTranslation, initLanguage, getDeviceLanguage };
