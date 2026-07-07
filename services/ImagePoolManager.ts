/**
 * Image Pool Manager - Merke und Male
 * Verwaltet den Bilderpool und wählt zufällige Bilder basierend auf Schwierigkeit
 */

import { LevelImage, Difficulty } from '../types';
import { getDifficultyForLevel } from './LevelManager';

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
    strokeCount: 12,
    colors: ['#000000', '#FFD700', '#FFA500'],
  },
  {
    filename: 'level-02-face.svg',
    difficulty: 1,
    displayName: 'Gesicht',
    displayNameEn: 'Face',
    strokeCount: 10,
    colors: ['#000000', '#FDBCB4'],
  },
  {
    filename: 'extra-01-stick-figure.svg',
    difficulty: 1,
    displayName: 'Strichmännchen',
    displayNameEn: 'Stick Figure',
    strokeCount: 6,
    colors: ['#000000'],
  },

  // Einfach-Mittel (Schwierigkeit 2)
  {
    filename: 'level-03-cloud.svg',
    difficulty: 2,
    displayName: 'Wolke',
    displayNameEn: 'Cloud',
    strokeCount: 8,
    colors: ['#FFFFFF'],
  },
  {
    filename: 'level-02-01-house.svg',
    difficulty: 2,
    displayName: 'Haus',
    displayNameEn: 'House',
    strokeCount: 15,
    colors: ['#000000', '#E74C3C', '#8B4513', '#87CEEB'],
  },
  {
    filename: 'level-02-02-apple.svg',
    difficulty: 2,
    displayName: 'Apfel',
    displayNameEn: 'Apple',
    strokeCount: 12,
    colors: ['#E74C3C', '#27AE60', '#8B4513', '#FFFFFF'],
  },
  {
    filename: 'level-02-03-rocket.svg',
    difficulty: 2,
    displayName: 'Rakete',
    displayNameEn: 'Rocket',
    strokeCount: 18,
    colors: ['#FF6B6B', '#FFD700', '#3498DB'],
  },
  {
    filename: 'level-02-04-balloon.svg',
    difficulty: 2,
    displayName: 'Luftballon',
    displayNameEn: 'Balloon',
    strokeCount: 14,
    colors: ['#FF1493', '#000000', '#CD853F'],
  },

  // Mittel (Schwierigkeit 3)
  {
    filename: 'level-04-house.svg',
    difficulty: 3,
    displayName: 'Haus',
    displayNameEn: 'House',
    strokeCount: 15,
    colors: ['#000000', '#E74C3C', '#8B4513', '#87CEEB'],
  },
  {
    filename: 'level-05-tree.svg',
    difficulty: 3,
    displayName: 'Baum',
    displayNameEn: 'Tree',
    strokeCount: 12,
    colors: ['#000000', '#8B4513', '#27AE60'],
  },
  {
    filename: 'extra-02-car.svg',
    difficulty: 3,
    displayName: 'Auto',
    displayNameEn: 'Car',
    strokeCount: 18,
    colors: ['#000000', '#E74C3C', '#87CEEB', '#FFD700'],
  },

  // Mittel-Schwer (Schwierigkeit 4)
  {
    filename: 'level-06-dog.svg',
    difficulty: 4,
    displayName: 'Hund',
    displayNameEn: 'Dog',
    strokeCount: 22,
    colors: ['#000000', '#8B4513', '#FFFFFF', '#E74C3C', '#FFD700'],
  },
  {
    filename: 'level-07-cat.svg',
    difficulty: 4,
    displayName: 'Katze',
    displayNameEn: 'Cat',
    strokeCount: 20,
    colors: ['#000000', '#FFA500'],
  },
  {
    filename: 'level-08-sheep.svg',
    difficulty: 4,
    displayName: 'Schaf',
    displayNameEn: 'Sheep',
    strokeCount: 18,
    colors: ['#FFFFFF', '#000000'],
  },
  {
    filename: 'extra-03-flower.svg',
    difficulty: 4,
    displayName: 'Blume',
    displayNameEn: 'Flower',
    strokeCount: 20,
    colors: ['#000000', '#27AE60', '#FF69B4', '#FFD700'],
  },
  {
    filename: 'extra-04-bird.svg',
    difficulty: 4,
    displayName: 'Vogel',
    displayNameEn: 'Bird',
    strokeCount: 18,
    colors: ['#000000', '#3498DB', '#FFD700', '#FFA500'],
  },

  // Tiere – Difficulty 3 (Level 11–13)
  {
    filename: 'level-11-cat-simple.svg',
    difficulty: 3,
    displayName: 'Katze',
    displayNameEn: 'Cat',
    strokeCount: 11,
    colors: ['#000000', '#FFA500', '#FFB6C1'],
    minLevel: 11,
  },
  {
    filename: 'level-12-dog-simple.svg',
    difficulty: 3,
    displayName: 'Hund',
    displayNameEn: 'Dog',
    strokeCount: 9,
    colors: ['#000000', '#D2691E', '#CD853F'],
    minLevel: 11,
  },
  {
    filename: 'level-13-bird-simple.svg',
    difficulty: 3,
    displayName: 'Vogel',
    displayNameEn: 'Bird',
    strokeCount: 8,
    colors: ['#000000', '#1E90FF', '#FFD700'],
    minLevel: 11,
  },

  // Fahrzeuge – Difficulty 4 (Level 14–16)
  {
    filename: 'level-14-car-v2.svg',
    difficulty: 4,
    displayName: 'Auto',
    displayNameEn: 'Car',
    strokeCount: 17,
    colors: ['#000000', '#2ECC71', '#87CEEB', '#FFD700', '#333333'],
    minLevel: 11,
  },
  {
    filename: 'level-15-train.svg',
    difficulty: 4,
    displayName: 'Zug',
    displayNameEn: 'Train',
    strokeCount: 16,
    colors: ['#000000', '#E74C3C', '#87CEEB', '#FFD700', '#333333'],
    minLevel: 11,
  },
  {
    filename: 'level-16-bicycle.svg',
    difficulty: 4,
    displayName: 'Fahrrad',
    displayNameEn: 'Bicycle',
    strokeCount: 18,
    colors: ['#000000', '#E74C3C', '#333333', '#FFD700'],
    minLevel: 11,
  },

  // Natur – Difficulty 5 (Level 17–20)
  {
    filename: 'level-17-tree-detailed.svg',
    difficulty: 5,
    displayName: 'Baum',
    displayNameEn: 'Tree',
    strokeCount: 14,
    colors: ['#000000', '#8B4513', '#27AE60', '#2ECC71', '#90EE90'],
    minLevel: 11,
  },
  {
    filename: 'level-18-flower-detailed.svg',
    difficulty: 5,
    displayName: 'Blume',
    displayNameEn: 'Flower',
    strokeCount: 16,
    colors: ['#000000', '#27AE60', '#FF69B4', '#FFD700', '#FF1493', '#8B4513'],
    minLevel: 11,
  },
  {
    filename: 'level-19-fish-tropical.svg',
    difficulty: 5,
    displayName: 'Tropenfisch',
    displayNameEn: 'Tropical Fish',
    strokeCount: 18,
    colors: ['#000000', '#FF6347', '#FFD700', '#FFFFFF', '#87CEEB'],
    minLevel: 11,
  },
  {
    filename: 'level-20-house-detailed.svg',
    difficulty: 5,
    displayName: 'Haus mit Garten',
    displayNameEn: 'House with Garden',
    strokeCount: 22,
    colors: ['#000000', '#E74C3C', '#8B4513', '#87CEEB', '#27AE60', '#FFD700', '#654321'],
    minLevel: 11,
  },

  // Fahrzeuge v1 – Themen-Pack (Difficulty 2–4)
  {
    filename: 'fahrzeuge-01-bus.svg',
    difficulty: 2,
    displayName: 'Schulbus',
    displayNameEn: 'School Bus',
    strokeCount: 12,
    colors: ['#FFD700', '#FFC300', '#87CEEB', '#333333'],
    pack: 'fahrzeuge-v1',
  },
  {
    filename: 'fahrzeuge-02-airplane.svg',
    difficulty: 2,
    displayName: 'Flugzeug',
    displayNameEn: 'Airplane',
    strokeCount: 11,
    colors: ['#87CEEB', '#4A90D9', '#FFFFFF'],
    pack: 'fahrzeuge-v1',
  },
  {
    filename: 'fahrzeuge-03-sailboat.svg',
    difficulty: 2,
    displayName: 'Segelboot',
    displayNameEn: 'Sailboat',
    strokeCount: 9,
    colors: ['#8B4513', '#FFFFFF', '#FFD700', '#4A90D9', '#E74C3C'],
    pack: 'fahrzeuge-v1',
  },
  {
    filename: 'fahrzeuge-04-tractor.svg',
    difficulty: 3,
    displayName: 'Traktor',
    displayNameEn: 'Tractor',
    strokeCount: 15,
    colors: ['#4CAF50', '#388E3C', '#87CEEB', '#333333', '#FFD700'],
    pack: 'fahrzeuge-v1',
  },
  {
    filename: 'fahrzeuge-05-helicopter.svg',
    difficulty: 3,
    displayName: 'Helikopter',
    displayNameEn: 'Helicopter',
    strokeCount: 14,
    colors: ['#FF6B35', '#87CEEB', '#D32F2F', '#757575'],
    pack: 'fahrzeuge-v1',
  },
  {
    filename: 'fahrzeuge-06-firetruck.svg',
    difficulty: 3,
    displayName: 'Feuerwehrauto',
    displayNameEn: 'Fire Truck',
    strokeCount: 14,
    colors: ['#E74C3C', '#C0392B', '#87CEEB', '#FFD700', '#333333'],
    pack: 'fahrzeuge-v1',
  },
  {
    filename: 'fahrzeuge-07-ambulance.svg',
    difficulty: 3,
    displayName: 'Krankenwagen',
    displayNameEn: 'Ambulance',
    strokeCount: 13,
    colors: ['#FFFFFF', '#E74C3C', '#2196F3', '#87CEEB'],
    pack: 'fahrzeuge-v1',
  },
  {
    filename: 'fahrzeuge-08-submarine.svg',
    difficulty: 4,
    displayName: 'U-Boot',
    displayNameEn: 'Submarine',
    strokeCount: 15,
    colors: ['#FFD700', '#FFC107', '#87CEEB', '#FFA000'],
    pack: 'fahrzeuge-v1',
  },
  {
    filename: 'fahrzeuge-09-speedboat.svg',
    difficulty: 4,
    displayName: 'Schnellboot',
    displayNameEn: 'Speedboat',
    strokeCount: 13,
    colors: ['#E74C3C', '#C0392B', '#87CEEB', '#FFFFFF', '#7F8C8D'],
    pack: 'fahrzeuge-v1',
  },
  {
    filename: 'fahrzeuge-10-spaceshuttle.svg',
    difficulty: 4,
    displayName: 'Raumfähre',
    displayNameEn: 'Space Shuttle',
    strokeCount: 16,
    colors: ['#ECEFF1', '#CFD8DC', '#87CEEB', '#FF7043', '#FFD700'],
    pack: 'fahrzeuge-v1',
  },

  // Tiere v1 – Themen-Pack (Difficulty 2–4)
  {
    filename: 'tiere-01-frog.svg',
    difficulty: 2,
    displayName: 'Frosch',
    displayNameEn: 'Frog',
    strokeCount: 10,
    colors: ['#4CAF50', '#2E7D32', '#1A1A1A', '#FFFFFF'],
    pack: 'tiere-v1',
  },
  {
    filename: 'tiere-02-rabbit.svg',
    difficulty: 2,
    displayName: 'Hase',
    displayNameEn: 'Rabbit',
    strokeCount: 11,
    colors: ['#F5F5F5', '#BDBDBD', '#FFB6C1', '#1A1A1A'],
    pack: 'tiere-v1',
  },
  {
    filename: 'tiere-03-duck.svg',
    difficulty: 2,
    displayName: 'Ente',
    displayNameEn: 'Duck',
    strokeCount: 10,
    colors: ['#FFD700', '#FF8C00', '#CC6600', '#1A1A1A', '#FFFFFF'],
    pack: 'tiere-v1',
  },
  {
    filename: 'tiere-04-owl.svg',
    difficulty: 3,
    displayName: 'Eule',
    displayNameEn: 'Owl',
    strokeCount: 12,
    colors: ['#795548', '#4E342E', '#FFD700', '#FFFFFF', '#1A1A1A'],
    pack: 'tiere-v1',
  },
  {
    filename: 'tiere-05-bear.svg',
    difficulty: 3,
    displayName: 'Bär',
    displayNameEn: 'Bear',
    strokeCount: 11,
    colors: ['#795548', '#4E342E', '#A1887F', '#1A1A1A'],
    pack: 'tiere-v1',
  },
  {
    filename: 'tiere-06-penguin.svg',
    difficulty: 3,
    displayName: 'Pinguin',
    displayNameEn: 'Penguin',
    strokeCount: 12,
    colors: ['#212121', '#FFFFFF', '#FF9800', '#E65100'],
    pack: 'tiere-v1',
  },
  {
    filename: 'tiere-07-snail.svg',
    difficulty: 3,
    displayName: 'Schnecke',
    displayNameEn: 'Snail',
    strokeCount: 11,
    colors: ['#66BB6A', '#388E3C', '#FF8A65', '#BF360C', '#1A1A1A'],
    pack: 'tiere-v1',
  },
  {
    filename: 'tiere-08-horse.svg',
    difficulty: 4,
    displayName: 'Pferd',
    displayNameEn: 'Horse',
    strokeCount: 14,
    colors: ['#C8A47E', '#8B6914', '#7A5230', '#1A1A1A', '#FFFFFF'],
    pack: 'tiere-v1',
  },
  {
    filename: 'tiere-09-elephant.svg',
    difficulty: 4,
    displayName: 'Elefant',
    displayNameEn: 'Elephant',
    strokeCount: 14,
    colors: ['#9E9E9E', '#616161', '#FFCDD2', '#FAFAFA', '#1A1A1A'],
    pack: 'tiere-v1',
  },
  {
    filename: 'tiere-10-fox.svg',
    difficulty: 4,
    displayName: 'Fuchs',
    displayNameEn: 'Fox',
    strokeCount: 13,
    colors: ['#FF6F00', '#E65100', '#FFECB3', '#1A1A1A', '#FFFFFF'],
    pack: 'tiere-v1',
  },

  // Schwierig (Schwierigkeit 5)
  {
    filename: 'level-09-fish.svg',
    difficulty: 5,
    displayName: 'Fisch',
    displayNameEn: 'Fish',
    strokeCount: 25,
    colors: ['#000000', '#FFA500', '#E74C3C', '#FFFFFF'],
  },
  {
    filename: 'level-10-butterfly.svg',
    difficulty: 5,
    displayName: 'Schmetterling',
    displayNameEn: 'Butterfly',
    strokeCount: 35,
    colors: ['#000000', '#9B59B6', '#FF69B4', '#FFD700', '#FFFFFF'],
  },
  {
    filename: 'level-05-01-lion.svg',
    difficulty: 5,
    displayName: 'Löwe',
    displayNameEn: 'Lion',
    strokeCount: 40,
    colors: ['#FFA500', '#CD853F', '#000000', '#8B6914', '#F4A460'],
  },
  {
    filename: 'level-05-02-landscape.svg',
    difficulty: 5,
    displayName: 'Landschaft',
    displayNameEn: 'Landscape',
    strokeCount: 50,
    colors: [
      '#87CEEB',
      '#90EE90',
      '#8B7355',
      '#A0826D',
      '#FFD700',
      '#FFA500',
      '#27AE60',
      '#FFFFFF',
      '#3498DB',
    ],
  },
  {
    filename: 'level-05-03-castle.svg',
    difficulty: 5,
    displayName: 'Burg',
    displayNameEn: 'Castle',
    strokeCount: 45,
    colors: ['#D3D3D3', '#A9A9A9', '#8B4513', '#654321', '#87CEEB', '#FFD700', '#FF1493'],
  },
];

