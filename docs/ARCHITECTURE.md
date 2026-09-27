# Architecture — DrawFromMemory ("Merke und Male")

## Overview

Memory-and-drawing game for children: an image is shown for a limited time, then
hidden, and the player redraws it from memory. One Expo codebase ships to Android
(Play Store) and to the web as a PWA. All progress is local — no backend, no account.

```
Level selected
      ↓
memorize phase   (image visible, timer, progressive reveal)
      ↓
draw phase       (Skia canvas — strokes + flood fill)
      ↓
result phase     (comparison, achievements, mascots, streak)
      ↓
StorageManager   (AsyncStorage: progress, badges, settings)
```

## Directory Structure

Routing is file-based via `expo-router` — every file in `app/` is a route.
Imports use the path aliases `@services/*`, `@components/*`, `@utils/*`
(see `tsconfig.json`); prefer them over deep relative paths.

```
/                            # Repo root = app root
├── app/                     # expo-router routes (file = screen)
│   ├── _layout.tsx          #   root layout, providers
│   ├── index.tsx            #   home
│   ├── game.tsx             #   the three-phase game loop
│   ├── levels.tsx, gallery.tsx, creative.tsx, settings.tsx
│   └── +html.tsx            #   web-only document head (SEO, meta)
├── components/
│   ├── game/                #   MemorizePhase, DrawPhase, ResultPhase, TimerArc
│   ├── DrawingCanvas.*.tsx  #   Skia canvas, split by platform
│   └── …                    #   Badge, Toast, Modal, Mascot components
├── services/                # Stateful managers, one domain each
│   ├── useGamePhase.ts      #   phase state machine + timers
│   ├── LevelManager.ts      #   level/difficulty resolution
│   ├── FloodFillService.ts  #   pixel flood fill
│   ├── NativeFillLayerService.ts + SoftwareRasterizer
│   ├── StorageManager.ts    #   AsyncStorage access
│   ├── AchievementManager, MascotManager, StreakManager, …
│   ├── SentryService.ts     #   crash reporting
│   └── i18n.ts              #   translation hook
├── constants/               # Colors, Layout, featureFlags, ExternalLinks
├── locales/                 # de, en, es, fr, it, nl, pl
├── utils/                   # platform.ts, useScreenLayout, useReduceMotion
├── types/index.ts           # GamePhase, LevelImage, shared types
├── plugins/, patches/       # Expo config plugins, patch-package fixes
├── scripts/                 # build-doctor, build-local, validate-release, deploy
└── docs/                    # Project documentation
```

## Key Decisions

### Three-phase game loop in one state machine

`services/useGamePhase.ts` owns `phase: 'memorize' | 'draw' | 'result'`, the
timers and the progressive reveal. `app/game.tsx` renders whichever phase
component is current. Phase transitions (including the 500 ms delay after the
timer expires) live in the hook, not in the screen — keep new phase logic there
so timing stays in one place.

### Skia for drawing, split per platform

`@shopify/react-native-skia` renders the canvas. `DrawingCanvas` and
`ConfettiBurst`/`TimerArc` exist as `.native.tsx` / `.web.tsx` pairs with a
shared `.shared.ts` module, because the web and native Skia backends differ
enough that runtime branching would be messier than separate files.

### Flood fill is computed in software

`FloodFillService` does the pixel fill; `NativeFillLayerService` +
`SoftwareRasterizer` rasterize the vector strokes into a buffer first, so the
fill respects the drawn outlines. Canvas dimensions **must be integers** —
fractional widths corrupt the buffer (see the comment in
`NativeFillLayerService.ts`).

### No backend, no account

Progress, badges and settings go through `StorageManager` into `AsyncStorage`.
Children's app: this avoids handling minors' data on a server and keeps the game
playable offline. Consequence: no cross-device sync, and clearing app data is
irreversible.

### Age groups instead of a difficulty setting

`AgeGroupManager` derives defaults (e.g. stroke width) from the selected age
group, so the game adapts without exposing raw difficulty knobs to a child.

### Seven languages

`locales/` holds de, en, es, fr, it, nl, pl, resolved via `@services/i18n`.
New user-facing strings belong in every locale file — no hardcoded text in
components.

## Data Flow

### One round

