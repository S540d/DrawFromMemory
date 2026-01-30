---
name: Play Store Asset Checklist
about: Checklist für Play Store Assets und Marketing-Materialien
title: 'Play Store Assets erstellen'
labels: 'assets, play-store'
assignees: ''
---

## Play Store Assets Checklist

### App Icons

- [ ] **App Icon** (1024x1024px)
  - Format: PNG-24
  - Transparent oder mit Hintergrund
  - Speichern als: `assets/icons/app-icon.png`
  - Quelle: `assets/icons/app-icon.svg`

- [ ] **Adaptive Icon** (1024x1024px)
  - Format: PNG-24
  - Foreground mit transparentem Hintergrund
  - Safe Zone: Icon muss in 66dp Kreis passen
  - Speichern als: `assets/icons/adaptive-icon.png`
  - Background Color: `#60D5FA` (bereits in app.json)

### Play Store Graphics

- [ ] **Feature Graphic** (1024x500px)
  - Format: PNG oder JPEG
  - Header/Banner für Play Store Listing
  - Speichern als: `assets/icons/feature-graphic.png`
  - Sollte Logo, App-Name und Tagline enthalten

- [ ] **High-Res Icon** (512x512px)
  - Format: PNG-32
  - Kann vom app-icon.png resized werden
  - Speichern als: `assets/icons/app-icon-512.png`

### Screenshots

- [ ] **Phone Screenshots** (mindestens 2, maximal 8)
  - Mindestgröße: 320px kürzeste Seite
  - Empfohlen: 1080x1920px (9:16)
  - Format: PNG oder JPEG
  - Speichern in: `assets/icons/screenshots/phone-*.png`
  - Screenshots sollten zeigen:
    - [ ] Home/Level-Auswahl Screen
    - [ ] Drawing Canvas mit Toolbar
    - [ ] Completed level mit Success-Screen
    - [ ] Settings Screen (optional)

- [ ] **7-inch Tablet Screenshots** (optional, mindestens 2)
  - Mindestgröße: 320px kürzeste Seite
  - Speichern in: `assets/icons/screenshots/tablet-7-*.png`

- [ ] **10-inch Tablet Screenshots** (optional, mindestens 2)
  - Mindestgröße: 1080px kürzeste Seite
  - Speichern in: `assets/icons/screenshots/tablet-10-*.png`

### Video (optional)

- [ ] **Promo Video** (optional)
  - Dauer: 30 Sekunden bis 2 Minuten
  - Format: YouTube Video Link
  - Zeigt App-Features und Gameplay

## Screenshot Erstellung

### Empfohlene Tools

1. **Expo/React Native**
   ```bash
   # Device mit Expo Go öffnen
   expo start
   # Screenshots vom Gerät machen
   ```

2. **Android Emulator**
   ```bash
   # Emulator starten
   npm run android
   # Screenshot: Cmd+S (Mac) oder Control+S (Windows)
   ```

3. **Screen Framing Tools**
   - [Shots.so](https://shots.so/) - Device Frames hinzufügen
   - [Appure](https://appure.io/) - App Store Screenshot Generator
   - [Mockuphone](https://mockuphone.com/) - Free Mockup Generator

### Screenshot Guidelines

**Best Practices:**
- Zeige die App in Aktion
- Verwende echte App-Screenshots (keine Mockups)
- Zeige verschiedene Features
- Gute Beleuchtung/Kontrast
- Kein Text-Overlay auf Screenshots
- Screenshots sollten selbsterklärend sein

**Was zeigen:**
1. Hauptfeature (Drawing Canvas)
2. Level-Auswahl
3. Erfolgs-Screen
4. Unterschiedliche Level-Komplexitäten

## Icon Design Guidelines

### App Icon
- **Wiedererkennbar:** Sollte auch in kleiner Größe gut erkennbar sein
- **Einfach:** Nicht zu viele Details
- **Farbschema:** Sollte zur App passen (#60D5FA Primary Color)
- **Einzigartig:** Von anderen Apps unterscheidbar

### Feature Graphic
- **App Name** deutlich sichtbar
- **Tagline:** "Gedächtnistraining für Kinder"
- **Visual:** App Icon oder Character
- **CTA:** Optional "Jetzt kostenlos spielen"
- **Farben:** Konsistent mit App-Design

## Asset Export Checklist

Vor dem Export sicherstellen:
- [ ] Richtige Größen verwendet
- [ ] Richtige Formate (PNG-24 für Transparenz)
- [ ] Komprimierung angewendet (aber Qualität erhalten)
- [ ] Dateien korrekt benannt
- [ ] In korrekten Ordnern gespeichert
- [ ] In Git committet

## Nach Asset-Erstellung

- [ ] Assets in `assets/icons/` Ordner eingecheckt
- [ ] `app.json` referenziert korrekte Dateien
- [ ] Lokaler Build-Test durchgeführt
- [ ] Visual Review auf verschiedenen Geräten
- [ ] Bereit für Play Store Upload

## Referenzen

- [Play Store Asset Guidelines](https://support.google.com/googleplay/android-developer/answer/9866151)
- [Adaptive Icons Guidelines](https://developer.android.com/develop/ui/views/launch/icon_design_adaptive)
- [Material Design Icons](https://m3.material.io/styles/icons/overview)
