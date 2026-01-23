# Claude Code Instructions - Merke und Male (Remember & Draw)

## Project Overview
Merke und Male (Remember & Draw) - A memory training app for children where they memorize images and draw them from memory.

**Tech Stack:**
- React Native with Expo 52
- TypeScript
- expo-router (file-based routing)
- @shopify/react-native-skia (drawing canvas)
- AsyncStorage (data persistence)
- GitHub Pages (web deployment)

## Key Project Documents
- [Design Decisions](../ENTSCHEIDUNGEN.md) - Finalized design choices (colors, levels, timer)
- [Project Status](../STATUS.md) - Current progress and completed tasks
- [Project Sketch](../PROJEKTSKIZZE.md) - Original project concept
- [Quick Status](../QUICK_STATUS.md) - Quick overview of current state
- [README](../README.md) - Project documentation

## Development Guidelines

### Code Style
- Use **TypeScript** with strict typing
- Follow React Native best practices
- Use expo-router file-based routing conventions
- Keep components small and focused
- Use functional components with hooks

### Cross-Platform Considerations
- **Priority:** Web (PWA) → Android → iOS
- Use `Platform.OS` checks for platform-specific code
- All Web APIs (window.*, localStorage.*) must be platform-safe
- Use `utils/platform.ts` helpers for Web API access
- Add `// platform-safe: [reason]` comments for pre-commit hook

### Pre-Commit Hooks
Critical validation rules enforced by Husky:
1. **No console.log/debug** (except in scripts/ directory)
2. **No window.* without platform check** or `// platform-safe` comment
3. **No localStorage without platform check** - use `Storage` from utils/platform.ts
4. **Version consistency** between package.json and app.json

### Git Branching Strategy
**IMPORTANT: New branching workflow as of 2026-01-23**

1. **Branch Structure:**
   - `main` - Production branch (stable releases only)
   - `testing` - Integration/staging branch (all features merge here first)
   - `feature/*` - Feature branches for development

2. **Workflow Rules:**
   - ✅ All new features → Create PR to `testing` branch
   - ✅ PRs required for ALL merges to `testing`
   - ✅ Only merge from `testing` → `main` after validation
   - ❌ Never commit directly to `main` or `testing`
   - ❌ Never merge feature branches directly to `main`

3. **Feature Development Flow:**
   ```bash
   # Create feature branch from testing
   git checkout testing
   git pull
   git checkout -b feature/my-feature

   # Work on feature, then create PR to testing
   git push -u origin feature/my-feature
   gh pr create --base testing --title "feat: My feature"

   # After PR approval and merge, delete feature branch
   git checkout testing
   git pull
   git branch -d feature/my-feature
   ```

4. **Release to Production:**
   - After thorough testing on `testing` branch
   - Create PR from `testing` → `main`
   - Deploy to production after merge

### Testing & Environments
- **Production:** `main` branch → https://s540d.github.io/DrawFromMemory/
- **Staging:** `testing` branch (for integration testing)
- **Local Dev:** `expo start --web` for quick testing
- **Unit Tests:** `npm test` (Jest + React Native Testing Library)
- Test both mobile (Expo Go) and web builds

#### Testing Framework
**Setup:** Jest + @testing-library/react-native + babel-jest

**Test Scripts:**
```bash
npm test                 # Run all tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:ci          # Run tests in CI mode
```

**Writing Tests:**
- Place tests next to source: `*.test.ts` or `*.test.tsx`
- Follow examples from `utils/platform.test.ts`
- Mock `react-native` Platform for platform-specific code
- Use `// platform-safe` comments when using window APIs in tests
- AsyncStorage mock auto-configured in `jest.setup.js`
- Skia components mocked in `__mocks__/@shopify/react-native-skia.js`

**Test Coverage Priority:**
1. `utils/platform.ts` - Platform detection (✅ Complete)
2. `services/StorageManager.ts` - Data persistence (⏳ TODO)
3. `services/LevelManager.ts` - Game logic (⏳ TODO)
4. `hooks/useDrawingCanvas` - Canvas hook (⏳ TODO)
5. `components/DrawingCanvas.tsx` - Core component (⏳ TODO)

