/**
 * MascotManager — Begleitfigur + einheitliches Fortschrittssystem (Issue #279, 1.1)
 *
 * Konsolidiert bestehende Fortschritts-Signale (Sterne aus StorageManager,
 * Streak aus StreakManager) hinter EINEM Fortschrittsbegriff: Gesamt-Sterne
 * schalten kosmetische Mascot-Accessoires frei. Kein separates XP-System,
 * keine zusätzliche Währung — bewusst nur eine Ressource (Sterne).
 */

import storageManager, { type AppProgress } from './StorageManager';
import { getStreakData } from './StreakManager';

export type MascotMood = 'neutral' | 'happy' | 'excited' | 'encouraging';

export interface MascotUnlock {
  id: string;
  starsRequired: number;
  labelKey: string; // i18n key für den Accessoire-Namen
}

/**
 * Kosmetische Unlocks, aufsteigend nach Sterne-Schwelle sortiert.
 * Bewusst nur Mascot-Accessoires (kein Pinselfarben-Unlock in dieser Runde,
 * um die feste Zeichenfarbpalette — Issue-Kommentar in Colors.ts — nicht
 * anzutasten).
 */
export const MASCOT_UNLOCKS: MascotUnlock[] = [
  { id: 'hat', starsRequired: 15, labelKey: 'mascot.accessory.hat' },
  { id: 'glasses', starsRequired: 40, labelKey: 'mascot.accessory.glasses' },
  { id: 'bowtie', starsRequired: 80, labelKey: 'mascot.accessory.bowtie' },
  { id: 'crown', starsRequired: 150, labelKey: 'mascot.accessory.crown' },
];

export function getTotalStars(progress: Pick<AppProgress, 'levels'>): number {
  return Object.values(progress.levels).reduce((sum, l) => sum + l.bestRating, 0);
}

export function getUnlockedMascotAccessories(totalStars: number): MascotUnlock[] {
  return MASCOT_UNLOCKS.filter(u => totalStars >= u.starsRequired);
}

export function getNextMascotUnlock(totalStars: number): MascotUnlock | null {
  return MASCOT_UNLOCKS.find(u => totalStars < u.starsRequired) ?? null;
}

/**
 * Ermittelt neu freigeschaltete Accessoires zwischen zwei Sterne-Ständen
 * (z.B. vor/nach dem Speichern einer neuen Bewertung).
 */
export function getNewlyUnlockedAccessories(
  starsBefore: number,
  starsAfter: number,
): MascotUnlock[] {
  return MASCOT_UNLOCKS.filter(u => starsAfter >= u.starsRequired && starsBefore < u.starsRequired);
}

export interface MascotProgress {
  totalStars: number;
  currentStreak: number;
  unlocked: MascotUnlock[];
  nextUnlock: MascotUnlock | null;
}

/**
 * Lädt den vereinheitlichten Fortschritt, den die Mascot-Komponente
 * anzeigt: Gesamt-Sterne, aktuelle Streak, freigeschaltete Accessoires.
 */
export async function getMascotProgress(): Promise<MascotProgress> {
  const [progress, streak] = await Promise.all([storageManager.getProgress(), getStreakData()]);
  const totalStars = getTotalStars(progress);
  return {
    totalStars,
    currentStreak: streak.currentStreak,
    unlocked: getUnlockedMascotAccessories(totalStars),
    nextUnlock: getNextMascotUnlock(totalStars),
  };
}

/** Begrüßungs-i18n-Key je nach aktueller Streak. */
export function getHomeGreetingKey(currentStreak: number): string {
  if (currentStreak >= 7) return 'mascot.greeting.streakLong';
  if (currentStreak >= 2) return 'mascot.greeting.streak';
  return 'mascot.greeting.default';
}

/** Mascot-Stimmung passend zur Sterne-Bewertung einer Runde. */
export function getResultMoodForStars(stars: number): MascotMood {
  if (stars >= 5) return 'excited';
  if (stars >= 4) return 'happy';
  if (stars >= 3) return 'neutral';
  return 'encouraging';
}