```
LevelManager.getDifficultyForLevel()  → level config
  → useGamePhase: 'memorize'          → image shown, progressive reveal, timer
  → useGamePhase: 'draw'              → DrawingCanvas collects DrawingPath[]
                                      → FloodFill/NativeFillLayer for fills
  → useGamePhase: 'result'            → comparison view
  → AchievementManager.checkAndUnlock() → BadgeUnlockToast / MascotUnlockToast
  → StreakManager + StorageManager     → persisted
```

## Environments

| Environment  | URL / Target                            | Build                     |
| ------------ | --------------------------------------- | ------------------------- |
| Production   | https://s540d.github.io/DrawFromMemory/ | `npm run deploy:ghpages`  |
| Play Store   | `com.s540d.merkeundmale`                | `npm run build:android`   |
| Local web    | Expo dev server (port printed on start) | `npm run web`             |
| Local native | Android/iOS device or emulator          | `npm run android` / `ios` |

## Testing & Tooling

Jest (`jest.config.js`, `jest.setup.js`) with tests in `__tests__/` and
co-located `__tests__` folders. `npm run test:ci` is the CI entry point.
`npm run validate:svg-counts` guards the level asset integrity;
`scripts/validate-release.sh` gates a release. Crash reporting via Sentry
(`SentryService.ts`).

## DrawingCanvas-UI (ausgelagert aus CLAUDE.md, Issue #160)

> Deutsch belassen, da direkt aus `CLAUDE.md` übernommen (Issue #160,
> project-templates CLAUDE.md-Wartung).

**Werkzeug-Icons (PR #272):** `components/game/ToolIcons.tsx` exportiert `PenIcon`, `FillIcon`, `EyeIcon` — abstrakte, einfarbige SVG-Piktogramme (via `react-native-svg`) für Pinsel/Füllen/Vorlage-ansehen in `DrawPhase.tsx`, statt bunter Emoji (✏️ 🪣 👁). Farbe wird komplett über den `color`-Prop gesteuert (aktiv = weiß, inaktiv = `colors.text.secondary`). Die Strichstärken-Auswahl (klein/mittel/groß) zeigt bei allen drei Punkten einheitlich `drawing.color`; die aktive Größe wird über einen Ring (`borderColor`) markiert, nicht über unterschiedliche Punktfarben.

**Startbildschirm & Einstellungen: Label-/Icon-Aufräumen (PR #292):** APK-Testing-Feedback: Startbildschirm-Button „Kreativ" → „Freies Malen" umbenannt (nur DE-Locale, `locales/de/translations.json`), Emoji 🎨 vor dem Button-Text in `app/index.tsx` entfernt. In den Einstellungen (`components/SettingsModal.tsx`) verlor der Bereich „Über & Support" (`settings.aboutSupport`) die Icons im Action-Grid (🏆 👨‍👩‍👧 ✉️ ☕ ↗ ℹ) — nur noch Text-Labels, `actionGridIcon`-Style entfernt.

**Tablet-/Landscape-Layout (PR #287, Issue #279, 2.4):** `useScreenLayout()` liefert zusätzlich `isLandscape` (width > height), `isTablet` (kürzere Kante ≥ 600px) und `toolbarPosition` (`'bottom' | 'side'`). Im ausreichend breiten Querformat (`safeWidth >= 480`) wechselt `toolbarPosition` auf `'side'`:

- `DrawPhase.tsx` rendert Zeichenfläche und Werkzeugleiste dann nebeneinander (Farbauswahl/Werkzeuge/Strichstärken vertikal gestapelt in einer schmalen Seitenleiste, Breite `sideToolbarWidth`) statt vertikal gestapelt.
- Die Zeichenfläche bekommt dadurch mehr Höhe (`canvasUpperLimitBase` 640 statt 320/400, da keine Werkzeugleiste mehr darunter Platz braucht).
- Die Merke-Phase bekommt ein größeres Vorschaubild (`memorizeImageSize`-Obergrenze an die verfügbare Breite gekoppelt statt fix 280px).
- Bei zu schmalem Querformat (z.B. Split-Screen) bleibt es beim bisherigen `'bottom'`-Layout.
- `app.json`s `orientation: "default"` + `android:resizeableActivity="true"` (Android-Manifest-Teil von Issue #278) kamen bereits in PR #281.
