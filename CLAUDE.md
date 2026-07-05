# CLAUDE.md — DrawFromMemory

## Projekt

**Merke und Male** — Gedächtnistraining-App für Kinder (React Native / Expo).
Spieler sehen ein Bild kurz, zeichnen es aus dem Gedächtnis, vergleichen das Ergebnis.

- **Aktuell: v1.7.0** (package.json + app.json; versionCode 66)
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
| Tests           | Jest 29 + jest-expo ~55 (373+ Tests, jsdom-Environment)                                                      |
| CI              | GitHub Actions (`.github/workflows/ci-cd.yml`)                                                               |
| Build (Native)  | EAS Build (`eas.json`)                                                                                       |
| Crash Reporting | Sentry via `EXPO_PUBLIC_SENTRY_DSN` (optional, no-op on Web)                                                 |

---

## Wichtige Dateien

```
app/
  _layout.tsx           # Root-Layout, ThemeProvider, SafeAreaProvider, SentryService
  index.tsx             # Home Screen (Startseite)
  game.tsx              # Haupt-Spielschirm (Merken → Zeichnen → Ergebnis)
  gallery.tsx           # Galerie gespeicherter Zeichnungen
  levels.tsx            # Level-Auswahl (10 Level, Difficulty 1-5)
  settings.tsx          # Einstellungen (via ParentalGate geschützt)

components/
  DrawingCanvas.tsx          # Re-Export + öffentliches API (useDrawingCanvas)
  DrawingCanvas.hooks.ts     # useDrawingCanvas Hook (color, strokeWidth, tool, paths, undo, clear)
  DrawingCanvas.shared.ts    # Gemeinsame Typen (DrawingPath) und Styles
  DrawingCanvas.native.tsx   # Native Skia-Implementierung (Flood-Fill via Rect-Spans)
  DrawingCanvas.web.tsx      # Web Canvas-Implementierung
  LevelImageDisplay.tsx      # SVG-Bild mit schrittweisem Aufdecken (revealStep)
  ParentalGate.tsx           # Eltern-Sperre für Einstellungen
  SettingsModal.tsx          # Einstellungen-Modal (In-Game)
  ErrorBoundary.tsx          # Fehlerbehandlung für Render-Fehler
  AnimatedPrimitives.tsx     # AnimatedCard, GlassCard, AnimatedButton, AnimatedFeedback, AnimatedStar
  AnimatedSplashScreen.tsx   # Animierter Splash Screen
  Badge.tsx                  # UI-Primitiv: Badge
  Chip.tsx                   # UI-Primitiv: Chip
  Button.tsx                 # UI-Primitiv: Button (primary = LinearGradient cta, secondary = outlined, ghost = transparent, danger = solid)
  SkeletonLoader.tsx         # Skeleton Placeholder

services/
  FloodFillService.ts        # Flood-Fill-Algorithmus (Scanline, 1-Bit-Palette)
  SoftwareRasterizer.ts      # CPU-Rasterizer für native Fill-Grenzenerkennung
  NativeFillLayerService.ts  # Konvertiert DrawingPath[] → native Skia Rect-Spans
  ImagePoolManager.ts        # Bilderpool: wählt zufällige Bilder nach Schwierigkeit
  LevelManager.ts            # Level-Definitionen (10 Level, Anzeigedauer, Difficulty)
  StorageManager.ts          # AsyncStorage-Wrapper mit In-Memory-Fallback für Web
  RatingManager.ts           # Stern-Bewertungen und rotierende Motivations-Nachrichten
  SoundManager.ts            # Web Audio API (Web) + expo-haptics (Native)
  SentryService.ts           # Sentry-Wrapper (init, captureException, etc.)
  ThemeContext.tsx            # ThemeProvider + useTheme Hook (light/dark/system)
  i18n.ts                    # Übersetzungs-Service (de/en/es/fr/it/nl/pl) mit listener-basiertem Reload + automatischer Geräte-Spracherkennung
  ReviewManager.ts           # In-App-Review-Trigger: 5-Sterne oder 3. Daily Challenge, 90-Tage-Cooldown — deaktiviert via EXPO_PUBLIC_ENABLE_IN_APP_REVIEW
  ShareService.ts            # PNG-Export (Web): Off-Screen-Canvas → Web Share API / Download-Fallback
  ShareService.native.ts     # PNG-Export (Native): Skia Surface → expo-file-system + expo-sharing
  useGamePhase.ts            # Spielphasen-Hook: memorize / draw / result + Replay
  useTimer.ts                # Timer-Hook (Countdown, pause/resume via phase)

constants/
  Colors.ts                  # Design-Tokens: Primärfarben, Gradienten, shadow.*, glass.*, Drawing-Farben
  Layout.ts                  # Spacing, FontSize, FontWeight, BorderRadius
  WebAccessibility.ts        # Web-spezifische Accessibility-Konstanten

utils/
  platform.ts                # isWeb/isIOS/isAndroid, safeWebAPI(), Storage-Adapter
  useScreenLayout.ts         # Responsiver Layout-Hook (xs/sm/md/lg nach nutzbarer Höhe)

types/
  index.ts                   # Globale TypeScript-Typen (LevelImage, GamePhase, AppSettings, …)

locales/
  de/translations.json       # Deutsche Übersetzungen
  en/translations.json       # Englische Übersetzungen
  es/, fr/, it/, nl/, pl/     # Spanisch, Französisch, Italienisch, Niederländisch, Polnisch (Issue #247)

assets/images/levels/        # Kanonische SVG-Bilder (level-01-sun.svg … extra-04-bird.svg)
assets/images/levels-{1-5}/  # Level-sortierte Kopien der gleichen SVGs
```

