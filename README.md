# Merke und Male

> Eine Gedächtnistraining-App für Kinder - Bild merken, zeichnen, vergleichen!

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://s540d.github.io/DrawFromMemory/)
[![Status](https://img.shields.io/badge/Status-MVP%2095%25-green)](https://github.com/S540d/DrawFromMemory)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**🌐 Live Demo:** [https://s540d.github.io/DrawFromMemory/](https://s540d.github.io/DrawFromMemory/)

**📊 Quick Status:** [QUICK_STATUS.md](QUICK_STATUS.md) | **📋 Vollständiger Status:** [STATUS.md](STATUS.md) | **✅ Abgeschlossene Issues:** [ABGESCHLOSSENE_ISSUES.md](ABGESCHLOSSENE_ISSUES.md)

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
- 🎨 **Einfache Zeichen-Tools** (Pinsel, Farben, Radiergummi)
- 💾 **Fortschritt speichern** (AsyncStorage)
- 🌓 **Dark Mode** Support
- 🌍 **Mehrsprachig** (Deutsch, English)
- 📱 **Cross-Platform** (Web, Android, iOS via React Native/Expo)
- 🎮 **Kein Internet erforderlich** (alle Bilder im Bundle)
- 🚀 **100% kostenlos** - Keine Werbung, keine In-App-Käufe

---

## 🚀 Roadmap

**Aktueller Stand:** MVP zu 95% fertig - [Detaillierter Status →](STATUS.md)

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
- 🔴 Settings Screen (geplant für Phase 2)
- 🔴 Dark Mode (geplant für Phase 2)

**Nächste Schritte:**
1. Settings-Menü (Theme, Sprache, Zeichenzeit)
2. Dark Mode Support
3. Sound-Effekte (optional)

### Phase 2: Erweiterte Features
- 🔲 Weitere 10 Level (Schwierigkeitsgrad 4-5)
- 🔲 Icon-Erweiterung: +28 neue Icons (siehe [Icon-Plan](ICON_GENERATION_PLAN.md))
- 🔲 Perspektivische Zeichnungen (Level 11+)
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

## 🛠 Tech Stack

- **Framework:** React Native (Expo 52) mit expo-router
- **Language:** TypeScript
- **Zeichnen:** @shopify/react-native-skia
- **Storage:** @react-native-async-storage/async-storage
- **i18n:** Custom Implementation (DE/EN)
- **Deployment:** GitHub Pages + GitHub Actions
- **Cross-Platform:** Web, Android, iOS

---

## 📂 Projektstruktur

```
DrawFromMemory/
├── app/                         # Expo Router (File-based Routing)
│   ├── index.tsx                # Home Screen
│   ├── game/[id].tsx            # Game Screen (Dynamic Route)
│   └── _layout.tsx              # Root Layout
│
├── components/
│   ├── DrawingCanvas.tsx        # Skia Canvas Component
│   └── StarRating.tsx           # Interaktive Sterne-Bewertung
│
├── assets/
│   ├── images/                  # Level-Bilder (SVG)
│   │   └── level-*.svg          # 10 Level + 4 Extra-Bilder
│   ├── icons/                   # App Icons
│   └── splash.png               # Splash Screen
│
├── services/
│   ├── i18n.ts                  # Internationalisierung (DE/EN)
│   └── storage.ts               # AsyncStorage Helper
│
├── constants/
│   └── levels.ts                # Level-Definitionen & Konfiguration
│
├── types/
│   └── index.ts                 # TypeScript Typen
│
├── docs/                        # Dokumentation
│   ├── ICON_GENERATION_PLAN.md  # Icon-Erweiterungsplan (Issue #5)
│   └── PROMPT_TEMPLATES.md      # AI-Prompts für Icon-Generierung
│
├── .github/
│   └── workflows/
│       ├── ci-cd.yml            # Quality Checks
│       └── deploy.yml           # GitHub Pages Deployment
│
└── scripts/
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

**Aktuell:** MVP-Phase - 95% fertig, bereit für Testing

**Was funktioniert bereits:**
- ✅ 10 Level-Bilder (SVG) + 4 Extra-Bilder
- ✅ Home Screen mit Level-Auswahl
- ✅ Memorize-Phase (Bild anzeigen mit 5-Sekunden-Timer)
- ✅ Drawing-Phase (Skia Canvas mit Zeichnen, Löschen, Undo)
- ✅ Result-Phase (Side-by-Side Vergleich + Interaktive Sterne-Bewertung + Dynamisches Feedback)
- ✅ Level-System mit progressiver Schwierigkeit
- ✅ Progress-Speicherung (AsyncStorage - abgeschlossene Level)
- ✅ Internationalisierung (DE/EN)
- ✅ Level-Navigation (← Zurück / Weiter →)
- ✅ GitHub Pages Deployment (testbar auf Telefon)
- ✅ CI/CD Pipeline mit automatischen Quality Checks

**Geplant für Phase 2:**
- 🔲 Settings-Menü (Theme, Sprache, Zeichenzeit)
- 🔲 Dark Mode
- 🔲 Sound-Effekte
- 🔲 Weitere Level (perspektivische Bilder)

👉 **[Live Demo testen](https://s540d.github.io/DrawFromMemory/)** | **[Detaillierter Status](STATUS.md)**

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
