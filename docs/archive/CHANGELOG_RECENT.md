# 🎉 Changelog - Aktuelle Releases

## Version 1.2.0 - Feb 27, 2026

### 🎬 Zeichnungs-Zeitraffer (Drawing Replay)
- **Strich-für-Strich Replay** in der Ergebnisphase
- Play/Stop-Button unter "Deine Zeichnung"
- Animation über ~3 Sekunden mit progressiver Punkt-Aufdeckung
- Unterstützt sowohl Pinsel- als auch Füll-Pfade

### 🔊 Sound-Effekte & Haptik (Issue #31)
- **Web Audio API** basierte Tonerzeugung (keine Sound-Dateien nötig)
- **Timer-Tick**: Sanfter Ton bei jedem Countdown-Schritt
- **Phasenwechsel-Chime**: Aufsteigender Dreiklang (C-E-G) bei Memorize→Draw und Draw→Result
- **Stern-Bewertung**: Aufsteigender Ton je nach Sternzahl (1-5)
- **Erfolgs-Sound**: Zweiklang beim Speichern in die Galerie
- **Haptisches Feedback** (Native): expo-haptics mit Light/Success Patterns
- **Sound-Toggle** in den Einstellungen (An/Aus, persistiert)

### 🖼️ Galerie & Progressive Reveal (vorherige Session)
- Zeichnungen in Galerie speichern (max 50)
- SVG-Elemente erscheinen einzeln während Memorize-Phase
- Level-10-Completion-Banner

### Implementierungsdetails

**Neue Dateien:**
- `services/SoundManager.ts` - Sound-Effekte (Web Audio API) + Haptik (expo-haptics)

**Geänderte Dateien:**
- `app/game.tsx` - Replay-Animation, Sound-Integration an 5 Stellen
- `components/SettingsModal.tsx` - Sound An/Aus Toggle
- `locales/de/translations.json` - Replay/Stop Übersetzungen
- `locales/en/translations.json` - Replay/Stop Übersetzungen
- `package.json` - expo-av, expo-haptics Dependencies

### Neue Dependencies
- `expo-av` ^16.0.8
- `expo-haptics` ^55.0.8

---

## Version 1.1.0 - Jan 5, 2026

### 🎨 Features

#### Issue #20: Color Picker Filtering ✅ COMPLETE
- **Extend LevelImage Interface** - `colors: string[]` property hinzugefügt
- **Farb-Kuration für alle 14 SVG-Bilder:**
  - Extra-einfach (Level 1-3): 1-3 Farben (z.B. Strichmännchen nur schwarz)
  - Mittel (Level 4-5): 3-5 Farben
  - Schwierig (Level 8-10): 5-8 Farben
- **Dynamischer Color Picker** - Filtert DrawingColors basierend auf `currentImage.colors`
- **UX Verbesserung**: Nur relevante Farben pro Bild anzeigen statt alle 13

**Implementierungsdetails:**
- `services/ImagePoolManager.ts`: Alle 14 Bilder mit Farb-Metadaten erweitert
- `app/game.tsx` (Zeilen 133-154): Color Picker Filter implementiert
- Fallback auf alle Farben wenn keine spezifischen Farben definiert

### 🚀 Deployment & Performance

#### Cache-Busting System (NEW)
- **scripts/update-cache-version.js** - Erweiterte Cache-Busting Implementierung
- Alle HTML-Dateien mit `?v=timestamp` Query-Parametern versehen
- HTTP Cache-Control Meta-Tags hinzugefügt
- `.nojekyll` Datei für GitHub Pages Kompatibilität
- `version.json` Endpoint für Versionstracking

**Effekt:**
- Browser lädt immer die neueste Version
- Keine Probleme mit veralteten Assets
- Benutzer sehen Update ohne manuellen Cache-Clear

### 🔧 Web-Deployment Fixes

#### AsyncStorage Web Fallback
- In-Memory Storage Fallback für Web/GitHub Pages
- Verhindert "Cannot set indexed properties" Fehler
- Graceful Degradation wenn AsyncStorage nicht verfügbar

**Implementierung:**
- `services/StorageManager.ts`: `safeStorageOps` Helper mit Try-Catch Wrapper
- Alle Storage-Operationen durch Fallback geschützt
- iOS/Android unaffected, nur Web betroffen

### ✅ GitHub Pages Configuration
- `baseUrl: "/DrawFromMemory/"` in app.json konfiguriert
- `scripts/post-build.js` für Subpath-Rewriting
- GitHub Actions Workflow: build → subpath-fix → cache-busting → deploy
- Live auf: https://s540d.github.io/DrawFromMemory/

---

## Commits dieser Session

```
01fabc7 feat: Implement cache-busting system for GitHub Pages
16ff6bc feat: Implement Issue #20 - Color picker filtering
bd4892a fix: Web storage fallback for GitHub Pages
```

---

## 📊 Statistiken

### Dateien verändert
- `types/index.ts` - LevelImage Interface erweitert
- `services/ImagePoolManager.ts` - 14 Bilder mit Farb-Metadaten
- `services/StorageManager.ts` - Web-Fallback implementiert
- `app/game.tsx` - Color Picker Filter hinzugefügt
- `scripts/update-cache-version.js` - Cache-Busting erweitert
- `.github/workflows/deploy.yml` - Bereits konfiguriert ✅

### Farb-Kuration
- Strichmännchen: 1 Farbe
- Sonne: 3 Farben (schwarz, gelb, orange)
- Haus: 4 Farben (schwarz, rot, braun, hellblau)
- Hund: 5 Farben (schwarz, braun, weiß, rot, gelb)
- Schmetterling: 5 Farben (schwarz, purple, pink, gelb, weiß)
- ...alle 14 Bilder kuratiert

---

## 🎯 Abgeschlossene Ziele

✅ Issue #20 Implementierung
✅ Farb-Filterung für alle 14 Bilder
✅ Cache-Busting System
✅ AsyncStorage Web-Fallback
✅ GitHub Pages Deployment
✅ Browser Cache Optimization

---

## 🚀 Nächste Prioritäten (aus Plan)

**TIER 1 - Blocker (3-4h)**
- [ ] Add npm scripts: format, lint, type-check, test
- [ ] Fix OTA Updates Project IDs in app.json
- [ ] Add accessibility labels (accessibilityRole, accessibilityLabel)
- [ ] Fix color contrast (Colors.text.light WCAG AA compliance)

**TIER 2 - UX (4-5h)**
- [ ] Settings Menu Overhaul
- [ ] Replace hardcoded colors with theme tokens
- [ ] Add loading states
- [ ] Responsive Design (tablets, desktop)

**TIER 3 - Polish (2-3h)**
- [ ] Performance optimizations
- [ ] Animation improvements
- [ ] Additional features (leaderboard, achievements, etc.)

---

## 📝 Notes

- **GitHub Pages URL ist stabil** nach Cache-Busting Implementation
- **Color Picker UX verbessert** - Weniger Optionen = bessere UX für Kinder
- **Web-Kompatibilität erhöht** - AsyncStorage Fallback macht App robust
- **Deployment automatisiert** - GitHub Actions kümmert sich um Cache-Busting

---

**Generated:** 2026-01-05
**Version:** 1.1.0
**Status:** Production Ready ✅