---

## Path-Aliase (tsconfig.json)

```jsonc
"@/*"           → "./*"
"@services/*"   → "./services/*"
"@components/*" → "./components/*"
"@utils/*"      → "./utils/*"
```

App- und Produktionscode verwendet diese Aliase (`@services/LevelManager`, nicht `../services/LevelManager`). Testdateien in `__tests__/` nutzen weiterhin relative Imports, da Jest die Babel-Aliase nicht auflöst.

> **Hinweis:** `constants/` hat kein Alias — dort immer relative Imports verwenden (`../constants/Colors`, `../constants/Layout`).

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
npm run build:android              # EAS Build (Android, Production)
npm run build:android:preview      # EAS Build (Android, Preview APK)
npm run build:android:local        # Lokaler EAS-Build (preview)
npm run build:android:local:production  # Lokaler EAS-Build (production)
npm run prepare-release            # Vorbereitungs-Script für Release
npm run validate                   # Vollständige Release-Validierung
npm run deploy:ghpages             # Deployment auf GitHub Pages
```

**Branch-Strategie:** `feature/issue-XXX → testing → main` (`staging` entfernt 2026-06-03, Issue #7).

> **⚠️ REGEL FÜR AI-ASSISTENTEN:** Merges auf `main` sind VERBOTEN ohne explizite schriftliche Freigabe durch den Nutzer in der aktuellen Konversation. Feature-PRs gehen immer gegen `testing`. `main` ist production — nur der Nutzer entscheidet, wann etwas dort landet.

---

## CI/CD (`.github/workflows/ci-cd.yml`)

Läuft auf `push` und `pull_request` gegen `main` und `testing`.

| Job | Name                       | Inhalt                                                                                                                                                                              |
| --- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Code Quality & Linting     | ESLint, kein `console.log` in `app/`/`components/`, Web-API-Guards prüfen, AsyncStorage-Usage, `validate:svg-counts`, TypeScript-Check (`npx tsc --noEmit \|\| true`, non-blocking) |
| 2   | Unit Tests & Coverage      | `npm run test:ci` (Coverage-Artefakt wird hochgeladen)                                                                                                                              |
| 3   | Build Web                  | `expo export --platform web`                                                                                                                                                        |
| 4   | Platform Checks            | Versionskonsistenz: `package.json` vs. `app.json` müssen identische Version haben                                                                                                   |
| 5   | Security Audit             | `npm audit --audit-level=high` — blockiert bei high/critical                                                                                                                        |
| 6   | Docs Privacy Check         | `docs/private/` darf nicht committed sein                                                                                                                                           |
| 7   | Keystore & Credential Scan | Keine `.keystore`/`.jks` Dateien, keine hardcodierten Passwörter                                                                                                                    |
| 8   | Release Readiness Report   | Nur bei Push auf `main`; generiert manuelles Checklist-Summary                                                                                                                      |

**Coverage-Schwellenwerte (jest.config.js):** branches 15 %, functions 25 %, lines 25 %, statements 25 %.

---

## Spielmechanik & Phasen

```
memorize  →  draw  →  result
```

1. **Memorize**: SVG-Bild wird 3 Sekunden angezeigt (progressiver Aufdeckeffekt via `revealStep`). Timer läuft via `useTimer`.
2. **Draw**: Zeichnen auf `DrawingCanvas` (Pinsel + Flood-Fill). Tool wechselt nach Fill automatisch zu Brush zurück (Issue #45).
3. **Result**: Sternbewertung (1–5), Replay-Animation, Speichern in Galerie möglich.

Level-Anzahl: 20 (Difficulty 1–5). Alle Level haben 3 s Anzeigezeit.
Bilderpool: `ImagePoolManager.ts` wählt zufällig nach Difficulty-Klasse aus. Aktuell **51 Bilder** (inkl. Tiere v1 Pack — 10 Tiere, PR #221 + Fahrzeuge v1 Pack — 10 Fahrzeuge, PR #254).

### Spielvarianten (Issue #247)

Auf dem Level-Auswahl-Screen (`app/levels.tsx`) wählbar (`GameVariant` in `types/index.ts`), wird als `?variant=` Query-Param an `/game` übergeben:

| Variante  | Effekt                                                                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `normal`  | Standard — Bild wird unverändert gezeigt                                                                                                   |
| `outline` | Nur Umriss merken — `LevelImageDisplay` entfernt rekursiv alle Füllfarben (`mode="outline"`), nur eine einheitliche Kontur bleibt sichtbar |
| `mirror`  | Spiegelbild — `LevelImageDisplay` spiegelt die Anzeige horizontal (`mirror`, `transform: scaleX(-1)`)                                      |

Wirkt in Memorize-Phase und im Hinweis-Modal der Draw-Phase gleichermaßen. Kreativ-Modus (freies Malen ohne Vorlage, `app/creative.tsx`) ist eine eigenständige Route, kein `GameVariant`.

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

## Theming

`ThemeContext.tsx` stellt `useTheme()` bereit:

- `theme`: aktuell aktives Schema (`'light' | 'dark'`)
- `themeSetting`: gespeicherte Präferenz (`'light' | 'dark' | 'system'`)
- `colors`: typisiertes `ThemeColors`-Objekt (primary, background, text, drawing, difficulty, stars, …)
- `setTheme(theme)`: persistiert in `StorageManager`

Beim SSR/Hydration startet die App immer mit `'light'` (verhindert Hydration-Mismatch).

---

## Speicherung (StorageManager)

AsyncStorage-Wrapper mit In-Memory-Fallback für Web (GitHub Pages).
Storage-Keys beginnen mit `@merke_male:`.

Gespeicherte Felder: `progress`, `theme`, `language`, `sound_enabled`, `music_enabled`, `extra_time_mode`, `gallery`.

---

## UI/UX Design System (Issue #176)

Stand `testing`: Phase A, B, C und E abgeschlossen, Phase D (Konfetti + Jubel-Sound, TimerArc, Phasen-Crossfade, Stats-Counter) größtenteils umgesetzt — nur Lottie offen.

### Phase-Übersicht

| Phase                                                                       | Status                                                                                                           | Branch/PR                            |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **A: Foundation** — Farbpalette, Dark Mode, Nunito-Font, Typografie         | ✅ in `testing`                                                                                                  | PR merged                            |
| **B: Components** — Gradient-Buttons, Glassmorphism-Cards, Sterne-Animation | ✅ in `testing`                                                                                                  | PR #178 merged                       |
| **C: Screens** — Timer-Visualisierung, Phase-Übergänge, Home-Refresh        | ✅ in `testing`                                                                                                  | PR #257 merged                       |
| **D: Delight** — Lottie, Konfetti, Mikro-Sounds                             | 🔶 größtenteils (Konfetti + Jubel-Sound PR #253, TimerArc/Phasen-Crossfade/Stats-Counter PR #257) — Lottie offen | —                                    |
| **E: Onboarding** — First-Run-Tour                                          | ✅ in `testing`                                                                                                  | PR #261 merged (In-Game Coach-Marks) |

### Neue Primitiven (Phase B)

**`AnimatedPrimitives.tsx`** exportiert:

| Komponente         | Zweck                                                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `AnimatedCard`     | Fade-in + Slide-up Eingangs-Animation mit Stagger (50 ms/Item)                                                   |
| `GlassCard`        | Glassmorphism + Eingangs-Animation + optionaler Press-Lift (scale 0.97, Spring) — `prefers-reduced-motion`-aware |
| `AnimatedButton`   | Scale-Spring bei Press                                                                                           |
| `AnimatedFeedback` | Scale + Fade beim Erscheinen (z.B. Feedback-Text)                                                                |
| `AnimatedStar`     | Spring-Bounce-Pop beim Füllen, Stagger 80 ms/Stern, goldener Textglow — `prefers-reduced-motion`-aware           |

**`GlassCard` verwenden:**

```tsx
import { GlassCard } from '@components/AnimatedPrimitives';
import Colors from '../constants/Colors';

