# CLAUDE.md – Merke und Male (DrawFromMemory)

Projektgedächtnis für Claude Code Sessions. Hier steht, was du wissen musst, um sofort loszulegen – ohne README, ohne Nachfragen.

---

## Projekt auf einen Blick

**App:** "Merke und Male" – Gedächtnistraining für Kinder. Bild 5s einprägen → aus dem Gedächtnis zeichnen → mit Original vergleichen → Sterne geben.

**Version:** 1.2.6 (Play Store-ready)  
**Team:** Sven (PM/Moderator), Kind (Ideen/Feedback), Claude (Entwicklung)  
**Repo:** https://github.com/S540d/DrawFromMemory  
**Live Demo:** https://s540d.github.io/DrawFromMemory/  
**Package:** `com.s540d.merkeundmale`

---

## Tech Stack

| Was | Womit |
|-----|-------|
| Framework | React Native + Expo 55 + expo-router (file-based routing) |
| Sprache | TypeScript (strict) |
| Zeichnen Native | @shopify/react-native-skia 2.4.18 |
| Zeichnen Web | HTML5 Canvas (eigene Implementierung) |
| Navigation | expo-router, Stack-Navigation |
| Storage | @react-native-async-storage/async-storage |
| Sound | Web Audio API (programmatisch, keine Audio-Assets) |
| Haptik | expo-haptics (nur Native) |
| i18n | Custom-Service (`services/i18n.ts`), DE/EN |
| Crash-Reporting | @sentry/react-native (optional, nur wenn `EXPO_PUBLIC_SENTRY_DSN` gesetzt) |
| CI/CD | GitHub Actions (`ci-cd.yml`, `deploy.yml`, `build-android.yml`) |
| Deployment Web | GitHub Pages via `gh-pages` Branch |
| Deployment Android | EAS Build |

---

## Wichtige Befehle

```bash
npm start                        # Expo Dev Server
npm run web                      # Webbrowser
npm run android                  # Android (Expo Go)
npm run test:ci                  # Tests + Coverage (für CI → NICHT npx jest --forceExit)
npm run lint                     # ESLint
npm run validate:svg-counts      # SVG-Element-Count-Validierung
npm run validate                 # Pre-release Checks
npx tsc --noEmit                 # TypeScript Check
```

---

## Projektstruktur

```
app/                    # Expo Router – File-based Routing
  _layout.tsx           # Root Layout (ThemeContext, SafeArea)
  index.tsx             # Home Screen
  game.tsx              # Game Screen (3 Phasen: Memorize / Draw / Result)
  levels.tsx            # Level-Auswahl
  gallery.tsx           # Gespeicherte Zeichnungen
  settings.tsx          # Einstellungen (nutzt SettingsModal eingebettet)

components/
  DrawingCanvas.tsx         # Web-Dispatcher (lädt .native.tsx oder .web.tsx)
  DrawingCanvas.native.tsx  # Skia-Implementierung
  DrawingCanvas.web.tsx     # HTML5 Canvas-Implementierung
  DrawingCanvas.shared.ts   # Gemeinsame Typen/Logik
  DrawingCanvas.hooks.ts    # Shared Hooks
  LevelImageDisplay.tsx     # SVG-Anzeige mit progressivem Aufdecken
  SettingsModal.tsx         # Einstellungs-Modal (auch embedded nutzbar)
  ParentalGate.tsx          # Eltern-Check vor externen Links (Multiplikationsaufgabe)
  Button.tsx                # Shared Button-Komponente
  Badge.tsx / Chip.tsx      # UI-Primitives
  ErrorBoundary.tsx         # Fehlerbehandlung
  SkeletonLoader.tsx        # Lade-Skeleton
  AnimatedPrimitives.tsx    # Animierte UI-Bausteine
  AnimatedSplashScreen.tsx  # Splash-Übergang

services/
  StorageManager.ts     # AsyncStorage + Web-Fallback (localStorage)
  SoundManager.ts       # Web Audio API + expo-haptics
  SentryService.ts      # Sentry-Wrapper (no-op wenn DSN nicht gesetzt)
  ImagePoolManager.ts   # Zufällige Bildauswahl pro Level
  LevelManager.ts       # Level-Konfiguration + Freischalt-Logik
  RatingManager.ts      # Sterne-Feedback-Texte
  ThemeContext.tsx       # Dark/Light/System Theme (React Context)
  i18n.ts               # DE/EN Übersetzungen (t('key'))
  useGamePhase.ts       # Game-Phasen-Hook
  useTimer.ts           # Timer-Hook

constants/
  Colors.ts             # Farbpalette (light + dark)
  Layout.ts             # Spacing, FontSize, FontWeight, BorderRadius

locales/
  de/translations.json  # Deutsche Übersetzungen
  en/translations.json  # Englische Übersetzungen

assets/images/levels/   # Level-Bilder als TSX-Komponenten (SVG)

docs/
  DEPLOYMENT_GUIDE.md        # Play Store Deployment (manuell, lokal)
  PLAY_STORE_METADATA.md     # Store-Texte DE
  PLAY_STORE_METADATA_EN.md  # Store-Texte EN
  PLAY_STORE_DATA_SAFETY.md  # Ausfüllhilfe Data Safety Section
  PRIVACY_POLICY.md / PRIVACY_POLICY_EN.md
  TESTING_README.md / TESTING_STRATEGY.md
  archive/                   # Historische Docs

scripts/
  validate-release.sh     # Pre-deployment Checks
  prepare-release.sh      # Play Store Release Validation
  validate-svg-counts.js  # Prüft SVG-Element-Counts in Level-Bildern
```

