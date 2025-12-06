# Offene Fragen - Merke und Male

## ✅ Beantwortete Fragen (2. Runde)

**Datum:** 2025-12-05 (mit Kind besprochen)

---

### 1. Bewertungssystem ⭐

**Frage:** Wie viele Sterne kann man maximal erreichen?

**✅ ANTWORT:** Maximal 5 Sterne

**Implementierung:**
```typescript
interface Rating {
  stars: 1 | 2 | 3 | 4 | 5;
  message: string;
  animation?: string;
  sound?: string;
}

function getRatingFeedback(stars: number): Rating {
  switch(stars) {
    case 1:
    case 2:
      return {
        stars,
        message: "Das war schon besser als vorhin, willst du es trotzdem nochmal versuchen?",
        animation: "none",
        sound: "huchhu.mp3"
      };
    case 3:
      return {
        stars,
        message: "Gut gemacht! Beim nächsten Mal wird es noch besser!",
        animation: "none",
        sound: null
      };
    case 4:
      return {
        stars,
        message: "Super! Das hast du toll gezeichnet!",
        animation: "none",
        sound: null
      };
    case 5:
      return {
        stars,
        message: "Perfekt! Du bist ein Gedächtnis-Meister!",
        animation: "jumping-person",
        sound: "success.mp3"
      };
  }
}
```

---

### 2. Perfekt-Animation (5 Sterne) 🎉

**Frage:** Was soll passieren, wenn man 5 Sterne bekommt?

**✅ ANTWORT:** Springender Mensch (kein Konfetti)

