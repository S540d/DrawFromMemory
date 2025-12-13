# Entscheidungen - Merke und Male

## ✅ Finalisierte Entscheidungen (mit Kind besprochen)

**Datum:** 2025-12-05

---

### 1. App-Name 📱

**"Merke und Male"**

- **Deutsch:** Merke und Male
- **Englisch:** Remember & Draw

**Rationale:**
- Einfach und kindgerecht
- Beschreibt die beiden Hauptaktionen
- Reimt sich im Deutschen (eingängig)
- Leicht merkbar für Kinder

---

### 2. Farbschema 🎨

**Helle, freundliche Farben**

```css
/* Primary Color */
--color-primary: #60D5FA;        /* Helles Türkis/Cyan - freundlich, hell */
--color-primary-light: #8FE3FC;
--color-primary-dark: #3CBCE0;

/* Secondary Color */
--color-secondary: #FFB84D;      /* Helles Orange - warm, einladend */
--color-secondary-light: #FFC976;
--color-secondary-dark: #FFA524;

/* Accent Color */
--color-accent: #A8E6CF;         /* Helles Mint-Grün - beruhigend */

/* Background */
--color-bg-primary: #FFFEF9;     /* Cremeweiß - sehr hell, augenfreundlich */
--color-bg-secondary: #F5F5F0;   /* Hellgrau (warm) */

/* Text */
--color-text-primary: #333333;   /* Dunkelgrau (nicht schwarz, sanfter) */
--color-text-secondary: #666666; /* Mittelgrau */

/* Status Colors (angepasst für helles Theme) */
--color-success: #4CAF50;        /* Freundliches Grün */
--color-warning: #FFA726;        /* Helles Orange */
--color-danger: #EF5350;         /* Sanftes Rot */
--color-info: #42A5F5;           /* Helles Blau */
```

**Rationale:**
- Kind wünscht helle Farben
- Freundlich und einladend
- Guter Kontrast für Lesbarkeit
- Nicht zu grell, aber fröhlich
- Augenfreundlich auch bei längerem Spielen

---

### 3. Level-Bilder (MVP - 10 Stück) 🖼️

**Neue Level-Liste:**

| Level | Bild | Schwierigkeit | Timer | Status |
|-------|------|---------------|-------|--------|
| 1 | ☀️ Sonne | Einfach | 10s | ✅ Vorhanden |
| 2 | 😊 Gesicht (Smiley) | Einfach | 9s | 🔲 Neu erstellen |
| 3 | ☁️ Wolke | Einfach | 8s | 🔲 Neu erstellen |
| 4 | 🏠 Haus | Einfach | 7s | ✅ Vorhanden |
| 5 | 🌳 Baum | Mittel | 6s | ✅ Vorhanden |
| 6 | 🐕 Hund (Seite) | Mittel | 5s | 🔲 Neu erstellen |
| 7 | 🐱 Katze | Mittel | 5s | ✅ Vorhanden |
| 8 | 🐑 Schaf | Mittel | 5s | 🔲 Neu erstellen |
| 9 | 🐟 Fisch | Schwierig | 4s | ✅ Vorhanden |
| 10 | 🦋 Schmetterling | Schwierig | 3s | ✅ Vorhanden |

**Änderungen:**
- ❌ Entfernt: Strichmännchen, Auto, Blume, Vogel
- ✅ Neu: Gesicht, Wolke, Hund (Seite), Schaf

**Thematische Verteilung:**
- **Natur:** Sonne, Wolke, Baum (3)
- **Tiere:** Hund, Katze, Schaf, Fisch, Schmetterling (5)
- **Objekte:** Haus, Gesicht (2)

---

### 4. Display-Timer (Progressive Schwierigkeit) ⏱️

**Level-abhängig (wird schwieriger):**

```typescript
function getDisplayDuration(levelNumber: number): number {
  // Level 1: 10s, Level 2: 9s, ..., Level 7-8: 5s, Level 9: 4s, Level 10: 3s
  return Math.max(3, 11 - levelNumber);
}
```

**Timer pro Level:**
- Level 1: 10 Sekunden (viel Zeit zum Einprägen)
- Level 2: 9 Sekunden
- Level 3: 8 Sekunden
- Level 4: 7 Sekunden
- Level 5: 6 Sekunden
- Level 6-8: 5 Sekunden (konstant)
- Level 9: 4 Sekunden (sehr schwierig)
- Level 10: 3 Sekunden (extrem schwierig)

**Settings-Option:**
- "Mehr Zeit"-Modus: +5 Sekunden auf allen Levels
- Für jüngere Kinder oder zum Üben

---

### 5. App-Icon 🎯

**Konzept: Stift der malt**

**Design:**
- Ein bunter Buntstift (Holzstift mit Spitzer Mine)
- Der gerade einen Stern oder eine Linie zeichnet
- Eventuell mit kleinem Gehirn-Symbol im Hintergrund (für "Merken")
- Hauptfarben: Helles Türkis (#60D5FA) + Orange (#FFB84D)

**Umsetzung:**
- SVG-Format für skalierbare Icons
- Verschiedene Größen: 192x192, 512x512 (PWA), 1024x1024 (Store)
- Adaptive Icon für Android

---

## 📋 Verbleibende offene Fragen (später)

Diese Fragen werden in einer zweiten Runde besprochen:

- [ ] Perfekt-Animation (Konfetti bei 5 Sternen?)
- [ ] Hinweise bei niedrigen Bewertungen ("Versuch es nochmal"?)
- [ ] Sound-Effekte (welche Sounds?)
- [ ] Hintergrundmusik (ja/nein?)
- [ ] Zeichen-Farben (welche 8 Grundfarben?)

---

## 🚀 Nächste Schritte (Umsetzung)

1. ✅ Farbschema dokumentiert
2. ✅ 4 neue Level-Bilder erstellen (Gesicht, Wolke, Hund, Schaf) - **Alle 10 Level + 4 Extra fertig**
3. 🔴 App-Icon mit Stift erstellen
4. ✅ PROJEKTSKIZZE.md aktualisieren
5. ✅ README.md aktualisieren mit neuem Namen
6. ✅ Expo-Projekt initialisieren mit "Merke und Male"

**Implementierungsstatus:** Siehe [STATUS.md](STATUS.md) für Details

---

**Erstellt:** 2025-12-05  
**Aktualisiert:** 2025-12-13  
**Status:** In Entwicklung (MVP 50%) - siehe [STATUS.md](STATUS.md)  
**Team:** Kind (Ideengeber), Sven (Moderator), Claude (Umsetzung)