/**
 * Speichert die zuletzt gezeigten Bilder (max. 3)
 * um direkte Wiederholungen zu vermeiden
 */
let lastShownImages: string[] = [];

/**
 * Wählt ein zufälliges Bild für ein Level aus
 * @param levelNumber Level-Nummer (1-10)
 * @param pack Optionale Themen-Pack-Einschränkung (z.B. 'tiere-v1'). 'all' oder undefined = kein Filter.
 * @returns Zufälliges Bild aus dem passenden Schwierigkeitspool
 */
export function getRandomImageForLevel(levelNumber: number, pack?: string): LevelImage {
  const targetDifficulty = getDifficultyForLevel(levelNumber);
  const matchesDifficulty = (img: LevelImage) =>
    img.difficulty === targetDifficulty && (!img.minLevel || img.minLevel <= levelNumber);
  const matchesPack = (img: LevelImage) => !pack || pack === 'all' || img.pack === pack;
  const isEligible = (img: LevelImage) => matchesDifficulty(img) && matchesPack(img);

  // Filtere Bilder nach Schwierigkeit, Pack, minLevel-Guard UND nicht kürzlich gezeigt
  let availableImages = imagePool.filter(
    img => isEligible(img) && !lastShownImages.includes(img.filename),
  );

  // Falls alle eligible Bilder kürzlich gezeigt wurden, reset
  if (availableImages.length === 0) {
    lastShownImages = [];
    availableImages = imagePool.filter(isEligible);
  }

  // Falls das gewählte Pack für diese Schwierigkeit keine Bilder hat, Pack-Filter ignorieren
  if (availableImages.length === 0) {
    availableImages = imagePool.filter(matchesDifficulty);
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
 * Wählt ein deterministisches Bild für ein Level anhand eines numerischen Seeds.
 * Wird für die Daily Challenge verwendet, damit das Bild des Tages konstant bleibt.
 * @param levelNumber Level-Nummer
 * @param seed Numerischer Seed (z. B. YYYYMMDD)
 * @param pack Optionale Themen-Pack-Einschränkung (z.B. 'tiere-v1'). 'all' oder undefined = kein Filter.
 */
export function getSeededImageForLevel(
  levelNumber: number,
  seed: number,
  pack?: string,
): LevelImage {
  const targetDifficulty = getDifficultyForLevel(levelNumber);
  const matchesDifficulty = (img: LevelImage) =>
    img.difficulty === targetDifficulty && (!img.minLevel || img.minLevel <= levelNumber);
  const matchesPack = (img: LevelImage) => !pack || pack === 'all' || img.pack === pack;

  let available = imagePool.filter(img => matchesDifficulty(img) && matchesPack(img));
  // Falls das gewählte Pack für diese Schwierigkeit keine Bilder hat, Pack-Filter ignorieren
  if (available.length === 0) {
    available = imagePool.filter(matchesDifficulty);
  }
  if (available.length === 0) return getRandomImageForLevel(levelNumber, pack);
  if (!Number.isFinite(seed)) return getRandomImageForLevel(levelNumber, pack);
  const index = Math.abs(Math.floor(seed)) % available.length;
  return available[index];
}

/**
 * Gibt alle im Bilderpool vorkommenden Themen-Pack-IDs zurück (z.B. ['fahrzeuge-v1', 'tiere-v1'])
 */
export function getAvailablePacks(): string[] {
  const packs = new Set<string>();
  imagePool.forEach(img => {
    if (img.pack) packs.add(img.pack);
  });
  return Array.from(packs).sort();
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
