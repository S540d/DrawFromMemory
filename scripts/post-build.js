/**
 * Post-Build-Schritt für den Web-Export (expo-router + GitHub Pages).
 *
 * Aufgaben:
 *  1. Pfade auf den GitHub-Pages-Unterpfad `/DrawFromMemory` umschreiben
 *  2. Titel + SEO-Tags (description, keywords, Open Graph, Twitter, canonical,
 *     JSON-LD) sowie die PWA-/Homescreen-Tags in die Landing Page injizieren
 *  3. Expos Platzhalter-`<noscript>` durch crawlbaren Inhalt mit Play-Store-Link
 *     ersetzen
 *  4. 404.html für SPA-Routing anlegen
 *
 * Die SEO-Tags landen bewusst nur in `index.html`: die übrigen von expo-router
 * generierten HTML-Dateien sind keine eigenständigen Landing Pages und würden
 * sonst Duplicate-Content-Signale erzeugen.
 *
 * Wird von `.github/workflows/deploy.yml` und `scripts/deploy-ghpages.sh` nach
 * `expo export --platform web` aufgerufen. Die exportierten Funktionen sind für
 * `scripts/__tests__/post-build.test.ts` da.
 */

const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const baseUrl = '/DrawFromMemory';
const siteUrl = 'https://s540d.github.io/DrawFromMemory/';
const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.s540d.merkeundmale';
const appTitle = 'Merke und Male - Gedächtnistraining für Kinder';
const appDescription =
  'Merke und Male: Gedächtnistraining für Kinder. Bild kurz ansehen, aus dem Gedächtnis nachzeichnen und vergleichen — spielerisch lernen, kostenlos und werbefrei.';

// Deutsche Suchbegriffe — die Seite ist neben dem Play Store die naheliegendste
// Direktquelle, der Hauptmarkt der App ist deutschsprachig.
const appKeywords = [
  'Gedächtnistraining Kinder',
  'Merkspiel',
  'Malspiel für Kinder',
  'Zeichnen lernen Kinder',
  'Kinderspiel ohne Werbung',
  'Lernspiel ab 3 Jahren',
  'Konzentration trainieren',
  'Memory Spiel Kinder',
  'Offline Kinder App',
  'kostenlose Kinder App',
].join(', ');

/**
 * Play-Store-Link mit Attributions-Parametern. Nur mit `referrer` tauchen
 * Installationen, die über die Web-Demo kommen, in der Play Console als eigene
 * Quelle auf (App-seitiges Gegenstück: `constants/ExternalLinks.ts`).
 */
function getPlayStoreUrl(medium) {
  const referrer = `utm_source=github-pages&utm_medium=${medium}&utm_campaign=web_demo`;
  return `${playStoreUrl}&referrer=${encodeURIComponent(referrer)}`;
}

/**
 * Schreibt absolute Pfade auf den GitHub-Pages-Unterpfad um — aber nur die, die
 * ihn noch nicht enthalten. Sonst würden bereits mit `baseUrl` ausgelieferte
 * Links (z. B. das Apple-Touch-Icon aus `app/+html.tsx`) zu
 * `/DrawFromMemory/DrawFromMemory/...`.
 */
function rewriteBasePaths(html) {
  const basePathSegment = baseUrl.replace(/^\//, '');
  const skipAlreadyPrefixed = `(?!\\/|${basePathSegment}\\/)`;
  return html
    .replace(new RegExp(`href="\\/${skipAlreadyPrefixed}`, 'g'), `href="${baseUrl}/`)
    .replace(new RegExp(`src="\\/${skipAlreadyPrefixed}`, 'g'), `src="${baseUrl}/`);
}

/**
 * JSON-LD für die App. Sagt Crawlern explizit, dass hinter der Seite eine
 * kostenlose, familienfreundliche Android-App steht — inklusive `installUrl`
 * auf den Play Store.
 *
 * Bewusst ohne `aggregateRating`: Bewertungen dürfen nur ausgezeichnet werden,
 * wenn sie auf der Seite real vorhanden sind.
 */
function buildStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'Merke und Male',
    description: appDescription,
    url: siteUrl,
    applicationCategory: 'GameApplication',
    applicationSubCategory: 'EducationalGame',
    operatingSystem: 'Android 8.0+, Web',
    installUrl: getPlayStoreUrl('structured_data'),
    downloadUrl: getPlayStoreUrl('structured_data'),
    screenshot: `${siteUrl}feature-graphic.png`,
    inLanguage: ['de', 'en', 'es', 'fr', 'it', 'nl', 'pl'],
    isFamilyFriendly: true,
    isAccessibleForFree: true,
    typicalAgeRange: '3-10',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    author: {
      '@type': 'Organization',
      name: 'S540d',
      url: 'https://github.com/S540d',
    },
  };
}