---

## Design-System

### Typografie-Hierarchie (`constants/Layout.ts`)

| Ebene | Token | px | Verwendung |
|-------|-------|----|------------|
| H1 | `FontSize.xxl` | 32 | App-Titel (Home) |
| H2 | `FontSize.xl` | 24 | Screen-/Modal-Titel |
| H3 | `FontSize.lg` | 20 | Abschnitts-Titel |
| Body | `FontSize.md` | 16 | Fließtext, Labels |
| Small | `FontSize.sm` | 14 | Captions |
| Tiny | `FontSize.xs` | 12 | Uppercase-Labels |
| Timer | `FontSize.huge` | 48 | **Nur** Timer-Anzeige |

### Spacing (`constants/Layout.ts`)
`xs=4, sm=8, md=16, lg=24, xl=32, xxl=48`

### Border Radius
`sm=8, md=10, lg=16 (Buttons), xl=20 (Cards), xxl=24, round=999`

### Farben (Primary)
```
primary:       #667eea  (Lila/Blau)
primary-light: #8599f3
primary-dark:  #4c63d2
secondary:     #f093fb  (Rosa)
accent:        #A8E6CF  (Mint)
background:    #FAFAFA  (Light) / #1a1a2e (Dark)
```

---

## Architektur-Entscheidungen

- **DrawingCanvas ist plattformspezifisch aufgeteilt:** `.native.tsx` (Skia) und `.web.tsx` (Canvas). Die `DrawingCanvas.tsx` ist ein Platform-Dispatcher. Nie direkte Skia-Importe in `.tsx` ohne `.native.tsx`-Extension.
- **Kein i18next** – eigenes `i18n.ts` mit `t('key')`-Aufruf. Übersetzungen in `locales/de/translations.json` und `locales/en/translations.json`.
- **Sentry ist opt-in:** `SentryService.ts` prüft selbst ob `EXPO_PUBLIC_SENTRY_DSN` gesetzt ist. Standard-Releases im Play Store haben Sentry deaktiviert.
- **ParentalGate vor externen Links:** `openExternalUrl()` in `SettingsModal.tsx` öffnet zuerst den ParentalGate-Dialog (zufällige Multiplikationsaufgabe), dann den Link. Google Play Families Policy Requirement.
- **StorageManager abstrahiert AsyncStorage/localStorage** – immer den StorageManager verwenden, nie direkt AsyncStorage oder localStorage importieren.
- **TypeScript-Pfad-Aliase:** `@services/` → `services/`, `@components/` → `components/` (konfiguriert in `babel.config.js` + `tsconfig.json`).

---

## Branching-Strategie

| Branch | Zweck |
|--------|-------|
| `main` | Produktions-Branch, CI läuft |
| `develop` | Feature-Integration |
| `testing` | QA / Staging |
| `staging` | Pre-Production |
| `claude/...` | Claude-Feature-Branches (auto-generiert) |

CI triggert bei Push auf `main`, `develop`, `testing` und bei PRs auf `main` und `develop`.

