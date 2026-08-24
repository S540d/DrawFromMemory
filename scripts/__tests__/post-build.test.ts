/**
 * Tests für scripts/post-build.js
 *
 * Der Post-Build-Schritt ist die einzige Stelle, an der SEO-, PWA- und
 * noscript-Inhalte tatsächlich ins Deployment gelangen (`app/+html.tsx` wird
 * bei `web.output: "single"` nicht gerendert). Entsprechend werden hier die
 * Tags geprüft, von denen die Auffindbarkeit der Seite abhängt.
 */

/* eslint-disable */
const {
  appTitle,
  appDescription,
  appKeywords,
  getPlayStoreUrl,
  rewriteBasePaths,
  buildStructuredData,
  buildSeoTags,
  buildPwaTags,
  buildNoscriptContent,
  injectNoscriptContent,
  injectSeoTags,
  applyTitle,
  processHtml,
} = require('../post-build');
/* eslint-enable */

// Verkürztes Abbild dessen, was `expo export --platform web` mit
// `output: "single"` erzeugt.
const EXPORTED_INDEX = `<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <title>Merke und Male</title>
  <meta name="theme-color" content="#60D5FA">
<meta name="description" content="Gedächtnistraining für Kinder: Merken, Malen, Lernen!">
<link rel="icon" href="/favicon.ico" /></head>
  <body>
    <noscript>
      You need to enable JavaScript to run this app.
    </noscript>
    <div id="root"></div>
  <script src="/_expo/static/js/web/entry-abc.js" defer></script>
</body>
</html>`;

describe('getPlayStoreUrl', () => {
  it('hängt einen URL-kodierten referrer mit UTM-Parametern an', () => {
    const url = getPlayStoreUrl('noscript');

    expect(url).toContain('id=com.s540d.merkeundmale');
    expect(url).toContain(
      '&referrer=utm_source%3Dgithub-pages%26utm_medium%3Dnoscript%26utm_campaign%3Dweb_demo',
    );
  });
});

describe('rewriteBasePaths', () => {
  it('setzt den GitHub-Pages-Unterpfad vor absolute Pfade', () => {
    const out = rewriteBasePaths('<script src="/_expo/entry.js"></script><a href="/gallery">x</a>');

    expect(out).toContain('src="/DrawFromMemory/_expo/entry.js"');
    expect(out).toContain('href="/DrawFromMemory/gallery"');
  });

  it('lässt bereits präfixierte Pfade unangetastet', () => {
    const html = '<link rel="apple-touch-icon" href="/DrawFromMemory/apple-touch-icon.png">';

    expect(rewriteBasePaths(html)).toBe(html);
  });

  it('lässt protokollrelative und absolute URLs unangetastet', () => {
    const html = '<a href="//example.com/x">a</a><a href="https://example.com/y">b</a>';

    expect(rewriteBasePaths(html)).toBe(html);
  });
});

describe('applyTitle', () => {
  it('ersetzt den Titel der Landing Page durch den SEO-Titel', () => {
    expect(applyTitle('<title>Merke und Male</title>', 'index.html')).toBe(
      `<title>${appTitle}</title>`,
    );
  });

  it('lässt den Titel anderer Seiten unverändert', () => {
    const html = '<title>Datenschutzerklärung - Merke und Male</title>';

    expect(applyTitle(html, 'privacy-policy.html')).toBe(html);
  });

  it('füllt einen leeren Titel auch auf anderen Seiten', () => {
    expect(applyTitle('<title></title>', 'privacy-policy.html')).toBe(`<title>${appTitle}</title>`);
  });
});

describe('buildStructuredData', () => {
  it('beschreibt die App als kostenlose, familienfreundliche Anwendung', () => {
    const data = buildStructuredData();

    expect(data['@type']).toBe('MobileApplication');
    expect(data.description).toBe(appDescription);
    expect(data.isFamilyFriendly).toBe(true);
    expect(data.offers.price).toBe('0');
    expect(data.installUrl).toContain('play.google.com');
    expect(data.installUrl).toContain('referrer=');
  });

  it('erfindet keine Bewertungen', () => {
    expect(buildStructuredData()).not.toHaveProperty('aggregateRating');
  });

  it('ist als JSON-LD serialisierbar', () => {
    const json = JSON.stringify(buildStructuredData());

    expect(JSON.parse(json)['@context']).toBe('https://schema.org');
  });
});

