# Level-Bilder - Draw From Memory

## Übersicht

Dieses Verzeichnis enthält alle Level-Bilder für die App. Jedes Bild ist im SVG-Format und nach dem Schema `level-XX-name.svg` benannt.

---

## Namenskonvention

```
level-01-sun.svg           → Level 1: Sonne
level-02-stick-figure.svg  → Level 2: Strichmännchen
level-03-house.svg         → Level 3: Haus
...
```

---

## Level-Übersicht (MVP - 10 Level)

### Einfach (Level 1-4)

**Level 1: Sonne** - `level-01-sun.svg`
- Kreis mit Strahlen
- ~10 Striche
- Farbe: Gelb + Orange

**Level 2: Strichmännchen** - `level-02-stick-figure.svg`
- Kopf + Körper + Arme + Beine
- ~8 Striche
- Farbe: Schwarz

**Level 3: Haus** - `level-03-house.svg`
- Quadrat + Dreieck (Dach) + Tür + Fenster
- ~12 Striche
- Farbe: Braun + Rot

**Level 4: Baum** - `level-04-tree.svg`
- Stamm + Baumkrone (Kreis oder Wolke)
- ~8 Striche
- Farbe: Braun + Grün

### Mittel (Level 5-8)

**Level 5: Auto** - `level-05-car.svg`
- Rechteck + 2 Kreise (Räder) + Fenster
- ~15 Striche
- Farbe: Rot + Schwarz

**Level 6: Katze** - `level-06-cat.svg`
- Körper + Kopf + Ohren + Schwanz
- ~18 Striche
- Farbe: Orange + Schwarz

**Level 7: Blume** - `level-07-flower.svg`
- Blütenblätter + Stängel + Blätter
- ~20 Striche
- Farbe: Gelb/Rosa + Grün

**Level 8: Vogel** - `level-08-bird.svg`
- Körper + Flügel + Schnabel
- ~15 Striche
- Farbe: Blau + Gelb

### Schwierig (Level 9-10)

**Level 9: Fisch** - `level-09-fish.svg`
- Körper + Flossen + Schwanz + Schuppen
- ~25 Striche
- Farbe: Orange + Blau

**Level 10: Schmetterling** - `level-10-butterfly.svg`
- Flügel (symmetrisch) + Körper + Fühler + Muster
- ~30 Striche
- Farbe: Bunt (Mehrfarbig)

### Perspektivisch (Level 11+) - **GEPLANT**

**Level 11+: Perspektivische Zeichnungen**
- 3D-Objekte (Würfel, Treppe, Tür)
- Szenen in Perspektive (Haus, Straße, Stadtszene)
- ~40+ Striche
- Mit Tiefenwirkung und Schatten

