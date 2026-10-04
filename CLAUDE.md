# CLAUDE.md — DrawFromMemory

## Projekt

**Merke und Male** — Gedächtnistraining-App für Kinder (React Native / Expo).
Spieler sehen ein Bild kurz, zeichnen es aus dem Gedächtnis, vergleichen das Ergebnis.

- **Aktuell: v1.9.0** (package.json + app.json; versionCode 70)
- **Mindestanforderung Android: API 26 (Android 8.0 Oreo)** — Nexus 6 (max. API 25) wird nicht mehr unterstützt (Issue #172, geschlossen)
- **Live Demo:** https://s540d.github.io/DrawFromMemory/
- **Repo:** https://github.com/S540d/DrawFromMemory
- **Play Store:** `com.s540d.merkeundmale`

---

## Tech Stack

| Bereich         | Technologie / Version                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| Framework       | React Native 0.83.2 + Expo SDK 55                                                                            |
| React           | 19.2.0                                                                                                       |
| Navigation      | Expo Router ~55.0.5 (file-based)                                                                             |
| Native Drawing  | `@shopify/react-native-skia` 2.4.18                                                                          |
| Web Drawing     | Canvas API (`DrawingCanvas.web.tsx`)                                                                         |
| Animationen     | `react-native-reanimated` ~4.2.2                                                                             |
| State           | React Hooks + AsyncStorage                                                                                   |
| Theming         | ThemeContext (light / dark / system)                                                                         |
| Sound           | Web Audio API (web) + `expo-haptics` (native)                                                                |
| i18n            | Custom `services/i18n.ts` (de/en/es/fr/it/nl/pl), Locales in `locales/`, automatische Geräte-Spracherkennung |
| Tests           | Jest 29 + jest-expo ~55 (389+ Tests, jsdom-Environment)                                                      |
| CI              | GitHub Actions (`.github/workflows/ci-cd.yml`)                                                               |
| Build (Native)  | EAS Build (`eas.json`)                                                                                       |
| Crash Reporting | Sentry via `EXPO_PUBLIC_SENTRY_DSN` (optional, no-op on Web)                                                 |

---

## Wichtige Dateien

Kernstruktur: `app/` (Screens: `_layout`, `index`, `game`, `gallery`, `levels`, `settings`), `components/` (DrawingCanvas-Familie, `levelImages/` mit einer Render-Datei pro Bild + `registry.ts`, UI-Primitiven wie `Button`/`Badge`/`Chip`, Mascot-Komponenten), `services/` (Flood-Fill/Rasterizer, Level-/Storage-/Sound-/Sentry-/Mascot-/AgeGroup-Manager, i18n), `constants/` (`Colors.ts`, `Layout.ts`, `ExternalLinks.ts`), `utils/` (`platform.ts`, `useScreenLayout.ts`), `types/index.ts`, `locales/` (7 Sprachen).

Path-Aliase (tsconfig.json): `@/*`, `@services/*`, `@components/*`, `@utils/*` — App-/Produktionscode nutzt sie, Tests in `__tests__/` bleiben bei relativen Imports (Jest löst die Babel-Aliase nicht auf). `constants/` hat **kein** Alias — dort immer relative Imports.

Vollständige Verzeichnisstruktur, Architektur-Entscheidungen und Datenfluss: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) (inkl. DrawingCanvas-UI-Details wie Werkzeug-Icons, Tablet-Layout).

---

## Entwicklungs-Workflow

```bash
npm start                          # Expo Dev Server
npm run android                    # Android-Emulator
npm run ios                        # iOS-Simulator
npm run web                        # Web-Dev-Server
npm test                           # Jest (alle Tests)
npm run test:watch                 # Jest Watch Mode
npm run test:coverage              # Testabdeckung
npm run lint                       # ESLint
npm run validate:svg-counts        # Prüft SVG-Element-Counts in LevelImageDisplay.tsx
npx tsc --noEmit                   # TypeScript-Check
npm run build:web                  # Web-Build für gh-pages (expo export --platform web)
npm run build:doctor               # Preflight-Checks vor lokalem Build (Disk/JDK/foojay/Sollstand/Branch)
npm run build:android              # EAS Build (Android, Production)
npm run build:android:preview      # EAS Build (Android, Preview APK)
npm run build:android:local        # Lokaler EAS-Build (preview; :local:production für production)
npm run prepare-release            # Vorbereitungs-Script für Release
npm run validate                   # Vollständige Release-Validierung
npm run deploy:ghpages             # Deployment auf GitHub Pages
```

