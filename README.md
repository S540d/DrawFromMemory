# Merke und Male

> Eine Gedächtnistraining-App für Kinder - Bild merken, zeichnen, vergleichen!

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://s540d.github.io/DrawFromMemory/)
[![Status](https://img.shields.io/badge/Status-Play%20Store%20Ready-blue)](https://github.com/S540d/DrawFromMemory)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Android%20%7C%20iOS-lightgrey)](https://github.com/S540d/DrawFromMemory)

**🌐 Live Demo:** [https://s540d.github.io/DrawFromMemory/](https://s540d.github.io/DrawFromMemory/)

**📚 Dokumentation:**
- 🚀 [Play Store Deployment](docs/DEPLOYMENT_GUIDE.md) - Komplette Veröffentlichungs-Anleitung
- 🧪 [Testing Guide](docs/TESTING_README.md) - Entwickler Testing-Guide
- 📝 [Store Metadata](docs/PLAY_STORE_METADATA.md) - App Store Texte
- 🔒 [Privacy Policy](PRIVACY_POLICY.md) - Datenschutzerklärung

---

## 📱 Über die App

**Draw From Memory** (Arbeitstitel) ist eine spielerische Gedächtnistraining-App, bei der Benutzer ein Bild kurzzeitig sehen, es sich einprägen und dann aus dem Gedächtnis nachzeichnen müssen.

### Wie funktioniert's?

1. **Merken** - Schaue dir ein Bild für 5 Sekunden an
2. **Zeichnen** - Zeichne das Bild aus dem Gedächtnis nach
3. **Vergleichen** - Lege deine Zeichnung über das Original
4. **Bewerten** - Gib dir selbst 1-5 Sterne

---

## ✨ Features

- 🎯 **10+ Level** mit steigendem Schwierigkeitsgrad
- 🎨 **Einfache Zeichen-Tools** (Pinsel, Füllen, Farben, Strichstärken)
- 🔍 **Schrittweises Aufdecken** - SVG-Elemente erscheinen nacheinander
- 🎬 **Zeichnungs-Zeitraffer** - Strich-für-Strich Replay-Animation
- 🔊 **Sound-Effekte** - Timer-Tick, Phasenwechsel-Chime, Stern-Bewertung
- 📳 **Haptisches Feedback** - Vibration bei Interaktionen (Native)
- 🖼️ **Galerie** - Zeichnungen speichern und ansehen
- 💾 **Fortschritt speichern** (AsyncStorage)
- 🌓 **Dark Mode** Support
- 🌍 **Mehrsprachig** (Deutsch, English)
- 📱 **Cross-Platform** (Web, Android, iOS via React Native/Expo)
- 🎮 **Kein Internet erforderlich** (alle Bilder im Bundle)
- 🚀 **100% kostenlos** - Keine Werbung, keine In-App-Käufe

---

## 🚀 Roadmap & Release Status

**Aktueller Stand:** App Store Vorbereitung läuft - [Detaillierter Status →](STATUS.md) | [Play Store Issue #48 →](https://github.com/S540d/DrawFromMemory/issues/48)

### Phase 1: MVP (Minimum Viable Product) - **95% FERTIG**
- ✅ Konzept & Projektskizze
- ✅ Expo-Projekt Setup mit expo-router
- ✅ Home Screen (vollständig)
- ✅ Game Screen (vollständig)
  - ✅ Merken-Phase (Bild + Timer)
  - ✅ Zeichnen-Phase (Canvas mit allen Features: Zeichnen, Löschen, Undo)
  - ✅ Ergebnis-Phase (Side-by-Side Vergleich + Interaktive Sterne-Bewertung + Feedback)
- ✅ 10 Level + 4 Extra-Bilder (alle SVG vorhanden)
- ✅ Fortschritt speichern (AsyncStorage mit completedLevels)
- ✅ GitHub Pages Deployment (Web-Testing auf Telefon)
- ✅ i18n (DE/EN) Service vorhanden
- ✅ Settings Screen (Theme, Sprache, Sound)
- ✅ Dark Mode Support

**Nächste Schritte:**
1. Variabler Timer (Schwierigkeit beeinflusst Memorize-Zeit)
2. Farbauswahl-Popup Verbesserung (#32)
3. Weitere Level & Perspektivische Bilder

### Phase 2: Erweiterte Features
- ✅ Galerie zum Speichern von Zeichnungen
- ✅ Sound-Effekte (Web Audio API)
- ✅ Haptisches Feedback (Native)
- ✅ Schrittweises Aufdecken (Progressive Reveal)
- ✅ Zeichnungs-Zeitraffer (Replay-Animation)
- 🔲 Weitere 10 Level (Schwierigkeitsgrad 4-5)
- 🔲 Perspektivische Zeichnungen (Level 11+)
- 🔲 Farbauswahl-Popup Verbesserung
- 🔲 Variabler Timer (Schwierigkeitsgrad-abhängig)
- 🔲 Achievements

### Phase 3: Advanced Features
- 🔲 Automatische Ähnlichkeitserkennung (ML)
- 🔲 Multiplayer (2 Spieler zeichnen das gleiche Bild)
- 🔲 Eigene Bilder hochladen
- 🔲 Community-Level

---

## 🛠 Tech Stack

- **Framework:** React Native (Expo 54) mit expo-router
- **Language:** TypeScript
- **Zeichnen:** @shopify/react-native-skia (Native) + HTML5 Canvas (Web)
- **Sound:** Web Audio API (programmatisch, keine Assets nötig)
- **Haptik:** expo-haptics (Native)
- **Storage:** @react-native-async-storage/async-storage
- **i18n:** Custom Implementation (DE/EN)
- **Deployment:** GitHub Pages + GitHub Actions
- **Cross-Platform:** Web, Android, iOS

---

## 📂 Projektstruktur

```
DrawFromMemory/
├── app/                         # Expo Router (File-based Routing)
│   ├── _layout.tsx              # Root Layout
│   ├── index.tsx                # Home Screen
│   ├── game.tsx                 # Game Screen (3 Phasen)
│   ├── levels.tsx               # Level-Auswahl
│   ├── gallery.tsx              # Gespeicherte Zeichnungen
│   └── settings.tsx             # Einstellungen
│
├── components/
│   ├── DrawingCanvas.tsx        # Zeichenfläche (Skia Native / Canvas Web)
│   ├── LevelImageDisplay.tsx    # SVG-Bildanzeige mit progressivem Aufdecken
│   ├── SettingsModal.tsx        # Einstellungs-Dialog
│   └── ErrorBoundary.tsx        # Fehlerbehandlung
│
├── services/
│   ├── StorageManager.ts        # AsyncStorage + Web-Fallback
│   ├── SoundManager.ts          # Sound-Effekte (Web Audio API) + Haptik
│   ├── ImagePoolManager.ts      # Zufällige Bildauswahl pro Level
│   ├── LevelManager.ts          # Level-Konfiguration
│   ├── RatingManager.ts         # Bewertungs-Feedback
│   ├── ThemeContext.tsx          # Dark/Light Theme
│   └── i18n.ts                  # Internationalisierung (DE/EN)
│
├── constants/
│   ├── Colors.ts                # Farbpalette + Zeichen-Farben
│   └── Layout.ts                # Spacing, Fonts, Border Radius
│
├── locales/
│   ├── de/translations.json     # Deutsche Übersetzungen
│   └── en/translations.json     # Englische Übersetzungen
│
├── assets/
│   └── images/levels/           # Level-Bilder (SVG als TSX)
│
├── docs/                        # Dokumentation
│   ├── DEPLOYMENT_GUIDE.md      # App Store Deployment Guide
│   ├── PLAY_STORE_METADATA.md   # Store Listing Texte
│   ├── TESTING_README.md        # Testing Guide
│   └── archive/                 # Historische Docs
│
├── .github/
│   └── workflows/
│       ├── ci-cd.yml            # Quality Checks
│       └── deploy.yml           # GitHub Pages Deployment
│
└── scripts/
    ├── prepare-release.sh       # Play Store Release Validation
    ├── validate-release.sh      # Pre-deployment Checks
    └── update-cache-version.js  # Cache-Busting für Deployment
```

---

## 🎨 Design-System: "Soft & Modern"

**Design-Philosophie:** Warme, sanfte Ästhetik mit subtiler Tiefe und Eleganz - speziell für Kinder optimiert.

### Farbpalette

```css
/* Primary Colors - Gradient-ready */
--color-primary: #667eea;        /* Lila/Blau - Kreativität & Spielfreude */
--color-primary-light: #8599f3;
--color-primary-dark: #4c63d2;
--color-secondary: #f093fb;      /* Rosa - Spielerisch & Warm */
--color-accent: #A8E6CF;         /* Mint - Zusätzlicher Akzent */

/* UI Colors */
--color-background: #FAFAFA;     /* Cremeweiß (nicht pures Weiß) */
--color-surface: #F5F5F5;        /* Hellgrau - Karten/Container */
--color-text-primary: #2C3E50;   /* Dunkelgrau - Haupttext */
--color-text-secondary: #7F8C8D; /* Mittelgrau - Sekundärtext */
```

### Shadow System

```css
/* Soft & Modern Shadows */
--shadow-small: 0 2px 8px rgba(0,0,0,0.08);
--shadow-medium: 0 4px 16px rgba(0,0,0,0.12);
--shadow-large: 0 8px 24px rgba(0,0,0,0.18);
```

### Border Radius

```css
--radius-sm: 8px;   /* Weiche Ecken */
--radius-md: 10px;
--radius-lg: 16px;  /* Buttons */
--radius-xl: 20px;  /* Cards */
--radius-xxl: 24px; /* Große Container */
```

### Typography

- **Font Family:** system-ui, -apple-system, sans-serif
- **Base Size:** 16px
- **Scale:** 1.125 (Major Second)

---

## 🧒 Team

- **Claude** - Entwicklung (AI-gestützt)
- **Kind** - Ideengeber (Level-Design, Bilder, Feedback)
- **Sven** - Moderator & Produktmanager

---

## 📝 Entwicklungsphilosophie

Dieses Projekt folgt dem **"Mit Kindern, für Kinder"** Ansatz:

- **Kinderfreundlich:** Große Touch-Targets, einfache Navigation
- **Lehrreich:** Gedächtnistraining + Kreativitätsförderung
- **Spaß-orientiert:** Gamification, Belohnungen, positive Verstärkung
- **Sicher:** Keine Werbung, keine Datensammlung, 100% offline spielbar
- **Transparent:** Open Source, MIT Lizenz

---

## 🚧 Status

**Aktuell:** Play Store Vorbereitung - [Issue #48](https://github.com/S540d/DrawFromMemory/issues/48)

**Was funktioniert bereits:**
- ✅ 10 Level-Bilder (SVG) + 4 Extra-Bilder
- ✅ Home Screen mit Level-Auswahl
- ✅ Memorize-Phase (Bild anzeigen mit Timer + Schrittweises Aufdecken)
- ✅ Drawing-Phase (Skia/Canvas mit Pinsel, Füllen, Farben, Strichstärken, Undo)
- ✅ Result-Phase (Side-by-Side Vergleich + Sterne-Bewertung + Zeitraffer-Replay)
- ✅ Sound-Effekte (Web Audio API) + Haptisches Feedback (Native)
- ✅ Galerie zum Speichern und Ansehen von Zeichnungen
- ✅ Level-System mit progressiver Schwierigkeit
- ✅ Progress-Speicherung (AsyncStorage - abgeschlossene Level)
- ✅ Internationalisierung (DE/EN)
- ✅ Dark Mode Support
- ✅ Level-Navigation (← Zurück / Weiter →)
- ✅ GitHub Pages Deployment (testbar auf Telefon)
- ✅ CI/CD Pipeline mit automatischen Quality Checks

**Geplant für zukünftige Updates:**
- 🔲 Variabler Timer (Schwierigkeit-abhängig)
- 🔲 Farbauswahl-Popup Verbesserung
- 🔲 Weitere Level (perspektivische Bilder)
- 🔲 Achievements System

👉 **[Live Demo testen](https://s540d.github.io/DrawFromMemory/)** | **[Play Store Issue #48](https://github.com/S540d/DrawFromMemory/issues/48)** | **[Nächste Schritte #51](https://github.com/S540d/DrawFromMemory/issues/51)**

---

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE)

**Open Source • No Ads • Made with ❤️**

---

## 📞 Kontakt

- **Feedback:** [devsven@posteo.de](mailto:devsven@posteo.de)
- **GitHub Issues:** [Issues](https://github.com/S540d/DrawFromMemory/issues)
- **Live Demo:** [https://s540d.github.io/DrawFromMemory/](https://s540d.github.io/DrawFromMemory/)

## 🚀 Installation & Development

```bash
# Repository klonen
git clone https://github.com/S540d/DrawFromMemory.git
cd DrawFromMemory

# Dependencies installieren
npm install

# Development Server starten
npm start

# Web (im Browser)
npm run web

# Android (mit Expo Go)
npm run android

# iOS (mit Expo Go, nur macOS)
npm run ios

# Web Build für Produktion
npm run build:web
```

---

**Hinweis:** Diese App befindet sich in der MVP-Phase. Features und Design können sich noch ändern.
