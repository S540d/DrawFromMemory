import { isWeb } from '../utils/platform';

// Zur Build-Zeit eingefroren (EXPO_PUBLIC_*), analog zu EXPO_PUBLIC_SENTRY_DSN.
// Leer = kein Script, kein Tracking (no-op). Erwartet die Domain eines
// Plausible-kompatiblen Endpunkts (self-hosted oder plausible.io), z. B. "s540d.github.io".
const PLAUSIBLE_DOMAIN = process.env.EXPO_PUBLIC_PLAUSIBLE_DOMAIN ?? '';
const PLAUSIBLE_SCRIPT_SRC =
  process.env.EXPO_PUBLIC_PLAUSIBLE_SCRIPT_SRC ?? 'https://plausible.io/js/script.js';

const SCRIPT_ID = 'plausible-analytics-script';

/**
 * Fügt ein privacy-freundliches, cookie-loses Analytics-Script (Plausible-kompatibel)
 * in den Web-Head ein. No-op auf Native und wenn EXPO_PUBLIC_PLAUSIBLE_DOMAIN nicht
 * gesetzt ist (Issue #279, 3.4 – Messgrundlage für Reichweite außerhalb des Stores).
 */
export function initAnalytics() {
  if (!isWeb || !PLAUSIBLE_DOMAIN) return;
  if (typeof document === 'undefined' || document.getElementById(SCRIPT_ID)) return; // platform-safe

  const script = document.createElement('script'); // platform-safe
  script.id = SCRIPT_ID;
  script.defer = true;
  script.dataset.domain = PLAUSIBLE_DOMAIN;
  script.src = PLAUSIBLE_SCRIPT_SRC;
  document.head.appendChild(script); // platform-safe
}
