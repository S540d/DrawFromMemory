# Bild-Richtlinien für "Merke und Male"

## Übersicht

Die App zeigt Bilder, die Nutzer aus dem Gedächtnis nachzeichnen sollen. Die Bilder sind nach Schwierigkeitsgrad in Level-Ordner organisiert.

## Ordnerstruktur

```
assets/images/
├── levels-1/          # Level 1 (Difficulty 1) - Sehr einfach
├── levels-2/          # Level 2-3 (Difficulty 2) - Einfach
├── levels-3/          # Level 4-5 (Difficulty 3) - Mittel
├── levels-4/          # Level 6-7 (Difficulty 4) - Schwer
└── levels-5/          # Level 8-10 (Difficulty 5) - Sehr schwer + Perspektive
```

## Dateinamenskonvention

```
level-{level-nr}-{name}.svg
extra-{nr}-{name}.svg
```

Beispiele:
- `level-01-sun.svg` - Hauptbild für Level 1
- `extra-02-star.svg` - Zusätzliches Bild für Variation

---

## Schwierigkeitsgrade

### Level 1 (Difficulty 1) - Sehr einfach
**Ziel:** Erste Erfolge, Grundformen üben

**Merkmale:**
- 3-5 Striche/Formen maximal
- Nur Grundformen: Kreis, Linie, einfaches Rechteck
- 1-2 Farben (+ Schwarz für Konturen)
- Keine Details
- Symmetrische, einfache Motive

**Geeignete Motive:**
- Sonne (Kreis + 8 Strahlen)
- Smiley (Kreis + 2 Punkte + Bogen)
- Strichmännchen (5 Linien + Kreis)
- Stern (5-zackig)
- Herz
- Mond (Halbkreis)

**SVG-Beispiel (Smiley):**
```svg
<svg width="200" height="200" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="60" fill="#FFD700" stroke="#000" stroke-width="3"/>
  <circle cx="75" cy="85" r="8" fill="#000"/>
  <circle cx="125" cy="85" r="8" fill="#000"/>
  <path d="M 70 120 Q 100 150 130 120" stroke="#000" stroke-width="4" fill="none"/>
</svg>
```

---

### Level 2-3 (Difficulty 2) - Einfach
**Ziel:** Mehrere Formen kombinieren

**Merkmale:**
- 5-8 Elemente
- Grundformen kombiniert
- 2-3 Farben
- Einfache Proportionen
- Keine Überlappungen oder nur minimale

**Geeignete Motive:**
- Einfaches Haus (Rechteck + Dreieck + Tür)
- Apfel (Kreis + Stiel + Blatt)
- Ballon (Oval + Schnur)
- Rakete (Dreieck + Rechteck + Flamme)
- Wolke (3 überlappende Kreise)
- Blume (Kreis + 5 Blütenblätter + Stiel)

**SVG-Beispiel (Apfel):**
```svg
<svg width="200" height="200" viewBox="0 0 200 200">
  <circle cx="100" cy="110" r="50" fill="#E74C3C" stroke="#000" stroke-width="3"/>
  <rect x="95" y="50" width="10" height="25" fill="#8B4513" stroke="#000" stroke-width="2"/>
  <ellipse cx="115" cy="65" rx="15" ry="10" fill="#27AE60" stroke="#000" stroke-width="2"/>
</svg>
```

---

### Level 4-5 (Difficulty 3) - Mittel
**Ziel:** Details und Proportionen

**Merkmale:**
- 8-12 Elemente
- Details innerhalb von Formen (z.B. Fensterkreuze)
- 3-4 Farben
- Proportionen werden wichtiger
- Einfache Überlappungen erlaubt

**Geeignete Motive:**
- Haus mit Details (Fensterkreuze, Schornstein)
- Baum mit Krone (Stamm + mehrere Kreise)
- Auto (Seitenansicht, vereinfacht)
- Schiff (einfache Seitenansicht)
- Vogel (Körper + Flügel + Schnabel)
- Pilz mit Details

**SVG-Beispiel (Baum):**
```svg
<svg width="200" height="200" viewBox="0 0 200 200">
  <rect x="85" y="130" width="30" height="50" fill="#8B4513" stroke="#000" stroke-width="3"/>
  <circle cx="100" cy="90" r="40" fill="#27AE60" stroke="#000" stroke-width="3"/>
  <circle cx="65" cy="110" r="30" fill="#27AE60" stroke="#000" stroke-width="3"/>
  <circle cx="135" cy="110" r="30" fill="#27AE60" stroke="#000" stroke-width="3"/>
</svg>
```