**Animation:**
- Ein einfaches Strichmännchen oder Cartoon-Figur
- Springt fröhlich auf und ab (3-4 Sprünge)
- Eventuell mit erhobenen Armen
- Helle, freundliche Farben (#60D5FA, #FFB84D)
- Animation-Dauer: ~2 Sekunden

**Technische Umsetzung:**
- SVG-Animation oder Lottie-Animation
- Wird angezeigt über dem "5 Sterne"-Rating
- Danach Fade-out

**Alternative (falls komplexer):**
- Einfacher Emoji/Smiley der springt 🤸
- Oder eine Figur die "Daumen hoch" zeigt 👍

---

### 3. Feedback bei niedrigen Bewertungen (1-2 Sterne) 😢

**Frage:** Was soll bei 1-2 Sternen passieren?

**✅ ANTWORT:** Motivierende Aussage

**Text:** "Das war schon besser als vorhin, willst du es trotzdem nochmal versuchen?"

**Optionen:**
- [ ] Nochmal versuchen → Level neu starten
- [ ] Weiter → Nächstes Level

**Zusätzliche motivierende Aussagen (Rotation):**
1. "Das war schon besser als vorhin, willst du es trotzdem nochmal versuchen?"
2. "Übung macht den Meister! Versuch es nochmal?"
3. "Fast geschafft! Beim nächsten Mal klappt es bestimmt!"
4. "Nicht aufgeben! Du kannst das schaffen!"

**Ton:** Freundlich, ermutigend, niemals negativ

---

### 4. Sound bei 1-2 Sternen 🔊

**Frage:** Welcher Sound soll bei 1-2 Sternen kommen?

**✅ ANTWORT:** "Huchhu" (sanft, freundlich)

**Sound-Spezifikation:**
- Dateiname: `huchhu.mp3`
- Dauer: ~1-2 Sekunden
- Ton: Freundlich, nicht frustrierend
- Lautstärke: Mittel
- Ähnlich wie: Cartoon-Charakter der "Oops" sagt

**Alternative Sounds (falls "Huchhu" nicht passend):**
- Sanfter "Whomp"-Sound
- Freundliches "Oh-oh"
- Cartoon-Boing (sehr soft)

**Wichtig:** NICHT benutzen:
- ❌ Buzzer (zu negativ)
- ❌ Fehler-Sound (demotivierend)
- ❌ Game-Over Sound (frustrierend)

---

### 5. Hintergrundmusik 🎵

**Frage:** Soll es Hintergrundmusik geben?

**✅ ANTWORT:** Vielleicht später (Phase 2)

**Für MVP:** Keine Hintergrundmusik

**Phase 2 (optional):**
- Sanfte, beruhigende Musik
- Loop (wiederholt sich)
- Lautstärke: Leise (nicht ablenkend)
- Ein/Aus Toggle in Settings
- Stil: Kindgerecht, fröhlich, aber nicht aufdringlich
- Beispiel: Leichte Klaviermusik, Glockenspiel

**Priorität:** Niedrig (Sound-Effekte wichtiger als Hintergrundmusik)

---

### 6. Zeichen-Farben 🎨

**Frage:** Welche Farben sollen zum Zeichnen verfügbar sein?

**✅ ANTWORT:** 9 Grundfarben

**Farbpalette:**
1. **Rot** - #E74C3C
2. **Grün** - #27AE60
3. **Braun** - #8B4513
4. **Helle Hautfarbe** - #FDBCB4
5. **Blau** - #3498DB
6. **Weiß** - #FFFFFF (mit grauer Border für Sichtbarkeit)
7. **Rosa** - #FF69B4
8. **Lila** - #9B59B6
9. **Schwarz** - #000000

**Layout:**
```
[Rot] [Grün] [Braun]
[Hautfarbe] [Blau] [Weiß]
[Rosa] [Lila] [Schwarz]
```

**Zusätzlich:**
- **Aktive Farbe:** Deutlich markiert (Border oder Schatten)
- **Pinselgröße:** 3 Optionen (Dünn, Mittel, Dick)
- **Radiergummi:** Separate Taste
- **Alles löschen:** Mit Bestätigung ("Wirklich alles löschen?")

**Technische Umsetzung:**
```typescript
const drawingColors = [
  { name: 'Rot', hex: '#E74C3C' },
  { name: 'Grün', hex: '#27AE60' },
  { name: 'Braun', hex: '#8B4513' },
  { name: 'Hautfarbe', hex: '#FDBCB4' },
  { name: 'Blau', hex: '#3498DB' },
  { name: 'Weiß', hex: '#FFFFFF', border: '#CCCCCC' }, // Border für Sichtbarkeit
  { name: 'Rosa', hex: '#FF69B4' },
  { name: 'Lila', hex: '#9B59B6' },
  { name: 'Schwarz', hex: '#000000' },
];
```

---

## 📝 Noch verbleibende Fragen (niedrige Priorität)

Diese Fragen können später oder während der Entwicklung entschieden werden:

### Sound-Design Details
- [ ] Welche Sound-Effekte für 3-4 Sterne?
- [ ] Sound beim Zeichnen (Stift-Geräusch)?
- [ ] Sound beim Bildwechsel ("Whoosh")?

### UI-Details
- [ ] Undo-Button: Nur letzten Strich oder mehrere Schritte?
- [ ] Zeige Bild-Countdown als Zahlen oder als Fortschrittsbalken?
- [ ] Soll man während des Zeichnens das Original nochmal kurz sehen können? (Tipp-Funktion)

### Erweiterte Features (Phase 2+)
- [ ] Achievements/Abzeichen?
- [ ] Statistik-Screen (Durchschnittliche Sterne, Anzahl Versuche)?
- [ ] Mehrere Spieler (abwechselnd)?

---

## ✅ Entscheidungs-Status

**Abgeschlossene Entscheidungen gesamt:** 18/20 (90%)

**Kernfunktionalität:** 100% entschieden ✅
**MVP:** Bereit für Entwicklung ✅
**Offene Details:** Können während Entwicklung geklärt werden

---

## 🚀 Nächste Schritte

1. **Sounds erstellen/finden:**
   - "Huchhu" Sound (1-2 Sterne)
   - "Success" Sound (5 Sterne)
   - Optionale Sounds für 3-4 Sterne

2. **Springende Figur Animation:**
   - SVG-Animation erstellen
   - Oder Lottie-Animation finden/erstellen

3. **Expo-Projekt initialisieren:**
   - Mit "Merke und Male" als Namen
   - Alle Design-Tokens einrichten
   - Bilderpool implementieren

4. **Prototyp entwickeln:**
   - Home Screen
   - Level-Auswahl mit Zufalls-Bildwahl
   - Game Screen (3 Phasen)
   - Bewertungssystem mit Feedback

---

**Aktualisiert:** 2025-12-05
**Status:** Alle wichtigen Entscheidungen getroffen, MVP-ready!
