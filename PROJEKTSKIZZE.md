# Draw From Memory - Projektskizze

## 📱 App-Konzept

**Name:** Draw From Memory (Arbeitstitel)
**Zielgruppe:** Kinder ab 4 Jahren, Erwachsene für Gedächtnistraining
**Plattformen:** Web (PWA), Android, iOS (via React Native / Expo)

### Kernidee

Eine Gedächtnistraining-App, bei der Benutzer ein Bild kurzzeitig sehen, es sich einprägen und dann aus dem Gedächtnis nachzeichnen. Anschließend werden das Original und die Zeichnung übereinander gelegt zur Bewertung.

---

## 🎯 Hauptfunktionen

### 1. Bildanzeige-Phase
- Bild wird für konfigurierbare Dauer angezeigt (z.B. 3-10 Sekunden)
- Countdown-Timer zeigt verbleibende Zeit
- Optional: Bild verblasst langsam (Fade-out Animation)
- Benutzer kann "Bereit"-Button drücken, um früher zu starten

### 2. Zeichen-Phase
- Leere Canvas zum Zeichnen
- Werkzeuge:
  - Pinselgröße (3-4 Optionen: dünn, mittel, dick)
  - Farben (5-8 Grundfarben)
  - Radiergummi
  - Alles löschen (mit Bestätigung)
- Undo/Redo Funktionalität
- Zeit-Limit optional (z.B. 60 Sekunden)

### 3. Vergleichs-Phase
- Original und Zeichnung werden übereinander gelegt
- Slider zum Anpassen der Transparenz (0-100%)
- Bewertungsoptionen:
  - Selbstbewertung: 1-5 Sterne
  - Automatische Ähnlichkeitserkennung (optional, später)
- Speichern der Zeichnung möglich
- Teilen-Funktion (Share API)

### 4. Schwierigkeitsstufen

**Level 1-3: Einfach**
- Geometrische Grundformen (Kreis, Quadrat, Dreieck)
- Sonne mit Strahlen
- Strichmännchen
- Einfacher Baum
- Haus mit Dach

**Level 4-6: Mittel**
- Kombination mehrerer Formen
- Einfache Tiere (Katze, Hund, Vogel)
- Fahrzeuge (Auto, Schiff)
- Blumen mit mehreren Elementen
- Gesichter mit Emotionen

**Level 7-10: Schwierig**
- Komplexe Szenen
- Detaillierte Tiere
- Architektur
- Abstrakte Muster
- Perspektivische Darstellungen

**Level 11+: Sehr schwierig**
- Komplexe Szenen mit vielen Elementen
- Detaillierte Portraits
- Komplexe geometrische Muster
- Kunstwerke (vereinfacht)

---

## 🎨 Design-System (nach project-templates Vorgaben)

### Farbpalette

```css
/* Primary Color */
--color-primary: #667eea;        /* Lila/Blau - Kreativität */
--color-primary-light: #8599f3;
--color-primary-dark: #4c63d2;

/* Secondary Color */
--color-secondary: #f093fb;      /* Rosa - Spielerisch */
--color-secondary-light: #f5b3fc;
--color-secondary-dark: #e673f9;

/* Neutral */
--color-bg-primary: #ffffff;
--color-bg-secondary: #f9fafb;
--color-text-primary: #111827;
--color-text-secondary: #6b7280;

/* Status Colors */
--color-success: #10b981;
--color-warning: #f59e0b;
--color-danger: #ef4444;
--color-info: #3b82f6;
```

### Typography

```css
--font-family: system-ui, -apple-system, sans-serif;
--font-base: 1rem;      /* 16px */
--font-lg: 1.125rem;    /* 18px */
--font-xl: 1.25rem;     /* 20px */
--font-2xl: 1.5rem;     /* 24px */
--font-3xl: 1.875rem;   /* 30px */
```

### Spacing (8px Grid)

```css
--space-2: 0.5rem;   /* 8px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
```

---

## 📱 Screens & Navigation

