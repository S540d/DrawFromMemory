# Bilderpool - Merke und Male

## 🎯 Konzept

Die App wählt **zufällig** aus einem Pool von Bildern basierend auf dem Schwierigkeitsgrad. So bleibt das Spiel abwechslungsreich und Kinder können nicht einfach auswendig lernen, welches Bild in welchem Level kommt.

> **📝 Hinweis:** Einen detaillierten Plan zur Erweiterung des Bilderpools finden Sie in [ICON_GENERATION_PLAN.md](../../../ICON_GENERATION_PLAN.md) (Issue #5).

---

## 📊 Bilderpool nach Schwierigkeitsgrad

### 🟢 Einfach (Schwierigkeit 1-2)

**Anzahl Striche:** 8-15
**Display Zeit:** 10-9 Sekunden
**Verwendung:** Level 1-4

| Dateiname | Bild | Striche | Status |
|-----------|------|---------|--------|
| level-01-sun.svg | ☀️ Sonne | ~12 | ✅ |
| level-02-face.svg | 😊 Gesicht | ~10 | ✅ |
| level-03-cloud.svg | ☁️ Wolke | ~8 | ✅ |
| extra-01-stick-figure.svg | 🧍 Strichmännchen | ~6 | ✅ |

**Pool-Größe:** 4 Bilder

---

### 🟡 Mittel (Schwierigkeit 3-4)

**Anzahl Striche:** 15-25
**Display Zeit:** 8-6 Sekunden
**Verwendung:** Level 5-8

| Dateiname | Bild | Striche | Status |
|-----------|------|---------|--------|
| level-04-house.svg | 🏠 Haus | ~15 | ✅ |
| level-05-tree.svg | 🌳 Baum | ~12 | ✅ |
| level-06-dog.svg | 🐕 Hund | ~22 | ✅ |
| level-07-cat.svg | 🐱 Katze | ~20 | ✅ |
| level-08-sheep.svg | 🐑 Schaf | ~18 | ✅ |
| extra-02-car.svg | 🚗 Auto | ~18 | ✅ |
| extra-03-flower.svg | 🌸 Blume | ~20 | ✅ |
| extra-04-bird.svg | 🐦 Vogel | ~18 | ✅ |

**Pool-Größe:** 8 Bilder

---

### 🔴 Schwierig (Schwierigkeit 5)

**Anzahl Striche:** 25-35+
**Display Zeit:** 5-3 Sekunden
**Verwendung:** Level 9-10

| Dateiname | Bild | Striche | Status |
|-----------|------|---------|--------|
| level-09-fish.svg | 🐟 Fisch | ~25 | ✅ |
| level-10-butterfly.svg | 🦋 Schmetterling | ~35 | ✅ |

**Pool-Größe:** 2 Bilder

---

### 🟣 Perspektivisch (Schwierigkeit 6+) - **GEPLANT**

**Anzahl Striche:** 40+
**Display Zeit:** 3 Sekunden
**Verwendung:** Level 11+

**Geplante Icons:**
- Würfel in 3D
- Haus in Perspektive
- Straße mit Fluchtpunkt
- Treppe
- Stadtszene
- Tunnel

**Pool-Größe:** 0 Bilder (geplant: 9+)

> Details siehe [ICON_GENERATION_PLAN.md](../../../ICON_GENERATION_PLAN.md)

---

## 🎲 Zufalls-Logik

### Implementierung

```typescript
interface LevelImage {
  filename: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  displayName: string;
  strokeCount: number;
}

const imagePool: LevelImage[] = [
  // Einfach (1-2)
  { filename: 'level-01-sun.svg', difficulty: 1, displayName: 'Sonne', strokeCount: 12 },
  { filename: 'level-02-face.svg', difficulty: 1, displayName: 'Gesicht', strokeCount: 10 },
  { filename: 'level-03-cloud.svg', difficulty: 2, displayName: 'Wolke', strokeCount: 8 },
  { filename: 'extra-01-stick-figure.svg', difficulty: 1, displayName: 'Strichmännchen', strokeCount: 6 },

  // Mittel (3-4)
  { filename: 'level-04-house.svg', difficulty: 3, displayName: 'Haus', strokeCount: 15 },
  { filename: 'level-05-tree.svg', difficulty: 3, displayName: 'Baum', strokeCount: 12 },
  { filename: 'level-06-dog.svg', difficulty: 4, displayName: 'Hund', strokeCount: 22 },
  { filename: 'level-07-cat.svg', difficulty: 4, displayName: 'Katze', strokeCount: 20 },
  { filename: 'level-08-sheep.svg', difficulty: 4, displayName: 'Schaf', strokeCount: 18 },
  { filename: 'extra-02-car.svg', difficulty: 3, displayName: 'Auto', strokeCount: 18 },
  { filename: 'extra-03-flower.svg', difficulty: 4, displayName: 'Blume', strokeCount: 20 },
  { filename: 'extra-04-bird.svg', difficulty: 4, displayName: 'Vogel', strokeCount: 18 },

  // Schwierig (5)
  { filename: 'level-09-fish.svg', difficulty: 5, displayName: 'Fisch', strokeCount: 25 },
  { filename: 'level-10-butterfly.svg', difficulty: 5, displayName: 'Schmetterling', strokeCount: 35 },
];

// Funktion zum Abrufen eines zufälligen Bildes für ein Level
function getRandomImageForLevel(levelNumber: number): LevelImage {
  // Schwierigkeit basierend auf Level-Nummer
  let targetDifficulty: number;

  if (levelNumber <= 2) {
    targetDifficulty = 1;
  } else if (levelNumber <= 4) {
    targetDifficulty = 2;
  } else if (levelNumber <= 6) {
    targetDifficulty = 3;
  } else if (levelNumber <= 8) {
    targetDifficulty = 4;
  } else {
    targetDifficulty = 5;
  }

  // Filtere Bilder nach Schwierigkeit
  const availableImages = imagePool.filter(img => img.difficulty === targetDifficulty);

  // Wähle zufällig
  const randomIndex = Math.floor(Math.random() * availableImages.length);

  return availableImages[randomIndex];
}

// Verhindere Wiederholungen (optional)
let lastShownImages: string[] = [];

function getRandomImageForLevelNoDuplicates(levelNumber: number): LevelImage {
  const targetDifficulty = /* ... wie oben ... */;

  // Filtere Bilder nach Schwierigkeit UND nicht kürzlich gezeigt
  let availableImages = imagePool.filter(img =>
    img.difficulty === targetDifficulty &&
    !lastShownImages.includes(img.filename)
  );

  // Falls alle Bilder gezeigt wurden, reset
  if (availableImages.length === 0) {
    lastShownImages = [];
    availableImages = imagePool.filter(img => img.difficulty === targetDifficulty);
  }

  const randomIndex = Math.floor(Math.random() * availableImages.length);
  const selectedImage = availableImages[randomIndex];

  // Merke letztes Bild
  lastShownImages.push(selectedImage.filename);
  if (lastShownImages.length > 3) {
    lastShownImages.shift(); // Behalte nur die letzten 3
  }

  return selectedImage;
}
```

---

## 📈 Erweiterbarkeit

### Neue Bilder hinzufügen

1. **SVG-Datei erstellen** (z.B. `extra-05-rocket.svg`)
2. **In assets/images/levels/** speichern
3. **In BILDERPOOL.md dokumentieren**
4. **In imagePool Array eintragen** (siehe oben)
5. **Schwierigkeit zuweisen** (1-5)

### Beispiel - Rakete hinzufügen

```typescript
{
  filename: 'extra-05-rocket.svg',
  difficulty: 3,
  displayName: 'Rakete',
  strokeCount: 16
}
```

---

## 🎯 Vorteile des Bilderpools

✅ **Abwechslung:** Jedes Spiel ist anders
✅ **Wiederholbarkeit:** Man kann Levels spielen, ohne das gleiche Bild zu sehen
✅ **Lerneffekt:** Kinder lernen nicht nur ein Bild auswendig, sondern trainieren echtes Gedächtnis
✅ **Skalierbar:** Einfach neue Bilder hinzufügen
✅ **Schwierigkeitsanpassung:** Automatisch passende Bilder für jedes Level

---

## 📊 Aktuelle Pool-Statistik

- **Gesamt:** 14 Bilder
- **Einfach (1-2):** 4 Bilder
- **Mittel (3-4):** 8 Bilder
- **Schwierig (5):** 2 Bilder

### Empfohlene Erweiterungen für Phase 2

**Einfach (1-2):** +6 Bilder → 10 gesamt
- Kreis, Quadrat, Dreieck, Herz, Stern, Blitz

**Mittel (3-4):** +4 Bilder → 12 gesamt
- Eule, Frosch, Pilz, Regenbogen

**Schwierig (5):** +8 Bilder → 10 gesamt
- Roboter, Drache, Schloss, Einhorn, Dinosaurier, Pirat, Fee, Rennauto

**Ziel Phase 2:** 32 Bilder gesamt

---

## 📊 Aktuelle Pool-Statistik

- **Gesamt:** 14 Bilder (Ziel: 28+ Bilder)
- **Einfach (1-2):** 4 Bilder (Ziel: 10+ Bilder)
- **Mittel (3-4):** 8 Bilder (Ziel: 12+ Bilder)
- **Schwierig (5):** 2 Bilder (Ziel: 10+ Bilder)
- **Perspektivisch (6+):** 0 Bilder (Ziel: 9+ Bilder)

### 🎯 Erweiterungsplan (Issue #5)

Detaillierte Informationen zur Erweiterung des Bilderpools finden Sie in:
- **[ICON_GENERATION_PLAN.md](../../../ICON_GENERATION_PLAN.md)** - Vollständiger Plan mit Prompts und Workflow
- **Phase 1:** +19 Icons für Difficulty 1-5
- **Phase 2:** +9 Icons für Difficulty 6+ (perspektivische Zeichnungen)

---

**Erstellt:** 2025-12-05  
**Zuletzt aktualisiert:** 2026-01-02  
**Status:** 14 Bilder im Pool, Erweiterung geplant (siehe ICON_GENERATION_PLAN.md)