/** Alle SEO-Tags der Landing Page (ohne das description-Tag selbst). */
function buildSeoTags() {
  return [
    `<meta name="robots" content="index, follow">`,
    `<meta name="keywords" content="${appKeywords}">`,
    `<meta property="og:title" content="${appTitle}">`,
    `<meta property="og:description" content="${appDescription}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:url" content="${siteUrl}">`,
    `<meta property="og:image" content="${siteUrl}feature-graphic.png">`,
    `<meta property="og:image:alt" content="Merke und Male — Merk- und Malspiel für Kinder">`,
    `<meta property="og:site_name" content="Merke und Male">`,
    `<meta property="og:locale" content="de_DE">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${appTitle}">`,
    `<meta name="twitter:description" content="${appDescription}">`,
    `<meta name="twitter:image" content="${siteUrl}feature-graphic.png">`,
    `<link rel="canonical" href="${siteUrl}">`,
    `<script type="application/ld+json">${JSON.stringify(buildStructuredData())}</script>`,
  ].join('\n');
}

/**
 * PWA-/Homescreen-Tags. Stehen inhaltlich auch in `app/+html.tsx`, das bei
 * `web.output: "single"` aber nicht gerendert wird (Expo nimmt dort sein
 * eigenes Template) — ohne diese Injektion fehlen sie im Deployment komplett.
 */
function buildPwaTags() {
  return [
    `<meta name="application-name" content="Merke und Male">`,
    `<meta name="apple-mobile-web-app-capable" content="yes">`,
    `<meta name="apple-mobile-web-app-status-bar-style" content="default">`,
    `<meta name="apple-mobile-web-app-title" content="Merke und Male">`,
    `<link rel="apple-touch-icon" href="${baseUrl}/apple-touch-icon.png">`,
  ].join('\n');
}

/**
 * Statischer Inhalt für den `<noscript>`-Block der Landing Page.
 *
 * Der Web-Export rendert clientseitig: das ausgelieferte HTML hat einen leeren
 * Body, bis das JS-Bundle läuft. Crawler ohne JS-Rendering und Nutzer ohne JS
 * sehen sonst nur „You need to enable JavaScript to run this app." — und vor
 * allem keinen einzigen Link zum Play Store. Der Block ersetzt genau diesen
 * Standardtext durch Überschrift, Beschreibung und echte `<a>`-Links.
 */
function buildNoscriptContent() {
  return [
    '<div style="max-width:640px;margin:0 auto;padding:24px;font-family:system-ui,-apple-system,sans-serif;line-height:1.5">',
    `<h1>${appTitle}</h1>`,
    '<p>Bild kurz ansehen, aus dem Gedächtnis nachzeichnen, vergleichen: ein Merk- und Malspiel für Kinder ab 3 Jahren. Ohne Werbung, ohne In-App-Käufe, komplett offline spielbar.</p>',
    '<p>Diese Seite ist die Web-Demo und braucht JavaScript. Die vollständige Android-App gibt es kostenlos im Play Store:</p>',
    // `&` im href muss als `&amp;` stehen, damit das HTML valide bleibt.
    `<p><a href="${getPlayStoreUrl('noscript').replace(/&/g, '&amp;')}">Merke und Male bei Google Play herunterladen</a></p>`,
    `<p><a href="${baseUrl}/privacy-policy.html">Datenschutzerklärung</a> · <a href="https://github.com/S540d/DrawFromMemory">Quellcode auf GitHub</a></p>`,
    '</div>',
  ].join('\n');
}

