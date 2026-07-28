/**
 * Zentrale Quelle für alle nach außen führenden Links (Play Store, Web-Demo,
 * Datenschutz) — bisher waren diese URLs in Komponenten und Build-Skripten
 * dupliziert.
 *
 * Wichtig für die Auffindbarkeit: Play-Store-Links, die von der Web-Demo aus
 * geöffnet werden, bekommen einen `referrer`-Parameter mit UTM-Tags. Nur damit
 * tauchen Installationen, die über die GitHub-Pages-Seite kommen, in der Play
 * Console unter „Akquise → Nutzergewinnung" als eigene Quelle auf. Ohne den
 * Parameter landen sie im Bucket „Google Play (organisch)" und die Web-Demo
 * sieht in den Reports so aus, als würde sie nichts beitragen.
 *
 * Format laut Play-Console-Doku: der komplette UTM-String wird als *ein*
 * URL-kodierter Wert im `referrer`-Parameter übergeben.
 */

export const PLAY_STORE_PACKAGE = 'com.s540d.merkeundmale';

/** Play-Store-Link ohne Tracking — z. B. für Store-Listing-Metadaten. */
export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PLAY_STORE_PACKAGE}`;

/** Öffentliche Web-Demo (GitHub Pages). */
export const SITE_URL = 'https://s540d.github.io/DrawFromMemory/';

export const PRIVACY_POLICY_URL = `${SITE_URL}PRIVACY_POLICY.html`;

/** Wo auf der Web-Demo der Klick passiert ist — wird zu `utm_medium`. */
export type PlayStoreLinkSource = 'web_banner' | 'web_footer' | 'web_result' | 'readme';

const UTM_SOURCE = 'github-pages';
const UTM_CAMPAIGN = 'web_demo';

/**
 * Play-Store-URL mit Attributions-Parametern.
 *
 * @param source Klickquelle innerhalb der Web-Demo (wird zu `utm_medium`)
 */
export function getPlayStoreUrl(source: PlayStoreLinkSource): string {
  const referrer = `utm_source=${UTM_SOURCE}&utm_medium=${source}&utm_campaign=${UTM_CAMPAIGN}`;
  return `${PLAY_STORE_URL}&referrer=${encodeURIComponent(referrer)}`;
}
