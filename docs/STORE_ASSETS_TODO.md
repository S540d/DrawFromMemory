# Store Assets - TODO Liste

Diese Datei trackt den Status der benötigten Store Assets.

## Status Legende
- ✅ Fertig
- 🔨 In Arbeit
- ⏳ Ausstehend
- ⚠️ Benötigt Review

## Kritische Assets (MUSS vor Store Upload)

### App Icons
| Asset | Größe | Format | Status | Datei | Notes |
|-------|-------|--------|--------|-------|-------|
| App Icon | 1024x1024 | PNG-24 | ⏳ | `assets/icons/app-icon.png` | Aus SVG generieren |
| Adaptive Icon | 1024x1024 | PNG-24 | ⏳ | `assets/icons/adaptive-icon.png` | Safe zone beachten |
| High-Res Icon | 512x512 | PNG-32 | ⏳ | `assets/icons/app-icon-512.png` | Für Play Console |

### Feature Graphics
| Asset | Größe | Format | Status | Datei | Notes |
|-------|-------|--------|--------|-------|-------|
| Feature Graphic | 1024x500 | PNG/JPG | ⏳ | `assets/icons/feature-graphic.png` | Play Store Header |

### Screenshots - Phone (mindestens 2)
| Asset | Größe | Status | Datei | Zeigt |
|-------|-------|--------|-------|-------|
| Screenshot 1 | 1080x1920 | ⏳ | `assets/icons/screenshots/phone-1.png` | Level Selection |
| Screenshot 2 | 1080x1920 | ⏳ | `assets/icons/screenshots/phone-2.png` | Drawing Canvas |
| Screenshot 3 | 1080x1920 | ⏳ | `assets/icons/screenshots/phone-3.png` | Success Screen |
| Screenshot 4 | 1080x1920 | ⏳ | `assets/icons/screenshots/phone-4.png` | Settings (optional) |

## Optionale Assets (Empfohlen)

### Tablet Screenshots
| Asset | Größe | Status | Datei | Notes |
|-------|-------|--------|-------|-------|
| 7" Tablet 1 | Min 320px | ⏳ | `assets/icons/screenshots/tablet-7-1.png` | Optional |
| 7" Tablet 2 | Min 320px | ⏳ | `assets/icons/screenshots/tablet-7-2.png` | Optional |

### Promo
| Asset | Type | Status | Notes |
|-------|------|--------|-------|
| Promo Video | YouTube | ⏳ | 30s-2min, optional |

## Dokumentation & Text Assets

### Play Store Texte
| Asset | Status | Datei | Notes |
|-------|--------|-------|-------|
| Store Title | ✅ | `docs/PLAY_STORE_METADATA.md` | "Merke und Male" |
| Short Description | ✅ | `docs/PLAY_STORE_METADATA.md` | 80 chars |
| Full Description | ✅ | `docs/PLAY_STORE_METADATA.md` | 4000 chars |
| Release Notes | ✅ | `docs/PLAY_STORE_METADATA.md` | What's New |
| Keywords | ✅ | `docs/PLAY_STORE_METADATA.md` | SEO Tags |

### Rechtliches
| Asset | Status | Datei | Notes |
|-------|--------|-------|-------|
| Privacy Policy | ✅ | `PRIVACY_POLICY.md` | Muss gehostet werden |
| Support Email | ⏳ | - | TBD |
| Website URL | ✅ | `app.json` | GitHub Pages |

## Konfiguration

### app.json
| Field | Status | Value | Notes |
|-------|--------|-------|-------|
| version | ✅ | 1.1.0 | Aktuelle Version |
| android.versionCode | ✅ | 1 | Integer |
| android.package | ✅ | com.s540d.merkeundmale | Bundle ID |
| android.privacyPolicy | ✅ | URL | Muss live sein |
| icon | ⏳ | ./assets/icons/app-icon.png | Generieren |
| android.adaptiveIcon | ⏳ | ./assets/icons/adaptive-icon.png | Generieren |
| extra.eas.projectId | ⚠️ | your-project-id-here | **MUSS aktualisiert werden** |

## Nächste Schritte (Reihenfolge)

### Phase 1: Icons erstellen (KRITISCH)
1. ⏳ SVG in Design-Tool öffnen (Figma/Photoshop/GIMP)
2. ⏳ `app-icon.png` (1024x1024) exportieren
3. ⏳ `adaptive-icon.png` (1024x1024) exportieren
4. ⏳ `app-icon-512.png` (512x512) exportieren
5. ⏳ Icons in `assets/icons/` speichern
6. ⏳ Icons visuell auf Gerät testen

### Phase 2: Feature Graphic erstellen
1. ⏳ Design mit App-Name und Tagline
2. ⏳ Als `feature-graphic.png` (1024x500) exportieren
3. ⏳ Review und Qualitätskontrolle

### Phase 3: Screenshots erstellen
1. ⏳ App auf Emulator/Gerät starten
2. ⏳ Screenshots von wichtigen Screens machen
3. ⏳ Optional: Device Frames hinzufügen
4. ⏳ Als `phone-*.png` speichern
5. ⏳ Mindestens 2 Screenshots auswählen

### Phase 4: EAS Setup
1. ⚠️ EAS Account erstellen/Login
2. ⚠️ `eas init` ausführen
3. ⚠️ Project ID in `app.json` aktualisieren
4. ✅ `eas.json` bereits konfiguriert

### Phase 5: Privacy Policy hosten
1. ✅ Privacy Policy bereits erstellt
2. ⏳ Auf GitHub Pages deployen
3. ⏳ URL in `app.json` updaten
4. ⏳ URL testen (öffentlich erreichbar)

### Phase 6: Support Email
1. ⏳ Email-Adresse für Support erstellen
2. ⏳ In Play Console hinterlegen
3. ⏳ In Dokumentation updaten

## Pre-Release Validation

Vor dem ersten Build checken:
- [ ] Alle kritischen Assets vorhanden
- [ ] Icons in korrekten Größen und Formaten
- [ ] Screenshots zeigen aktuelle App-Version
- [ ] Privacy Policy öffentlich erreichbar
- [ ] EAS Project ID aktualisiert
- [ ] Support-Email konfiguriert
- [ ] Alle Texte Korrektur gelesen
- [ ] `npm run prepare-release` erfolgreich

## Hilfreiche Commands

```bash
# Assets validieren
npm run prepare-release

# Test Build erstellen
npm run build:android:preview

# Production Build
npm run build:android
```

## Notizen & Learnings

### Icon-Generierung
- Tool verwendet: [TBD]
- Besonderheiten: [TBD]
- Probleme: [TBD]

### Screenshot-Erstellung
- Device verwendet: [TBD]
- Framing Tool: [TBD]
- Besonderheiten: [TBD]

### EAS Setup
- Account: [TBD]
- Project ID: [TBD]
- Build-Zeit: [TBD]

---

**Letzte Aktualisierung:** [TBD]
**Status:** 🔨 In Vorbereitung
**Nächster Meilenstein:** Icons & Screenshots erstellen
