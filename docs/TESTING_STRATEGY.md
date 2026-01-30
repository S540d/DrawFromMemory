# Testing Strategy - Production-Grade Tests

Comprehensive testing strategy for ensuring app quality before Play Store release.

## Testing Pyramid

```
        /\
       /E2E\         <- 10% - Critical user journeys
      /------\
     /  INT   \      <- 30% - Component integration
    /----------\
   /   UNIT     \    <- 60% - Business logic & utilities
  /--------------\
```

## Current Test Coverage

### Existing Tests ✅
- `services/__tests__/i18n.test.ts` - i18n service (85% coverage)
- `utils/platform.test.ts` - Platform utilities (95% coverage)

### Coverage Gaps 🔴
- No component tests
- No integration tests
- No E2E tests
- No performance tests
- No accessibility tests

## Production-Grade Test Plan

### Phase 1: Unit Tests (60%)

#### Services
- [ ] `services/StorageManager.test.ts`
  - getSetting/setSetting/removeSetting
  - Error handling
  - Data persistence

- [ ] `services/i18n.test.ts` ✅ (Already exists)
  - Language switching
  - Translation loading

#### Utils
- [ ] `utils/platform.test.ts` ✅ (Already exists)
- [ ] `utils/drawing.test.ts` (if exists)
- [ ] `utils/validation.test.ts` (if exists)

#### Constants
- [ ] `constants/levels.test.ts`
  - Level configuration
  - Difficulty progression
  - Image paths validation

### Phase 2: Component Tests (30%)

#### Core Components
- [ ] `components/DrawingCanvas.test.tsx`
  - Rendering
  - Touch interactions
  - Undo/Redo
  - Color selection
  - Brush size changes
  - Clear canvas

- [ ] `components/StarRating.test.tsx`
  - Star rendering (1-5)
  - User interaction
  - Callback triggers

- [ ] `components/ColorPicker.test.tsx`
  - Color selection
  - Modal open/close
  - Default color

- [ ] `components/ToolButton.test.tsx`
  - Active/inactive states
  - Icon rendering
  - Press handlers

### Phase 3: Screen/Integration Tests (10%)

#### Screens
- [ ] `app/index.test.tsx` - Home Screen
  - Level list rendering
  - Progress display
  - Navigation to game
  - Settings access

- [ ] `app/game/[id].test.tsx` - Game Screen
  - Memorize phase
  - Drawing phase
  - Result phase
  - Phase transitions
  - Timer functionality

- [ ] `app/settings.test.tsx` - Settings
  - Language switch
  - Theme toggle
  - Persistence

### Phase 4: E2E Tests (Critical Paths)

#### User Journeys
- [ ] **Happy Path**: Complete a level
  1. Open app
  2. Select level
  3. Memorize image
  4. Draw from memory
  5. Rate result
  6. Progress saved

- [ ] **Settings Flow**
  1. Change language
  2. Verify UI updates
  3. Restart app
  4. Language persists

- [ ] **Level Progression**
  1. Complete level 1
  2. Level 2 unlocks
  3. Navigation works
  4. Progress persists

### Phase 5: Special Tests

#### Performance Tests
- [ ] Canvas rendering performance
- [ ] Image loading time
- [ ] Storage read/write performance
- [ ] App launch time

#### Accessibility Tests
- [ ] Touch target sizes (min 44x44)
- [ ] Color contrast ratios
- [ ] Screen reader compatibility
- [ ] Keyboard navigation (web)

#### Regression Tests
- [ ] AsyncStorage corruption handling
- [ ] Network offline mode
- [ ] Low memory scenarios
- [ ] App backgrounding/foregrounding

## Test Quality Standards

### Code Coverage Targets
- **Overall:** ≥80%
- **Utils/Services:** ≥90%
- **Components:** ≥75%
- **Screens:** ≥60%

### Test Quality Checklist
- [ ] All tests are deterministic (no flaky tests)
- [ ] Tests have descriptive names
- [ ] Tests follow AAA pattern (Arrange, Act, Assert)
- [ ] Mocks are properly cleaned up
- [ ] No hardcoded timeouts (use waitFor)
- [ ] Tests are isolated (no shared state)
- [ ] Edge cases are tested
- [ ] Error cases are tested

## Testing Tools & Libraries

### Current Stack
- **Test Runner:** Jest
- **React Testing:** @testing-library/react-native
- **Assertions:** Jest matchers + @testing-library/jest-native
- **Mocks:** Jest mocks

### Additional Tools (Optional)
- **E2E:** Detox (native) or Playwright (web)
- **Performance:** @shopify/react-native-performance
- **Accessibility:** @testing-library/react-native (a11y queries)
- **Visual Regression:** jest-image-snapshot

## Test Execution

### Local Development
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Specific file
npm test -- StorageManager.test.ts
```

### CI/CD
```bash
# CI mode (no watch, with coverage)
npm run test:ci
```

### Pre-commit
- Run affected tests only
- Lint test files
- Check coverage doesn't decrease

## Test Organization

```
DrawFromMemory/
├── components/
│   ├── DrawingCanvas.tsx
│   └── __tests__/
│       └── DrawingCanvas.test.tsx
│
├── services/
│   ├── StorageManager.ts
│   └── __tests__/
│       └── StorageManager.test.ts
│
├── utils/
│   ├── platform.ts
│   └── platform.test.ts
│
├── app/
│   ├── index.tsx
│   └── __tests__/
│       └── index.test.tsx
│
└── e2e/
    ├── complete-level.e2e.ts
    └── settings-persistence.e2e.ts
```

## Critical Tests for Play Store

Before Play Store submission, these tests MUST pass:

### Functional
- [x] App launches without crashes
- [ ] All levels are playable
- [ ] Drawing tools work correctly
- [ ] Progress saves and loads
- [ ] Language switching works
- [ ] Settings persist across restarts

### Performance
- [ ] App launches in <3 seconds
- [ ] Canvas rendering is smooth (≥30 FPS)
- [ ] No memory leaks
- [ ] Storage operations complete quickly

### Compliance
- [ ] No crashes on low-memory devices
- [ ] Works offline (no network required)
- [ ] No data leakage
- [ ] Privacy policy accessible

## Test Metrics & Monitoring

### Tracked Metrics
- Code coverage percentage
- Test execution time
- Number of flaky tests
- Test failure rate

### Targets
- **Coverage:** ≥80%
- **Execution Time:** <60 seconds
- **Flaky Tests:** 0
- **Failure Rate:** <1%

## Continuous Improvement

### Review Schedule
- Weekly: Review failed tests
- Bi-weekly: Update test coverage
- Monthly: Refactor slow/flaky tests
- Per release: Add regression tests for bugs

### Test Maintenance
- Remove obsolete tests
- Update mocks when dependencies change
- Refactor duplicated test code
- Keep test data realistic

## Resources

- [Testing Library Docs](https://testing-library.com/docs/react-native-testing-library/intro/)
- [Jest Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [React Native Testing](https://reactnative.dev/docs/testing-overview)

---

**Last Updated:** 2026-01-29
**Status:** 🔨 In Progress
**Next:** Implement Phase 1 (Unit Tests)
