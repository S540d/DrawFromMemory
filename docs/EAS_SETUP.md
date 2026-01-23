# EAS (Expo Application Services) Setup Guide

## Voraussetzungen
- Expo Account (https://expo.dev)
- EAS CLI installiert: `npm install -g eas-cli`
- Authentifizierung: `eas login`

## Setup-Schritte

### 1. EAS Projekt initialisieren
```bash
eas init
```

Dieser Befehl wird:
- Ein neues Expo-Projekt auf expo.dev erstellen
- Eine eindeutige Project ID generieren
- Die ID automatisch in app.json eintragen

### 2. Project ID verifizieren
Nach `eas init` sollte in `app.json` folgendes stehen:

```json
"extra": {
  "eas": {
    "projectId": "<ECHTE_PROJECT_ID>" // z.B. "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
},
"updates": {
  "url": "https://u.expo.dev/<ECHTE_PROJECT_ID>"
}
```

⚠️ **WICHTIG:** Die Project ID muss **identisch** in beiden Feldern sein!

### 3. Update Scripts in package.json hinzufügen
Füge folgende Scripts hinzu:

```json
"scripts": {
  "ota:publish": "eas update --branch main",
  "ota:preview": "eas update --branch preview",
  "build:android": "eas build --platform android --profile production",
  "build:preview": "eas build --platform android --profile preview"
}
```

### 4. Ersten OTA-Update veröffentlichen
```bash
npm run ota:publish
# oder
eas update --branch main --message "Initial OTA setup"
```

### 5. Build für Play Store erstellen
```bash
npm run build:android
# oder
eas build --platform android --profile production
```

## OTA-Update Workflow

### Was sind OTA-Updates?
Over-The-Air (OTA) Updates ermöglichen es, JavaScript-Code und Assets zu aktualisieren, ohne einen neuen Build im Play Store hochzuladen.

### Wann OTA verwenden?
✅ **Geeignet für:**
- UI-Änderungen
- Bugfixes
- Neue Features (JavaScript/TypeScript)
- Asset-Updates (Bilder, Übersetzungen)

❌ **NICHT geeignet für:**
- Native Code Änderungen (dependencies mit native modules)
- Änderungen in app.json (Version, Permissions)
- Expo SDK Upgrades

### OTA-Update veröffentlichen
```bash
# Main Branch (Production)
npm run ota:publish

# Mit Beschreibung
eas update --branch main --message "Fix: Accessibility labels für Settings-Buttons"

# Mehrere Branches
eas update --branch main --message "Production release v1.2.0"
eas update --branch preview --message "Preview: Testing new feature"
```

### OTA-Update Status prüfen
```bash
# Alle Updates anzeigen
eas update:list

# Spezifischen Branch
eas update:list --branch main

# Update-Details
eas update:view <update-id>
```

## Troubleshooting

### Problem: "Project ID not found"
**Lösung:** Führe `eas init` erneut aus oder trage die ID manuell ein.

### Problem: Updates werden nicht geladen
**Lösung:**
1. Prüfe, ob `runtimeVersion` in app.json korrekt ist
2. Stelle sicher, dass Branch-Name übereinstimmt
3. App komplett neu starten (Force Close)

### Problem: "Invalid Project ID"
**Lösung:**
1. Überprüfe, dass Project ID in beiden Feldern identisch ist:
   - `extra.eas.projectId`
   - `updates.url`
2. Keine Leerzeichen oder Sonderzeichen

## Nützliche Befehle

```bash
# EAS Status
eas whoami

# Projekt-Info
eas project:info

# Build-Historie
eas build:list

# Update-Historie
eas update:list

# Projekt neu verknüpfen
eas init --force
```

## Weitere Ressourcen

- [EAS Update Dokumentation](https://docs.expo.dev/eas-update/introduction/)
- [EAS Build Dokumentation](https://docs.expo.dev/build/introduction/)
- [Runtime Versions](https://docs.expo.dev/eas-update/runtime-versions/)

## Status: Issue #30 Phase 1.3
- [x] eas.json erstellt
- [ ] `eas init` ausführen (erfordert manuellen Schritt)
- [ ] Echte Project ID in app.json eintragen
- [ ] Ersten OTA-Update testen
