# Wachstums-Roadmap — DrawFromMemory (Issue #219)

> Ausgelagert aus `CLAUDE.md` im Rahmen der CLAUDE.md-Wartung (Issue #160,
> project-templates). Übergeordneter Plan, um aus der App eine dauerhaft
> wachsende Kids-App im Play Store zu machen.

Stand: `main` @ v1.9.0 / versionCode 70 (Release-PRs #266, #293, #301). Enthält u.a. Themen-Pack-Auswahl-UI (#271), Draw-UX-Fixes (#272), Mascot "Mali" + Altersstufen-Auswahl (Issue #279 1.1+1.3, #284), Illustrations-Stilguide (#285), Lottie/Icon-Refresh (#286), Tablet-/Landscape-Layout (#281/#287), Themen-Packs Natur/Märchen/Essen v1 (#288, Pool 51→81 Bilder), SEO-/Trust-Ausbau der gh-pages-Demo (#280/#291), Startbildschirm-/Einstellungen-Label-Anpassungen aus APK-Testing-Feedback (#292), foojay/Gradle-9-Fix (Issue #276), Fahrzeuge v1, PNG-Export, Mini-Tutorial, Design-System Phase C/D-Polish, Spielvarianten, weitere Sprachen, Sentry-ErrorBoundary (#264) und den transform-origin Web-Fix (#265). `testing` liegt weiterhin leicht voraus: primär Tech-Debt/Infra (ARCHITECTURE.md #307, `levelImages/`-Split #309, Dependabot+CodeQL #310, Coverage-Threshold-Anhebung #313, actionlint-Reuse #316, CI-Fix für PRs gegen testing #319, `react-native-svg-web` entfernt #321, DailyChallengeManager/OnboardingManager-Refactor #320) — kein User-Facing-Feature-Rückstand mehr. **Play Store noch nicht auf v1.9.0** — Release-Aufgabe in Issue #267.

## P0 — Foundation für Wachstum

| Task                                           | Status                                                                                                                                             |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Galerie-Persistenz (#215)                      | ✅ erledigt (v1.6.3)                                                                                                                               |
| Play-Store-Listing-Audit                       | ⏭ extern — teilweise umgesetzt                                                                                                                     |
| **In-App-Review-Prompt** (`expo-store-review`) | ✅ in main (v1.7.0) — per Feature-Flag deaktiviert (`EXPO_PUBLIC_ENABLE_IN_APP_REVIEW`)                                                            |
| Analytics-Setup (COPPA-konform)                | 🔲 offen — Tool-Entscheidung nötig                                                                                                                 |
| Crash-Rate-Baseline (Sentry)                   | 🟡 teilweise — ErrorBoundary meldet an Sentry, initSentry abgesichert (PR #264); noch offen: `EXPO_PUBLIC_SENTRY_DSN` für Produktions-Build setzen |

## P1 — Content & Retention

| Task                                                                     | Status                                                                                                       |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| **Themen-Pack Tiere v1** (10 Bilder, #222)                               | ✅ in main (v1.7.0)                                                                                          |
| **Themen-Pack Fahrzeuge v1** (10 Bilder, PR #254)                        | ✅ in main (v1.7.0)                                                                                          |
| **Themen-Pack-Auswahl-UI** (Chip-Filter Alle/Tiere/Fahrzeuge, PR #271)   | ✅ in main                                                                                                   |
| **Themen-Pack Natur/Märchen/Essen v1** (je 10 Bilder, Issue #279 1.5)    | ✅ in main (v1.8.0, PR #288)                                                                                 |
| Content-Pipeline: Ziel 100+ Bilder (Issue #279 1.5)                      | 🟡 81/100+ — saisonaler Pack-Mechanismus noch offen                                                          |
| **Spielvarianten** (Nur Umriss merken, Spiegelbild, Kreativ-Modus, #247) | ✅ in main (v1.7.0)                                                                                          |
| **Avatar & Personalisierung** (Mascot "Mali", Issue #279 1.1)            | ✅ in main (v1.8.0, PR #284) — bewusst ohne separates XP-System, siehe Zeile darunter                        |
| ~~XP- & Level-System~~                                                   | ❌ bewusst nicht (Issue #279 Anti-Bloat) — Gesamt-Sterne schalten stattdessen direkt Mascot-Accessoires frei |
| Wöchentliche Challenge                                                   | ❌ bewusst nicht (Issue #279 Anti-Bloat) — ein Loop (Daily Challenge) statt mehrerer Parallel-Systeme        |

## P2 — Reichweite & Trust

| Task                                                                   | Status                                                    |
| ---------------------------------------------------------------------- | --------------------------------------------------------- |
| Designed for Families Programm                                         | 🔲 offen                                                  |
| **Weitere Sprachen** (ES/FR/IT/NL/PL, #247)                            | ✅ in main (v1.7.0) — automatische Geräte-Spracherkennung |
| **Sharing-Feature / PNG-Export** (ShareService, PR #255)               | ✅ in main (v1.7.0)                                       |
| Push-Notifications (opt-in)                                            | 🔲 offen                                                  |
| **Tablet-/Landscape-Layout** (Issue #279 2.4, deckt #278 UI-seitig ab) | ✅ in main (v1.8.0, PR #281/#287)                         |

## Themen-Pack Architektur (ab PR #221, Auswahl-UI ab PR #271)

- `LevelImage.pack?: string` — optionaler Tag (z.B. `'tiere-v1'`)
- Bilder ohne `minLevel` sind ab dem passenden Difficulty-Level verfügbar
- Neue Packs: einfach neue Render-Dateien in `components/levelImages/` + Registry-Einträge in `components/levelImages/registry.ts` + Einträge in `ImagePoolManager.ts` + `IMAGE_ELEMENT_COUNTS` (`LevelImageDisplay.tsx`)
- Pflicht nach jedem neuen SVG: `npm run validate:svg-counts` (derzeit 81 Einträge)
- `getAvailablePacks()` (`ImagePoolManager.ts`) liefert alle im Pool vorkommenden Pack-IDs für die Chip-Filter-UI in `app/levels.tsx`
- Neue Packs erscheinen automatisch als Filteroption — für ein sprechendes Label in der UI zusätzlich einen Eintrag in `PACK_LABEL_KEYS` (`app/levels.tsx`) sowie `levels.pack.<label>` in allen 7 Locale-Dateien ergänzen
- **Visueller Stil verbindlich:** [`ILLUSTRATION_STYLEGUIDE.md`](ILLUSTRATION_STYLEGUIDE.md) (Linienstärke, Farbpalette aus `Colors.ts`, Ziel-Elementanzahl pro Difficulty, Produktionsweg für neue SVGs) — Grundlage für Issue #279 Säule 2.1 und die Content-Pipeline (1.5, Ziel 100+ Bilder)
