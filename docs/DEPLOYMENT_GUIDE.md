# Deployment Guide - Play Store & App Store

Schritt-für-Schritt Anleitung zur Veröffentlichung der App in den App Stores.

## Voraussetzungen

### Tools Installation
```bash
# EAS CLI installieren
npm install -g eas-cli

# EAS Login
eas login

# EAS Project initialisieren (falls noch nicht geschehen)
eas init
```

### Accounts benötigt
- [ ] Google Play Developer Account ($25 einmalig)
- [ ] Apple Developer Account ($99/Jahr) - optional, später
- [ ] Expo Account (kostenlos)

## Phase 1: Vorbereitung (MUSS vor Upload)

### 1.1 Icons generieren

Die Icons müssen aus der SVG-Quelle generiert werden:

```bash
# Manuelle Generierung mit Design-Tool
# 1. assets/icons/app-icon.svg öffnen
# 2. Als app-icon.png (1024x1024px) exportieren
# 3. Als adaptive-icon.png (1024x1024px) exportieren
```

**Benötigte Files:**
- `assets/icons/app-icon.png` (1024x1024px)
- `assets/icons/adaptive-icon.png` (1024x1024px)
- `assets/icons/feature-graphic.png` (1024x500px) - Play Store Banner
- `assets/icons/screenshots/phone-*.png` (mindestens 2)

### 1.2 EAS Project ID aktualisieren

```bash
# Project ID erhalten
eas whoami
eas project:info

# In app.json die Project ID ersetzen
# "projectId": "your-actual-project-id"
```

### 1.3 Privacy Policy hosten

```bash
# Privacy Policy auf GitHub Pages deployen
git checkout gh-pages
cp PRIVACY_POLICY.md docs/PRIVACY_POLICY.md

# Zurück zu main
git checkout main

# URL testen:
# https://s540d.github.io/DrawFromMemory/PRIVACY_POLICY.html
```

## Phase 2: Build erstellen

### 2.1 Android (Google Play Store)

```bash
# Production Build (AAB für Play Store)
eas build --platform android --profile production

# Build dauert ca. 10-15 Minuten
# Build wird automatisch signiert (Keystore wird von EAS verwaltet)

# Build herunterladen nach Fertigstellung
# URL wird in der Console angezeigt
```

**Wichtig:** Der erste Build generiert automatisch einen Keystore. Dieser muss für alle zukünftigen Updates verwendet werden!

### 2.2 Build lokal testen (optional)

```bash
# Preview Build für lokales Testing
eas build --platform android --profile preview

# APK herunterladen und auf Gerät installieren
adb install build-output.apk
```

## Phase 3: Google Play Console Setup

### 3.1 Play Console Account

