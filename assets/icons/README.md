# App Icons & Play Store Assets

## Vorhandene Assets

| Asset | Datei | Größe | Status |
|-------|-------|-------|--------|
| App Icon | `app-icon.png` | 1024x1024px | ✅ Fertig |
| Adaptive Icon | `adaptive-icon.png` | 1024x1024px | ✅ Fertig |
| Feature Graphic | `feature-graphic.png` | 1024x500px | ⚠️ Erstellen |
| Screenshots | `screenshots/` | 1080x1920px | ⚠️ Erstellen |

## Design-Stil

Alle Assets basieren auf dem bestehenden Icon-Design:
- **Stil:** Freundlicher Cartoon-Stil für Kinder
- **Hauptfarbe:** Hellblau (#60D5FA)
- **Charakter:** Fröhliches Kind beim Zeichnen
- **Elemente:** Buntstift, Papier, Stern, Blume

---

## 1. Feature Graphic (1024x500px)

**Datei:** `feature-graphic.png`

### Design-Vorgaben
Das Feature Graphic ist das Hauptbanner im Play Store und sollte:
- Den App-Namen "Merke und Male" enthalten
- Das Kind aus dem Icon zeigen (vergrößert/angepasst)
- Die Kernfunktion visualisieren (Bild merken → zeichnen)
- Die Markenfarbe #60D5FA als Hintergrund verwenden

### Prompt für KI-Bildgenerierung (z.B. ChatGPT/DALL-E)
```
Create a Google Play Store feature graphic (1024x500px) for a children's memory drawing app called "Remember and Draw" (German: "Merke und Male").

Style:
- Friendly cartoon style matching the existing app icon
- Light blue background (#60D5FA)
- Playful and inviting for children ages 3-8

Elements to include:
- The same cartoon child character from the icon (brown hair, yellow shirt)
- The child holding a crayon/pencil
- A simple drawing sequence: picture → thinking → drawing
- The app name "Merke und Male" in a fun, child-friendly font
- Optional: stars, colorful elements, happy atmosphere

The image should convey: "Look at a picture, remember it, draw it from memory"
Make sure the main content is centered (safe zone for cropping).
```

### Manuelles Erstellen
1. Öffne das zweite Icon (`ChatGPT Image 6. Dez. 2025, 09_38_05.png`) in einem Bildeditor
2. Erstelle eine neue Datei: 1024x500px
3. Hintergrund: #60D5FA (App-Primärfarbe)
4. Platziere das Kind links oder mittig
5. Füge den App-Namen "Merke und Male" hinzu
6. Optional: Füge Beispiel-Zeichnungen (Sonne, Stern, Haus) hinzu

---

## 2. Screenshots (1080x1920px)

**Ordner:** `screenshots/`

### Benötigte Screenshots (mindestens 2-4)

| Nr. | Szene | Dateiname | Beschreibung |
|-----|-------|-----------|--------------|
| 1 | Startbildschirm | `phone-1-home.png` | Home-Screen mit "Spiel starten" Button |
| 2 | Level-Auswahl | `phone-2-levels.png` | Level-Grid mit Schwierigkeitsanzeige |
| 3 | Bild anschauen | `phone-3-memorize.png` | Phase "Merken" mit Countdown |
| 4 | Zeichnen | `phone-4-draw.png` | Zeichenoberfläche mit Tools |
| 5 | Vergleich | `phone-5-compare.png` | Original vs. Zeichnung |

### Screenshots erstellen

**Option 1: Vom Gerät**
```bash
# Android (mit ADB)
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png phone-1-home.png

# iOS (Simulator)
xcrun simctl io booted screenshot phone-1-home.png
```

**Option 2: Expo Web (localhost)**
1. Starte die App: `npm run web`
2. Öffne Chrome DevTools (F12)
3. Klicke auf "Toggle device toolbar" (Strg+Shift+M)
4. Wähle Größe: 1080x1920 (oder "iPhone 12 Pro")
5. Mache Screenshots mit Snipping Tool oder Browser-Extension

**Option 3: Expo Go auf Gerät**
1. App auf echtem Gerät starten
2. Screenshots mit Gerät machen
3. Bilder auf PC übertragen

### Screenshot-Inhalte

**Screenshot 1 - Startbildschirm:**
- App-Name prominent
- "Spiel starten" Button sichtbar
- Freundliche, einladende Atmosphäre

**Screenshot 2 - Level-Auswahl:**
- Mehrere Level-Karten sichtbar
- Schwierigkeitsanzeige (Farben/Sterne)
- Klare Navigation

**Screenshot 3 - Merkphase:**
- Bild zum Merken (z.B. Sonne oder Haus)
- Countdown-Anzeige
- "Schau genau hin!" Text

**Screenshot 4 - Zeichnen:**
- Leere Zeichenfläche
- Toolbar mit Pinsel, Radierer, Farben
- Farbpalette sichtbar

**Screenshot 5 - Ergebnis:**
- Original-Bild und Zeichnung nebeneinander
- Positive Bestätigung
- "Weiter" Button

---

## 3. Zusätzliche Assets (optional)

### Promo-Video (YouTube)
- **Format:** 16:9 (1920x1080px)
- **Länge:** 30 Sekunden bis 2 Minuten
- **Inhalt:** Gameplay-Demo, Features zeigen

### TV Banner (Android TV)
- **Größe:** 1280x720px
- Falls Android TV unterstützt wird

---

## Dateistruktur

```
assets/icons/
├── app-icon.png              # ✅ 1024x1024px (App Icon)
├── adaptive-icon.png         # ✅ 1024x1024px (Android Adaptive)
├── feature-graphic.png       # ⚠️ 1024x500px (Play Store Banner)
├── ChatGPT Image *.png       # Originale Quelldateien
├── README.md                 # Diese Datei
└── screenshots/
    ├── phone-1-home.png      # ⚠️ 1080x1920px
    ├── phone-2-levels.png    # ⚠️ 1080x1920px
    ├── phone-3-memorize.png  # ⚠️ 1080x1920px
    ├── phone-4-draw.png      # ⚠️ 1080x1920px
    └── phone-5-compare.png   # ⚠️ 1080x1920px
```

---

## Checkliste

- [x] App Icon (1024x1024px)
- [x] Adaptive Icon (1024x1024px)
- [ ] Feature Graphic (1024x500px)
- [ ] Screenshot 1: Startbildschirm
- [ ] Screenshot 2: Level-Auswahl
- [ ] Screenshot 3: Merkphase
- [ ] Screenshot 4: Zeichnen
- [ ] Screenshot 5: Ergebnis (optional)
- [ ] Alle Dateien in korrektem Format (PNG, 24-bit)
- [ ] Alle Größen korrekt

---

## Referenzen

- [Google Play Store Asset Guidelines](https://support.google.com/googleplay/android-developer/answer/9866151)
- [Material Design Icon Guidelines](https://m3.material.io/styles/icons/designing-icons)
- [App Icon Template](https://developer.android.com/studio/write/image-asset-studio)
