# Google Play — Store-Listing

Vorlage für die Listing-Texte in der Google Play Console.
Quelle: Issue [#243](https://github.com/S540d/DrawFromMemory/issues/243) (Store-Listing-Überarbeitung, live seit Juni 2026).

**Zeichenlimits (Play Console):** Titel max. 30, Kurzbeschreibung max. 80, Langbeschreibung max. 4000 Zeichen.

---

## 1. Titel (max. 30 Zeichen)

| Sprache | Titel                | Zeichen |
| ------- | -------------------- | ------- |
| DE      | Merke und Male       | 14      |
| EN      | Merke und Male       | 14      |

> Der App-Name bleibt in allen Sprachen identisch (Markenname, entspricht `app.json` / Package `com.s540d.merkeundmale`). Keyword-Ergänzungen im Titel (z. B. „– Memory für Kinder") sind möglich, aber bewusst weggelassen: Der Titel bleibt kurz und einprägsam, Keywords stehen in Kurz- und Langbeschreibung.

---

## 2. Kurzbeschreibung (max. 80 Zeichen, ASO-relevant)

EN-Original bewusst kurz gehalten, damit Auto-Übersetzungen in den meisten Sprachen unter 80 Zeichen bleiben. „coloring" steht nicht im Titel (Längen-/Keyword-Trade-off), dafür prominent in Zeile 1 der Langbeschreibung.

### Manuell geprüfte Übersetzungen

| Sprache | Text                                                         | Zeichen |
| ------- | ------------------------------------------------------------ | ------- |
| EN      | Memory & drawing game for kids — no ads, offline             | 49      |
| DE      | Memory- & Zeichenspiel für Kinder — ohne Werbung, offline    | 56      |
| ES      | Juego de memoria y dibujo para niños — sin anuncios, offline | 60      |
| FR      | Jeu de mémoire et dessin pour enfants — sans pub, hors ligne | 60      |
| DA      | Hukommelses- og tegnespil for børn — ingen reklamer, offline | 60      |
| FI      | Muisti- ja piirtopeli lapsille — ei mainoksia, offline       | 54      |
| AR      | لعبة ذاكرة ورسم للأطفال — بدون إعلانات، دون إنترنت           | 49      |

> Übrige Sprachen über die Auto-Übersetzung der Play Console; die Tabelle oben dient als manuelle Referenz/Korrektur.

---

## 3. Langbeschreibung (max. 4000 Zeichen)

### EN (Original)

```
Can your child remember the picture — and draw it from memory? A drawing and coloring game that trains memory and concentration through play. No ads. No in-app purchases. Fully offline. Made for kids and toddlers ages 3 and up.

📚 HOW IT WORKS
1. Look at the picture and memorize it
2. The picture disappears
3. Draw it from memory
4. Compare and learn

✨ WHY KIDS LOVE IT
• 10 levels that grow with your child
• Simple drawing tools: brush, eraser, fill
• A big, colorful palette
• Unlimited undo & redo
• Works completely offline — perfect for the car, plane or waiting room
• In German and English

🎯 WHAT YOUR CHILD PRACTICES
• Memory & concentration
• Fine motor skills
• Color recognition
• Creativity and spatial thinking
• And most of all — it's just fun!

🛡️ MADE FOR PARENTS' PEACE OF MIND
• No ads, ever
• No in-app purchases
• No data collection — everything stays on the device
• No internet needed
• No external links or buttons your child could tap by accident
• COPPA & GDPR compliant

📖 LEVELS THAT GROW WITH YOUR CHILD
• Levels 1–3: Simple shapes and first colors
• Levels 4–6: Combinations and more details
• Levels 7–10: Bigger challenges for older kids

💝 Completely free. No hidden costs, no ads, no purchases — just download and play.

Built with privacy in mind. Source code openly available for those who want to check.
```

### DE

```
Kann sich dein Kind das Bild merken — und es aus dem Gedächtnis malen? Ein Zeichen- und Malspiel, das Gedächtnis und Konzentration spielerisch trainiert. Keine Werbung. Keine In-App-Käufe. Komplett offline. Für Kinder ab 3 Jahren.

📚 SO FUNKTIONIERT'S
1. Bild ansehen und merken
2. Das Bild verschwindet
3. Aus dem Gedächtnis nachmalen
4. Vergleichen und lernen

✨ WARUM KINDER ES LIEBEN
• 10 Level, die mit deinem Kind mitwachsen
• Einfache Werkzeuge: Pinsel, Radierer, Füllen
• Eine große, bunte Farbpalette
• Unbegrenztes Rückgängigmachen
• Funktioniert komplett offline — perfekt für Auto, Flugzeug oder Wartezimmer
• Auf Deutsch und Englisch

🎯 WAS DEIN KIND TRAINIERT
• Gedächtnis & Konzentration
• Feinmotorik
• Farben erkennen
• Kreativität und räumliches Denken
• Und vor allem: Es macht einfach Spaß!

🛡️ FÜR DIE RUHE DER ELTERN GEMACHT
• Keine Werbung, niemals
• Keine In-App-Käufe
• Keine Datensammlung — alles bleibt auf dem Gerät
• Kein Internet nötig
• Keine externen Links oder Buttons, die dein Kind versehentlich antippen könnte
• COPPA- & DSGVO-konform

📖 LEVEL, DIE MITWACHSEN
• Level 1–3: Einfache Formen und erste Farben
• Level 4–6: Kombinationen und mehr Details
• Level 7–10: Größere Herausforderungen für ältere Kinder

💝 Komplett kostenlos. Keine versteckten Kosten, keine Werbung, keine Käufe — einfach herunterladen und losmalen.

Mit Datenschutz im Kern entwickelt. Der Quellcode ist offen einsehbar.
```

> Übrige Sprachen (ES/FR/IT/NL/PL u. a.) über die Auto-Übersetzung der Play Console erzeugen und stichprobenartig gegen die App-Übersetzungen in `locales/` prüfen.

---

## 4. Pflege-Hinweise

- **Konsistenz mit der App:** Bei inhaltlichen Änderungen (Level-Anzahl, Sprachen, neue Features wie Themen-Packs oder Spielvarianten) die Beschreibungen nachziehen. Die Langbeschreibung nennt aktuell „10 levels" und „German and English" — bei einem Listing-Update auf 20 Level und 7 Sprachen (de/en/es/fr/it/nl/pl) aktualisieren.
- **Altersangabe konsistent halten:** „ages 3+ / toddlers" ↔ Zielgruppen-/Familienfreigabe in der Console (siehe [PLAY_STORE_DATA_SAFETY.md](PLAY_STORE_DATA_SAFETY.md)).
- **Data Safety:** Antworten für das Data-Safety-Formular stehen in [PLAY_STORE_DATA_SAFETY.md](PLAY_STORE_DATA_SAFETY.md).
- **Visuelle Assets** (Screenshots, Feature-Graphic, Video): siehe Aufwertungs-Plan [#279](https://github.com/S540d/DrawFromMemory/issues/279), Säule 3.

---

_Letzte Aktualisierung: 12. Juli 2026_
