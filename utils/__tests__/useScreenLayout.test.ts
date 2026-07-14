/**
 * useScreenLayout Hook Tests
 *
 * Prüft die Multi-Breakpoint-Logik des responsiven Layout-Hooks.
 */
import { renderHook } from '@testing-library/react-native';

// Mocks müssen vor dem Import des zu testenden Moduls gesetzt werden
let mockWindowDimensions = { width: 390, height: 844 };
let mockInsets = { top: 47, bottom: 34, left: 0, right: 0 };

jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native');
  return {
    ...rn,
    useWindowDimensions: () => mockWindowDimensions,
  };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => mockInsets,
}));

import { useScreenLayout } from '../useScreenLayout';

describe('useScreenLayout', () => {
  beforeEach(() => {
    mockWindowDimensions = { width: 390, height: 844 };
    mockInsets = { top: 47, bottom: 34, left: 0, right: 0 };
  });

  describe('Größenklassen (size)', () => {
    it('ist "md" für iPhone 14 Pro (safeHeight = 763, < 768)', () => {
      mockWindowDimensions = { width: 390, height: 844 };
      mockInsets = { top: 47, bottom: 34, left: 0, right: 0 };
      // safeHeight = 844 - 47 - 34 = 763 → md (< 768)
      const { result } = renderHook(() => useScreenLayout());
      expect(result.current.size).toBe('md');
    });

    it('ist "lg" wenn safeHeight === 768', () => {
      mockWindowDimensions = { width: 430, height: 932 };
      mockInsets = { top: 50, bottom: 34, left: 0, right: 0 };
      // safeHeight = 932 - 50 - 34 = 848 → lg
      const { result } = renderHook(() => useScreenLayout());
      expect(result.current.size).toBe('lg');
      expect(result.current.isLarge).toBe(true);
      expect(result.current.isSmall).toBe(false);
    });

    it('ist "md" für mittlere Geräte (640 ≤ safeHeight < 768)', () => {
      mockWindowDimensions = { width: 375, height: 736 };
      mockInsets = { top: 20, bottom: 0, left: 0, right: 0 };
      // safeHeight = 736 - 20 = 716 → md
      const { result } = renderHook(() => useScreenLayout());
      expect(result.current.size).toBe('md');
      expect(result.current.isMedium).toBe(true);
      expect(result.current.isSmall).toBe(false);
    });

    it('ist "sm" für kleine Geräte (500 ≤ safeHeight < 640)', () => {
      mockWindowDimensions = { width: 320, height: 568 };
      mockInsets = { top: 20, bottom: 0, left: 0, right: 0 };
      // safeHeight = 568 - 20 = 548 → sm
      const { result } = renderHook(() => useScreenLayout());
      expect(result.current.size).toBe('sm');
      expect(result.current.isSmall).toBe(true);
      expect(result.current.isXSmall).toBe(false);
    });

    it('ist "xs" für sehr kleine Geräte (safeHeight < 500)', () => {
      mockWindowDimensions = { width: 320, height: 480 };
      mockInsets = { top: 20, bottom: 0, left: 0, right: 0 };
      // safeHeight = 480 - 20 = 460 → xs
      const { result } = renderHook(() => useScreenLayout());
      expect(result.current.size).toBe('xs');
      expect(result.current.isXSmall).toBe(true);
      expect(result.current.isSmall).toBe(true);
    });
  });

  describe('Canvas-Höhen', () => {
    it('canvasMaxHeight ist kleiner auf kleinen Geräten', () => {
      // Großes Gerät
      mockWindowDimensions = { width: 430, height: 932 };
      mockInsets = { top: 50, bottom: 34, left: 0, right: 0 };
      const { result: lgResult } = renderHook(() => useScreenLayout());

      // Kleines Gerät
      mockWindowDimensions = { width: 320, height: 568 };
      mockInsets = { top: 20, bottom: 0, left: 0, right: 0 };
      const { result: smResult } = renderHook(() => useScreenLayout());

      expect(lgResult.current.canvasMaxHeight).toBeGreaterThan(smResult.current.canvasMaxHeight);
    });

    it('canvasMinHeight ist auf xs kleiner als auf lg', () => {
      mockWindowDimensions = { width: 320, height: 480 };
      mockInsets = { top: 20, bottom: 0, left: 0, right: 0 };
      const { result: xsResult } = renderHook(() => useScreenLayout());

      mockWindowDimensions = { width: 430, height: 932 };
      mockInsets = { top: 50, bottom: 34, left: 0, right: 0 };
      const { result: lgResult } = renderHook(() => useScreenLayout());

      expect(xsResult.current.canvasMinHeight).toBeLessThan(lgResult.current.canvasMinHeight);
    });

    it('canvasMaxHeight ist immer größer oder gleich canvasMinHeight', () => {
      const cases = [
        { width: 320, height: 480, top: 20, bottom: 0 },
        { width: 320, height: 568, top: 20, bottom: 0 },
        { width: 375, height: 667, top: 20, bottom: 0 },
        { width: 390, height: 844, top: 47, bottom: 34 },
        { width: 430, height: 932, top: 50, bottom: 34 },
      ];
      cases.forEach(({ width, height, top, bottom }) => {
        mockWindowDimensions = { width, height };
        mockInsets = { top, bottom, left: 0, right: 0 };
        const { result } = renderHook(() => useScreenLayout());
        expect(result.current.canvasMaxHeight).toBeGreaterThanOrEqual(
          result.current.canvasMinHeight,
        );
      });
    });
  });

  describe('Button-Höhen', () => {
    it('buttonMinHeight ist auf xs kleiner als auf lg', () => {
      mockWindowDimensions = { width: 320, height: 480 };
      mockInsets = { top: 20, bottom: 0, left: 0, right: 0 };
      const { result: xsResult } = renderHook(() => useScreenLayout());

      mockWindowDimensions = { width: 430, height: 932 };
      mockInsets = { top: 50, bottom: 34, left: 0, right: 0 };
      const { result: lgResult } = renderHook(() => useScreenLayout());

      expect(xsResult.current.buttonMinHeight).toBeLessThan(lgResult.current.buttonMinHeight);
    });

    it('toolbarButtonMinHeight ist auf xs kleiner als auf lg', () => {
      mockWindowDimensions = { width: 320, height: 480 };
      mockInsets = { top: 20, bottom: 0, left: 0, right: 0 };
      const { result: xsResult } = renderHook(() => useScreenLayout());

      mockWindowDimensions = { width: 430, height: 932 };
      mockInsets = { top: 50, bottom: 34, left: 0, right: 0 };
      const { result: lgResult } = renderHook(() => useScreenLayout());

      expect(xsResult.current.toolbarButtonMinHeight).toBeLessThan(
        lgResult.current.toolbarButtonMinHeight,
      );
    });
  });

  describe('Merke-Phase Bildgrößen', () => {
    it('memorizeImageSize ist auf kleinen Geräten kleiner', () => {
      mockWindowDimensions = { width: 320, height: 480 };
      mockInsets = { top: 20, bottom: 0, left: 0, right: 0 };
      const { result: xsResult } = renderHook(() => useScreenLayout());

      mockWindowDimensions = { width: 430, height: 932 };
      mockInsets = { top: 50, bottom: 34, left: 0, right: 0 };
      const { result: lgResult } = renderHook(() => useScreenLayout());

      expect(xsResult.current.memorizeImageSize).toBeLessThan(lgResult.current.memorizeImageSize);
    });

    it('memorizeImageSize liegt immer im Bereich [140, 280]', () => {
      const cases = [
        { width: 320, height: 480, top: 20, bottom: 0 },
        { width: 320, height: 568, top: 20, bottom: 0 },
        { width: 375, height: 667, top: 20, bottom: 0 },
        { width: 390, height: 844, top: 47, bottom: 34 },
        { width: 430, height: 932, top: 50, bottom: 34 },
        { width: 820, height: 1180, top: 24, bottom: 20 }, // Tablet
      ];
      cases.forEach(({ width, height, top, bottom }) => {
        mockWindowDimensions = { width, height };
        mockInsets = { top, bottom, left: 0, right: 0 };
        const { result } = renderHook(() => useScreenLayout());
        expect(result.current.memorizeImageSize).toBeGreaterThanOrEqual(140);
        expect(result.current.memorizeImageSize).toBeLessThanOrEqual(280);
      });
    });
  });

  describe('Querformat / Tablet (Issue #279, 2.4)', () => {
    it('erkennt Querformat wenn width > height', () => {
      mockWindowDimensions = { width: 932, height: 430 };
      mockInsets = { top: 0, bottom: 21, left: 50, right: 50 };
      const { result } = renderHook(() => useScreenLayout());
      expect(result.current.isLandscape).toBe(true);
    });

    it('bleibt im Hochformat, wenn height >= width', () => {
      mockWindowDimensions = { width: 390, height: 844 };
      mockInsets = { top: 47, bottom: 34, left: 0, right: 0 };
      const { result } = renderHook(() => useScreenLayout());
      expect(result.current.isLandscape).toBe(false);
      expect(result.current.toolbarPosition).toBe('bottom');
    });

    it('erkennt Tablets über die kürzere Bildschirmkante (>= 600px)', () => {
      mockWindowDimensions = { width: 1180, height: 820 };
      mockInsets = { top: 24, bottom: 20, left: 0, right: 0 };
      const { result } = renderHook(() => useScreenLayout());
      expect(result.current.isTablet).toBe(true);
    });

    it('verschiebt die Werkzeugleiste im breiten Querformat zur Seite', () => {
      mockWindowDimensions = { width: 932, height: 430 };
      mockInsets = { top: 0, bottom: 21, left: 50, right: 50 };
      const { result } = renderHook(() => useScreenLayout());
      expect(result.current.toolbarPosition).toBe('side');
      expect(result.current.sideToolbarWidth).toBeGreaterThan(0);
    });

    it('bleibt bei "bottom", wenn im Querformat zu wenig Breite übrig ist', () => {
      // Sehr schmales Querformat-Popup (z.B. Split-Screen) — sollte nicht seitlich stapeln
      mockWindowDimensions = { width: 460, height: 300 };
      mockInsets = { top: 0, bottom: 0, left: 0, right: 0 };
      const { result } = renderHook(() => useScreenLayout());
      expect(result.current.toolbarPosition).toBe('bottom');
    });

    it('erlaubt der Zeichenfläche im Tablet-Querformat eine größere Obergrenze als im Portrait-Großgerät', () => {
      // Portrait, großes Gerät: canvasUpperLimitBase = 400 (isLarge)
      mockWindowDimensions = { width: 430, height: 932 };
      mockInsets = { top: 50, bottom: 34, left: 0, right: 0 };
      const { result: portraitResult } = renderHook(() => useScreenLayout());

      // Tablet-Querformat mit viel vertikalem Platz: canvasUpperLimitBase = 640 (toolbarPosition 'side')
      mockWindowDimensions = { width: 1180, height: 900 };
      mockInsets = { top: 24, bottom: 20, left: 0, right: 0 };
      const { result: landscapeResult } = renderHook(() => useScreenLayout());

      expect(landscapeResult.current.toolbarPosition).toBe('side');
      expect(landscapeResult.current.canvasMaxHeight).toBeGreaterThan(
        portraitResult.current.canvasMaxHeight,
      );
    });
  });

  describe('Header-Padding', () => {
    it('headerPaddingVertical ist auf xs kleiner als auf lg', () => {
      mockWindowDimensions = { width: 320, height: 480 };
      mockInsets = { top: 20, bottom: 0, left: 0, right: 0 };
      const { result: xsResult } = renderHook(() => useScreenLayout());

      mockWindowDimensions = { width: 430, height: 932 };
      mockInsets = { top: 50, bottom: 34, left: 0, right: 0 };
      const { result: lgResult } = renderHook(() => useScreenLayout());

      expect(xsResult.current.headerPaddingVertical).toBeLessThan(
        lgResult.current.headerPaddingVertical,
      );
    });
  });
});