1. Gehe zu [Google Play Console](https://play.google.com/console)
2. Zahle $25 Registrierungsgebühr (einmalig)
3. Fülle Account-Details aus
4. Verifiziere deine Identität

### 3.2 App erstellen

1. **Create App** Button klicken
2. **App details:**
   - Name: `Merke und Male`
   - Default language: `German (Germany)`
   - App or game: `App`
   - Free or paid: `Free`

3. **Declarations:**
   - ✓ Follow Play policies
   - ✓ US export laws compliant

### 3.3 Store Listing ausfüllen

**App details:**
- Short description: Siehe `docs/PLAY_STORE_METADATA.md`
- Full description: Siehe `docs/PLAY_STORE_METADATA.md`

**Graphics:**
- App icon: `assets/icons/app-icon.png` (512x512px)
- Feature graphic: `assets/icons/feature-graphic.png` (1024x500px)
- Phone screenshots: Mindestens 2 (aus `assets/icons/screenshots/`)

**Categorization:**
- App category: `Education`
- Tags: Siehe PLAY_STORE_METADATA.md

**Contact details:**
- Email: [TBD - muss hinzugefügt werden]
- Website: `https://s540d.github.io/DrawFromMemory/`
- Privacy policy: `https://s540d.github.io/DrawFromMemory/PRIVACY_POLICY.html`

### 3.4 Content Rating

1. **Start questionnaire**
2. **Category:** Education
3. **Questions beantworten:**
   - Violence: No
   - Sexuality: No
   - Language: No
   - Controlled substances: No
   - User interaction: No
   - Personal info shared: No
   - Location: No
4. **Submit** → Rating wird generiert (vermutlich PEGI 3 / Everyone)

### 3.5 Data Safety

**Data collection:**
- Does your app collect or share user data? **NO**

**Security practices:**
- Data encryption in transit: N/A (no network)
- Users can request data deletion: Yes (uninstall)
- Committed to Play Families Policy: Yes

### 3.6 App Access

- All features available without restrictions
- No special access needed
- No login required

### 3.7 Pricing & Distribution

- Countries: All countries
- Pricing: Free
- Contains ads: No
- Contains in-app purchases: No
- Content rating: Everyone
- Target audience: Kids, Education

## Phase 4: Upload & Testing

### 4.1 Internal Testing Track

1. **Create release** in Internal testing
2. **Upload AAB** (von EAS Build heruntergeladen)
3. **Release name:** v1.1.0
4. **Release notes:** Siehe PLAY_STORE_METADATA.md "What's New"
5. **Testers hinzufügen** (Email-Adressen)
6. **Review and rollout**

### 4.2 Pre-Launch Report

Nach Upload führt Google automatisch Tests durch:
- Crashs
- Performance
- Security
- Accessibility

**Berichte prüfen und Probleme beheben!**

### 4.3 Internal Testing

1. Tester erhalten Email mit Link
2. Mindestens 2-3 Tage testen
3. Feedback sammeln
4. Bugs fixen falls nötig

## Phase 5: Production Release

### 5.1 Production Track

1. **Promote release** von Internal zu Production
   ODER
2. **Create new release** direkt in Production

3. **Review and rollout**
4. **Submit for review**

### 5.2 Review Process

- **Dauer:** 1-7 Tage (meist 1-3 Tage)
- **Status:** Play Console → Publishing overview
- **Benachrichtigung:** Per Email

**Mögliche Review-Ergebnisse:**
- ✅ Approved → App ist live!
- ⚠️ Changes requested → Feedback bearbeiten und neu einreichen
- ❌ Rejected → Policy-Verstöße beheben

### 5.3 Nach Approval

- App ist live im Play Store!
- URL: `https://play.google.com/store/apps/details?id=com.s540d.merkeundmale`
- Monitoring: Play Console → Statistics

## Phase 6: Updates deployen

### 6.1 Version erhöhen

```json
// package.json
"version": "1.2.0"

// app.json
"version": "1.2.0",
"android": {
  "versionCode": 2  // Integer, immer erhöhen!
}
```

### 6.2 Build & Upload

```bash
# Neuen Build erstellen
eas build --platform android --profile production

# In Play Console hochladen
# Production → Create new release → Upload new AAB
```

### 6.3 Release Notes

- Immer aussagekräftige Release Notes hinzufügen
- In allen unterstützten Sprachen
- Siehe PLAY_STORE_METADATA.md für Format

## Troubleshooting

### Build fails

```bash
# Logs anschauen
eas build:list
eas build:view [BUILD_ID]

# Cache clearen
eas build --platform android --profile production --clear-cache
```

### Keystore Probleme

```bash
# Keystore info anzeigen
eas credentials

# Bei verlorenem Keystore:
# WARNUNG: Neue App im Store erstellen erforderlich!
```

### Play Console Errors

**"App not reviewed"**
- Alle Sections (Store Listing, Content Rating, etc.) vollständig ausfüllen
- Grüne Häkchen bei allen Pflichtfeldern

**"Privacy Policy required"**
- Privacy Policy URL muss öffentlich erreichbar sein
- Keine Authentifizierung erforderlich

## Checkliste vor Production Release

- [ ] Icons generiert und in app.json referenziert
- [ ] EAS Project ID in app.json aktualisiert
- [ ] Privacy Policy gehostet und URL getestet
- [ ] Production Build erfolgreich erstellt
- [ ] Build lokal auf Gerät getestet
- [ ] Store Listing komplett ausgefüllt
- [ ] Screenshots hochgeladen (mind. 2)
- [ ] Feature Graphic hochgeladen
- [ ] Content Rating abgeschlossen
- [ ] Data Safety Form ausgefüllt
- [ ] Internal Testing durchgeführt
- [ ] Alle Pre-Launch Report Probleme behoben
- [ ] Support-Email hinterlegt
- [ ] Website/GitHub URLs korrekt
- [ ] Release Notes vorbereitet

## Nützliche Links

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [EAS Submit Docs](https://docs.expo.dev/submit/introduction/)
- [Play Console](https://play.google.com/console)
- [Play Store Guidelines](https://play.google.com/about/developer-content-policy/)
- [Play Store Asset Specs](https://support.google.com/googleplay/android-developer/answer/9866151)

## Support

Bei Problemen:
- EAS Docs: https://docs.expo.dev/
- Expo Discord: https://chat.expo.dev/
- GitHub Issues: https://github.com/S540d/DrawFromMemory/issues
