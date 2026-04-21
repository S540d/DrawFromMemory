# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.4] - 2026-04-21

### Fixed
- Android navigation bar overlap: `paddingBottom: insets.bottom` auf äußersten Container gesetzt, gilt für alle 3 Phasen (#143)
- TypeScript: `ColorSchemeName` Mapping in `ThemeContext.tsx`, `svgElement.props`-Cast in `LevelImageDisplay.tsx` (#133, #143)
- Native flood-fill auf alten Android-Geräten (Nexus 6 / Adreno 420): vollständige Ersetzung des Skia-Pixel-Roundtrips durch Skia Rect-Span Rendering — Fills werden als horizontale Run-Length-Spans als `<Rect>`-Elemente gerendert (#132, #138, #141)
- Scanline-Algorithmus für Flood-Fill (O(rows) statt O(pixels) Stack-Tiefe) (#130)
- Flood-Fill Speicheroptimierung: 1-Bit-Palette statt RGBA-Buffer (~20× weniger RAM) (#131)

### Security
- CI: `npm audit --audit-level=high` statt `--audit-level=moderate || true` — Pipeline blockiert jetzt bei echten Bedrohungen (#110, #144)
- Abhängigkeiten: handlebars (critical), lodash, node-forge, @xmldom/xmldom, picomatch (alle high) via `npm audit fix` behoben (#144)

## [1.3.0] - 2026-04-11

### Fixed
- Flood-fill OOM crash on low-memory Android devices: replaced `Set<number>` visited structure with `Uint8Array` bitmap (~8× smaller), check neighbours before push to prevent stack blowup (#126)

### Changed
- Result screen: compact 3-button row, canvas icon overlays for Replay/Save, shorter labels (#125)
- Standardized typography hierarchy and reduced button sizes (#116)
- `docs/private/` pattern introduced for internal docs (gitignored) (#120)

### Security
- CI: fixed `docs-privacy` false positives; tightened sensitive-filename list to real credential files (#124)
- Removed stale branches: `develop`, `testing`, all `claude/*` and `copilot/*` branches (#124)

## [1.2.6] - 2026-04-05

### Changed
- i18n refactor for SettingsModal: replace ternary strings with `t()` keys (#115)

### Fixed
- Responsive layout: proportional screen sections across all device sizes
- Fill tool flooding entire canvas instead of bounded region

### Security
- npm audit fix: flatted Prototype Pollution (high severity)

## [1.2.5] - 2026-02-xx

### Fixed
- Fill function, Settings layout and result screen (Issues #104, #105, #106)
- SafeAreaProvider, padding, and fillRadius improvements (PR suggestions)

### Tests
- Coverage increased from 34% to 48% (+45 tests) (#103)
- Responsive layout fix for small devices in Draw phase (#100, #102)

### Changed
- Removed emojis from Settings menu (#99)
- Patch updates: reanimated 4.2.2 + safe-area-context 5.7.0 (#98)

## [1.2.4] - 2026-01-xx

### Fixed
- iOS Home screen icon and app label (Issue #84, #97)
- Timer instability in Memorize phase (Issue #95, #96)
- UX adjustments for small devices (#85, #94)

## [1.2.3] - 2025-12-xx

### Fixed
- iOS Home screen icon and app label (Issue #84)
- UX adjustments for small devices (#85)

## [1.2.2] - 2025-12-xx

### Added
- Expo SDK 55 Upgrade (Step 9 of #77)
- UI Primitives: Badge, Chip, Button (Phase 5 of #90, #93)
- react-native-reanimated setup (Phase 2 of #90, #92)

## [1.2.1] - 2025-11-xx

### Added
- Sentry crash reporting — optional, only active when `EXPO_PUBLIC_SENTRY_DSN` is set (Step 8 of #77, #89)
- Platform-specific DrawingCanvas split into `.native.tsx` / `.tsx` files (Step 7 of #77, #88)

### Fixed
- Skia retry logic for delayed native module init (#87)
- Disabled Sentry source map upload for local builds

## [1.2.0] - 2025-10-xx

### Added
- Game Screen custom hooks + UX fixes (Step 6 of #77, #86)

### Fixed
- Skia load-failure fallback UI improvements (v1.1.9, Step 5, #83)
- TypeScript path aliases `@services` and `@components` (v1.1.8, Step 4 of #77, #82)
- Drawing fix: use refs to prevent stale closure in event handlers (#81)
- SVG element count validator (v1.1.7, Step 3 of #77, #80)

## [1.1.5] - 2025-09-xx

### Added
- React Hooks ESLint rules to prevent Play Store rejections (#78)
- FloodFill algorithm extracted into `FloodFillService` (Step 2/9 of Tech Debt, #79)

### Security
- Resolved high-severity vulnerabilities in minimatch and tar (#76)

## [1.1.3] - 2025-08-xx

### Fixed
- Prevented Android crash by lazy-loading Skia native modules
- Prevented Android crash by replacing SVG rendering with static element count lookup
- Aligned expo-haptics with SDK 54, removed unused expo-av

### Added
- App icon assets

[Unreleased]: https://github.com/S540d/DrawFromMemory/compare/v1.3.4...HEAD
[1.3.4]: https://github.com/S540d/DrawFromMemory/compare/v1.3.0...v1.3.4
[1.3.0]: https://github.com/S540d/DrawFromMemory/compare/v1.2.6...v1.3.0
[1.2.6]: https://github.com/S540d/DrawFromMemory/compare/v1.2.5...v1.2.6
[1.2.5]: https://github.com/S540d/DrawFromMemory/compare/v1.2.4...v1.2.5
[1.2.4]: https://github.com/S540d/DrawFromMemory/compare/v1.2.3...v1.2.4
[1.2.3]: https://github.com/S540d/DrawFromMemory/compare/v1.2.2...v1.2.3
[1.2.2]: https://github.com/S540d/DrawFromMemory/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/S540d/DrawFromMemory/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/S540d/DrawFromMemory/compare/v1.1.5...v1.2.0
[1.1.5]: https://github.com/S540d/DrawFromMemory/compare/v1.1.3...v1.1.5
[1.1.3]: https://github.com/S540d/DrawFromMemory/releases/tag/v1.1.3
