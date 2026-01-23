/**
 * Tests for platform.ts
 *
 * NOTE: Tests use window APIs directly since they run in a jsdom environment // platform-safe
 * where these APIs are available. The platform-safe comments satisfy the
 * pre-commit hook that prevents accidental window usage without platform checks
 * in production code.
 */

import {
  isWeb,
  isIOS,
  isAndroid,
  isMobile,
  supportsMatchMedia,
  getSystemDarkModePreference,
  addSystemThemeChangeListener,
  Storage,
  assertWebAPI,
  safeWebAPI,
} from './platform';

// Mock react-native Platform
jest.mock('react-native', () => ({
  Platform: {
    OS: 'web',
  },
}));

describe('platform.ts - Platform Detection', () => {
  it('should correctly identify web platform', () => {
    expect(isWeb).toBe(true);
  });

  it('should correctly identify non-iOS platform', () => {
    expect(isIOS).toBe(false);
  });

  it('should correctly identify non-Android platform', () => {
    expect(isAndroid).toBe(false);
  });

  it('should correctly identify non-mobile platform', () => {
    expect(isMobile).toBe(false);
  });
});

describe('platform.ts - matchMedia Support', () => {
  // Tests run in jsdom environment where window APIs are available // platform-safe
  let originalMatchMedia: typeof window.matchMedia | undefined; // platform-safe

  beforeEach(() => {
    originalMatchMedia = window.matchMedia; // platform-safe
  });

  afterEach(() => {
    if (originalMatchMedia) {
      (window as any).matchMedia = originalMatchMedia; // platform-safe
    }
  });

  it('should support matchMedia on web', () => {
    // Mock matchMedia (available in jsdom test environment) // platform-safe
    (window as any).matchMedia = jest.fn(); // platform-safe

    expect(supportsMatchMedia()).toBe(true);
  });

  it('should not support matchMedia when matchMedia is not a function', () => {
    // Remove matchMedia to simulate unsupported environment
    delete (window as any).matchMedia; // platform-safe

    expect(supportsMatchMedia()).toBe(false);
  });
});

describe('platform.ts - System Dark Mode Detection', () => {
  let originalMatchMedia: typeof window.matchMedia | undefined; // platform-safe

  beforeEach(() => {
    originalMatchMedia = window.matchMedia; // platform-safe
  });

  afterEach(() => {
    if (originalMatchMedia) {
      (window as any).matchMedia = originalMatchMedia; // platform-safe
    }
  });

  it('should detect dark mode when prefers-color-scheme is dark', () => {
    const mockMatchMedia = jest.fn((query: string) => ({ // platform-safe
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    (window as any).matchMedia = mockMatchMedia; // platform-safe

    const isDark = getSystemDarkModePreference();
    expect(isDark).toBe(true);
    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
  });

  it('should detect light mode when prefers-color-scheme is light', () => {
    const mockMatchMedia = jest.fn((query: string) => ({ // platform-safe
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    (window as any).matchMedia = mockMatchMedia; // platform-safe

    const isDark = getSystemDarkModePreference();
    expect(isDark).toBe(false);
  });

  it('should return false when matchMedia is not supported', () => {
    // Remove matchMedia
    delete (window as any).matchMedia; // platform-safe

    const isDark = getSystemDarkModePreference();
    expect(isDark).toBe(false);
  });

  it('should handle matchMedia errors gracefully', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    (window as any).matchMedia = jest.fn(() => { // platform-safe
      throw new Error('matchMedia error');
    });

    const isDark = getSystemDarkModePreference();
    expect(isDark).toBe(false);
    expect(consoleWarnSpy).toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
  });
});

describe('platform.ts - Theme Change Listener', () => {
  let originalMatchMedia: typeof window.matchMedia | undefined; // platform-safe

  beforeEach(() => {
    originalMatchMedia = window.matchMedia; // platform-safe
  });

  afterEach(() => {
    if (originalMatchMedia) {
      (window as any).matchMedia = originalMatchMedia; // platform-safe
    }
  });

  it('should add and remove theme change listener successfully', () => {
    const mockRemoveEventListener = jest.fn();
    const mockAddEventListener = jest.fn();
    const mockMediaQuery = { // platform-safe
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      dispatchEvent: jest.fn(),
    };

    (window as any).matchMedia = jest.fn(() => mockMediaQuery); // platform-safe

    const callback = jest.fn();
    const cleanup = addSystemThemeChangeListener(callback);

    // Should call addEventListener with 'change' event and a function handler
    expect(mockAddEventListener).toHaveBeenCalled();
    expect(mockAddEventListener.mock.calls[0][0]).toBe('change');
    expect(typeof mockAddEventListener.mock.calls[0][1]).toBe('function');

    // Call cleanup
    cleanup();

    // Should call removeEventListener with 'change' event and the same function handler
    expect(mockRemoveEventListener).toHaveBeenCalled();
    expect(mockRemoveEventListener.mock.calls[0][0]).toBe('change');
  });

  it('should call callback when theme changes', () => {
    let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;
    const mockAddEventListener = jest.fn((event: string, handler: any) => {
      if (event === 'change') {
        changeHandler = handler;
      }
    });

    const mockMediaQuery = { // platform-safe
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: mockAddEventListener,
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };

    (window as any).matchMedia = jest.fn(() => mockMediaQuery); // platform-safe

    const callback = jest.fn();
    addSystemThemeChangeListener(callback);

    // Simulate theme change
    if (changeHandler) {
      changeHandler({ matches: true } as MediaQueryListEvent);
      expect(callback).toHaveBeenCalledWith(true);
    }
  });

  it('should return noop cleanup when matchMedia is not supported', () => {
    // Remove matchMedia
    delete (window as any).matchMedia; // platform-safe

    const callback = jest.fn();
    const cleanup = addSystemThemeChangeListener(callback);

    // Should not throw
    expect(() => cleanup()).not.toThrow();
  });
});

describe('platform.ts - Storage Adapter', () => {
  it('should use localStorage on web', async () => {
    // Mock localStorage // platform-safe
    const mockGetItem = jest.fn(() => 'test-value');
    const mockSetItem = jest.fn();
    const mockRemoveItem = jest.fn();

    Object.defineProperty(window, 'localStorage', { // platform-safe
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
        removeItem: mockRemoveItem,
      },
      writable: true,
    });

    await Storage.setItem('test-key', 'test-value');
    expect(mockSetItem).toHaveBeenCalledWith('test-key', 'test-value');

    const value = await Storage.getItem('test-key');
    expect(value).toBe('test-value');
    expect(mockGetItem).toHaveBeenCalledWith('test-key');

    await Storage.removeItem('test-key');
    expect(mockRemoveItem).toHaveBeenCalledWith('test-key');
  });
});

describe('platform.ts - Web API Safety', () => {
  it('should not throw when asserting Web API on web platform', () => {
    expect(() => assertWebAPI('window.navigator')).not.toThrow(); // platform-safe: testing platform detection
  });

  it('should execute callback on web platform', () => {
    const result = safeWebAPI(() => 'success', 'fallback', 'testAPI');
    expect(result).toBe('success');
  });

  it('should return fallback on error', () => {
    const result = safeWebAPI(() => {
      throw new Error('API Error');
    }, 'fallback', 'testAPI');
    expect(result).toBe('fallback');
  });
});