describe('buildSeoTags', () => {
  it('enthält deutsche Keywords', () => {
    const tags = buildSeoTags();

    expect(tags).toContain(`<meta name="keywords" content="${appKeywords}">`);
    expect(appKeywords).toContain('Gedächtnistraining Kinder');
  });

  it('enthält Open-Graph-, Twitter- und canonical-Tags', () => {
    const tags = buildSeoTags();

    expect(tags).toContain('property="og:title"');
    expect(tags).toContain('property="og:locale"');
    expect(tags).toContain('property="og:site_name"');
    expect(tags).toContain('name="twitter:card"');
    expect(tags).toContain('<link rel="canonical" href="https://s540d.github.io/DrawFromMemory/">');
  });

  it('enthält den JSON-LD-Block', () => {
    expect(buildSeoTags()).toContain('<script type="application/ld+json">');
  });
});

describe('buildPwaTags', () => {
  it('verlinkt das Apple-Touch-Icon unter dem Unterpfad', () => {
    expect(buildPwaTags()).toContain(
      '<link rel="apple-touch-icon" href="/DrawFromMemory/apple-touch-icon.png">',
    );
  });
});

describe('injectNoscriptContent', () => {
  it('ersetzt den Expo-Platzhalter durch einen echten Play-Store-Link', () => {
    const out = injectNoscriptContent(EXPORTED_INDEX);

    expect(out).not.toContain('You need to enable JavaScript to run this app.');
    expect(out).toContain('play.google.com/store/apps/details');
    expect(out).toContain('utm_medium%3Dnoscript');
    // Valides HTML: das & im href ist maskiert
    expect(out).toContain('&amp;referrer=');
    expect(out).toContain('<h1>');
  });

  it('verlinkt Datenschutz und Quellcode', () => {
    const content = buildNoscriptContent();

    expect(content).toContain('/DrawFromMemory/privacy-policy.html');
    expect(content).toContain('https://github.com/S540d/DrawFromMemory');
  });
});

describe('injectSeoTags', () => {
  it('ersetzt die kurze app.json-Beschreibung durch die SEO-Fassung', () => {
    const out = injectSeoTags(EXPORTED_INDEX);

    expect(out).toContain(`<meta name="description" content="${appDescription}">`);
    expect(out).not.toContain('content="Gedächtnistraining für Kinder: Merken, Malen, Lernen!"');
  });

  it('ergänzt die Tags auch ohne vorhandenes description-Tag', () => {
    const out = injectSeoTags('<html><head><title>x</title></head><body></body></html>');

    expect(out).toContain('name="description"');
    expect(out).toContain('property="og:title"');
    expect(out).toContain('</head>');
  });
});

describe('processHtml', () => {
  it('verarbeitet die Landing Page vollständig', () => {
    const out = processHtml(EXPORTED_INDEX, 'index.html');

    expect(out).toContain(`<title>${appTitle}</title>`);
    expect(out).toContain('src="/DrawFromMemory/_expo/static/js/web/entry-abc.js"');
    expect(out).toContain('name="keywords"');
    expect(out).toContain('application/ld+json');
    expect(out).toContain('apple-touch-icon');
    expect(out).toContain('play.google.com');
  });

  it('fügt anderen Seiten keine SEO-Tags hinzu (kein Duplicate Content)', () => {
    const privacy = `<html><head><title>Datenschutzerklärung - Merke und Male</title></head>
      <body><a href="/index.html">Start</a></body></html>`;
    const out = processHtml(privacy, 'privacy-policy.html');

    expect(out).not.toContain('og:title');
    expect(out).not.toContain('application/ld+json');
    expect(out).toContain('href="/DrawFromMemory/index.html"');
  });

  it('ist idempotent gegenüber den Basispfaden', () => {
    const once = processHtml(EXPORTED_INDEX, 'index.html');
    const twice = processHtml(once, 'index.html');

    expect(twice).not.toContain('/DrawFromMemory/DrawFromMemory/');
  });
});