### 1. Home Screen
- App-Logo und Titel
- "Play"-Button (Hauptaktion)
- Aktuelle Level-Anzeige
- Statistik-Übersicht (Anzahl abgeschlossene Level, Durchschnittsbewertung)
- Settings-Button (⋮) oben rechts

### 2. Level-Auswahl Screen
- Scrollbare Liste aller Level
- Visual Preview (Miniatur des Bildes, verschwommen)
- Schwierigkeitsgrad-Badge
- Abgeschlossen-Status (✓ mit Sternen)
- Gesperrt/Freigespielt-Status

### 3. Game Screen (3 Phasen)
- **Phase 1:** Bild anzeigen + Timer
- **Phase 2:** Canvas zum Zeichnen
- **Phase 3:** Vergleich + Bewertung

### 4. Gallery Screen
- Übersicht aller gespeicherten Zeichnungen
- Grid-Layout mit Thumbnails
- Filter: Nach Level, Datum, Bewertung
- Teilen-Funktion

### 5. Settings Screen (nach UX-Vorgaben)

**Struktur:**
```
APPEARANCE
  [Light] [Dark] [System]    <- Theme Toggle

LANGUAGE
  [Deutsch] [English]        <- Language Toggle

GAME SETTINGS
  Anzeigedauer: [3s] [5s] [10s]
  Zeichen-Limit: [30s] [60s] [Unbegrenzt]
  Hinweis-Level: [Ein] [Aus]

DATA
  Alle Zeichnungen löschen
  Fortschritt zurücksetzen

FEEDBACK UND SUPPORT
  Send Feedback (mailto:feedback@example.com)
  support me (https://ko-fi.com/devsven)
  Share this App                           <- NEU!

ABOUT
  Version X.Y.Z
  Datenquelle: Eigene Illustrationen
  Lizenz: Open Source • MIT

```

---

## 🧑‍💻 Technische Architektur

### Framework & Tools
- **Framework:** React Native (Expo)
- **Zeichnen:** react-native-canvas oder react-native-svg
- **Storage:** AsyncStorage (Fortschritt, Einstellungen)
- **i18n:** Eigene Implementierung (DE/EN)
- **Analytics:** Plausible (DSGVO-konform, optional)

### Projektstruktur

```
DrawFromMemory/
├── App.tsx                      # Haupt-App-Komponente
├── app.json                     # Expo Konfiguration
├── package.json
├── tsconfig.json
│
├── components/
│   ├── Canvas.tsx               # Zeichen-Canvas
│   ├── ImageDisplay.tsx         # Bild-Anzeige mit Timer
│   ├── ComparisonView.tsx       # Overlay-Vergleich
│   ├── ToolBar.tsx              # Zeichen-Werkzeuge
│   ├── LevelCard.tsx            # Level-Auswahl Card
│   └── SettingsMenu.tsx         # Einstellungen
│
├── screens/
│   ├── HomeScreen.tsx
│   ├── LevelSelectionScreen.tsx
│   ├── GameScreen.tsx
│   ├── GalleryScreen.tsx
│   └── SettingsScreen.tsx
│
├── assets/
│   ├── images/
│   │   ├── level-01-sun.svg
│   │   ├── level-02-stick-figure.svg
│   │   └── ...
│   ├── icons/
│   └── fonts/
│
├── utils/
│   ├── storage.ts               # AsyncStorage Helper
│   ├── levelData.ts             # Level-Definitionen
│   ├── translations.ts          # i18n
│   └── constants.ts             # Farben, Spacing, etc.
│
├── types/
│   └── index.ts                 # TypeScript Typen
│
├── public/                      # Web-Assets (PWA)
│   ├── index.html
│   ├── manifest.json
│   ├── icons/
│   └── .well-known/
│       └── assetlinks.json      # Android App Links
│
├── scripts/
│   └── post-build.js            # Build-Prozess (Copy .well-known)
│
└── docs/
    ├── PROJEKTSKIZZE.md         # Diese Datei
    ├── FRAGEN.md                # Offene Fragen
    ├── ARCHITECTURE.md
    └── PRIVACY_POLICY.md
```

---

## 🔐 Android-Spezifische Vorgaben

