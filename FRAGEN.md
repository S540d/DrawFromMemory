# Offene Fragen zur Entwicklung - Draw From Memory

## 🎯 Konzept & Features

### 1. App-Name
**Frage:** Wie soll die App final heißen?

**Optionen:**
- "Draw From Memory"
- "Gedächtnis-Zeichnen"
- "Memory Draw"
- "Picture Memory"
- Andere Vorschläge?

**Entscheidung:** ___________

**Rationale:**
- Sollte in beiden Sprachen (DE/EN) funktionieren
- Leicht merkbar für Kinder
- Beschreibt das Konzept klar

---

### 2. Schwierigkeitsstufen - Anzahl & Verteilung

**Frage:** Wie viele Level soll die App insgesamt haben?

**Optionen:**
- MVP: 10 Level (einfach bis mittel)
- Phase 2: 20 Level (einfach bis schwierig)
- Phase 3: 30+ Level (einfach bis sehr schwierig)

**Empfehlung:** Start mit 10 Levels, schrittweise erweitern basierend auf Nutzerfeedback

**Offene Fragen:**
- Wie viele Level pro Schwierigkeitsgrad?
  - Einfach (1-3): ____ Level
  - Mittel (4-6): ____ Level
  - Schwierig (7-10): ____ Level
  - Sehr schwierig (11+): ____ Level

---

### 3. Bildauswahl & Stil

**Frage:** Welcher Illustrationsstil soll verwendet werden?

**Optionen:**
- **Handgezeichnet:** Sympathisch, kindgerecht
- **Vektorbasiert (SVG):** Skalierbar, modern
- **Pixel-Art:** Retro-Charme, einfach zu erstellen
- **Fotos (vereinfacht):** Realistisch

**Empfehlung:** Vektorbasiert (SVG) - skalierbar für verschiedene Bildschirmgrößen

**Offene Fragen:**
- Wer erstellt die Bilder?
  - Kind zeichnet (gescannt & digitalisiert)?
  - Erwachsener zeichnet nach Kindervorgaben?
  - Tools nutzen (z.B. Procreate, Figma)?
- Farbe oder Schwarz-Weiß?
  - **Empfehlung:** Schwarz-Weiß für einfache Level, Farbe ab mittlerem Level
- Wie detailliert sollen die Bilder sein?
  - **Empfehlung:** Start simpel (10-20 Striche), schrittweise komplexer

---

### 4. Zeichen-Tools & Features

**Frage:** Welche Zeichen-Werkzeuge soll die App bieten?

**Minimal (MVP):**
- ✅ Pinsel (3 Größen: dünn, mittel, dick)
- ✅ Farben (5-8 Grundfarben: Schwarz, Rot, Blau, Grün, Gelb, Braun, Orange, Lila)
- ✅ Radiergummi
- ✅ Alles löschen
- ✅ Undo (1 Schritt zurück)

**Erweitert (Phase 2):**
- 🔲 Redo (wiederherstellen)
- 🔲 Mehr Farben (Farbpicker)
- 🔲 Füllen-Werkzeug
- 🔲 Formen (Kreis, Rechteck, Linie)

**Frage:** Brauchen wir erweiterte Tools im MVP?
**Empfehlung:** Nein, Fokus auf einfaches, intuitives Zeichnen

---

### 5. Timer & Zeitlimits

**Frage:** Wie lange soll das Bild angezeigt werden?

**Optionen:**
- **Fest:** Immer 5 Sekunden
- **Konfigurierbar:** Benutzer wählt 3s / 5s / 10s
- **Level-abhängig:** Einfache Level = 10s, schwierige = 3s

**Empfehlung:** Konfigurierbar (Settings), Standard: 5 Sekunden

**Frage:** Soll es ein Zeitlimit für das Zeichnen geben?

**Optionen:**
- **Ja, immer:** z.B. 60 Sekunden
- **Optional:** Benutzer aktiviert in Settings
- **Nein:** Kein Zeitlimit

**Empfehlung:** Optional, standardmäßig deaktiviert (Kinder sollen nicht unter Druck stehen)

