/**
 * StreakManager - Täglicher Streak-Tracker
 * Zählt aufeinanderfolgende Tage mit ≥1 Spielrunde.
 * DST-sicher via lokale YYYY-MM-DD-Strings (kein UTC).
 */

import { createPersistedJson } from './storage/persistedJson';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string | null; // YYYY-MM-DD (local)
}

const DEFAULT_STATE: StreakData = { currentStreak: 0, longestStreak: 0, lastPlayedDate: null };

const isStreakData = (v: unknown): v is StreakData => {
  if (typeof v !== 'object' || v === null) return false;
  const s = v as Record<string, unknown>;
  return (
    typeof s.currentStreak === 'number' &&
    typeof s.longestStreak === 'number' &&
    (s.lastPlayedDate === null || typeof s.lastPlayedDate === 'string')
  );
};

const store = createPersistedJson<StreakData>({
  key: '@merke_male:streak',
  defaultValue: DEFAULT_STATE,
  isValid: isStreakData,
});

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
  try {
    return await store.load();
  } catch {
    return { ...DEFAULT_STATE };
  }
}

/**
 * Wird nach jeder abgeschlossenen Spielrunde aufgerufen.
 * Aktualisiert currentStreak, longestStreak und lastPlayedDate.
 */
export async function updateStreakAfterGame(date: Date = new Date()): Promise<void> {
  try {
    const state = await store.load();
    const today = getLocalDateKey(date);

    if (state.lastPlayedDate === today) {
      // Bereits heute gespielt — kein Update nötig
      return;
    }

    let newStreak: number;

    if (state.lastPlayedDate !== null) {
      const yesterday = getLocalDateKey(
        new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1),
      );
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

    await store.save({
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
  await store.reset();
}