### Edge-to-Edge (Android 15+)
- ✅ Material Components >= 1.13.0
- ✅ compileSdk = 36, targetSdk = 36
- ✅ WindowCompat.setDecorFitsSystemWindows(window, false)
- ✅ Transparente Status/Navigation Bar
- ✅ Theme.Material3.DayNight.NoActionBar

### OTA Updates (Expo)
**KRITISCH: Von Anfang an konfigurieren!**

```json
{
  "expo": {
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/PROJECT-ID"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "extra": {
      "eas": {
        "projectId": "PROJECT-ID"
      }
    }
  }
}
```

### Android App Links
- ✅ Digital Asset Links (.well-known/assetlinks.json)
- ✅ Intent-Filter in app.json
- ✅ .nojekyll für GitHub Pages
- ✅ SHA-256 Fingerprint aus Play Console

---

## 📊 Datenmodell

### Level-Daten

```typescript
interface Level {
  id: number;
  title: string;                  // z.B. "Sonne", "Strichmännchen"
  difficulty: 1 | 2 | 3 | 4 | 5;  // 1 = einfach, 5 = sehr schwierig
  imagePath: string;              // z.B. "assets/images/level-01-sun.svg"
  displayDuration: number;        // in Sekunden (Standard: 5)
  drawingTimeLimitSeconds?: number; // optional
  unlocked: boolean;              // Freigeschaltet?
  completed: boolean;             // Abgeschlossen?
  bestRating?: number;            // 1-5 Sterne
}
```

### User Progress

```typescript
interface UserProgress {
  currentLevel: number;
  completedLevels: number[];
  totalStars: number;
  drawings: SavedDrawing[];
  settings: UserSettings;
}

interface SavedDrawing {
  id: string;
  levelId: number;
  timestamp: number;
  imageDataUrl: string;          // Base64 encoded PNG
  rating: number;                // 1-5
}

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'de' | 'en';
  defaultDisplayDuration: number;
  defaultDrawingTimeLimit: number | null;
  soundEnabled: boolean;
}
```

---

## 🎮 Spielmechanik & Progression

### Freischalten von Levels
- **Linear:** Level 1 → 2 → 3 → ... (klassisch)
- **Alternative:** Erreiche 3+ Sterne in Level X, um Level X+2 freizuschalten

### Belohnungen & Motivation
- ⭐ Sterne-System (1-5 Sterne pro Level)
- 🏆 Achievements (optional):
  - "Perfektionist" - 5 Sterne in allen Levels
  - "Schnellzeichner" - Alle Levels unter Zeit-Limit
  - "Gedächtnis-Meister" - 10 Levels in Folge mit 4+ Sternen
- 📈 Statistiken:
  - Durchschnittliche Bewertung
  - Gesamtanzahl Zeichnungen
  - Lieblings-Level (am meisten gespielt)

---

## 🌍 Internationalisierung (i18n)

### Unterstützte Sprachen (MVP)
- 🇩🇪 Deutsch
- 🇬🇧 English

### Translations-Struktur

```typescript
const translations = {
  en: {
    appName: 'Draw From Memory',
    home: {
      playButton: 'Play',
      currentLevel: 'Current Level',
      statistics: 'Statistics',
    },
    game: {
      memorizePhase: 'Memorize this image!',
      drawingPhase: 'Draw what you remember!',
      comparisonPhase: 'How did you do?',
      timeRemaining: 'Time remaining',
      rateYourDrawing: 'Rate your drawing',
    },
    settings: {
      title: 'Settings',
      appearance: 'APPEARANCE',
      language: 'LANGUAGE',
      gameSettings: 'GAME SETTINGS',
      displayDuration: 'Display Duration',
      drawingTimeLimit: 'Drawing Time Limit',
      unlimited: 'Unlimited',
      shareApp: 'Share this App',
    },
  },
  de: {
    appName: 'Gedächtnis-Zeichnen',
    home: {
      playButton: 'Spielen',
      currentLevel: 'Aktuelles Level',
      statistics: 'Statistiken',
    },
    game: {
      memorizePhase: 'Merke dir dieses Bild!',
      drawingPhase: 'Zeichne, was du dir gemerkt hast!',
      comparisonPhase: 'Wie hast du dich geschlagen?',
      timeRemaining: 'Verbleibende Zeit',
      rateYourDrawing: 'Bewerte deine Zeichnung',
    },
    settings: {
      title: 'Einstellungen',
      appearance: 'ERSCHEINUNGSBILD',
      language: 'SPRACHE',
      gameSettings: 'SPIEL-EINSTELLUNGEN',
      displayDuration: 'Anzeigedauer',
      drawingTimeLimit: 'Zeichen-Zeitlimit',
      unlimited: 'Unbegrenzt',
      shareApp: 'App teilen',
    },
  },
};
```

