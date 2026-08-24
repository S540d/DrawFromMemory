# Auffindbarkeit außerhalb des Play Stores

Wie Nutzer die App finden, ohne im Play Store zu suchen — und wie sichtbar wird,
dass sie über diesen Weg gekommen sind.

## Der Trichter

```
Google-Suche / GitHub / geteilter Link
        ↓
GitHub-Pages-Seite (Web-Demo)  ←→  README auf GitHub
        ↓
Play-Store-Listing (mit referrer-Attribution)
        ↓
Install
```

Die Web-Demo ist die naheliegendste Direktquelle neben dem Store. Sie war
allerdings eine Sackgasse Richtung Play Store: der einzige Store-Link stand im
Footer ganz unten und wurde erst nach dem Scrollen sichtbar; das README verlinkte
den Store überhaupt nicht. Besucher wurden dadurch zu Web-/PWA-Nutzern statt zu
Play-Store-Installationen — und weil die Links keine Attributions-Parameter
trugen, waren die wenigen Store-Besuche in der Play Console nicht von organischem
Traffic zu unterscheiden.

## Was wo passiert

| Ort                                | Beitrag                                                                                        |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| `README.md`                        | Play-Store-Badge + Link, deutsche Kurzbeschreibung, Web-Demo-Link                              |
| `components/WebInstallBanner.tsx`  | Nur Web: Play-Store-CTA im sichtbaren Bereich der Startseite (nicht erst im Footer)            |
| `components/WebTrustFooter.tsx`    | Nur Web: Store- und Datenschutz-Link am Seitenende                                             |
| `constants/ExternalLinks.ts`       | Einzige Quelle für Store-/Site-URLs + `getPlayStoreUrl(source)` mit Attributions-Parametern    |
| `scripts/post-build.js`            | Titel, description, deutsche Keywords, Open Graph, Twitter Cards, canonical, JSON-LD, PWA-Tags |
| `scripts/post-build.js` (noscript) | Crawlbarer Fallback-Inhalt inkl. echtem `<a>`-Link zum Play Store                              |
| `public/robots.txt`                | Freigabe + Sitemap-Verweis                                                                     |
| `public/sitemap.xml`               | Startseite + beide Datenschutzseiten                                                           |
| `app.json` (`web.lang: "de"`)      | `<html lang="de">` — deutschsprachiger Hauptmarkt                                              |

## Attribution: warum `referrer` an jedem Store-Link hängt

Play-Store-Links aus der App/Web-Demo werden über `getPlayStoreUrl(source)`
erzeugt und tragen einen `referrer`-Parameter:

```
https://play.google.com/store/apps/details?id=com.s540d.merkeundmale
  &referrer=utm_source%3Dgithub-pages%26utm_medium%3Dweb_banner%26utm_campaign%3Dweb_demo
```

Der komplette UTM-String ist **ein** URL-kodierter Wert. Ohne ihn zählt die Play
Console diese Installationen als „Google Play (organisch)" — die Web-Demo sieht in
den Akquise-Reports dann so aus, als trage sie nichts bei.

`utm_medium` unterscheidet die Klickquellen: `web_banner` (Startseiten-CTA),
`web_footer`, `noscript` (Fallback-Inhalt), `structured_data` (JSON-LD),
`readme` (GitHub). Auswertung: Play Console → **Nutzergewinnung → Akquise-Berichte
→ Nutzerquellen**. Erste Zahlen erscheinen erst 24–48 h nach den ersten Klicks.

## Rendering-Besonderheit: `+html.tsx` ist inaktiv

`app.json` setzt `web.output: "single"`. In diesem Modus rendert Expo **nicht**
`app/+html.tsx`, sondern kopiert sein eigenes Template
(`@expo/cli/static/template/index.html`). Alles, was dort im `<head>` oder
`<body>` steht, landet nie im Deployment — deshalb werden die tatsächlich
ausgelieferten Tags in `scripts/post-build.js` injiziert.

Konsequenz für Änderungen: Meta-Tags immer in `scripts/post-build.js` ergänzen
(oder zusätzlich dort, wenn sie aus Symmetriegründen auch in `+html.tsx` stehen
sollen). Nach dem Build prüfen:

```bash
npm run build:web && node scripts/post-build.js
grep -o '<meta[^>]*>' dist/index.html
```

Zweite Konsequenz: der ausgelieferte Body ist bis zum JS-Rendering leer. Crawler
ohne JS-Ausführung sehen nur den `<noscript>`-Block — deshalb steht dort echter
Inhalt statt Expos „You need to enable JavaScript to run this app.".

`scripts/deploy-ghpages.sh` (manuelles Deployment) und
`.github/workflows/deploy.yml` (automatisch bei Push auf `main`) führen beide
`post-build.js` + `update-cache-version.js` aus.

## Offene Punkte (nicht im Code lösbar)

- **GitHub-Repo-Beschreibung + Topics** setzen (`android`, `react-native`, `expo`,
  `kids-app`, `educational-game`, `memory-game`, `drawing`) — Repo-Einstellungen,
  wirkt auf GitHub-Suche und Google.
- **Google Search Console**: Property `https://s540d.github.io/DrawFromMemory/`
  verifizieren und `sitemap.xml` einreichen; danach prüfen, ob die Seite ohne
  JS-Rendering indexiert wird.
- **Analytics**: `EXPO_PUBLIC_PLAUSIBLE_DOMAIN` setzen, um die Klickrate auf die
  Store-Links messbar zu machen (Infrastruktur steht: `services/AnalyticsService.ts`).
- **Web-App-Manifest**: `output: "single"` erzeugt keine `manifest.json`, die
  `web.icons`/`web.shortName`-Angaben aus `app.json` verpuffen. Für einen echten
  PWA-Installationsprompt müsste das Manifest im Post-Build erzeugt werden —
  bewusst offen gelassen, solange der Play Store der primäre Zielkanal ist.
- **Android App Links** (`.well-known/assetlinks.json`): würde Links auf
  s540d.github.io direkt in der installierten App öffnen. Braucht den
  SHA-256-Fingerprint des Play-Signaturschlüssels aus der Play Console.