---

### Level 6-7 (Difficulty 4) - Schwer
**Ziel:** Komplexere Formen und Tiere

**Merkmale:**
- 12-18 Elemente
- Organische Formen (Kurven, Bögen)
- 4-5 Farben
- Erkennbare Tiere/Objekte mit Details
- Überlappungen und Schichtung

**Geeignete Motive:**
- Katze (sitzend, von vorne)
- Hund (Seitenansicht)
- Schaf (Körper aus Wolken-Kreisen)
- Elefant (vereinfacht)
- Blume mit Blättern
- Fisch mit Schuppen (vereinfacht)

**SVG-Beispiel (Katze):**
```svg
<svg width="200" height="200" viewBox="0 0 200 200">
  <!-- Körper -->
  <ellipse cx="100" cy="140" rx="45" ry="35" fill="#808080" stroke="#000" stroke-width="3"/>
  <!-- Kopf -->
  <circle cx="100" cy="80" r="35" fill="#808080" stroke="#000" stroke-width="3"/>
  <!-- Ohren -->
  <polygon points="70,55 80,30 90,55" fill="#808080" stroke="#000" stroke-width="2"/>
  <polygon points="110,55 120,30 130,55" fill="#808080" stroke="#000" stroke-width="2"/>
  <!-- Augen -->
  <ellipse cx="85" cy="75" rx="8" ry="10" fill="#90EE90" stroke="#000" stroke-width="2"/>
  <ellipse cx="115" cy="75" rx="8" ry="10" fill="#90EE90" stroke="#000" stroke-width="2"/>
  <!-- Pupillen -->
  <ellipse cx="85" cy="75" rx="3" ry="6" fill="#000"/>
  <ellipse cx="115" cy="75" rx="3" ry="6" fill="#000"/>
  <!-- Nase -->
  <polygon points="100,88 95,95 105,95" fill="#FFC0CB"/>
  <!-- Schnurrhaare -->
  <line x1="65" y1="90" x2="90" y2="92" stroke="#000" stroke-width="1.5"/>
  <line x1="65" y1="95" x2="90" y2="95" stroke="#000" stroke-width="1.5"/>
  <line x1="110" y1="92" x2="135" y2="90" stroke="#000" stroke-width="1.5"/>
  <line x1="110" y1="95" x2="135" y2="95" stroke="#000" stroke-width="1.5"/>
</svg>
```

---

### Level 8-10 (Difficulty 5) - Sehr schwer + Perspektive
**Ziel:** Räumliches Denken und Perspektive

**Merkmale:**
- 15-25 Elemente
- **Perspektivische Elemente** (Tiefenwirkung)
- Vorder-/Hintergrund-Unterscheidung
- 5+ Farben
- Komplexe Szenen
- Größenverhältnisse zeigen Entfernung

**Perspektive-Techniken (einfach):**
- Größenunterschiede (nah = groß, fern = klein)
- Überlappung (vorne verdeckt hinten)
- Position (unten = nah, oben = fern)
- Einfache Fluchtpunkte (Straße, Schienen)

**Geeignete Motive:**
- Landschaft mit Bergen (vorne Bäume, hinten Berge)
- Straße mit Fluchtpunkt
- Burg/Schloss
- Unterwasserszene (Fische in verschiedenen Größen)
- Stadtsilhouette
- Löwe/Tiger (von vorne)