---

## 🚀 MVP (Minimum Viable Product)

### Phase 1: Core Features (MVP) - **50% FERTIG**
- ✅ 10 Level (Schwierigkeitsgrad 1-5) + 4 Extra-Bilder
- ✅ Bildanzeige mit Timer (Memorize-Phase vollständig)
- ✅ Einfacher Canvas zum Zeichnen (DrawingCanvas.tsx mit react-native-skia)
- 🔴 Vergleich mit Slider (noch nicht implementiert)
- 🔴 Selbstbewertung (1-5 Sterne) (RatingManager vorhanden, UI fehlt)
- 🔴 Fortschritt speichern (AsyncStorage) (noch nicht implementiert)
- 🔴 Light/Dark Mode (noch nicht implementiert)
- ✅ i18n (DE/EN) (Service vorhanden)
- 🔴 Settings-Menü (nur Platzhalter)

### Phase 2: Erweiterte Features
- 🔲 Weitere 10 Level (Schwierigkeitsgrad 4-5)
- 🔲 Galerie zum Speichern von Zeichnungen
- 🔲 Share-Funktion
- 🔲 Sound-Effekte
- 🔲 Achievements

### Phase 3: Advanced Features
- 🔲 Automatische Ähnlichkeitserkennung (ML)
- 🔲 Multiplayer (2 Spieler zeichnen das gleiche Bild)
- 🔲 Eigene Bilder hochladen
- 🔲 Community-Level

---

## 🎨 Design-Referenzen

### Inspiration
- **Quick, Draw!** (Google) - Einfaches Zeichen-Interface
- **Duolingo** - Gamification, Level-System
- **Peak** (Gedächtnistraining) - Moderne UI, Motivationssystem
- **Procreate Pocket** - Zeichen-Tools (vereinfacht)

### UI-Stil
- **Modern & Minimalistisch**
- **Farbenfrohe Akzente**
- **Große Touch-Targets (min. 44x44px)**
- **Klare Typografie**
- **Smooth Animations (200-300ms)**

---

## 📦 Deployment-Strategie

### GitHub Pages (Web/PWA)
```bash
npm run build
npm run deploy  # gh-pages -d dist -t --dotfiles
```

### Expo OTA Updates
```bash
eas update --branch production --message "Fix: ..."
```

### Play Store (Android)
```bash
eas build --platform android --profile production
```

### App Store (iOS) - Optional, später
```bash
eas build --platform ios --profile production
```

---

## 📝 Nächste Schritte

1. ✅ Projektskizze erstellen (diese Datei)
2. ✅ Fragenkatalog zusammenstellen (siehe FRAGEN.md)
3. ✅ GitHub Repository erstellen
4. ✅ Expo-Projekt initialisieren
5. ✅ Level-Bilder mit Kind zusammen erstellen (10 Level + 4 Extra)
6. 🟡 Prototyp entwickeln (MVP Phase 1) - **50% fertig** - siehe [STATUS.md](STATUS.md)
7. 🔴 Usability-Test mit Kind
8. 🔴 Iterieren basierend auf Feedback

---

**Erstellt:** 2025-12-05  
**Aktualisiert:** 2025-12-13  
**Team:** Claude (Entwicklung), Kind (Ideengeber), User (Moderator)  
**Status:** Entwicklungsphase (MVP 50%) - siehe [STATUS.md](STATUS.md) für Details
