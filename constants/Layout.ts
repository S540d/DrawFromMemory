/**
 * Layout-Konstanten - Merke und Male
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,     // 4 → 8 (weicher)
  md: 10,    // 8 → 10 (weicher)
  lg: 16,    // 12 → 16 (Soft & Modern Standard für Buttons)
  xl: 20,    // 16 → 20 (Soft & Modern Standard für Cards)
  xxl: 24,   // NEU - für große Cards/Containers
  round: 999, // Vollständig abgerundet
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  huge: 48,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export default {
  Spacing,
  BorderRadius,
  FontSize,
  FontWeight,
};