---

### 6. Bewertungssystem

**Frage:** Wie soll die Bewertung funktionieren?

**Selbstbewertung (MVP):**
- Benutzer bewertet mit 1-5 Sternen
- Subjektiv, aber einfach

**Automatische Bewertung (Phase 3):**
- Ähnlichkeitserkennung via ML
- Technisch aufwändig, aber objektiv

**Offene Fragen:**
- Soll es eine "Perfekt"-Animation geben (z.B. bei 5 Sternen)?
- Sollen Hinweise gegeben werden ("Versuch es nochmal" bei 1-2 Sternen)?
- Kann man Level wiederholen, um bessere Bewertung zu erzielen?
  - **Empfehlung:** Ja, unbegrenzt wiederholbar

---

### 7. Fortschritt & Freischaltung

**Frage:** Wie werden neue Level freigeschaltet?

**Optionen:**
- **Linear:** Level 1 abschließen → Level 2 freischalten
- **Sterne-basiert:** Mindestens 3 Sterne für nächstes Level
- **Komplett offen:** Alle Level von Anfang an spielbar

**Empfehlung:** Linear, aber Level können wiederholt werden für bessere Bewertung

**Frage:** Sollen Level auch übersprungen werden können?
- **Ja:** "Skip"-Button nach 3 Versuchen
- **Nein:** Nur durch Abschließen

**Empfehlung:** Nein im MVP, eventuell in Phase 2 (verhindert Frustration)

---

### 8. Speichern von Zeichnungen

**Frage:** Sollen alle Zeichnungen automatisch gespeichert werden?

**Optionen:**
- **Ja, immer:** Galerie mit allen Zeichnungen
- **Nur bei Bewertung 4+:** Automatisch speichern
- **Manuell:** Benutzer entscheidet nach Bewertung

**Empfehlung:** Manuell (nach Bewertung: "Speichern?" Ja/Nein)

**Offene Fragen:**
- Wo speichern?
  - AsyncStorage (begrenzt auf ~6MB)
  - Lokales Dateisystem (expo-file-system)
  - **Empfehlung:** AsyncStorage für MVP (max. 50 Zeichnungen)
- Format?
  - PNG (Base64 encoded)
  - SVG (vektorbasiert, kleiner)
  - **Empfehlung:** PNG (einfacher zu implementieren)

---

### 9. Multiplayer & Social Features

**Frage:** Soll es Multiplayer-Funktionen geben?

**Optionen:**
- **Lokal:** 2 Spieler zeichnen nacheinander das gleiche Bild (Vergleich)
- **Online:** Echtzeit-Zeichnen mit anderen Spielern
- **Community:** Nutzer laden eigene Bilder hoch

**Empfehlung:** Nicht im MVP, eventuell Phase 3

---

## 🎨 Design & UX

### 10. Farbschema & Branding

**Frage:** Welche Primärfarbe soll die App haben?

**Vorschlag (siehe PROJEKTSKIZZE.md):**
- Primary: #667eea (Lila/Blau - Kreativität)
- Secondary: #f093fb (Rosa - Spielerisch)