const { theme } = useTheme();
const glassSurface = theme === 'dark' ? Colors.glass.darkSurface : Colors.glass.lightSurface;
const glassBorder  = theme === 'dark' ? Colors.glass.darkBorder  : Colors.glass.lightBorder;
const glassShadow  = theme === 'dark' ? Colors.glass.darkShadow  : Colors.glass.lightShadow;

<GlassCard
  index={index}
  onPress={...}       // optional — aktiviert Press-Lift
  style={[{ backgroundColor: glassSurface, borderColor: glassBorder, borderWidth: 1.5 }, glassShadow]}
>
  {children}
</GlassCard>
```

**`Colors.glass`-Tokens:**

```ts
Colors.glass.lightSurface; // 'rgba(255,255,255,0.88)'
Colors.glass.darkSurface; // 'rgba(42,35,64,0.88)'
Colors.glass.lightBorder; // 'rgba(255,255,255,0.70)'
Colors.glass.darkBorder; // 'rgba(255,255,255,0.10)'
Colors.glass.lightShadow; // { boxShadow, elevation } — lila Tönung
Colors.glass.darkShadow; // { boxShadow, elevation } — dunkel
```

**`Colors.shadow.buttonPrimary`** — lila-getönter Schatten für primäre CTAs (`Button` variant=`primary` verwendet ihn intern).

---

## Feature Flags (Env-Vars)

Alle `EXPO_PUBLIC_*`-Flags sind zur Build-Zeit eingefroren (Expo bündelt sie statisch).

| Env-Var                            | Default | Bedeutung                                                                                                       |
| ---------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| `EXPO_PUBLIC_SENTRY_DSN`           | —       | Sentry-Reporting aktivieren (leer = no-op)                                                                      |
| `EXPO_PUBLIC_ENABLE_IN_APP_REVIEW` | `false` | In-App-Review-Prompt via `expo-store-review` — **deaktiviert bis Play-Store-Listing auditiert** (Issue #219 P0) |

> **Aktivieren:** In `.env` oder EAS-Build-Profil `EXPO_PUBLIC_ENABLE_IN_APP_REVIEW=true` setzen.  
> Der Flag wird in `services/ReviewManager.ts` ausgewertet; kein Code-Change nötig.

---

## Konventionen für AI-Assistenten

### Verboten (wird von CI geprüft)

- `console.log` / `console.debug` in `app/` oder `components/`
- `window.*` ohne `Platform.OS === 'web'`-Guard oder `// platform-safe`-Kommentar
- `localStorage.*` ohne Platform-Check (AsyncStorage verwenden)
- `.keystore` / `.jks` Dateien committen

