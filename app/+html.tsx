import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * HTML-Template für den Web-Export.
 * Fügt Apple-spezifische Meta-Tags hinzu, damit die App beim
 * "Zum Homescreen hinzufügen" auf iOS ein korrektes Icon und Label erhält.
 *
 * ⚠️ Diese Datei wird beim aktuellen Setup **nicht** verwendet: `app.json` hat
 * `web.output: "single"`, und in diesem Modus rendert Expo nicht `+html.tsx`,
 * sondern kopiert sein eigenes Template
 * (`@expo/cli/static/template/index.html`). Erst bei `output: "static"` oder
 * `"server"` greift `+html.tsx`. Die Datei bleibt deshalb als Vorlage für einen
 * späteren Umstieg erhalten — die tatsächlich ausgelieferten Meta-Tags
 * (PWA/Homescreen, SEO, JSON-LD, noscript-Inhalt) werden in
 * `scripts/post-build.js` injiziert. Wer hier etwas ergänzt, muss es dort
 * ebenfalls ergänzen, sonst landet es nicht im Deployment.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* PWA / Homescreen */}
        <meta name="application-name" content="Merke und Male" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Merke und Male" />
        <meta name="theme-color" content="#60D5FA" />

        {/* Apple Touch Icon – wird als Homescreen-Icon auf iOS verwendet */}
        <link rel="apple-touch-icon" href="/DrawFromMemory/apple-touch-icon.png" />

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
