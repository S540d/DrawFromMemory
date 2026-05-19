# 🗺️ Merke und Male — Entwicklungs-Roadmap

> **Aktueller Stand:** v1.3.4 · Play-Store-ready · 10 Level · DE/EN
>
> Dieses Dokument fasst zusammen, wie die App weiterentwickelt und für Nutzer attraktiver gemacht werden kann. Es baut auf dem bestehenden Backlog (Issue #68) auf und ergänzt ihn mit konkreten Umsetzungsschritten.

---

## Analyse: Was macht die App aktuell stark?

| Stärke | Details |
|--------|---------|
| ✅ Kernmechanik | Merken → Zeichnen → Ergebnis ist klar und einsteigerfreundlich |
| ✅ Zeichenwerkzeug | Pinsel + Füllen, Farbauswahl, Rückgängig — vollständig |
| ✅ Galerie | Zeichnungen speichern und anzeigen |
| ✅ Replay | Zeichnung Strich für Strich nochmal anschauen |
| ✅ Sound & Haptik | Timer-Tick, Stern-Tap, Phasenwechsel |
| ✅ Dark Mode + i18n | Vollständig umgesetzt (DE/EN) |
| ✅ Barrierefreiheit | accessibilityRole/Label auf allen Buttons |

## Analyse: Was fehlt noch für langfristige Bindung?

| Lücke | Auswirkung |
|-------|-----------|
| ⚠️ Alle Level von Anfang an entsperrt | Kein Anreiz zum Weitermachen |
| ⚠️ Timer fix bei 3 s für alle Level | Zu einfach auf hohen Stufen, fehlende Spannung |
| ⚠️ Kein Streak/Tagesanreiz | Nutzer kehren nicht täglich zurück |
| ⚠️ Nur 10 Level | Inhalt zu schnell durchgespielt |
| ⚠️ Kein Tutorial | Neue Nutzer müssen sich selbst zurechtfinden |
| ⚠️ Bewertung nur selbst | Kein objektives Feedback / Erfolgserlebnis |
| ⚠️ Galerie nicht teilbar | Soziale Motivation fehlt |
| ⚠️ Kein Familien-Modus | Nur Einzelspieler |

---

## Phase 1 — Kernmechanik schärfen *(1–2 Sprints, niedriger Aufwand, hoher Impact)*

### 1.1 Variabler Memorize-Timer
**Problem:** Aktuell fest bei 3 s für alle 10 Level — Schwierigkeitsgefälle fehlt.
**Lösung:** Timer skaliert mit Schwierigkeit:

| Stufe | Zeit |
|-------|------|
| 1 (sehr einfach) | 5 s |
| 2 (einfach) | 4 s |
| 3 (mittel) | 3 s |
| 4 (schwierig) | 2 s |
| 5 (sehr schwierig) | 1,5 s |

`extraTimeMode`-Setting (bereits in `StorageManager`) verlängert jeden Wert um +3 s.

**Betroffene Dateien:** `services/LevelManager.ts` (`getDisplayDuration`), `services/useGamePhase.ts`
**Aufwand:** XS · **Impact:** Hoch

---

### 1.2 Level-Fortschritt im Levels-Screen
**Problem:** Der Levels-Screen zeigt Karte + Schwierigkeit, aber keine Sterne-Bewertung der bereits gespielten Level.
**Lösung:** Sterne-Anzeige (`★★★☆☆`) auf jeder Level-Karte aus `StorageManager.getLevelRating()` nachladen.

**Betroffene Dateien:** `app/levels.tsx`
**Aufwand:** S · **Impact:** Hoch (Erfolgserlebnis)

---

### 1.3 Mehr Level (11–20)
**Problem:** 10 Level sind schnell durchgespielt; Langzeitmotivation fehlt.
**Lösung:** Bilderpool um 10 weitere SVG-Vorlagen erweitern (Tiere, Alltagsgegenstände, einfache Szenen).

- Level 11–13: Difficulty 3 (Mittel)
- Level 14–16: Difficulty 4 (Schwierig)
- Level 17–20: Difficulty 5 (Sehr schwierig)

**Betroffene Dateien:** `services/LevelManager.ts` (`getTotalLevels`), `services/ImagePoolManager.ts`, neue SVG-Assets
**Aufwand:** M (SVG-Erstellung ist Hauptaufwand) · **Impact:** Sehr hoch

---

### 1.4 i18n-Vervollständigung
**Problem:** Vereinzelt noch hardcodierte Strings (Issue #162, z. B. `imageInfo`-Zeile in `game.tsx`).
**Lösung:** Alle verbliebenen Strings auf `t()`-Schlüssel umstellen; fehlende Keys in `locales/de/` und `locales/en/` ergänzen.

**Betroffene Dateien:** `app/game.tsx`, beide `translations.json`
**Aufwand:** XS · **Impact:** Mittel

---

## Phase 2 — Engagement & Wiederkehr *(2–3 Sprints, mittlerer Aufwand)*

### 2.1 Streak-System & Tages-Anreiz
**Konzept:** Tägliche Spiel-Streak mit Belohnungs-Feedback.

- Beim Öffnen der App: Streak-Zähler auf dem Home-Screen (🔥 3 Tage)
- Wird täglich erhöht, wenn mindestens 1 Level gespielt wird
- Bei Unterbrechung: freundliche Erinnerung, keine Strafe

**Neue Dateien:** `services/StreakManager.ts`, neuer Storage-Key `@merke_male:streak`
**Aufwand:** S · **Impact:** Hoch (Retention)

---

### 2.2 Daily Challenge — Bild des Tages
**Konzept:** Jeden Tag ein zufälliges Bild als besonderes Challenge-Level.

- Deterministisch aus Datum berechnet (kein Server nötig)
- Eigener Eintrag auf dem Home-Screen mit Ablauf-Countdown
- Besonderes Galerie-Label „Daily Challenge" für den gespeicherten Eintrag

**Neue Dateien:** `services/DailyChallengeManager.ts`
**Aufwand:** S · **Impact:** Hoch (täglicher Anreiz)

---

### 2.3 Onboarding-Tutorial
**Konzept:** Beim ersten Start kurze geführte Tour (max. 4 Schritte):

1. „Schau dir das Bild genau an" (Memorize-Phase)
2. „Zeichne das Bild aus dem Gedächtnis nach" (Draw-Phase)
3. „Bewerte dich selbst" (Result-Phase)
4. „Speichere deine Zeichnung in der Galerie"

Überspringbar, nur beim allerersten Start (Flag in AsyncStorage).

**Neue Dateien:** `components/OnboardingOverlay.tsx`
**Aufwand:** M · **Impact:** Mittel (Aktivierung neuer Nutzer)

---

### 2.4 Achievements / Meilenstein-Badges
**Konzept:** Kleine Belohnungen für Meilensteine sichtbar in den Einstellungen.

Beispiel-Achievements:
- 🏅 „Erster Strich" — Erstes Level abgeschlossen
- 🌟 „Perfektionist" — 5 Sterne auf einem Level
- 🔥 „7 Tage am Stück" — 7-Tage-Streak
- 🎨 „Galerie-Künstler" — 10 Zeichnungen gespeichert
- 🧠 „Gedächtnis-Meister" — Alle 20 Level abgeschlossen

**Neue Dateien:** `services/AchievementManager.ts`, `components/AchievementToast.tsx`
**Aufwand:** M · **Impact:** Mittel-Hoch

---

### 2.5 Galerie teilen
**Konzept:** Zeichnungen als Bild exportieren und über Share-Sheet teilen.

- `expo-sharing` + `expo-file-system` zum Exportieren als PNG
- Share-Button in der Galerie-Detailansicht
- Elternsperre (`ParentalGate`) vor dem Teilen aktivieren

**Betroffene Dateien:** `app/gallery.tsx`, neuer `GalleryDetailScreen`
**Aufwand:** M · **Impact:** Hoch (virale Verbreitung)

---

## Phase 3 — Soziale & Familien-Features *(3–5 Sprints, höherer Aufwand)*

### 3.1 Familien-Modus
**Konzept:** Person A zeichnet ein freies Bild → Person B muss es nachzeichnen.

- Keine externen Server oder Uploads nötig (lokaler Modus)
- Person A nutzt den vorhandenen Zeichencanvas
- Zeichnung wird lokal gespeichert und als Vorlage für Person B bereitgestellt
- Neue Route: `/family`

**Neue Dateien:** `app/family.tsx`, `services/FamilyModeManager.ts`
**Aufwand:** M-H · **Impact:** Sehr hoch (soziale Motivation, USP)

---

### 3.2 Eltern-Dashboard
**Konzept:** Geschützter Bereich (via `ParentalGate`) mit aggregiertem Fortschritt.

- Zeitverlauf der gespielten Level (Sparkline-Grafik)
- Durchschnittliche Selbstbewertung pro Woche
- Gesamte Spielzeit (geschätzt aus Spieldauer je Level)
- Export als einfacher Text-Report

**Neue Dateien:** `app/parent-dashboard.tsx`, `services/ProgressAnalytics.ts`
**Aufwand:** M · **Impact:** Mittel (Eltern-Retention)

---

## Phase 4 — Langfristig & Distribution *(5+ Sprints)*

### 4.1 Gedächtnis-Stufen
**Konzept:** Verschiedene Verzögerungs-Modi für echtes Gedächtnistraining.

| Modus | Ablauf |
|-------|--------|
| Sofort (aktuell) | Bild → sofort zeichnen |
| Verzögert | Bild → 30 s Ablenkungsaufgabe → zeichnen |
| Langzeit *(experimentell)* | Bild morgens sehen → Erinnerung abends |

**Aufwand:** M-H · **Impact:** Sehr hoch (USP, pädagogischer Mehrwert)

---

### 4.2 Eigene Bilder / Kamera-Modus (Issue #1)
**Konzept:** Nutzer fotografiert oder zeichnet ein eigenes Bild → andere Person malt nach.

- Kamera-Zugriff via `expo-image-picker`
- Bild wird lokal als Vorlage gespeichert (keine Cloud)
- Familien-Modus als Vorstufe implementieren (Phase 3.1)

**Aufwand:** H · **Impact:** Hoch (viel gewünscht von Nutzern)

---

### 4.3 Mehr Inhaltskategorien
**Konzept:** Thematisch gruppierte Bildpools für zusätzliche Abwechslung.

| Kategorie | Beispiele |
|-----------|-----------|
| 🐾 Tiere | Katze, Hund, Fisch, Vogel |
| 🚗 Fahrzeuge | Auto, Zug, Flugzeug, Schiff |
| 🏠 Alltagsgegenstände | Haus, Stuhl, Apfel, Tasse |
| 🌳 Natur | Baum, Sonne, Blume, Wolke |
| 🏆 Herausforderungen | Komplexe Szenen, abstrakte Formen |

**Aufwand:** M (SVG-Assets) · **Impact:** Sehr hoch (Langzeitmotivation)

---

### 4.4 Accessibility-Verbesserungen
**Konzept:** App für mehr Nutzer zugänglich machen.

- **Farbenblinden-Modus:** Paletten mit ausreichendem Kontrast
- **Textgröße:** Opt-in für größere Schriften (via Settings)
- **VoiceOver/TalkBack:** Vollständige Screenreader-Unterstützung für alle Buttons

**Aufwand:** M · **Impact:** Mittel (Inklusion, Store-Bewertungen)

---

## Zusammenfassung & Empfehlung

```
Priorität | Feature                    | Aufwand | Impact
----------|----------------------------|---------|-------
🔴 P1     | Variabler Timer            | XS      | Hoch
🔴 P1     | Level-Sterne im Grid       | S       | Hoch
🔴 P1     | 10 weitere Level           | M       | Sehr hoch
🔴 P1     | i18n-Vervollständigung     | XS      | Mittel
🟠 P2     | Streak-System              | S       | Hoch
🟠 P2     | Daily Challenge            | S       | Hoch
🟠 P2     | Onboarding-Tutorial        | M       | Mittel
🟠 P2     | Achievements               | M       | Mittel-Hoch
🟠 P2     | Galerie teilen             | M       | Hoch
🟡 P3     | Familien-Modus             | M-H     | Sehr hoch
🟡 P3     | Eltern-Dashboard           | M       | Mittel
🟢 P4     | Gedächtnis-Stufen          | M-H     | Sehr hoch
🟢 P4     | Kamera-Modus (Issue #1)    | H       | Hoch
🟢 P4     | Inhaltskategorien          | M       | Sehr hoch
🟢 P4     | Accessibility              | M       | Mittel
```

**Empfohlener Einstieg:** P1-Features sind alle klein und bringen sofort spürbaren Mehrwert. Insbesondere der **variable Timer** und die **Level-Sterne** lassen sich in einem einzigen Sprint umsetzen und machen das Spiel direkt spannender.

---

## Verknüpfte Issues

- [#1](https://github.com/S540d/DrawFromMemory/issues/1) — Eigene Zeichnungen fotografieren & als Vorlage nutzen
- [#68](https://github.com/S540d/DrawFromMemory/issues/68) — Weiterentwicklung DrawFromMemory — Feature-Roadmap (Sammelissue)
- [#162](https://github.com/S540d/DrawFromMemory/issues/162) — i18n Lokalisierung nicht fertig
- [#167](https://github.com/S540d/DrawFromMemory/issues/167) — App modernisieren und weiterentwickeln (dieses Issue)