**Branch-Strategie:** `feature/issue-XXX → testing → main` (`staging` entfernt 2026-06-03, Issue #7).

> **⚠️ REGEL FÜR AI-ASSISTENTEN:** Merges auf `main` sind VERBOTEN ohne explizite schriftliche Freigabe durch den Nutzer in der aktuellen Konversation. Feature-PRs gehen immer gegen `testing`. `main` ist production — nur der Nutzer entscheidet, wann etwas dort landet.

---

## CI/CD (`.github/workflows/ci-cd.yml`)

Läuft auf `push` und `pull_request` gegen `main` und `testing`.

| Job | Name                       | Inhalt                                                                                                                                                                             |
| --- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Code Quality & Linting     | ESLint, kein `console.log` in `app/`/`components/`, Web-API-Guards prüfen, AsyncStorage-Usage, `validate:svg-counts`, TypeScript-Check (`npx tsc --noEmit`, blockiert bei Fehlern) |
| 2   | Unit Tests & Coverage      | `npm run test:ci` (Coverage-Artefakt wird hochgeladen)                                                                                                                             |
| 3   | Build Web                  | `expo export --platform web`                                                                                                                                                       |
| 4   | Platform Checks            | Versionskonsistenz: `package.json` vs. `app.json` müssen identische Version haben                                                                                                  |
| 5   | Security Audit             | `npm audit --audit-level=high` — blockiert bei high/critical                                                                                                                       |
| 6   | Docs Privacy Check         | `docs/private/` darf nicht committed sein                                                                                                                                          |
| 7   | Keystore & Credential Scan | Keine `.keystore`/`.jks` Dateien, keine hardcodierten Passwörter                                                                                                                   |
| 8   | Release Readiness Report   | Nur bei Push auf `main`; generiert manuelles Checklist-Summary                                                                                                                     |

**Coverage-Schwellenwerte (jest.config.js):** branches 49 %, functions 45 %, lines 54 %, statements 52 %.

---

## Spielmechanik & Phasen

```
memorize  →  draw  →  result
```

1. **Memorize**: SVG-Bild wird 3 Sekunden angezeigt (progressiver Aufdeckeffekt via `revealStep`). Timer läuft via `useTimer`.
2. **Draw**: Zeichnen auf `DrawingCanvas` (Pinsel + Flood-Fill). Tool wechselt nach Fill automatisch zu Brush zurück (Issue #45).
3. **Result**: Sternbewertung (1–5), Replay-Animation, Speichern in Galerie möglich.

Level-Anzahl: 20 (Difficulty 1–5). Alle Level haben 3 s Anzeigezeit.
Bilderpool: `ImagePoolManager.ts` wählt zufällig nach Difficulty-Klasse aus. Aktuell **81 Bilder** (inkl. Tiere v1 Pack — 10 Tiere, PR #221 + Fahrzeuge v1 Pack — 10 Fahrzeuge, PR #254 + Natur/Märchen/Essen v1 Packs — je 10 Bilder, Issue #279 1.5).

Fortschrittsanzeige oben im Spielschirm (`app/game.tsx`): proportionaler Balken (`levelNumber / totalLevels`), kein Punkte-Indikator mehr (PR #272 — die vorherigen 5 fest codierten Punkte waren bei 20 Levels irreführend).

### Themen-Pack-Auswahl (PR #271)

Auf dem Level-Auswahl-Screen (`app/levels.tsx`) gibt es neben der Spielvarianten-Auswahl einen zweiten Chip-Filter „Themen-Pack" (Alle / Tiere / Fahrzeuge), sofern der Bilderpool getaggte Packs enthält (`getAvailablePacks()` in `ImagePoolManager.ts`). Die Auswahl wird als `?pack=`-Query-Param an `/game` durchgereicht und schränkt `getRandomImageForLevel()` / `getSeededImageForLevel()` auf Bilder mit passendem `pack`-Tag ein — mit Fallback auf den vollen Schwierigkeitspool, falls ein Pack für ein Level leer ist.

### Spielvarianten (Issue #247)

Auf dem Level-Auswahl-Screen (`app/levels.tsx`) wählbar (`GameVariant` in `types/index.ts`), als `?variant=` Query-Param an `/game` übergeben: `normal` (Standard), `outline` (nur Umriss — `LevelImageDisplay` entfernt rekursiv alle Füllfarben, `mode="outline"`), `mirror` (Spiegelbild, `transform: scaleX(-1)`). Wirkt in Memorize-Phase und im Hinweis-Modal der Draw-Phase gleichermaßen. Kreativ-Modus (freies Malen ohne Vorlage, `app/creative.tsx`) ist eine eigenständige Route, kein `GameVariant`.

---

## DrawingCanvas-Architektur

| Datei                      | Zweck                                                                         |
| -------------------------- | ----------------------------------------------------------------------------- |
| `DrawingCanvas.tsx`        | Re-Export, öffentliches API (`DrawingCanvas`, `useDrawingCanvas`)             |
| `DrawingCanvas.hooks.ts`   | `useDrawingCanvas()` Hook: color, strokeWidth, tool, paths, undo, clearCanvas |
| `DrawingCanvas.shared.ts`  | `DrawingPath` Interface, Shared-Styles                                        |
| `DrawingCanvas.native.tsx` | Skia-Implementierung: `<Path>` für Strokes, `<Rect>`-Spans für Fills          |
| `DrawingCanvas.web.tsx`    | HTML5-Canvas-Implementierung                                                  |

**DrawingPath-Typ:**

```typescript
interface DrawingPath {
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
  type?: 'stroke' | 'fill'; // default = 'stroke'
}
```

### Werkzeug-Icons, Tablet-/Landscape-Layout & UI-Label-Historie

`components/game/ToolIcons.tsx` liefert abstrakte SVG-Icons (Pinsel/Füllen/Vorlage) statt Emoji. `useScreenLayout()` liefert `toolbarPosition` (`'bottom' | 'side'`) für Querformat/Tablet-Layouts (PR #287) — `DrawPhase.tsx` rendert bei `'side'` Zeichenfläche und Werkzeugleiste nebeneinander statt gestapelt.

Details (Icon-Farblogik, Layout-Schwellenwerte, Label-Historie aus APK-Feedback PR #292): [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md#drawingcanvas-ui-ausgelagert-aus-claudemd-issue-160).

---

## Flood-Fill Architektur (Native)

CPU-Flood-Fill auf alten Android-Geräten (Nexus 6 / Adreno 420) — die GPU-Pipeline (`readPixels` / `MakeImage`) ist dort unzuverlässig.

- CPU-Flood-Fill via `floodFillPixels()` (Scanline-Algorithmus, 1-Bit-Palette → ~20× weniger RAM als RGBA)
- Ergebnis: horizontale `FloodFillSpan[]` (Run-Length-Encoding)
- Native Rendering via Skia `<Rect>` Elemente — kein Image-Roundtrip
- Strokes werden IMMER als `<Path>` Komponenten gerendert — kein Mode-Switching
- `NativeFillLayerService` konvertiert `DrawingPath[]` → renderfähige Layers
- `SoftwareRasterizer` rastert bisherige Strokes für die Grenzenerkennung des Fill-Algorithmus

---

## Theming & Speicherung

`ThemeContext.tsx` stellt `useTheme()` bereit (`theme`: `'light'|'dark'`, `themeSetting`: `'light'|'dark'|'system'`, `colors`: typisiertes `ThemeColors`-Objekt, `setTheme()` persistiert in `StorageManager`). SSR/Hydration startet immer mit `'light'` (verhindert Hydration-Mismatch).

`StorageManager` ist ein AsyncStorage-Wrapper mit In-Memory-Fallback für Web; Keys beginnen mit `@merke_male:`. Gespeicherte Felder: `progress`, `theme`, `language`, `sound_enabled`, `music_enabled`, `extra_time_mode`, `gallery`. `extra_time_mode` bleibt aus Rückwärtskompatibilität erhalten, steuert die Anzeigedauer aber nicht mehr — das übernimmt `AgeGroupManager` (eigener Key `@merke_male:age_group`).

---

## Mascot & Altersstufen (Issue #279, 1.1 + 1.3)

**Mascot "Mali"** (`components/Mascot.tsx`, `services/MascotManager.ts`): SVG-Chamäleon-Begleitfigur, kein Lottie-Charakter (siehe `docs/ILLUSTRATION_STYLEGUIDE.md` für den visuellen Stil). Begrüßt auf dem Home-Screen (streak-abhängige Nachricht) und kommentiert die Ergebnis-Phase mit einer `MascotMood` (`neutral`/`happy`/`excited`/`encouraging`, abgeleitet aus der Sterne-Bewertung).

**Ein Fortschrittssystem statt eines weiteren Parallel-Systems:** Gesamt-Sterne (`StorageManager.getProgress()` → `getTotalStars()`) schalten kosmetische Mascot-Accessoires frei — `MASCOT_UNLOCKS` in `MascotManager.ts`: 15 → Hut, 40 → Sonnenbrille, 80 → Fliege, 150 → Krone. Bewusst **kein** separates XP-System, keine zusätzliche Währung. `useGamePhase.handleRatingSubmit()` vergleicht Sterne-Stand vor/nach dem Speichern und zeigt bei neuem Unlock `MascotUnlockToast` (mit `MascotSparkle`-Lottie-Effekt).

**Altersstufen** (`services/AgeGroupManager.ts`, `components/AgeGroupModal.tsx`): ersetzen den früher UI-losen `extra_time_mode`-Schalter durch eine bewusste Auswahl (3-5 / 6-8 / 9+) beim ersten Start, änderbar über Segment-Control in `SettingsModal.tsx`. Steuert Anzeigedauer-Bonus (`getExtraTimeForAgeGroup()`, nur 3-5), Standard-Strichstärke (`getDefaultStrokeWidthForAgeGroup()`: dick/mittel/dünn) und einen empfohlenen Level-Bereich (`getRecommendedLevelRange()`, dezenter Hinweis, **keine harte Sperre**).

---

## UI/UX Design System (Issue #176)

Phasen A–E abgeschlossen (Foundation, Components, Screens, Delight, Onboarding). Kern-Primitiven in `AnimatedPrimitives.tsx` (`AnimatedCard`, `GlassCard`, `AnimatedFeedback`, `AnimatedStar`, `PressableScale`, `PulseView`) — alle `prefers-reduced-motion`-aware. `Colors.glass.*` liefert Glassmorphism-Tokens (Surface/Border/Shadow, light+dark). Lottie via `MascotSparkle.tsx` (`lottie-react-native` + `@lottiefiles/dotlottie-react` als Web-Peer-Dependency, gemockt in Tests via `__mocks__/lottie-react-native.js`).

Phasen-Tabelle, Komponenten-API, `GlassCard`-Verwendungsbeispiel, vollständige Farbtoken-Liste: [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).

## Feature Flags (Env-Vars)

Alle `EXPO_PUBLIC_*`-Flags sind zur Build-Zeit eingefroren (Expo bündelt sie statisch).

| Env-Var                            | Default             | Bedeutung                                                                                                       |
| ---------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------- |
| `EXPO_PUBLIC_SENTRY_DSN`           | —                   | Sentry-Reporting aktivieren (leer = no-op)                                                                      |
| `EXPO_PUBLIC_ENABLE_IN_APP_REVIEW` | `false`             | In-App-Review-Prompt via `expo-store-review` — **deaktiviert bis Play-Store-Listing auditiert** (Issue #219 P0) |
| `EXPO_PUBLIC_PLAUSIBLE_DOMAIN`     | —                   | Privacy-freundliches, cookie-loses Web-Analytics (Plausible-kompatibel) — leer = no-op (Issue #279, 3.4)        |
| `EXPO_PUBLIC_PLAUSIBLE_SCRIPT_SRC` | Plausible-Cloud-URL | Überschreibt die Script-Quelle für self-hosted Plausible/Umami-kompatible Instanzen                             |

> **Aktivieren:** In `.env` oder EAS-Build-Profil `EXPO_PUBLIC_ENABLE_IN_APP_REVIEW=true` setzen.  
> Der Flag wird in `services/ReviewManager.ts` ausgewertet; kein Code-Change nötig.
>
> **Analytics aktivieren:** `EXPO_PUBLIC_PLAUSIBLE_DOMAIN=s540d.github.io` (oder eigene Domain) setzen — Tool-Entscheidung (Plausible-Cloud vs. self-hosted) und Domain-Wahl liegen beim Team, der Flag ist nur die Infrastruktur dafür (`services/AnalyticsService.ts`, aufgerufen in `app/_layout.tsx`).

---

## Konventionen für AI-Assistenten

### Verboten (wird von CI geprüft)

- `console.log` / `console.debug` in `app/` oder `components/`
- `window.*` ohne `Platform.OS === 'web'`-Guard oder `// platform-safe`-Kommentar
- `localStorage.*` ohne Platform-Check (AsyncStorage verwenden)
- `.keystore` / `.jks` Dateien committen

### Pflicht bei neuen SVG-Bildern

`IMAGE_ELEMENT_COUNTS` in `LevelImageDisplay.tsx` muss um den neuen Dateinamen ergänzt werden, sonst schlägt `npm run validate:svg-counts` fehl. Das eigentliche SVG-Markup kommt in eine neue Datei `components/levelImages/<basename>.tsx` (ohne `.svg`), die per `default export` eine `render(svgSize, viewBox)`-Funktion bereitstellt und in `components/levelImages/registry.ts` unter dem vollen Dateinamen (`'<basename>.svg'`) eingetragen wird — kein `case` mehr in `LevelImageDisplay.tsx` selbst (PR #309).

### Imports & Plattform-spezifischer Code

Path-Aliase nutzen: `@services/...`, `@components/...`, `@utils/...`. Web-APIs über `utils/platform.ts` absichern (`safeWebAPI`, `isWeb`-Guard). Für Storage stets `StorageManager` nutzen — nicht direkt `AsyncStorage` oder `localStorage`.

### react-native-svg auf Web

Niemals `rotation`/`origin`-Props an SVG-Elemente geben, die auch auf Web gerendert werden — ungültiges `transform-origin`-DOM-Attribut, Console-Error bei jedem Render. Stattdessen Standard-SVG `transform={`rotate(angle cx cy)`}` verwenden. Details: [`docs/private/INCIDENTS.md`](docs/private/INCIDENTS.md).

### Web-Meta-Tags / SEO

`app/+html.tsx` wird **nicht** gerendert, solange `app.json` `web.output: "single"` setzt — Expo kopiert in diesem Modus sein eigenes Template. Neue Meta-Tags, JSON-LD oder noscript-Inhalte gehören deshalb in `scripts/post-build.js` (wird von `deploy.yml` und `deploy-ghpages.sh` ausgeführt), sonst landen sie nie im Deployment. Play-Store-Links immer über `getPlayStoreUrl(source)` aus `constants/ExternalLinks.ts` erzeugen — der `referrer`-Parameter ist die einzige Möglichkeit, Installationen aus der Web-Demo in der Play Console zu sehen. Details: [`docs/WEB_DISCOVERABILITY.md`](docs/WEB_DISCOVERABILITY.md).

### Tests

- Test-Dateien liegen bei `services/__tests__/`, `components/__tests__/`, `utils/__tests__/`, `__tests__/`
- Jest-Umgebung: `jsdom`; Skia wird gemockt via `__mocks__/@shopify/react-native-skia.js`, `react-native-svg` via `__mocks__/react-native-svg.js`, `lottie-react-native` via `__mocks__/lottie-react-native.js` (alle global, automatisch für alle Tests aktiv — kein `jest.mock()`-Aufruf nötig)
- `getByTestId`/`queryByTestId` aus `@testing-library/react-native` matchen `node.props.testID` auf der React-Test-Instance-Ebene — unter der `react-native-web`-Abbildung (`moduleNameMapper` in `jest.config.js`) landet der Prop auf dem finalen Host-Element aber als `data-testid`, nicht mehr als `testID`, wodurch beide Queries nichts finden. Für testID-Prüfungen stattdessen `UNSAFE_getAllByType(View)` + `.props.testID`-Filter verwenden (etabliertes Muster in diesem Repo, siehe z.B. `MascotSparkle.test.tsx`).
- `@testing-library/dom` muss installiert sein (Peer-Dep von `@testing-library/react` v16)
- `npm test` (kein `--runInBand` nötig, aber stabil)

---

## Security

- `npm audit --audit-level=high` in CI — Pipeline blockiert bei high/critical
- Bekannte moderate Findings (jest-expo/expo-SDK-Chain) und Fix-Historie: [`docs/private/INCIDENTS.md`](docs/private/INCIDENTS.md)

---

## Wachstums-Roadmap (Issue #219)

Übergeordneter Plan für nachhaltiges Wachstum im Play Store. Stand `main` @ v1.9.0 / versionCode 70. **Play Store noch nicht auf v1.9.0** (Release-Aufgabe Issue #267). `testing` liegt primär mit Tech-Debt/Infra voraus (kein User-Facing-Feature-Rückstand). Themen-Packs sind über `LevelImage.pack?: string` getaggt; neue Packs brauchen Render-Dateien in `components/levelImages/` + Registry-/Pool-Einträge, visueller Stil verbindlich laut [`docs/ILLUSTRATION_STYLEGUIDE.md`](docs/ILLUSTRATION_STYLEGUIDE.md).

Vollständige P0/P1/P2-Statustabellen und Themen-Pack-Architektur-Details: [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

## Offene Issues / Bekannte Einschränkungen

- **jest-expo → @tootallnate/once** (low severity): Breaking-Major-Upgrade nötig — noch nicht gemacht. Details: [`docs/private/INCIDENTS.md`](docs/private/INCIDENTS.md).
- **foojay-resolver-Patch** (`patches/@react-native+gradle-plugin+0.83.6.patch`, via `postinstall`): hebt foojay-resolver 0.5.0 → 1.0.0, sonst bricht der Android-Build unter Gradle 9 / JDK 21 ab (Issue #276). **Bei RN-Upgrade prüfen:** `grep foojay node_modules/@react-native/gradle-plugin/settings.gradle.kts`; `npm run build:doctor` warnt automatisch bei Regression. Diagnose-Historie: [`docs/private/INCIDENTS.md`](docs/private/INCIDENTS.md).
- **Nexus 6**: EOL — `minSdkVersion` = 26; Nexus 6 endet bei API 25 (geschlossen via Issue #172)
- **iOS**: Nicht primär getestet (Fokus auf Web + Android)
- **iOS App Store**: Bundle ID `com.s540d.merkeundmale`, App Store URL noch TBD

---

## Wartung: CLAUDE.md klein halten (project-templates Issue #160)

Ziel: max. 300 Zeilen. Vorfalls-Abschnitte (Datum, PR-Nummer, Diagnose-Verlauf) gehören nicht hierher, sondern in [`docs/private/INCIDENTS.md`](docs/private/INCIDENTS.md) (gitignored) — nur Kernregel + kurzer Kontext + Link bleiben in dieser Datei. Gültiges, aber zu ausführliches Architektur-/Prozesswissen wandert stattdessen in versionierte `docs/*.md`-Dateien (z.B. `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/ROADMAP.md`). Details zum Ablauf: `dev-standards/claude-md-maintenance.md` in project-templates.

<!-- GLOBAL POLICY:START -->

## [GLOBAL POLICY]

> Automatisch synchronisiert aus project-templates (Issue #7). Nicht manuell editieren –
> Änderungen hier werden beim nächsten Sync überschrieben. Quelle anpassen statt lokal.

- PRs immer gegen `testing`, nie direkt gegen `staging` oder `main`
- Merge auf `main` nur mit expliziter schriftlicher Freigabe
- `--delete-branch` nur für Feature-Branches (nie staging/testing)
- **Lokales Branch-Cleanup:** `main` und `testing` NIE löschen — auch nicht beim Bulk-Delete verwaister `[gone]`-Branches. Ein fehlender `origin/main`/`origin/testing` ist ein **wiederherzustellender Defekt** (lokal behalten, nach origin zurückpushen), kein Aufräum-Signal.
- `--no-verify` nur auf explizite Bitte
- **Vor jedem Push: lokale Tests ausführen** (`npm test` bzw. projektspezifischer Test-Befehl) – kein Push ohne grüne lokale Tests
- **Kein Merge bei CI-Fail** – Branch Protection erzwingt das technisch; nie mit `--admin` umgehen außer auf explizite Bitte
- **Zugehöriges Issue beim Merge schließen** (Issue #111): `Closes #X` im PR-Body greift nur beim Merge in den Default-Branch (`main`) — bei PRs nach `testing` also **nie**. Das Issue nach dem Merge manuell schließen (`gh issue close <N> -c "Umgesetzt in #<PR>, gemergt nach \`testing\`."`), sonst bleiben erledigte Issues offen liegen. Ausnahme: Sammel-/Meta-Issues, die ein Teil-PR nur anteilig abarbeitet — die bleiben offen. `Closes #X` trotzdem im PR-Body lassen: es erzeugt die sichtbare Verknüpfung.

## [ANDROID BUILD – PFLICHTREGELN]

- **Git-Tag** nach jedem Play-Store-Upload setzen: `git tag vX.Y.Z && git push origin vX.Y.Z` – der Tag markiert den tatsächlich veröffentlichten Stand und dient als Changelog-Baseline für den nächsten Build
- **EAS Local Build (DrawFromMemory):** Workingdir vor jedem Build leeren: `rm -rf ~/tmp/eas-build && mkdir -p ~/tmp/eas-build` – ein nicht-leeres Verzeichnis bricht den Build sofort ab
- **Disk-Check vor EAS Build:** Skia-Libraries benötigen ~5–8 GB. Bei < 5 GB frei: `npm cache clean --force && rm -rf ~/.npm/_npx` (~13 GB, sicher löschbar)
- **JAVA_HOME** für EAS/Expo-Builds explizit auf Android Studio JBR setzen: `export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"`
- **Gradle-Lock nach Absturz:** Bei "Cannot lock file hash cache"-Fehler Daemons stoppen: `pkill -f GradleDaemon`, dann Workingdir leeren und neu starten
- **AAB-Archiv:** Gebaute Release-AABs in einem **gitignored** `aab-archive/`-Verzeichnis im Repo-Root ablegen (in `.gitignore` aufnehmen – AABs sind 3–110 MB und gehören nie in die Git-History). Benennung: `<Projekt>-vX.Y.Z-vc<versionCode>-YYYY-MM-DD.aab`. **Retention: max. 2 Dateien** (aktuelles Release + ein Vorgänger für schnelles Rollback); ältere AABs löschen. Der Git-Tag `vX.Y.Z` ist die eigentliche Release-Baseline – ältere AABs lassen sich daraus jederzeit neu bauen.

## [CLAUDE.MD-WARTUNG]

- **CLAUDE.md bleibt bei maximal 300 Zeilen** (Issue #160): Sie wird bei jeder Session vollständig in den Kontext geladen. Beschreibt ein Abschnitt einen konkreten Vorfall, gehören maximal 2-3 Zeilen (Kernregel + kurzer Auslöser-Kontext) + ein Link auf `docs/private/INCIDENTS.md` hinein; aktuell gültiges Architektur-/Prozesswissen, das kein Vorfall ist, aber zu ausführlich für CLAUDE.md, gehört in versionierte `docs/*.md`-Dateien (z. B. `docs/ARCHITECTURE.md`). Die Schwelle ist ein Prüf-Auslöser, kein Zwang, bewusst dort gehaltenes, aktuelles Architekturwissen aus CLAUDE.md zu verdrängen. Aktiv gekürzt wird erst ab 500 Zeilen; Dateien zwischen 300 und 500 Zeilen werden im Turnus nicht angefasst. Ausführlicher Prozess, Checkliste und Stand pro Projekt: https://github.com/S540d/project-templates/blob/main/dev-standards/claude-md-maintenance.md
- **`docs/private/INCIDENTS.md` ist bewusst gitignored** — reine lokale Gedächtnisstütze wie Memory, kein Teil des geteilten Repo-Zustands. In jedem Projekt mit dieser Datei muss `.gitignore` einen Eintrag `docs/private/` enthalten; existiert die Datei bereits versioniert (z. B. als `docs/INCIDENTS.md`), gehört sie nach `docs/private/` verschoben und per `git rm --cached` aus dem Tracking genommen.
- **Regelmäßig `/simplify` auf CLAUDE.md ausführen**, nicht nur einmalig beim Überschreiten der Schwelle — Ziel ist dauerhaft niedriger Token-Verbrauch pro Session statt zyklischem Anwachsen und Zurückkürzen in großen Sprüngen.

## [CODE HEALTH AUDIT]

- **Wiederkehrendes Code-Health-Audit** (Ballast/Architektur: God Components, Boilerplate-Duplikation, toter Code, Dependency-Bloat, Test-Integrität, Design-Konsistenz, Bundle-Größe) alle ~3 Monate oder ~15 gemergte Feature-PRs (je nachdem was zuerst eintritt). Checkliste + Ablauf: https://github.com/S540d/project-templates/blob/main/dev-standards/code-health-audit.md — Ergebnis ist immer ein Issue im jeweiligen Projekt-Repo, nie in project-templates.

## [SIMPLIFY-AUDIT]

- **Wiederkehrender `/simplify`-Durchlauf auf den Quellcode** (Reuse, Simplification, Efficiency, Altitude) alle ~3 Monate oder ~15 gemergte Feature-PRs (je nachdem was zuerst eintritt), gleiche Kadenz wie das Code-Health-Audit. Anders als dieses wendet er die Fixes direkt an: Ergebnis ist ein PR gegen den projektüblichen Ziel-Branch, nur kleine, verhaltensneutrale Refactorings (bei Unsicherheit Finding auslassen). Ablauf: https://github.com/S540d/project-templates/blob/main/dev-standards/simplify-audit.md

## [ÜBER-ABSCHNITT]

- **Einheitlicher „Über"-Abschnitt im Settingsmenü** (Issue #150): Jedes Web-Projekt zeigt „Über" als Eintrag in einem `⋮`-Settingsmenü (kein Footer — wird bei Bedarf neu angelegt, auch für aktuell menülose Projekte). Fester Vollausbau: App-Name, Version, Impressum, Datenschutz, Quellcode, Play Store, Feedback — nicht zutreffende Felder werden weggelassen, nie umsortiert. Spezifikation: https://github.com/S540d/project-templates/blob/main/dev-standards/about-section.md — Umsetzung ist immer ein Issue im jeweiligen Projekt-Repo, nie in project-templates.

## [CI – CACHE-CLEANUP]

- **Cache-Cleanup-Workflow** (`.github/workflows/cache-cleanup.yml`) in jedem Repo mit GitHub-Actions-Caches: löscht wöchentlich (So 03:00 UTC) bzw. on-demand alle Action-Caches älter als der jeweils letzte Lauf. GitHub-Limit ist 10 GB pro Repo – ohne Cleanup laufen Build-Caches (node_modules, Gradle, Expo) voll und verdrängen frische Einträge. Vorlage: `cache-cleanup.yml` in project-templates.

<!-- GLOBAL POLICY:END -->
