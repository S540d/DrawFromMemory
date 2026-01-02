# GitHub Pages Setup - Anleitung

## Problem
Die App sollte unter https://s540d.github.io/DrawFromMemory/ erreichbar sein, ist es aber nicht.

## Ursache
Das Deployment funktioniert einwandfrei! Der GitHub Actions Workflow läuft erfolgreich und deployed die App in den `gh-pages` Branch. **ABER**: GitHub Pages ist nicht in den Repository-Einstellungen aktiviert.

## Lösung: GitHub Pages aktivieren

### Schritt-für-Schritt Anleitung:

1. **Gehe zu den Repository-Einstellungen:**
   - Öffne https://github.com/S540d/DrawFromMemory/settings

2. **Navigiere zu "Pages":**
   - In der linken Seitenleiste, unter "Code and automation", klicke auf **"Pages"**

3. **Aktiviere GitHub Pages:**
   - **Source:** Wähle "Deploy from a branch"
   - **Branch:** Wähle `gh-pages` aus dem Dropdown
   - **Folder:** Wähle `/ (root)`
   - Klicke auf **"Save"**

4. **Warte auf die Aktivierung:**
   - GitHub Pages wird nun aktiviert (kann 1-2 Minuten dauern)
   - Du erhältst eine Bestätigung: "Your site is live at https://s540d.github.io/DrawFromMemory/"

5. **Teste die App:**
   - Öffne https://s540d.github.io/DrawFromMemory/
   - Die App sollte jetzt erreichbar sein!

## Warum ist das Problem aufgetreten?

Der GitHub Actions Workflow (`.github/workflows/deploy.yml`) funktioniert perfekt:
- ✅ Build läuft erfolgreich
- ✅ Export nach `dist/` funktioniert
- ✅ Post-Build Skript korrigiert die Pfade für GitHub Pages
- ✅ Deployment in den `gh-pages` Branch erfolgreich
- ❌ **ABER:** GitHub Pages ist nicht aktiviert, um den Branch zu veröffentlichen

## Technische Details

### Was ist bereits vorhanden:

1. **Deployment Workflow** (`.github/workflows/deploy.yml`):
   - Triggered bei Push auf `main` Branch
   - Baut die Web-Version mit `expo export --platform web`
   - Korrigiert Pfade mit `scripts/post-build.js`
   - Deployed zu `gh-pages` Branch

2. **gh-pages Branch**:
   - Existiert und enthält die deployten Dateien
   - Enthält: `index.html`, `game.html`, `levels.html`, `settings.html`, `_expo/`, `assets/`

3. **Post-Build Script** (`scripts/post-build.js`):
   - Korrigiert alle Pfade für den `/DrawFromMemory/` Subpath
   - Updated JavaScript Bundle für korrekte Client-Side Navigation
   - Fügt `.nojekyll` Datei hinzu

### Konfiguration in `app.json`:
```json
{
  "expo": {
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/icon.png"
    }
  },
  "experiments": {
    "typedRoutes": true,
    "baseUrl": "/DrawFromMemory"
  }
}
```

## Nächste Schritte

Nach der Aktivierung von GitHub Pages:
1. Die App wird unter https://s540d.github.io/DrawFromMemory/ erreichbar sein
2. Bei jedem Push auf `main` wird automatisch neu deployed
3. Die App funktioniert vollständig offline (PWA-fähig)

## Troubleshooting

Falls die App nach der Aktivierung nicht sofort funktioniert:

1. **Cache leeren:**
   - Drücke `Ctrl+Shift+R` (Windows/Linux) oder `Cmd+Shift+R` (Mac)

2. **Warte 1-2 Minuten:**
   - GitHub Pages braucht manchmal etwas Zeit für die erste Aktivierung

3. **Prüfe den Deployment Status:**
   - Gehe zu https://github.com/S540d/DrawFromMemory/deployments
   - Überprüfe ob `github-pages` als aktive Environment erscheint

4. **Force Redeploy:**
   - Gehe zu Actions → Deploy to GitHub Pages → Run workflow
   - Trigger einen manuellen Deploy mit "workflow_dispatch"

## Support

Falls Probleme auftreten:
- Prüfe die Actions Logs: https://github.com/S540d/DrawFromMemory/actions
- Öffne ein Issue: https://github.com/S540d/DrawFromMemory/issues

---

**Status:** ✅ Deployment funktioniert | ⏳ GitHub Pages muss aktiviert werden
