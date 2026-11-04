/**
 * DailyChallengeManager - Tägliche Challenge (Bild des Tages)
 * Deterministisch aus Datum berechnet, kein Server nötig.
 */

import { safeStorageOps } from './StorageManager';
import { getTotalLevels } from './LevelManager';
import { getLocalDateKey } from './StreakManager';

const STORAGE_KEY = '@merke_male:daily_challenge';

interface DailyChallengeState {
  lastCompletedDate: string | null;
}

async function loadState(): Promise<DailyChallengeState> {
  const raw = await safeStorageOps.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fall through to default below
    }
  }
  return { lastCompletedDate: null };
}

async function saveState(state: DailyChallengeState): Promise<void> {
  await safeStorageOps.setItem(STORAGE_KEY, JSON.stringify(state));
}

/**
 * Gibt den Datums-Key im Format "YYYY-MM-DD" zurück.
 */
export function getDailyChallengeKey(date: Date = new Date()): string {
  return getLocalDateKey(date);
}

/**
 * Berechnet deterministisch das Level des Tages aus dem Datum.
 * Gleicher Tag → gleicher Level für alle Nutzer, kein Server nötig.
 */
export function getDailyChallengeLevel(date: Date = new Date()): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dateValue = y * 10000 + m * 100 + d;
  const total = getTotalLevels();
  return (dateValue % total) + 1;
}

/**
 * Gibt die verbleibenden Sekunden bis Mitternacht zurück.
 */
export function getSecondsUntilMidnight(now: Date = new Date()): number {
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
}

/**
 * Prüft ob die heutige Challenge bereits abgeschlossen wurde.
 */
export async function isTodayCompleted(date: Date = new Date()): Promise<boolean> {
  try {
    const state = await loadState();
    return state.lastCompletedDate === getDailyChallengeKey(date);
  } catch {
    return false;
  }
}

/**
 * Markiert die heutige Challenge als abgeschlossen.
 */
export async function markTodayCompleted(date: Date = new Date()): Promise<void> {
  try {
    await saveState({ lastCompletedDate: getDailyChallengeKey(date) });
  } catch {
    // best-effort
  }
}
