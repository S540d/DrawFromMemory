/**
 * Feature-Flags — interner Kill-Switch für einzelne Features.
 * Nicht für Endnutzer sichtbar; Änderung erfordert App-Rebuild.
 *
 * Konvention: ENABLE_* defaultet auf `true`. Auf `false` setzen, um
 * das Feature ohne Code-Removal kurzfristig zu deaktivieren.
 */

export const FeatureFlags = {
  /** Konfetti bei 5-Sterne-Ergebnis (Issue #186). */
  ENABLE_CONFETTI: true,
  /** Draw/Result Tab-Navigation im Game-Screen (Issue #199). */
  ENABLE_GAME_PHASE_TABS: false,
} as const;