> **📝 Erweiterung geplant:** Siehe [ICON_GENERATION_PLAN.md](../../../ICON_GENERATION_PLAN.md) für Details zu neuen Icons und perspektivischen Zeichnungen (Issue #5).

---

## Bildquellen (Frei verfügbar, kommerzielle Nutzung erlaubt)

### Empfohlene Quellen

#### 1. **Unsplash** (https://unsplash.com/)
- ✅ Kostenlos
- ✅ Kommerzielle Nutzung erlaubt
- ✅ Keine Namensnennung erforderlich
- ✅ Hochqualität

**Suchbegriffe:**
- "simple sun illustration"
- "stick figure drawing"
- "simple house cartoon"
- "minimalist tree"

#### 2. **Pixabay** (https://pixabay.com/)
- ✅ Kostenlos
- ✅ Pixabay Lizenz (kommerzielle Nutzung OK)
- ✅ Viele Vektorgrafiken (SVG)
- ✅ Filter: "Vektorgrafiken"

**Suchbegriffe:**
- "sonne vektor"
- "haus cartoon"
- "baum einfach"

#### 3. **SVG Repo** (https://www.svgrepo.com/)
- ✅ Kostenlos
- ✅ CC0 / MIT Lizenz (kommerzielle Nutzung OK)
- ✅ Direkt SVG-Format
- ✅ Kategorien: Icons, Illustrations

**Kategorien:**
- Nature → Sun, Tree
- Animals → Cat, Bird, Fish
- Transport → Car
- Architecture → House

#### 4. **Flaticon** (https://www.flaticon.com/)
- ✅ Kostenlos (mit Attribution) oder Premium (ohne Attribution)
- ✅ Kommerzielle Nutzung erlaubt
- ✅ SVG-Format
- ⚠️ Attribution erforderlich (außer Premium)

#### 5. **Freepik** (https://www.freepik.com/)
- ✅ Kostenlos (mit Attribution) oder Premium
- ✅ Kommerzielle Nutzung erlaubt
- ✅ Viele einfache Illustrationen
- ⚠️ Attribution erforderlich (außer Premium)

---

## Download-Anleitung

### Methode 1: Manueller Download

1. Gehe zu einer der oben genannten Quellen
2. Suche nach dem gewünschten Motiv (z.B. "simple sun")
3. Wähle ein Bild mit klarer, einfacher Darstellung
4. Lade das Bild herunter (bevorzugt SVG, alternativ PNG)
5. Benenne die Datei um: `level-01-sun.svg`
6. Speichere die Datei in: `assets/images/levels/`

### Methode 2: Bulk Download Script (Bash)

```bash
# SVG Repo (Public Domain)
curl -o assets/images/levels/level-01-sun.svg "https://www.svgrepo.com/download/123456/sun.svg"
curl -o assets/images/levels/level-02-stick-figure.svg "https://www.svgrepo.com/download/789012/person.svg"
# ... weitere URLs
```

**Hinweis:** Du musst die konkreten URLs selbst von der Website kopieren.

---

## Lizenz-Hinweise

### CC0 (Public Domain)
- ✅ Keine Attribution erforderlich
- ✅ Kommerzielle Nutzung OK
- ✅ Keine Einschränkungen

### MIT Lizenz
- ✅ Kommerzielle Nutzung OK
- ⚠️ Attribution im Code erforderlich (z.B. in CREDITS.md)

### Unsplash Lizenz
- ✅ Kommerzielle Nutzung OK
- ✅ Keine Attribution erforderlich
- ⚠️ Keine Redistribution als Bildsammlung

### Pixabay Lizenz
- ✅ Kommerzielle Nutzung OK
- ✅ Keine Attribution erforderlich
- ⚠️ Keine Redistribution im Original-Format

---

## Bild-Spezifikationen

### Format
- **Bevorzugt:** SVG (vektorbasiert, skalierbar)
- **Alternativ:** PNG (transparent, min. 512x512px)

### Stil
- **Einfach:** Klare Linien, minimale Details
- **Kindgerecht:** Freundlich, bunt, nicht zu realistisch
- **Kontrast:** Gute Unterscheidbarkeit der Elemente
- **Farben:** Max. 3-4 Farben pro Bild

### Technische Anforderungen
- **SVG:** Max. 50KB pro Datei
- **PNG:** Max. 200KB pro Datei
- **Auflösung:** Min. 512x512px (für PNG)
- **Farbraum:** RGB
- **Hintergrund:** Transparent oder weiß

---

## Alternative: Eigene SVG-Bilder erstellen

Falls keine passenden Bilder gefunden werden, können wir einfache SVG-Grafiken selbst erstellen:

**Tools:**
- **Figma** (Web, kostenlos): https://figma.com
- **Inkscape** (Desktop, Open Source): https://inkscape.org
- **Excalidraw** (Web, kostenlos): https://excalidraw.com
- **draw.io** (Web, kostenlos): https://draw.io

**Vorteile:**
- ✅ Exakt auf unsere Bedürfnisse zugeschnitten
- ✅ Konsistenter Stil
- ✅ Keine Lizenz-Probleme
- ✅ Mit dem Kind zusammen erstellen

---

## Checkliste

Vor dem Hinzufügen eines Bildes:

- [ ] Lizenz überprüft (CC0, MIT, Unsplash, Pixabay OK)
- [ ] Format: SVG bevorzugt
- [ ] Dateiname: `level-XX-name.svg`
- [ ] Dateigröße: < 50KB (SVG) oder < 200KB (PNG)
- [ ] Stil: Einfach, kindgerecht
- [ ] Getestet: Bild wird in verschiedenen Größen korrekt angezeigt

---

## Status

**Aktuell:** 14/28+ Bilder vorhanden (siehe [BILDERPOOL.md](BILDERPOOL.md))

### MVP Level (1-10) - VOLLSTÄNDIG
- [x] Level 1: Sonne
- [x] Level 2: Gesicht  
- [x] Level 3: Wolke
- [x] Level 4: Haus
- [x] Level 5: Baum
- [x] Level 6: Hund
- [x] Level 7: Katze
- [x] Level 8: Schaf
- [x] Level 9: Fisch
- [x] Level 10: Schmetterling

### Extra Icons (für Abwechslung) - VOLLSTÄNDIG
- [x] Extra 1: Strichmännchen
- [x] Extra 2: Auto
- [x] Extra 3: Blume
- [x] Extra 4: Vogel

### Geplante Erweiterungen (Issue #5)
- [ ] Phase 1: +19 Icons für Difficulty 1-5
- [ ] Phase 2: +9 Icons für Difficulty 6+ (perspektivische Zeichnungen)

> **Detaillierter Plan:** [ICON_GENERATION_PLAN.md](../../../ICON_GENERATION_PLAN.md)

---

**Erstellt:** 2025-12-05  
**Zuletzt aktualisiert:** 2026-01-02  
**Lizenz:** Alle Bilder müssen kommerziell nutzbar sein (CC0, MIT, Unsplash, Pixabay)