**SVG-Beispiel (Straße mit Perspektive):**
```svg
<svg width="200" height="200" viewBox="0 0 200 200">
  <!-- Himmel -->
  <rect width="200" height="100" fill="#87CEEB"/>
  <!-- Wiese -->
  <rect y="100" width="200" height="100" fill="#90EE90"/>
  <!-- Berge (hinten, klein) -->
  <polygon points="0,100 50,60 100,100" fill="#A0826D" stroke="#000" stroke-width="2"/>
  <polygon points="80,100 140,50 200,100" fill="#8B7355" stroke="#000" stroke-width="2"/>
  <!-- Straße (Fluchtpunkt) -->
  <polygon points="70,200 130,200 105,100 95,100" fill="#555" stroke="#000" stroke-width="2"/>
  <!-- Mittelstreifen -->
  <line x1="100" y1="200" x2="100" y2="110" stroke="#FFF" stroke-width="3" stroke-dasharray="15,10"/>
  <!-- Sonne -->
  <circle cx="170" cy="30" r="20" fill="#FFD700" stroke="#FFA500" stroke-width="2"/>
  <!-- Baum vorne (groß) -->
  <rect x="15" y="140" width="15" height="40" fill="#8B4513" stroke="#000" stroke-width="2"/>
  <circle cx="22" cy="120" r="25" fill="#27AE60" stroke="#000" stroke-width="2"/>
  <!-- Baum hinten (klein) -->
  <rect x="160" y="85" width="6" height="15" fill="#8B4513" stroke="#000" stroke-width="1"/>
  <circle cx="163" cy="78" r="10" fill="#27AE60" stroke="#000" stroke-width="1"/>
</svg>
```

---

## Technische Anforderungen

### SVG-Format
- **Größe:** 200x200 px (Standard) oder 300x200 px (Landschaft)
- **ViewBox:** Immer definieren für Skalierbarkeit
- **Stroke-Width:** Minimum 2-3px für gute Sichtbarkeit

### Farben (App-Palette)
**WICHTIG:** Verwende NUR diese 12 Farben! Sie entsprechen exakt der Farbauswahl in der App (3x4 Grid).

| Zeile | Farbe | Hex | Verwendung |
|-------|-------|-----|------------|
| **1** | Schwarz | `#000000` | Konturen, Augen |
| **1** | Weiß | `#FFFFFF` | Highlights, Wolken, Schnee |
| **1** | Grau | `#808080` | Tiere (Elefant, Maus), Steine |
| **2** | Rot | `#E74C3C` | Herzen, Äpfel, Dächer |
| **2** | Orange | `#FFA500` | Sonne (Ring), Karotten, Kürbis |
| **2** | Gelb | `#FFD700` | Sonne, Sterne, Blumen |
| **3** | Grün | `#27AE60` | Bäume, Gras, Blätter |
| **3** | Blau | `#3498DB` | Himmel, Wasser, Details |
| **3** | Lila | `#9B59B6` | Blumen, Dekoration |
| **4** | Rosa | `#FF69B4` | Blumen, Schwein, Details |
| **4** | Braun | `#8B4513` | Baumstämme, Holz, Erde |
| **4** | Hautfarbe | `#FDBCB4` | Gesichter, Hände (bei Menschen) |

**Farben die NICHT mehr verfügbar sind:**
- ~~Hellgrün (#90EE90)~~ → Nutze stattdessen: Grün (#27AE60)
- ~~Hellblau (#87CEEB)~~ → Nutze stattdessen: Blau (#3498DB)
- ~~Hellbraun (#D2691E)~~ → Nutze stattdessen: Orange (#FFA500)
- ~~Rosa (#FFC0CB)~~ → Nutze stattdessen: Rosa (#FF69B4)

### Vermeiden
- **Keine Farbverläufe** (schwer zu malen)
- **Keine Schatten/Blur-Effekte**
- **Keine zu feinen Details** (< 2px)
- **Keine Text-Elemente**
- **Keine Transparenz** (außer bei Überlappungen)

### Gute Praxis
- Klare Konturen (`stroke-width: 2-4`)
- Geschlossene Formen (`fill` + `stroke`)
- Einfache Geometrie
- Erkennbare Silhouetten
- Kommentare im SVG für Struktur

---

## Anzahl Bilder pro Level

| Level | Ordner | Mindestanzahl | Empfohlen |
|-------|--------|---------------|-----------|
| 1 | levels-1 | 3 | 5-6 |
| 2-3 | levels-2 | 4 | 6-8 |
| 4-5 | levels-3 | 4 | 6-8 |
| 6-7 | levels-4 | 4 | 6-8 |
| 8-10 | levels-5 | 5 | 8-10 |

---

## Checkliste vor dem Hinzufügen

- [ ] SVG validiert (keine Fehler)
- [ ] Größe 200x200 oder 300x200
- [ ] Nur erlaubte Farben verwendet
- [ ] Keine Farbverläufe
- [ ] Stroke-Width mindestens 2px
- [ ] Motiv ist mit Finger auf Handy nachmalbar
- [ ] Schwierigkeitsgrad passt zum Level
- [ ] Dateiname folgt Konvention