/** Ersetzt Expos Platzhalter-noscript durch den crawlbaren Inhalt. */
function injectNoscriptContent(html) {
  return html.replace(
    /<noscript>[\s\S]*?<\/noscript>/,
    `<noscript>\n${buildNoscriptContent()}\n</noscript>`,
  );
}

/** Setzt description + SEO-Tags in die Landing Page. */
function injectSeoTags(html) {
  const seoTags = buildSeoTags();

  const tags = `${seoTags}\n${buildPwaTags()}`;

  if (html.includes('<meta name="description"')) {
    // Die aus app.json übernommene Kurzbeschreibung durch die ausführlichere
    // SEO-Fassung ersetzen und die restlichen Tags direkt dahinter einsetzen.
    return html.replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${appDescription}">\n${tags}`,
    );
  }

  return html.replace(
    '</head>',
    `<meta name="description" content="${appDescription}">\n${tags}\n</head>`,
  );
}

/** Ersetzt bzw. ergänzt den Seitentitel. */
function applyTitle(html, fileName) {
  const hasEmptyTitle =
    html.includes('<title data-rh="true"></title>') || html.includes('<title></title>');

  if (hasEmptyTitle) {
    return html.replace(/<title[^>]*><\/title>/, `<title>${appTitle}</title>`);
  }

  if (fileName === 'index.html') {
    // Auch wenn expo-router schon einen Titel gesetzt hat: die Landing Page
    // bekommt den beschreibenden, SEO-tauglichen Titel. Andere statische Seiten
    // (z. B. privacy-policy.html) behalten ihren eigenen — sie hier zu
    // überschreiben würde sie als die App auszeichnen.
    return html.replace(/<title>[^<]*<\/title>/, `<title>${appTitle}</title>`);
  }

  return html;
}

/** Vollständige Verarbeitung einer einzelnen HTML-Datei. */
function processHtml(html, fileName) {
  let out = rewriteBasePaths(html);
  out = applyTitle(out, fileName);
  if (fileName === 'index.html') {
    out = injectSeoTags(out);
    out = injectNoscriptContent(out);
  }
  return out;
}

function main() {
  console.log('🔧 Starting post-build processing for expo-router + GitHub Pages...');

  // Get all HTML files generated by expo-router static rendering
  const htmlFiles = fs
    .readdirSync(distPath)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(distPath, file));

  console.log(`📄 Found ${htmlFiles.length} HTML files to process`);

  // Also need to update the JavaScript bundle to use correct base path
  const jsFiles = fs
    .readdirSync(path.join(distPath, '_expo/static/js/web'))
    .filter(file => file.startsWith('entry-') && file.endsWith('.js'))
    .map(file => path.join(distPath, '_expo/static/js/web', file));

  htmlFiles.forEach(filePath => {
    const fileName = path.basename(filePath);
    const html = fs.readFileSync(filePath, 'utf8');

    fs.writeFileSync(filePath, processHtml(html, fileName));
    console.log(`  ✓ Processed ${fileName}`);
  });

  // Update JavaScript bundle to handle basePath in router
  jsFiles.forEach(filePath => {
    const fileName = path.basename(filePath);
    let js = fs.readFileSync(filePath, 'utf8');

    // Replace router base path configuration
    // This ensures client-side navigation works with the subpath
    js = js.replace(/location\.pathname/g, `location.pathname.replace('${baseUrl}', '')`);

    fs.writeFileSync(filePath, js);
    console.log(`  ✓ Updated ${fileName} for subpath routing`);
  });

  // For SPA mode: Create 404.html that mirrors index.html for GitHub Pages routing
  const indexPath = path.join(distPath, 'index.html');
  const notFoundPath = path.join(distPath, '404.html');
  if (fs.existsSync(indexPath) && !fs.existsSync(notFoundPath)) {
    fs.copyFileSync(indexPath, notFoundPath);
    console.log('  ✓ Created 404.html for SPA routing');
  }

  console.log('✅ Post-build processing complete!');
  console.log(`   Updated all paths with baseUrl: ${baseUrl}`);
}

module.exports = {
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
};

if (require.main === module) {
  main();
}
