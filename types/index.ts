/**
 * TypeScript Types - Merke und Male
 */

/**
 * Schwierigkeitsgrad eines Levels (1 = sehr einfach, 5 = sehr schwierig)
 */
export type Difficulty = 1 | 2 | 3 | 4 | 5;

/**
 * Bild im Bilderpool
 */
export interface LevelImage {
  filename: string;
  difficulty: Difficulty;
  displayName: string;
  displayNameEn: string;
  strokeCount: number;
  colors: string[]; // Array von Hex-Farben für dieses Bild
  minLevel?: number; // Wenn gesetzt, nur ab dieser Level-Nummer im Pool
  pack?: string;    // Optionale Themen-Pack-Zugehörigkeit (z.B. 'tiere-v1')
}

/**
 * Sternen-Bewertung (1-5 Sterne)
 */
export type StarRating = 1 | 2 | 3 | 4 | 5;

/**
 * Feedback für eine Bewertung
 */
export interface RatingFeedback {
  stars: StarRating;
  message: string;
  messageEn: string;
  animation?: 'none' | 'jumping-person';
  sound?: string | null;
}

/**
 * Spiel-Phase
 */
export type GamePhase = 'memorize' | 'draw' | 'result';

/**
 * Spielvariante: 'normal' (Standard), 'outline' (nur Umriss merken),
 * 'mirror' (Spiegelbild merken/zeichnen)
 */
export type GameVariant = 'normal' | 'outline' | 'mirror';

/**
 * Level-Daten
 */
export interface Level {
  number: number;
  difficulty: Difficulty;
  displayDuration: number; // in Sekunden
}

/**
 * Spiel-State
 */
export interface GameState {
  currentLevel: number;
  currentImage: LevelImage;
  phase: GamePhase;
  timeRemaining: number;
  drawingData: string | null; // Base64 oder SVG String
}

/**
 * User-Fortschritt (gespeichert in AsyncStorage)
 */
export interface UserProgress {
  completedLevels: number[];
  levelRatings: Record<number, StarRating>; // Level-Nummer -> Bewertung
  totalStars: number;
  lastPlayedLevel: number;
}

/**
 * App-Settings (gespeichert in AsyncStorage)
 */
export interface AppSettings {
  language: 'de' | 'en' | 'es' | 'fr' | 'it' | 'nl' | 'pl';
  soundEnabled: boolean;
  musicEnabled: boolean;
}

/**
 * Zeichenstift-Einstellungen
 */
export interface BrushSettings {
  color: string;
  size: number; // 1 = dünn, 2 = mittel, 3 = dick
}
