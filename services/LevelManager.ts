/**
 * Level Manager - Merke und Male
 * Verwaltet Level-Konfiguration und Fortschritt
 */

import { Level, Difficulty } from '../types';

/**
 * Berechnet die Anzeigedauer für ein Level
 * Level 1: 10s, Level 2: 9s, ..., Level 9: 4s, Level 10: 3s
 */
export function getDisplayDuration(levelNumber: number): number {
  return Math.max(3, 11 - levelNumber);
}

/**
 * Ermittelt die Schwierigkeit basierend auf der Level-Nummer
 */
export function getDifficultyForLevel(levelNumber: number): Difficulty {
  if (levelNumber <= 2) return 1;
  if (levelNumber <= 4) return 2;
  if (levelNumber <= 6) return 3;
  if (levelNumber <= 8) return 4;
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
  return 10;
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
