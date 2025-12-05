# Draw From Memory

> Eine Gedächtnistraining-App für Kinder - Bild merken, zeichnen, vergleichen!

[![Status](https://img.shields.io/badge/Status-Konzept-yellow)](https://github.com/S540d/DrawFromMemory)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

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

### Phase 1: MVP (Minimum Viable Product)
- ✅ Konzept & Projektskizze
- 🔲 Expo-Projekt Setup
- 🔲 Home Screen
- 🔲 Game Screen (3 Phasen: Merken → Zeichnen → Vergleichen)
- 🔲 Settings Screen (nach UX-Vorgaben)
- 🔲 10 Level (Schwierigkeitsgrad 1-3)
- 🔲 Fortschritt speichern
- 🔲 Dark Mode
- 🔲 i18n (DE/EN)

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

## 🛠 Tech Stack

- **Framework:** React Native (Expo)
- **Language:** TypeScript
- **Zeichnen:** react-native-skia (geplant)
- **Storage:** AsyncStorage
- **i18n:** Custom Implementation
- **Analytics:** Plausible (DSGVO-konform, optional)

---

## 📂 Projektstruktur

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
│   ├── images/                  # Level-Bilder (SVG/PNG)
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
│   └── .well-known/
│       └── assetlinks.json      # Android App Links
│
└── docs/
    ├── PROJEKTSKIZZE.md         # Detaillierte Konzeption
    ├── FRAGEN.md                # Offene Fragen & Entscheidungen
    ├── ARCHITECTURE.md          # Technische Architektur
    └── PRIVACY_POLICY.md        # Datenschutzerklärung
```

---

## 🎨 Design-System

### Farbpalette

```css
/* Primary Color */
--color-primary: #667eea;        /* Lila/Blau - Kreativität */
--color-primary-light: #8599f3;
--color-primary-dark: #4c63d2;

/* Secondary Color */
--color-secondary: #f093fb;      /* Rosa - Spielerisch */

/* Neutral */
--color-bg-primary: #ffffff;
--color-text-primary: #111827;
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

**Aktuell:** Konzept-Phase

Nächste Schritte:
1. Entscheidungen mit dem Kind treffen (siehe [FRAGEN.md](FRAGEN.md))
2. Expo-Projekt initialisieren
3. Erste 3 Level-Bilder mit Kind erstellen
4. Prototyp entwickeln (Home + Game Screen)
5. Usability-Test mit Kind

---

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE)

**Open Source • No Ads • Made with ❤️**

---

## 📞 Kontakt

- **Feedback:** [feedback@example.com](mailto:feedback@example.com)
- **GitHub Issues:** [Issues](https://github.com/S540d/DrawFromMemory/issues)
- **Support the Project:** [Ko-fi](https://ko-fi.com/devsven)

---

**Hinweis:** Diese App befindet sich in der Konzept-Phase. Alle Features und Designs können sich noch ändern.