### Pflicht bei neuen SVG-Bildern

`IMAGE_ELEMENT_COUNTS` in `LevelImageDisplay.tsx` muss um den neuen Dateinamen ergänzt werden, sonst schlägt `npm run validate:svg-counts` fehl.

### Imports

Path-Aliase nutzen: `@services/...`, `@components/...`, `@utils/...`.

### Plattform-spezifischer Code

Web-APIs über `utils/platform.ts` absichern (`safeWebAPI`, `isWeb`-Guard). Für Storage stets `StorageManager` nutzen — nicht direkt `AsyncStorage` oder `localStorage`.

### react-native-svg auf Web

Niemals `rotation`/`origin`-Props an SVG-Elemente geben, die auch auf Web gerendert werden — sie erzeugen ein ungültiges `transform-origin`-DOM-Attribut (React DOM erwartet `transformOrigin`) → Console-Error bei jedem Render. Stattdessen Standard-SVG `transform={`rotate(angle cx cy)`}` verwenden (Fix: PR #265).

### Tests

- Test-Dateien liegen bei `services/__tests__/`, `components/__tests__/`, `utils/__tests__/`, `__tests__/`
- Jest-Umgebung: `jsdom`; Skia wird gemockt via `__mocks__/@shopify/react-native-skia.js`
- `@testing-library/dom` muss installiert sein (Peer-Dep von `@testing-library/react` v16)
- `npm test` (kein `--runInBand` nötig, aber stabil)

---

## Security

- `npm audit --audit-level=high` in CI — Pipeline blockiert bei high/critical
- Verbleibende Findings (11 moderate, Stand 2026-07-03): alle im jest-expo/expo-SDK-Chain — nur via `npm audit fix --force` (Breaking) behebbar, `npm audit --audit-level=high` schlägt nicht an
- Alle high/critical Vulnerabilities zuletzt gefixt: 2026-07-03 via `npm audit fix` (19 → 11, PR #265)

---

## Wachstums-Roadmap (Issue #219)

Übergeordneter Plan, um aus der App eine dauerhaft wachsende Kids-App im Play Store zu machen.
Stand: `main` @ v1.7.0 / versionCode 66 — `testing` synchron. Enthält Fahrzeuge v1, PNG-Export, Mini-Tutorial, Design-System Phase C/D-Polish, Spielvarianten, weitere Sprachen, Sentry-ErrorBoundary (#264) und den transform-origin Web-Fix (#265). **Play Store noch nicht auf v1.7.0** — Release-Aufgabe in Issue #267.

### P0 — Foundation für Wachstum

| Task                                           | Status                                                                                                                                             |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Galerie-Persistenz (#215)                      | ✅ erledigt (v1.6.3)                                                                                                                               |
| Play-Store-Listing-Audit                       | ⏭ extern — teilweise umgesetzt                                                                                                                     |
| **In-App-Review-Prompt** (`expo-store-review`) | ✅ in main (v1.7.0) — per Feature-Flag deaktiviert (`EXPO_PUBLIC_ENABLE_IN_APP_REVIEW`)                                                            |
| Analytics-Setup (COPPA-konform)                | 🔲 offen — Tool-Entscheidung nötig                                                                                                                 |
| Crash-Rate-Baseline (Sentry)                   | 🟡 teilweise — ErrorBoundary meldet an Sentry, initSentry abgesichert (PR #264); noch offen: `EXPO_PUBLIC_SENTRY_DSN` für Produktions-Build setzen |

### P1 — Content & Retention

| Task                                                                     | Status              |
| ------------------------------------------------------------------------ | ------------------- |
| **Themen-Pack Tiere v1** (10 Bilder, #222)                               | ✅ in main (v1.7.0) |
| **Themen-Pack Fahrzeuge v1** (10 Bilder, PR #254)                        | ✅ in main (v1.7.0) |
| Themen-Pack Natur / Märchen / weitere                                    | 🔲 offen            |
| **Spielvarianten** (Nur Umriss merken, Spiegelbild, Kreativ-Modus, #247) | ✅ in main (v1.7.0) |
| Avatar & Personalisierung                                                | 🔲 offen            |
| XP- & Level-System                                                       | 🔲 offen            |
| Wöchentliche Challenge                                                   | 🔲 offen            |

### P2 — Reichweite & Trust

| Task                                                     | Status                                                    |
| -------------------------------------------------------- | --------------------------------------------------------- |
| Designed for Families Programm                           | 🔲 offen                                                  |
| **Weitere Sprachen** (ES/FR/IT/NL/PL, #247)              | ✅ in main (v1.7.0) — automatische Geräte-Spracherkennung |
| **Sharing-Feature / PNG-Export** (ShareService, PR #255) | ✅ in main (v1.7.0)                                       |
| Push-Notifications (opt-in)                              | 🔲 offen                                                  |

### Themen-Pack Architektur (ab PR #221)

- `LevelImage.pack?: string` — optionaler Tag (z.B. `'tiere-v1'`)
- Bilder ohne `minLevel` sind ab dem passenden Difficulty-Level verfügbar
- Neue Packs: einfach neue Cases in `LevelImageDisplay.tsx` + Einträge in `ImagePoolManager.ts` + `IMAGE_ELEMENT_COUNTS`
- Pflicht nach jedem neuen SVG: `npm run validate:svg-counts` (derzeit 51 Einträge)

---

## Offene Issues / Bekannte Einschränkungen

- **jest-expo → @tootallnate/once** (low severity): Fix würde Breaking-Major-Upgrade von jest-expo erfordern (aktuell `~55.0.9`) — noch nicht gemacht
- **Nexus 6**: EOL — `minSdkVersion` = 26; Nexus 6 endet bei API 25 (geschlossen via Issue #172)
- **iOS**: Nicht primär getestet (Fokus auf Web + Android)
- **iOS App Store**: Bundle ID `com.s540d.merkeundmale`, App Store URL noch TBD