### Critical Areas
1. **Platform Utilities (utils/platform.ts):**
   - Central place for all platform-specific checks
   - Storage adapter: localStorage (web) vs AsyncStorage (mobile)
   - Never use Web APIs directly - always use platform helpers
   - Pattern: `// platform-safe: isWeb check` or `// platform-safe: inside [function] check`

2. **Drawing Canvas (components/DrawingCanvas.tsx):**
   - Uses @shopify/react-native-skia
   - Path-based drawing system
   - Undo/redo functionality
   - Don't break canvas touch handling

3. **expo-router Configuration:**
   - File-based routing in /app directory
   - GitHub Pages requires baseUrl: "/DrawFromMemory/"
   - Post-build script handles subpath routing

4. **Storage & Progress:**
   - Use `services/StorageManager.ts` for all data operations
   - AsyncStorage keys: "theme", "language", "completedLevels", "levelStars"
   - Never access AsyncStorage directly

## Common Tasks

### Adding a New Feature
1. Create feature branch from `testing` (not `main`)
2. Check if it affects cross-platform compatibility
3. Use TodoWrite tool to plan implementation steps
4. Update translations in locales/de/ and locales/en/
5. Test on both web and mobile (Expo Go)
6. Run pre-commit checks before committing
7. Create PR to `testing` branch (never directly to `main`)
8. After merge, delete feature branch

