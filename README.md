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

**Aktueller Stand:** MVP zu 50% fertig - [Detaillierter Status →](STATUS.md)

### Phase 1: MVP (Minimum Viable Product) - **50% FERTIG**
- ✅ Konzept & Projektskizze
- ✅ Expo-Projekt Setup
- ✅ Home Screen (vollständig)
- 🟡 Game Screen (3 Phasen: Merken ✅ → Zeichnen ✅ → Vergleichen 🔴)
- 🔴 Settings Screen (nur Platzhalter)
- ✅ 10 Level + 4 Extra-Bilder (alle SVG vorhanden)
- 🔴 Fortschritt speichern (AsyncStorage)
- 🔴 Dark Mode
- ✅ i18n (DE/EN) Service vorhanden

**Nächste Schritte für MVP:**
1. Comparison-Phase implementieren (Overlay mit Slider)
2. Rating-Phase implementieren (Sterne-Auswahl)
3. Progress-Speicherung (AsyncStorage)
4. Settings-Menü vollständig
5. Dark Mode

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

**Aktuell:** Entwicklungsphase - MVP zu 50% fertig

**Was funktioniert bereits:**
- ✅ 10 Level-Bilder (SVG) + 4 Extra-Bilder
- ✅ Home Screen mit Navigation
- ✅ Memorize-Phase (Bild anzeigen mit Timer)
- ✅ Drawing-Phase (Canvas mit Farben, Pinsel, Radiergummi)
- ✅ Level-System mit progressiver Schwierigkeit
- ✅ Internationalisierung (DE/EN)

**In Arbeit:**
- 🔴 Comparison-Phase (Overlay-Vergleich)
- 🔴 Rating-Phase (Sterne-Bewertung)
- 🔴 Progress-Speicherung
- 🔴 Settings-Menü

👉 **[Detaillierter Projektstatus](STATUS.md)** - Vollständige Übersicht aller erledigten und offenen Aufgaben

Nächste Schritte:
1. Entscheidungen mit dem Kind treffen (siehe [OFFENE_FRAGEN.md](OFFENE_FRAGEN.md))
2. ~~Expo-Projekt initialisieren~~ ✅
3. ~~Erste 3 Level-Bilder mit Kind erstellen~~ ✅ (Alle 10 + 4 Extra)
4. ~~Prototyp entwickeln (Home + Game Screen)~~ 🟡 50% fertig
5. Comparison- und Rating-Phase fertigstellen
6. Progress-Speicherung implementieren
7. Usability-Test mit Kind

👉 **[Vollständiger Projektstatus](STATUS.md)**

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
