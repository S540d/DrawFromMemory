# Android AAB/APK lokal bauen

Führe einen lokalen Android Build durch – ohne EAS-Credits zu verbrauchen.

## 1. Voraussetzungen prüfen

Prüfe mit Bash-Befehlen:
- `adb --version` → Android SDK erreichbar?
- `eas --version` → EAS CLI erreichbar?
- `java -version` → JDK 17 aktiv?
- `eas whoami` → Bei EAS eingeloggt? (für Production-Build nötig)

Falls ein Befehl nicht gefunden wird:
- `source ~/.zshrc` ausführen und erneut prüfen
- Anleitung in CLAUDE.md → Abschnitt "Android Build (lokal)" nachschlagen

## 2. Build-Profil wählen

Frage den User welches Profil:

| Profil | Format | Signing | Verwendung |
|--------|--------|---------|-----------|
| `preview` | APK | Debug (automatisch) | Testen auf Gerät |
| `production` | AAB | EAS Cloud Keystore | Play Store Upload |

## 3. Build starten

```bash
# Preview APK (Standard, kein Login nötig)
npm run build:android:local:preview

# Production AAB (EAS Login + EXPO_TOKEN nötig)
npm run build:android:local:production
```

Das Skript `scripts/build-local.sh` setzt alle nötigen Umgebungsvariablen automatisch.

## 4. Output

- Preview APK: `build/app-preview.apk`
- Production AAB: `build/app-production.aab`

## 5. APK auf Gerät installieren (optional)

```bash
adb install build/app-preview.apk
```

## 6. AAB für Play Store

Das `.aab` aus `build/app-production.aab` direkt in der Play Console hochladen:
1. [Play Console](https://play.google.com/console) öffnen
2. App → Produktion → Release erstellen
3. AAB hochladen

## Hinweise

- Build dauert ca. 5–15 Minuten (Gradle-Download beim ersten Mal länger)
- `build/` Verzeichnis ist in `.gitignore` – wird nicht committed
- versionCode wird bei Production-Builds **nicht** auto-inkrementiert (lokal)
- versionCode manuell in `app.json` → `expo.android.versionCode` erhöhen vor Play Store Upload