### Bug Fixes
- Check [open issues](https://github.com/S540d/DrawFromMemory/issues)
- Reference issue number in commits
- Current priorities:
  - Issue #29: Level selection bug (game.tsx doesn't read URL params)
  - Issue #32: Color selection popup
  - Issue #31: Background music
  - Issue #33: Expo 54 upgrade + hook architecture

### Before Committing
- Pre-commit hooks will automatically check:
  - console.log removal
  - Platform-safe Web API usage
  - Version consistency
- Optional manual checks (no npm scripts yet):
  - Prettier: Format code with `.prettierrc.json` config
  - ESLint: Check with `eslint.config.mjs` configuration
  - TypeScript: Run type checking manually if needed

## Known Issues & Gotchas

### Platform-Safe Patterns (Critical)
- **Pre-commit hook fails** if window.* or localStorage.* is used without checks
- **Solution:** Use helpers from `utils/platform.ts`:
  - `Storage.getItem/setItem/removeItem` for storage
  - `supportsMatchMedia()` for window.matchMedia checks
  - `isWeb`, `isIOS`, `isAndroid` constants
  - Add `// platform-safe: [reason]` comment for exceptions

### expo-router & GitHub Pages
- GitHub Pages serves from `/DrawFromMemory/` subpath
- Post-build script patches HTML/JS for subpath routing
- Don't use absolute paths - use relative paths or expo-router Links

### React Native Skia Canvas
- Requires native build for full functionality
- Web version has some limitations
- Always test drawing features on actual mobile device

### Internationalization (i18n)
- All text must be in translation files (locales/de/, locales/en/)
- Use `t('key.path')` function from services/i18n.ts
- Never hardcode German/English text in components

## Architecture Notes

### Module Structure
```
app/
├── _layout.tsx          # Root layout with expo-router
├── index.tsx            # Home screen
├── game.tsx             # Main game screen (3 phases)
├── levels.tsx           # Level selection
└── settings.tsx         # Settings screen

components/
├── DrawingCanvas.tsx    # Skia-based drawing canvas
└── LevelImageDisplay.tsx # SVG image display

services/
├── i18n.ts              # Internationalization
├── LevelManager.ts      # Level progression logic
├── ImagePoolManager.ts  # Level image selection
├── RatingManager.ts     # Star rating system
└── StorageManager.ts    # AsyncStorage wrapper

utils/
├── platform.ts          # Platform detection & Web API helpers

constants/
├── Colors.ts               # Theme colors (light/dark)
├── Layout.ts               # Spacing, borders, fonts
├── WebAccessibility.ts     # WCAG 2.1 AA focus rings & touch targets
└── index.ts                # Centralized exports
```

### Game Flow
1. **Home Screen** → User selects "Play" or "Levels"
2. **Level Selection** → Choose specific level (1-10)
3. **Game Screen - Phase 1 (Memorize):** Show image + timer (3-10s)
4. **Game Screen - Phase 2 (Draw):** User draws from memory
5. **Game Screen - Phase 3 (Result):** Side-by-side comparison + self-rating (1-5 stars)
6. **Progress Save:** Stars and completion status stored

### Data Flow
1. User action → Update local React state
2. Save to AsyncStorage (via StorageManager)
3. Update UI immediately (optimistic updates)
4. No backend/API - fully client-side

## Do's and Don'ts

### ✅ Do:
- Use `utils/platform.ts` for all Web API access
- Use `Storage` helper for localStorage/AsyncStorage
- Add `// platform-safe` comments when required
- Use TodoWrite tool for multi-step tasks
- Test on both web and mobile (Expo Go)
- Use expo-router `<Link>` for navigation
- Keep translations in locales/ files

### ❌ Don't:
- Use `window.*` or `localStorage.*` directly
- Use `console.log` (except in scripts/)
- Add framework dependencies without discussion
- Hardcode German/English text in components
- Use absolute paths with GitHub Pages subpath
- Modify app.json version without package.json sync
- Skip pre-commit checks (use `--no-verify` only if critical)

## Design System

### Colors (Light Theme)
- Primary: #60D5FA (Cyan) - Friendly, cheerful
- Secondary: #FFB84D (Orange) - Warm, inviting
- Background: #FFFEF9 (Cream white)
- Text: #333333 (Dark gray)

### Dark Theme
- Primary: #4A9DC9 (Darker cyan)
- Background: #1A1A1A (Almost black)
- Surface: #2A2A2A (Dark gray)
- Text: #E0E0E0 (Light gray)

### Material Design 3 Button Style
- BorderRadius: 20px (BorderRadius.xl)
- BorderWidth: 2px (outlined buttons)
- Padding: Spacing.md / Spacing.lg
- See [app/settings.tsx:outlinedButton](../app/settings.tsx) for reference

### Accessibility (WCAG 2.1 AA)
- All interactive elements have `accessibilityRole`
- Use `accessibilityLabel` for non-text elements
- Add `accessibilityHint` for complex actions
- Ensure 4.5:1 contrast ratio for text

## Current Project State (Jan 2026)

### Completed Features
- ✅ All 35 SVG clipart images (levels 1-10, organized in difficulty folders)
- ✅ Drawing canvas with @shopify/react-native-skia
- ✅ Level progression system with star ratings
- ✅ Dark mode support
- ✅ Internationalization (DE/EN)
- ✅ Platform-safe storage utilities
- ✅ Web accessibility constants (WebAccessibility.ts)
- ✅ Prettier & ESLint configuration files

### Recent Updates (2026-01-23)
- ✅ All config files committed (.prettierrc.json, eslint.config.mjs, etc.)
- ✅ Jest testing framework setup complete
- ✅ Platform utility tests (17 passing tests)
- ✅ Level 4+ image bug fixed (PR #36)
- ✅ Fill tool implemented (PR #35)

### Open Issues & Priorities
1. **Issue #29 (Bugfixes):**
   - ✅ Level 4+ placeholder images → FIXED (PR #36)
   - ✅ Fill tool → IMPLEMENTED (PR #35)
   - ⏳ Level selection doesn't work (game.tsx needs URL param reading)

2. **Issue #32:** Color selection popup
3. **Issue #31:** Background music
4. **Issue #33:** Expo 54 upgrade + hook architecture refactoring
5. **Issue #30:** Production readiness roadmap

### Next Steps
- Fix level selection bug in [app/game.tsx](../app/game.tsx)
- Add npm scripts for format/lint/type-check
- Expand test coverage (components, services, hooks)

## Questions?
Refer to the documentation in root directory or check related GitHub issues:
- [Issue #30](https://github.com/S540d/DrawFromMemory/issues/30) - Projekt-Evolution Roadmap
- [Issue #29](https://github.com/S540d/DrawFromMemory/issues/29) - Bugfixes
- [Issue #33](https://github.com/S540d/DrawFromMemory/issues/33) - Expo 54 Upgrade
