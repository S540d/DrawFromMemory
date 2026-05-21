/**
 * Level Manager - Merke und Male
 * Verwaltet Level-Konfiguration und Fortschritt
 */

import { Level, Difficulty } from '../types';

const BASE_DURATIONS: Record<number, number> = {
  1: 5,
  2: 4,
  3: 3,
  4: 2,
  5: 1.5,
};

/**
 * Berechnet die Anzeigedauer für ein Level basierend auf der Schwierigkeit.
 * extraTimeMode addiert +3 s auf jeden Basiswert.
 */
export function getDisplayDuration(levelNumber: number, extraTimeMode = false): number {
  const difficulty = getDifficultyForLevel(levelNumber);
  const base = BASE_DURATIONS[difficulty] ?? 3;
  return extraTimeMode ? base + 3 : base;
}

/**
 * Ermittelt die Schwierigkeit basierend auf der Level-Nummer
 * Level 1: Difficulty 1
 * Level 2-3: Difficulty 2
 * Level 4-5: Difficulty 3
 * Level 6-7: Difficulty 4
 * Level 8-10: Difficulty 5
 * Level 11-13: Difficulty 3 (Tiere)
 * Level 14-16: Difficulty 4 (Fahrzeuge)
 * Level 17-20: Difficulty 5 (Natur)
 */
export function getDifficultyForLevel(levelNumber: number): Difficulty {
  if (levelNumber === 1) return 1;
  if (levelNumber <= 3) return 2;
  if (levelNumber <= 5) return 3;
  if (levelNumber <= 7) return 4;
  if (levelNumber <= 10) return 5;
  if (levelNumber <= 13) return 3;
  if (levelNumber <= 16) return 4;
  return 5;
}

/**
 * Erstellt ein Level-Objekt mit allen Eigenschaften
 */
export function getLevel(levelNumber: number): Level {
  return {
    number: levelNumber,
    difficulty: getDifficultyForLevel(levelNumber),
    displayDuration: getDisplayDuration(levelNumber),
  };
}

/**
 * Gibt die Gesamtanzahl der Level zurück
 */
export function getTotalLevels(): number {
  return 20;
}

/**
 * Prüft ob eine Level-Nummer gültig ist
 */
export function isValidLevel(levelNumber: number): boolean {
  return levelNumber >= 1 && levelNumber <= getTotalLevels();
}

/**
 * Gibt alle Level als Array zurück
 */
export function getAllLevels(): Level[] {
  const levels: Level[] = [];
  for (let i = 1; i <= getTotalLevels(); i++) {
    levels.push(getLevel(i));
  }
  return levels;
}
