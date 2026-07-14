# Illustrations-Stilguide

Verbindlicher Stil für alle Level-SVGs in `assets/images/levels/` und
`assets/images/levels-{1-5}/`. Grundlage für Säule 2.1 aus [Issue #279](https://github.com/S540d/DrawFromMemory/issues/279)
und Voraussetzung für 1.5 (Content-Pipeline auf 100+ Bilder) — ohne einen
festgelegten Stil lässt sich Bildproduktion nicht in Serie delegieren, und
jedes neue Pack würde optisch aus dem Rahmen fallen.

Dieser Guide beschreibt den **Ist-Stil** der bestehenden 51 Bilder (extrahiert
aus den am konsistentesten umgesetzten Level-SVGs) als verbindlichen
Ziel-Standard — nicht eine neue Erfindung. Er ist die Referenz für:

- neue Themen-Packs (Natur, Märchen, Essen, Saison-Packs — siehe 1.5)
- den geplanten Icon-/Feature-Graphic-Refresh (2.3)
- einen späteren Konsistenz-Pass über Ausreißer im Bestand

---

## 1. Technisches Format

- **Canvas:** `viewBox="0 0 200 200"`, `width="200" height="200"`. Alle Bilder
  nutzen dasselbe Koordinatensystem, damit sie bei jeder Anzeigegröße
  (`LevelImageDisplay` skaliert per `size`-Prop) gleich wirken.
- **Erlaubte Elemente:** `<circle>`, `<ellipse>`, `<rect>`, `<line>`,
  `<path>`, `<polygon>`, gruppiert mit `<g>`. Keine `<image>`, keine
  Rasterdaten, keine CSS-`<filter>`/Gradients — das hält Dateien klein
  (<50 KB, siehe `assets/images/levels/README.md`) und in `react-native-svg`
  auf allen Plattformen identisch renderbar.
- **`rotation`/`origin`-Props sind verboten** (siehe CLAUDE.md-Konvention
  "react-native-svg auf Web") — für Rotationen `transform="rotate(angle cx cy)"`
  direkt im SVG verwenden.
- **Kein Reveal-Step-Bruch:** Jedes Top-Level-Kind-Element eines `<Svg>`
  zählt für den progressiven Aufdeckeffekt (`revealStep` in
  `LevelImageDisplay.tsx`, `IMAGE_ELEMENT_COUNTS`). Elemente so gruppieren,
  dass die Aufdeck-Reihenfolge sinnvoll ist (große Formen zuerst, Details
  zuletzt) — nicht nach Belieben verschachteln.
- **Outline-Modus-tauglich:** Die Spielvariante „Nur Umriss merken"
  (`mode="outline"` in `LevelImageDisplay.tsx`) entfernt rekursiv alle
  Füllfarben und erzwingt eine einheitliche Kontur. Jedes Element muss daher
  auch **ohne Fill** als Silhouette erkennbar bleiben — keine Details, die
  ausschließlich über Farbflächen ohne eigene Kontur transportiert werden.

## 2. Linienstärke

| Verwendung | `stroke-width` | Beispiel |
| --- | --- | --- |
| Haupt-Konturen (Körper, Kopf, große Formen) | `2`–`3` | Körper-Ellipse, Kopf-Kreis |
| Details (Augen, Mund, kleine Elemente) | `2` | Pupillen-Highlight, Mund-Pfad |
| Akzent-/dünne Linien (Strahlen, Fühler, Whiskers) | `4` | Sonnenstrahlen (`level-01-sun.svg`) |
| Dicke Akzente (Schwanz, Äste) | `6`–`8` | Hunde-Schwanz (`level-06-dog.svg`) |

Nie dünner als `2` (verschwindet bei kleiner Anzeigegröße auf Mobilgeräten)
und nie dicker als `8` (wirkt klobig gegen die übrige Linienführung).
`stroke-linecap="round"` auf allen offenen Pfaden/Linien für die weiche,
kindgerechte Optik.

## 3. Farbpalette

Referenz ist ausschließlich `constants/Colors.ts`. Zwei Farbwelten:

1. **Zeichen-Palette (`DrawingColors`, 12 Farben)** — das Kind zeichnet mit
   diesen Farben nach. Level-Bilder sollten **überwiegend** aus dieser
   Palette bestehen, damit „Farbe nachmalen" für das Kind erreichbar ist:
   `#000000` (Schwarz), `#FFFFFF` (Weiß), `#808080` (Grau), `#E74C3C` (Rot),
   `#FFA500` (Orange), `#FFD700` (Gelb), `#27AE60` (Grün), `#3498DB` (Blau),
   `#87CEEB` (Hellblau), `#9B59B6` (Lila), `#FF69B4` (Rosa), `#8B4513`
   (Braun), `#FDBCB4` (Hautfarbe).
2. **Illustrations-Akzente** — abgeleitete Schattierungen für Konturen und
   Tiefe (z.B. `#8B4513` als Kontur-Ton zu einem `#D2691E`-Fill), analog zum
   bestehenden Muster „Fill in Zeichenfarbe, Kontur eine Stufe dunkler".

**Regeln:**

- **Max. 4 Farben pro Bild** (inkl. einer Kontur-/Schattenfarbe), plus
  optional Schwarz/Weiß für Augen/Highlights. Mehr Farben erschweren das
  Nachmalen und wirken unruhig.
- Kontur-Farbe ist immer eine gedeckte, dunklere Variante der Fläche, nie
  reines Schwarz auf hellen Flächen (Ausnahme: feine Detaillinien wie Augen,
  Mund — dort `#000000`).
- Keine Farbverläufe, keine Transparenz außer für dezente Akzente
  (`opacity` sparsam, z.B. Wangen-Blush).

## 4. Komplexität pro Difficulty

Anzeigedauer und Element-Anzahl hängen zusammen (`LevelManager.getDisplayDuration`
gibt jüngeren/schwierigeren Leveln mehr/weniger Zeit). Werte sind aus dem
tatsächlichen Bestand extrahiert (Top-Level-SVG-Elemente je Bild,
`IMAGE_ELEMENT_COUNTS` in `LevelImageDisplay.tsx`, gegen `difficulty` in
`ImagePoolManager.ts` gemappt, Stand 51 Bilder):

| Difficulty | Anzeigezeit | Ist-Streuung (min–max) | Ziel-Korridor für neue Bilder | Charakter |
| --- | --- | --- | --- | --- |
| 1 | 5 s | 6–9 (n=3) | 6–9 | Einzelnes Objekt, Grundformen (Kreis, Linie) |
| 2 | 4 s | 5–11 (n=11) | 8–11 | Objekt + 1–2 Details (Fenster, Blätter) |
| 3 | 3 s | 8–15 (n=14) | 10–13 | Mehrteiliges Motiv (Kopf+Körper+Gliedmaßen) |
| 4 | 2 s | 12–23 (n=14) | 13–16 | Reicher an Details (Fell-Muster, Zubehör) |
| 5 | 2 s | 9–25 (n=9) | 15–18 | Komplexeste Motive (Szenen, viele Elemente) |

Die teils breite Ist-Streuung (v.a. Difficulty 4/5, Ausreißer bis 23/25
Elemente bzw. so niedrig wie 9) zeigt konkret, warum ein späterer
Konsistenz-Pass nötig ist (§7) — für **neue** Bilder gilt ab sofort der
engere Ziel-Korridor. Beim Design eines neuen Bildes die Elementanzahl im
Ziel-Korridor der Ziel-Difficulty halten, dann `npm run validate:svg-counts`
nutzen, um den tatsächlichen Wert zu verifizieren (Pflicht-Schritt, siehe
unten).

## 5. Motiv & Ausdruck

- **Kindgerecht, nicht realistisch:** vereinfachte, freundliche Formen
  (große Augen, runde Körper) statt anatomisch korrekter Proportionen.
- **Klare Silhouette:** jedes Motiv muss auch stark verkleinert (Level-Grid-
  Vorschau, ca. 80×80 px) erkennbar sein — keine filigranen Innendetails,
  die bei kleiner Größe verschwimmen.
- **Ein Blickfang pro Bild:** kein überladenes Szenenbild; ein Hauptmotiv
  mittig, optional 1–2 unterstützende Elemente (z.B. Baum neben einem Haus).
- **Konsistente Kamera/Perspektive:** Frontal- oder leichte 3/4-Ansicht,
  keine Vogelperspektive oder starke Verzerrung.

## 6. Produktionsweg für neue Bilder (1.5-Grundlage)

1. Motiv anhand der Ziel-Difficulty aus §4 auswählen (Elementanzahl-Korridor).
2. In einem SVG-Editor (Figma, Inkscape, Excalidraw — siehe
   `assets/images/levels/README.md`) mit `viewBox="0 0 200 200"` zeichnen,
   Linienstärken aus §2 und Farben aus §3 verwenden.
3. Datei benennen nach Schema `level-XX-name.svg` / `extra-NN-name.svg` /
   packbezogen (z.B. `level-05-04-lion.svg` für Themen-Pack-Bilder, siehe
   bestehende Namenskonvention in `services/ImagePoolManager.ts`).
4. In `assets/images/levels/` (kanonisch) sowie im passenden
   `assets/images/levels-{1-5}/`-Ordner ablegen.
5. Eintrag in `services/ImagePoolManager.ts` (`filename`, `difficulty`,
   `displayName`/`displayNameEn`, `strokeCount`, `colors`, optional `pack`)
   ergänzen.
6. **Pflicht:** `IMAGE_ELEMENT_COUNTS` in `components/LevelImageDisplay.tsx`
   um den neuen Dateinamen ergänzen (Anzahl der Top-Level-SVG-Kinder).
7. `npm run validate:svg-counts` ausführen — schlägt fehl, wenn Schritt 6
   vergessen wurde oder die Zahl nicht stimmt.
8. Stichprobe in der App: Reveal-Effekt (Memorize-Phase), Outline-Modus
   (Spielvariante „Nur Umriss") und Spiegelbild-Modus visuell prüfen.

## 7. Bestehender Konsistenz-Pass (Follow-up)

Dieser Guide dokumentiert den Ziel-Stil; ein systematischer Abgleich aller
51 bestehenden SVGs gegen §2–§5 (Ausreißer bei Linienstärke/Farbanzahl
angleichen) ist **nicht** Teil dieser Umsetzung und als separates
Arbeitspaket vorgesehen, sobald neue Packs nach diesem Guide entstehen und
Abweichungen sichtbar werden. Neue Bilder folgen dem Guide ab sofort
verbindlich.

## Verwandte Dokumente

- [`assets/images/levels/README.md`](../assets/images/levels/README.md) —
  Namenskonvention, Bildquellen/Lizenzen, technische Datei-Anforderungen
  (Dateigröße, Format)
- [CLAUDE.md](../CLAUDE.md) — Projektübersicht, Themen-Pack-Architektur
- [Issue #279](https://github.com/S540d/DrawFromMemory/issues/279) — Säule 2.1
