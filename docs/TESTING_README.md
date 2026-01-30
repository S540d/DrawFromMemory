# Testing Guide

Comprehensive guide for running and writing tests for Merke und Male.

## Quick Start

```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

## Test Structure

```
DrawFromMemory/
├── services/__tests__/
│   ├── StorageManager.test.ts    ✅ Comprehensive storage tests
│   ├── LevelManager.test.ts      ✅ Level configuration tests
│   └── i18n.test.ts              ✅ Internationalization tests
│
├── utils/
│   └── platform.test.ts          ✅ Platform detection tests
│
└── components/__tests__/
    └── (tests to be added)
```

## Test Coverage

### Current Coverage
- **StorageManager**: ~95% (all critical paths)
- **LevelManager**: 100% (all functions)
- **i18n Service**: ~85% (language switching)
- **Platform Utils**: ~95% (platform detection)

### Coverage Goals
- Services: ≥90%
- Utils: ≥90%
- Components: ≥75%
- Overall: ≥80%

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test File
```bash
npm test -- StorageManager.test.ts
npm test -- LevelManager
```

### Watch Mode (Auto-rerun on changes)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

Coverage report will be generated in `coverage/` directory.
Open `coverage/lcov-report/index.html` in browser for detailed view.

### CI Mode
```bash
npm run test:ci
```

Used in GitHub Actions. Runs once with coverage, no watch mode.

## Writing Tests

### Test File Naming
- Component tests: `ComponentName.test.tsx`
- Service tests: `ServiceName.test.ts`
- Util tests: `utilName.test.ts`
- Location: `__tests__/` folder or `*.test.ts` next to source

### Test Structure (AAA Pattern)

```typescript
describe('Feature or Component', () => {
  describe('specific function or behavior', () => {
    it('should do something specific', () => {
      // Arrange - Setup test data
      const input = 'test';

      // Act - Execute the function
      const result = myFunction(input);

      // Assert - Verify the outcome
      expect(result).toBe('expected');
    });
  });
});
```

### Example Test

```typescript
import { getLevel } from '../LevelManager';

describe('LevelManager', () => {
  describe('getLevel', () => {
    it('should return correct level object', () => {
      // Arrange
      const levelNumber = 5;

      // Act
      const level = getLevel(levelNumber);

      // Assert
      expect(level).toEqual({
        number: 5,
        difficulty: 3,
        displayDuration: 3,
      });
    });
  });
});
```

## Mocking

### AsyncStorage Mock
Already configured in `jest.setup.js`:

```typescript
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
}));
```

### Skia Canvas Mock
Already configured in `__mocks__/@shopify/react-native-skia.js`.

### Custom Mocks

```typescript
// Mock a module
jest.mock('../myModule', () => ({
  myFunction: jest.fn().mockReturnValue('mocked value'),
}));

// Mock a specific implementation
const mockFunction = jest.fn();
mockFunction.mockResolvedValue('async result');
mockFunction.mockRejectedValue(new Error('error'));
```

## Best Practices

### ✅ DO
- Write descriptive test names
- Test one thing per test
- Use AAA pattern (Arrange, Act, Assert)
- Clean up mocks in `beforeEach`/`afterEach`
- Test edge cases and error handling
- Keep tests isolated (no shared state)
- Use `waitFor` instead of hardcoded timeouts

### ❌ DON'T
- Don't test implementation details
- Don't hardcode timeouts
- Don't have tests depend on each other
- Don't mock everything (test real code when possible)
- Don't skip error cases
- Don't leave `console.log` in tests

## Common Patterns

### Testing Async Functions

```typescript
it('should handle async operation', async () => {
  const result = await asyncFunction();
  expect(result).toBe('expected');
});
```

### Testing Error Handling

```typescript
it('should handle errors gracefully', async () => {
  const consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation();

  await functionThatLogs();

  expect(consoleErrorSpy).toHaveBeenCalled();
  consoleErrorSpy.mockRestore();
});
```

### Testing with Mock Data

```typescript
beforeEach(() => {
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
    JSON.stringify({ test: 'data' })
  );
});

it('should use mocked data', async () => {
  const data = await loadData();
  expect(data).toEqual({ test: 'data' });
});
```

## Debugging Tests

### Run Single Test
```bash
npm test -- -t "test name"
```

### Debug in VS Code
Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Verbose Output
```bash
npm test -- --verbose
```

## Coverage Reports

### Generate Coverage
```bash
npm run test:coverage
```

### View Coverage
- Terminal: Shows coverage summary
- HTML: `coverage/lcov-report/index.html`
- VS Code: Use Coverage Gutters extension

### Coverage Thresholds
Configured in `jest.config.js`:

```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
},
```

## CI/CD Integration

Tests run automatically on:
- Every push to any branch
- Every pull request
- Before deployment

### GitHub Actions Workflow
`.github/workflows/ci-cd.yml`:

```yaml
- name: Run tests
  run: npm run test:ci

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Troubleshooting

### Tests Fail with "Cannot find module"
- Run `npm install`
- Check jest.config.js `moduleNameMapper`

### AsyncStorage Mock Not Working
- Ensure jest.setup.js is loaded
- Check `setupFilesAfterEnv` in jest.config.js

### Skia Canvas Errors
- Check `__mocks__/@shopify/react-native-skia.js` exists
- Verify `moduleNameMapper` in jest.config.js

### Flaky Tests
- Remove hardcoded timeouts
- Use `waitFor` from testing-library
- Check for race conditions
- Ensure proper cleanup in afterEach

## Test Utilities

### Testing Library Queries
```typescript
import { render, screen } from '@testing-library/react-native';

const { getByText, queryByText, findByText } = render(<Component />);

// Sync queries
expect(getByText('Hello')).toBeTruthy();
expect(queryByText('Missing')).toBeNull();

// Async queries
const element = await findByText('Loaded');
```

### User Events
```typescript
import { fireEvent } from '@testing-library/react-native';

fireEvent.press(button);
fireEvent.changeText(input, 'new text');
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library React Native](https://callstack.github.io/react-native-testing-library/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Testing Strategy](./TESTING_STRATEGY.md)

## Support

For questions or issues:
- Check existing tests for examples
- Review [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
- Open an issue on GitHub

---

**Last Updated:** 2026-01-29
**Test Coverage:** ~90% (Services/Utils)
**Status:** Production-ready
