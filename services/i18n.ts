/**
 * i18n Service - Merke und Male
 * Einfaches Übersetzungssystem für Deutsch/Englisch
 */

import de from '../locales/de/translations.json';
import en from '../locales/en/translations.json';

type Language = 'de' | 'en';
type TranslationKey = string;

const translations = { de, en };
let currentLanguage: Language = 'de';

/**
 * Setzt die aktuelle Sprache
 */
export function setLanguage(lang: Language): void {
  currentLanguage = lang;
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
      console.warn(`Translation missing for key: ${key} (language: ${currentLanguage})`);
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

export default { t, setLanguage, getLanguage, useTranslation };
