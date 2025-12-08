/**
 * Image Pool Manager - Merke und Male
 * Verwaltet den Bilderpool und wählt zufällige Bilder basierend auf Schwierigkeit
 */

import { LevelImage, Difficulty } from '../types';

/**
 * Bilderpool mit allen verfügbaren Bildern
 */
const imagePool: LevelImage[] = [
  // Einfach (Schwierigkeit 1)
  {
    filename: 'level-01-sun.svg',
    difficulty: 1,
    displayName: 'Sonne',
    displayNameEn: 'Sun',
    strokeCount: 12
  },
  {
    filename: 'level-02-face.svg',
    difficulty: 1,
    displayName: 'Gesicht',
    displayNameEn: 'Face',
    strokeCount: 10
  },
  {
    filename: 'extra-01-stick-figure.svg',
    difficulty: 1,
    displayName: 'Strichmännchen',
    displayNameEn: 'Stick Figure',
    strokeCount: 6
  },

  // Einfach-Mittel (Schwierigkeit 2)
  {
    filename: 'level-03-cloud.svg',
    difficulty: 2,
    displayName: 'Wolke',
    displayNameEn: 'Cloud',
    strokeCount: 8
  },

  // Mittel (Schwierigkeit 3)
  {
    filename: 'level-04-house.svg',
    difficulty: 3,
    displayName: 'Haus',
    displayNameEn: 'House',
    strokeCount: 15
  },
  {
    filename: 'level-05-tree.svg',
    difficulty: 3,
    displayName: 'Baum',
    displayNameEn: 'Tree',
    strokeCount: 12
  },
  {
    filename: 'extra-02-car.svg',
    difficulty: 3,
    displayName: 'Auto',
    displayNameEn: 'Car',
    strokeCount: 18
  },

  // Mittel-Schwer (Schwierigkeit 4)
  {
    filename: 'level-06-dog.svg',
    difficulty: 4,
    displayName: 'Hund',
    displayNameEn: 'Dog',
    strokeCount: 22
  },
  {
    filename: 'level-07-cat.svg',
    difficulty: 4,
    displayName: 'Katze',
    displayNameEn: 'Cat',
    strokeCount: 20
  },
  {
    filename: 'level-08-sheep.svg',
    difficulty: 4,
    displayName: 'Schaf',
    displayNameEn: 'Sheep',
    strokeCount: 18
  },
  {
    filename: 'extra-03-flower.svg',
    difficulty: 4,
    displayName: 'Blume',
    displayNameEn: 'Flower',
    strokeCount: 20
  },
  {
    filename: 'extra-04-bird.svg',
    difficulty: 4,
    displayName: 'Vogel',
    displayNameEn: 'Bird',
    strokeCount: 18
  },

  // Schwierig (Schwierigkeit 5)
  {
    filename: 'level-09-fish.svg',
    difficulty: 5,
    displayName: 'Fisch',
    displayNameEn: 'Fish',
    strokeCount: 25
  },
  {
    filename: 'level-10-butterfly.svg',
    difficulty: 5,
    displayName: 'Schmetterling',
    displayNameEn: 'Butterfly',
    strokeCount: 35
  },
];

/**
 * Speichert die zuletzt gezeigten Bilder (max. 3)
 * um direkte Wiederholungen zu vermeiden
 */
let lastShownImages: string[] = [];

/**
 * Ermittelt die Schwierigkeit basierend auf der Level-Nummer
 * Level 1: Difficulty 1
 * Level 2-3: Difficulty 2
 * Level 4-5: Difficulty 3
 * Level 6-7: Difficulty 4
 * Level 8-10: Difficulty 5
 */
function getDifficultyForLevel(levelNumber: number): Difficulty {
  if (levelNumber === 1) return 1;
  if (levelNumber <= 3) return 2;
  if (levelNumber <= 5) return 3;
  if (levelNumber <= 7) return 4;
  return 5;
}

/**
 * Wählt ein zufälliges Bild für ein Level aus
 * @param levelNumber Level-Nummer (1-10)
 * @returns Zufälliges Bild aus dem passenden Schwierigkeitspool
 */
export function getRandomImageForLevel(levelNumber: number): LevelImage {
  const targetDifficulty = getDifficultyForLevel(levelNumber);

  // Filtere Bilder nach Schwierigkeit UND nicht kürzlich gezeigt
  let availableImages = imagePool.filter(img =>
    img.difficulty === targetDifficulty &&
    !lastShownImages.includes(img.filename)
  );

  // Falls alle Bilder dieser Schwierigkeit kürzlich gezeigt wurden, reset
  if (availableImages.length === 0) {
    lastShownImages = [];
    availableImages = imagePool.filter(img => img.difficulty === targetDifficulty);
  }

  // Wähle zufällig aus verfügbaren Bildern
  const randomIndex = Math.floor(Math.random() * availableImages.length);
  const selectedImage = availableImages[randomIndex];

  // Merke letztes Bild (max. 3 Bilder speichern)
  lastShownImages.push(selectedImage.filename);
  if (lastShownImages.length > 3) {
    lastShownImages.shift(); // Entferne ältestes
  }

  return selectedImage;
}

/**
 * Gibt alle Bilder einer bestimmten Schwierigkeit zurück
 */
export function getImagesForDifficulty(difficulty: Difficulty): LevelImage[] {
  return imagePool.filter(img => img.difficulty === difficulty);
}

/**
 * Gibt die Gesamtanzahl der Bilder im Pool zurück
 */
export function getTotalImageCount(): number {
  return imagePool.length;
}

/**
 * Gibt die Anzahl der Bilder pro Schwierigkeit zurück
 */
export function getImageCountByDifficulty(): Record<Difficulty, number> {
  return {
    1: getImagesForDifficulty(1).length,
    2: getImagesForDifficulty(2).length,
    3: getImagesForDifficulty(3).length,
    4: getImagesForDifficulty(4).length,
    5: getImagesForDifficulty(5).length,
  };
}

/**
 * Setzt den "zuletzt gezeigt" Cache zurück
 */
export function resetLastShownImages(): void {
  lastShownImages = [];
}
