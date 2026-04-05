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

/**
 * Typografie-Hierarchie
 *
 * H1 – App-Titel (Home-Screen):              xxl  = 32 px  bold
 * H2 – Screen-Titel:                         xl   = 24 px  bold
 * H3 – Modal-/Phase-/Abschnitts-Titel:       lg   = 20 px  semibold
 * Body / Labels:                              md   = 16 px  regular / medium
 * Small / Captions:                           sm   = 14 px  regular
 * Tiny / Abschnitts-Labels (uppercase):       xs   = 12 px  semibold
 * Sonderfall Timer:                           huge = 48 px  bold  (nur Timer-Anzeige)
 */
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
