# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.6] - 2026-04-05

### Changed
- Privacy policies updated to accurately document optional Sentry crash reporting
- CI/CD pipeline now runs automated tests on every push and pull request
- CI/CD pipeline now triggers on `staging` branch in addition to `main` and `develop`

### Added
- CHANGELOG.md following Keep a Changelog format
- THIRD_PARTY_LICENSES.md documenting open-source dependencies
- `staging` branch for pre-production integration

### Fixed
- Privacy policy contradiction: policies now correctly describe Sentry as an optional,
  configurable crash reporting service (was incorrectly stating "no third-party services"
  and "no crash reports")

## [1.2.5] - 2026-03-15

### Changed
- package-lock.json updated after npm install

## [1.2.4] - 2026-03-01

### Changed
- i18n for SettingsModal: replaced ternary strings with t() keys (#115)

### Fixed
- Responsive layout: proportional screen sections across all device sizes

## [1.2.3] - 2026-02-20

### Fixed
- Fill tool flooding entire canvas instead of bounded region

## [1.2.0] - 2026-02-27

### Added
- Drawing replay (Strich-für-Strich / stroke-by-stroke) in result phase
- Play/Stop button under "Deine Zeichnung" / "Your Drawing"
- Sound effects and haptics (Issue #31):
  - Web Audio API based tone generation (no audio files required)
  - Timer tick sound on each countdown step
  - Phase-change chime (C-E-G ascending triad) on Memorize→Draw and Draw→Result transitions
  - Star-rating sound (ascending tone per star, 1–5)
  - Success sound (two-tone) on gallery save
  - Haptic feedback (native): expo-haptics with Light/Success patterns
  - Sound toggle in settings (on/off, persisted)

### Dependencies
- Added `expo-av` ^16.0.8
- Added `expo-haptics` ^55.0.8

## [1.1.0] - 2026-01-05

### Added
- Color picker filtering per level image (Issue #20)
  - `colors: string[]` property added to LevelImage interface
  - Color curation for all 14 SVG images
  - Dynamic color picker filters DrawingColors based on `currentImage.colors`
- Cache-busting system for GitHub Pages
  - `scripts/update-cache-version.js` for extended cache-busting
  - `?v=timestamp` query parameters on all HTML files
  - HTTP Cache-Control meta tags
  - `.nojekyll` file for GitHub Pages compatibility
  - `version.json` endpoint for version tracking

### Fixed
- AsyncStorage web fallback for GitHub Pages (in-memory storage when AsyncStorage unavailable)
- GitHub Pages subpath configuration (`baseUrl: "/DrawFromMemory/"` in app.json)

## [1.0.0] - 2026-01-01

### Added
- Initial release of Merke und Male / Remember and Draw
- Memory training game with 10 difficulty levels
- 14 SVG images to memorize and redraw
- Drawing canvas with brush tool and fill tool
- Color picker with themed palette
- Gallery for saving drawings (max 50)
- Settings: language (de/en), theme, brush size, sound toggle
- Offline-first: all data stored locally via AsyncStorage
- Web version deployed to GitHub Pages
- Android build via EAS

[Unreleased]: https://github.com/S540d/DrawFromMemory/compare/v1.2.6...HEAD
[1.2.6]: https://github.com/S540d/DrawFromMemory/compare/v1.2.5...v1.2.6
[1.2.5]: https://github.com/S540d/DrawFromMemory/compare/v1.2.4...v1.2.5
[1.2.4]: https://github.com/S540d/DrawFromMemory/compare/v1.2.3...v1.2.4
[1.2.3]: https://github.com/S540d/DrawFromMemory/compare/v1.2.0...v1.2.3
[1.2.0]: https://github.com/S540d/DrawFromMemory/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/S540d/DrawFromMemory/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/S540d/DrawFromMemory/releases/tag/v1.0.0