**Alternative Farbschemata:**
- **Kindgerecht:** Hellblau (#3b82f6) + Orange (#f59e0b)
- **Kreativ:** Lila (#8b5cf6) + Gelb (#fbbf24)
- **Neutral:** Blau (#1e40af) + Grün (#10b981)

**Entscheidung mit Kind:** ___________

---

### 11. Icon & Logo

**Frage:** Wie soll das App-Icon aussehen?

**Ideen:**
- Pinsel + Gehirn (Symbolisiert "Gedächtnis zeichnen")
- Leere Canvas mit Fragezeichen
- Kindliche Zeichnung (z.B. Sonne oder Strichmännchen)

**Offene Frage:** Soll das Kind das Icon entwerfen?

---

### 12. Animationen & Feedback

**Frage:** Wie viel Animation soll die App haben?

**Minimal (MVP):**
- ✅ Fade-out beim Verstecken des Bildes
- ✅ Countdown-Animation
- ✅ Sterne-Animation bei Bewertung

**Erweitert:**
- 🔲 Konfetti bei 5 Sternen
- 🔲 Shake-Animation bei Fehler
- 🔲 Smooth-Scrolling in Level-Auswahl

**Empfehlung:** Minimal im MVP, mehr in Phase 2

---

## 💻 Technische Entscheidungen

### 13. Canvas-Bibliothek

**Frage:** Welche Bibliothek soll für das Zeichnen verwendet werden?

**Optionen:**
- **react-native-canvas:**
  - ✅ Canvas API ähnlich zu Web
  - ❌ Performance-Probleme auf älteren Geräten
- **react-native-svg:**
  - ✅ Vektorbasiert, performant
  - ❌ Komplexer für Freihand-Zeichnen
- **react-native-skia:**
  - ✅ Sehr performant, native Rendering
  - ❌ Größere Lernkurve
- **expo-gl (WebGL):**
  - ✅ Hardware-beschleunigt
  - ❌ Komplex zu implementieren

**Empfehlung:** react-native-skia (beste Performance, moderne Lösung)
**Alternative:** react-native-canvas (einfacher Start)

**Entscheidung:** ___________

---

### 14. Storage-Strategie

**Frage:** Wie sollen Daten gespeichert werden?

**Optionen:**
- **AsyncStorage:** Einfach, limitiert (~6MB), synchron
- **expo-file-system:** Unbegrenzt, asynchron, Datei-basiert
- **expo-sqlite:** Strukturiert, Query-fähig, Overkill für MVP

**Empfehlung:** AsyncStorage für MVP (Fortschritt, Settings, max. 50 Zeichnungen)

**Datenstruktur:**
```json
{
  "progress": {
    "currentLevel": 3,
    "completedLevels": [1, 2],
    "totalStars": 12
  },
  "settings": {
    "theme": "light",
    "language": "de",
    "displayDuration": 5,
    "drawingTimeLimit": null
  },
  "drawings": [
    {
      "id": "drawing-1",
      "levelId": 1,
      "timestamp": 1733420000000,
      "imageDataUrl": "data:image/png;base64,...",
      "rating": 5
    }
  ]
}
```

---

### 15. Bild-Assets

**Frage:** Wie sollen die Level-Bilder gespeichert werden?

**Optionen:**
- **Statisch im Bundle:** Alle Bilder im assets/-Ordner
  - ✅ Offline verfügbar
  - ✅ Schnell
  - ❌ App-Größe steigt
- **Remote (CDN):** Bilder von Server laden
  - ✅ Kleinere App
  - ❌ Internet-Verbindung nötig
  - ❌ Mehr Komplexität

**Empfehlung:** Statisch im Bundle (MVP), Remote in Phase 2 für Community-Level

**Format:**
- SVG (vektorbasiert, skalierbar) oder
- PNG (rasterbasiert, einfacher)

**Empfehlung:** SVG (Vorteil: verlustfrei skalierbar)

---

### 16. Plattform-Priorität

**Frage:** Welche Plattform hat Priorität?

**Optionen:**
- **Web (PWA):** Schnell zu testen, keine App-Store-Genehmigung
- **Android:** Größere Zielgruppe, direktes Testing
- **iOS:** Kleinere Zielgruppe, teureres Testing ($99/Jahr)

**Empfehlung:** Web (PWA) + Android gleichzeitig, iOS später (Phase 2)

---

## 🧒 Kind als Ideengeber

### 17. Inhaltliche Fragen ans Kind

**Level-Ideen:**
1. Welche 10 Bilder sollen in den ersten Levels sein?
   - Beispiel: Sonne, Haus, Baum, Auto, Katze, ...
2. Soll es verschiedene "Themen" geben?
   - z.B. Tiere, Fahrzeuge, Natur, Fantasy
3. Welche Farben magst du am liebsten? (für Farbauswahl)
4. Welche Sounds würdest du cool finden?
   - z.B. "Pling" beim Stern, "Whoosh" beim Bildwechsel

**Design-Fragen:**
5. Welches Icon/Logo gefällt dir am besten?
   - Kind kann 2-3 Varianten zeichnen
6. Welche Musik/Sounds sind zu laut/leise/nervig?

**Gameplay-Fragen:**
7. Ist 5 Sekunden genug Zeit, um sich das Bild zu merken?
8. Ist das Zeichnen mit dem Finger einfach genug?
9. Was macht am meisten Spaß?
   - Bild merken, Zeichnen, Vergleich?

---

## 🚀 Deployment & Marketing

### 18. Store-Listings

**Frage:** Wie soll die App im Store beschrieben werden?

**App-Name:** ___________

**Kurzbeschreibung (80 Zeichen):**
```
Gedächtnistraining für Kinder - Bild merken, zeichnen, vergleichen!
```

**Lange Beschreibung (4000 Zeichen):**
```
Trainiere dein Gedächtnis auf spielerische Weise!

Wie funktioniert's?
1. Schaue dir ein Bild an (5 Sekunden)
2. Zeichne es aus dem Gedächtnis nach
3. Vergleiche deine Zeichnung mit dem Original
4. Bewerte dich selbst (1-5 Sterne)

Features:
• 10+ spannende Level
• Verschiedene Schwierigkeitsgrade
• Einfache Zeichen-Tools
• Fortschritt speichern
• Dark Mode
• Mehrsprachig (DE/EN)
• 100% kostenlos, keine Werbung

Perfekt für:
• Kinder ab 4 Jahren
• Gedächtnistraining
• Kreativitätsförderung
• Spaß & Lernen

Open Source • MIT Lizenz
```

**Keywords (Google Play):**
```
Gedächtnis, Zeichnen, Kinder, Memory, Kreativität, Lernen, Malen
```

---

### 19. Marketing-Strategie

**Frage:** Wie soll die App beworben werden?

**Optionen:**
- **Organisch:**
  - Reddit (r/androidapps, r/learnart)
  - ProductHunt Launch
  - GitHub (Open Source Community)
- **Social Media:**
  - TikTok/Instagram (Demo-Videos)
  - YouTube (Tutorial)
- **Kooperationen:**
  - Kindergärten, Grundschulen (Empfehlung)

**Empfehlung:** Start mit organischem Marketing (Reddit, ProductHunt)

---

### 20. Monetarisierung

**Frage:** Soll die App monetarisiert werden?

**Optionen:**
- **Komplett kostenlos:** Keine Werbung, keine In-App-Käufe
- **Ko-fi/Buy Me a Coffee:** Freiwillige Unterstützung (im Settings-Menü)
- **Premium-Features:** z.B. mehr Level, eigene Bilder hochladen

**Empfehlung:** Komplett kostenlos + Ko-fi Link im Settings-Menü

**Store-Angabe:**
- Contains Ads: ❌ NO
- In-App Purchases: ❌ NO

---

## ✅ Entscheidungs-Checkliste

Bitte folgende Entscheidungen mit dem Kind/Team treffen:

- [ ] **App-Name:** ___________
- [ ] **Primärfarbe:** ___________
- [ ] **Anzahl Level (MVP):** ___________
- [ ] **Erste 10 Level-Ideen:** ___________
- [ ] **Icon-Design:** ___________
- [ ] **Canvas-Bibliothek:** ___________
- [ ] **Display-Dauer (Standard):** ___________
- [ ] **Zeitlimit für Zeichnen:** ___________
- [ ] **Store-Beschreibung:** ___________

---

## 📝 Nächste Schritte nach Entscheidungen

1. GitHub Repository erstellen
2. Expo-Projekt initialisieren
3. Erste 3 Level-Bilder mit Kind erstellen
4. Prototyp entwickeln (Home + Game Screen)
5. Usability-Test mit Kind
6. Iterieren basierend auf Feedback

---

**Erstellt:** 2025-12-05
**Status:** Offene Fragen - Diskussion mit Kind & Team erforderlich
