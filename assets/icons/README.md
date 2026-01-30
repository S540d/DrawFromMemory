# App Icons für Play Store

## Benötigte Icons

### 1. App Icon (app-icon.png)
- **Größe:** 1024x1024px
- **Format:** PNG (24-bit)
- **Hintergrund:** Transparent oder Farbe
- **Verwendung:** iOS App Store, generelle App-Identität

### 2. Adaptive Icon (adaptive-icon.png)
- **Größe:** 1024x1024px
- **Format:** PNG (24-bit)
- **Safe Zone:** 108x108dp Kreis in der Mitte (Icon sollte im 66dp Kreis zentriert sein)
- **Verwendung:** Android adaptive Icons
- **Background Color:** `#60D5FA` (bereits in app.json konfiguriert)

### 3. Play Store Feature Graphic
- **Größe:** 1024x500px
- **Format:** PNG oder JPEG
- **Verwendung:** Hauptbanner im Play Store

### 4. Screenshots (mindestens 2 pro Kategorie)
- **Phone:** Mindestens 320px auf der kürzeren Seite
- **7-inch Tablet:** Optional
- **10-inch Tablet:** Optional
- **Empfohlen:** 1080x1920px (9:16) für Phones

## Aktueller Status

- ✅ SVG-Quelle vorhanden: `app-icon.svg`
- ⚠️ PNG Icons müssen noch generiert werden
- ⚠️ Feature Graphic muss erstellt werden
- ⚠️ Screenshots müssen erstellt werden

## Generierung der Icons

### Option 1: Manuell mit Design-Tool
1. `app-icon.svg` in Figma/Photoshop/GIMP öffnen
2. Als 1024x1024px PNG exportieren
3. Für adaptive-icon.png sicherstellen, dass das Icon im Safe-Zone-Kreis liegt

### Option 2: Mit Expo Icon Generator (nach PNG-Erstellung)
```bash
npx expo prebuild --clean
```

### Option 3: Online Tools
- [Icon Kitchen](https://icon.kitchen/)
- [App Icon Generator](https://www.appicon.co/)
- [Adaptive Icon Generator](https://adapticon.tooo.io/)

## Checkliste vor Play Store Upload

- [ ] app-icon.png (1024x1024px) erstellt
- [ ] adaptive-icon.png (1024x1024px) erstellt
- [ ] Feature Graphic (1024x500px) erstellt
- [ ] Mindestens 2 Screenshots (Phone) erstellt
- [ ] Icons in app.json referenziert
- [ ] Visuelle Überprüfung auf verschiedenen Geräten

## Naming Convention

```
assets/icons/
├── app-icon.png          # 1024x1024px
├── adaptive-icon.png     # 1024x1024px (Foreground)
├── app-icon.svg          # Source file
├── feature-graphic.png   # 1024x500px (Play Store)
└── screenshots/
    ├── phone-1.png
    ├── phone-2.png
    └── ...
```
