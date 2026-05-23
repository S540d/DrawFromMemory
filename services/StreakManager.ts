/**
 * StreakManager - Täglicher Streak-Tracker
 * Zählt aufeinanderfolgende Tage mit ≥1 Spielrunde.
 * DST-sicher via lokale YYYY-MM-DD-Strings (kein UTC).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@merke_male:streak';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string | null; // YYYY-MM-DD (local)
}

const MEMORY: Record<string, string> = {};

async function loadState(): Promise<StreakData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      MEMORY[STORAGE_KEY] = raw;
      return JSON.parse(raw);
    }
  } catch {
    const raw = MEMORY[STORAGE_KEY];
    if (raw) return JSON.parse(raw);
  }
  return { currentStreak: 0, longestStreak: 0, lastPlayedDate: null };
}

async function saveState(state: StreakData): Promise<void> {
  const raw = JSON.stringify(state);
  MEMORY[STORAGE_KEY] = raw;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // in-memory fallback is sufficient for web sessions
  }
}

/**
 * Gibt das Datum als lokalen YYYY-MM-DD-String zurück (DST-sicher).
 */
export function getLocalDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Lädt die aktuellen Streak-Daten.
 */
export async function getStreakData(): Promise<StreakData> {
  return loadState();
}

/**
 * Wird nach jeder abgeschlossenen Spielrunde aufgerufen.
 * Aktualisiert currentStreak, longestStreak und lastPlayedDate.
 */
export async function updateStreakAfterGame(date: Date = new Date()): Promise<void> {
  try {
    const state = await loadState();
    const today = getLocalDateKey(date);

    if (state.lastPlayedDate === today) {
      // Bereits heute gespielt — kein Update nötig
      return;
    }

    let newStreak: number;

    if (state.lastPlayedDate !== null) {
      const yesterday = getLocalDateKey(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1));
      if (state.lastPlayedDate === yesterday) {
        // Gestern gespielt → Streak verlängern
        newStreak = state.currentStreak + 1;
      } else {
        // Mehr als 1 Tag Pause → Streak zurücksetzen
        newStreak = 1;
      }
    } else {
      // Erster Spieltag überhaupt
      newStreak = 1;
    }

    await saveState({
      currentStreak: newStreak,
      longestStreak: Math.max(state.longestStreak, newStreak),
      lastPlayedDate: today,
    });
  } catch {
    // best-effort
  }
}

/**
 * Setzt alle Streak-Daten zurück (nur für Tests / Reset-Funktion).
 */
export async function resetStreakData(): Promise<void> {
  delete MEMORY[STORAGE_KEY];
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // best-effort
  }
}