---

## CI/CD Pipeline (`ci-cd.yml`)

7 Jobs in Reihenfolge:

1. **`code-quality`** – ESLint, console.log-Check, Platform-API-Check, TypeScript
2. **`test`** – `npm run test:ci` (Jest + Coverage-Upload als Artefakt)
3. **`build-web`** – `expo export --platform web`
4. **`platform-checks`** – Sicherheits-Scan, Android Manifest Check
5. **`docs-privacy`** – prüft `docs/private/` gitignoriert, keine sensiblen Dateien committed
6. **`keystore-secrets`** – kein `.keystore`/`.jks` committed, kein hardcodiertes Passwort
7. **`release-checklist`** – Release Readiness Report (nur auf `main`)

**Wichtig:** Immer `npm run test:ci` verwenden (nutzt `--maxWorkers=2`, kein `--forceExit`).

---

## Sicherheits-Konventionen

- `docs/private/` ist gitignoriert – dorthin gehören Deployment-Guides, Store-Zugangsdaten etc. die lokal bleiben sollen
- `.keystore` und `.jks` sind gitignoriert
- Husky Pre-Commit Hook blockiert keystore-Dateien und hardcodierte Passwörter
- `EXPO_PUBLIC_SENTRY_DSN` niemals committen – als EAS Secret oder lokale `.env` halten

---

## Datenschutz / Privacy

- App ist **kindgerecht** (COPPA + DSGVO-konform)
- Keine Datensammlung im Standard-Build
- Sentry nur optional (Build-Flag `EXPO_PUBLIC_SENTRY_DSN`)
- Externer Link-Zugriff nur über ParentalGate
- Datenschutz-Dokumente:
  - `PRIVACY_POLICY.md` (Root, EN, Effective Date: 5. April 2026)
  - `docs/PRIVACY_POLICY.md` (DE, Letzte Aktualisierung: 1. Feb 2026)
  - `docs/PRIVACY_POLICY_EN.md` (EN)
  - `public/privacy-policy.html` + `public/privacy-policy-en.html` (gehostet)
  - **Alle 5 Dateien müssen bei Änderungen synchron gehalten werden!**

---

## Aktueller Stand (April 2026)

### Zuletzt gemergte PRs
- **#116** – Typografie-Hierarchie standardisiert, Button-Größen reduziert, SettingsModal auf Listen-Rows umgebaut
- **#122** – Play Store Vorbereitung: Privacy Policies aktualisiert, ParentalGate, CHANGELOG.md, THIRD_PARTY_LICENSES.md, CI Test-Job, Data Safety Docs
- **#121** – CI: `docs-privacy` + `keystore-secrets` Jobs, Husky Pre-Commit Hooks

### Nächste Schritte (offen)
- Data Safety Section in Play Console ausfüllen (Anleitung: `docs/PLAY_STORE_DATA_SAFETY.md`)
- Variabler Timer (Schwierigkeits-abhängig)
- Weitere Level (perspektivische Bilder, Schwierigkeit 4–5)
- Farbauswahl-Popup Verbesserung (#32)
- Achievements System

### Play Store Status
App ist technisch bereit. Noch ausstehend (manuell):
- [ ] Play Console: Data Safety ausfüllen
- [ ] Keystore lokal generieren + als EAS Secret hinterlegen
- [ ] Store Screenshots erstellen
- [ ] Release-Build via `npm run build:android`

---

## Häufige Fallstricke

- **Skia nur auf Native:** Keine Skia-Imports in Dateien ohne `.native.tsx`-Extension – bricht den Web-Build.
- **SVG-Bilder sind TSX-Komponenten**, keine `.svg`-Dateien. Element-Count muss in `validate-svg-counts.js` registriert sein.
- **`expo-linking` ist devDependency**, nicht runtime. Wird nur für Tests/Dev gebraucht.
- **i18next ist NICHT installiert** – kein `import i18next from 'i18next'`. Immer `t()` aus `services/i18n.ts`.
- **ThemeContext** ist der einzige Weg auf das aktuelle Theme zuzugreifen – kein direktes Lesen von AsyncStorage für Theme.
- **`develop`-Branch existiert auf GitHub**, wird aber nicht aktiv für Feature-Branches genutzt (Claude-Branches direkt von `main`).
