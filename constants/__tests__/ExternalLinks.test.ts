import {
  PLAY_STORE_PACKAGE,
  PLAY_STORE_URL,
  PRIVACY_POLICY_URL,
  SITE_URL,
  getPlayStoreUrl,
} from '../ExternalLinks';

describe('ExternalLinks', () => {
  it('verweist auf das Play-Store-Paket der App', () => {
    expect(PLAY_STORE_PACKAGE).toBe('com.s540d.merkeundmale');
    expect(PLAY_STORE_URL).toBe(
      'https://play.google.com/store/apps/details?id=com.s540d.merkeundmale',
    );
  });

  it('leitet Site- und Datenschutz-URL von derselben Basis ab', () => {
    expect(SITE_URL).toBe('https://s540d.github.io/DrawFromMemory/');
    expect(PRIVACY_POLICY_URL).toBe(`${SITE_URL}PRIVACY_POLICY.html`);
  });

  it('hängt einen URL-kodierten referrer mit UTM-Parametern an', () => {
    expect(getPlayStoreUrl('web_footer')).toBe(
      `${PLAY_STORE_URL}&referrer=utm_source%3Dgithub-pages%26utm_medium%3Dweb_footer%26utm_campaign%3Dweb_demo`,
    );
  });

  it('unterscheidet die Klickquellen über utm_medium', () => {
    expect(getPlayStoreUrl('web_banner')).toContain('utm_medium%3Dweb_banner');
    expect(getPlayStoreUrl('web_footer')).toContain('utm_medium%3Dweb_footer');
  });

  it('kodiert den referrer als einen einzigen Parameterwert', () => {
    // Play Console wertet nur den kompletten, kodierten referrer-String aus —
    // unkodierte "&" würden die UTM-Parameter zu Play-URL-Parametern machen.
    const url = getPlayStoreUrl('web_banner');
    const referrer = new URL(url).searchParams.get('referrer');

    expect(referrer).toBe('utm_source=github-pages&utm_medium=web_banner&utm_campaign=web_demo');
  });
});
