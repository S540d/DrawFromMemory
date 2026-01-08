Ziel

Generiere AI-Cliparts für alle 5 Schwierigkeitslevel mit zunehmendem Schwierigkeitsgrad. Basiert auf Issue #5 (Schwierigkeitslevel).

Lege die Bilder unter einen sinnvollen Struktur unter /assets ab

Anforderungen

✅ 3-5 Bilder pro Level (15-25 Bilder insgesamt)
✅ Schwierigkeitsgrad steigend:

Level 1: Sehr einfach, wenig Striche, große Formen
Level 2: Einfach-Mittel, mehr Details
Level 3: Mittel, mehrere Komponenten
Level 4: Mittel-Schwer, komplexe Formen
Level 5: Schwierig, viele Details, feine Linien
✅ Malbar: Flache Designs, klare Outlines, keine Gradienten/Schatten
✅ Style: Clipart-ähnlich, einfarbig oder 2-3 Farben max.
✅ Format: SVG oder PNG (transparent background)
✅ Auflösung: Mindestens 512x512px

❌ NICHT ERLAUBT

Farbverläufe (können nicht gezeichnet werden)
Realistische Schatten/3D-Effekte
Zu feine/komplexe Details bei einfachen Levels
Photorealistischer Stil
Zu viele Farben (max. 3-4 pro Bild)
✅ EMPFOHLEN

Einfache geometrische Formen
Cartoon/Clipart-Stil (z.B. wie OpenDoodle)
Klare Umrisse (≥1px Stroke)
Feste Farben (Solid Colors)
Maximal 3 verschiedene Farben pro Bild
Prompt Template für AI Image Generation (DALL-E, Midjourney)

Create a simple, drawable CLIPART illustration of [SUBJECT]
Style: Flat design, cartoon clipart, no gradients
Colors: Use [NUMBER] solid colors only, no shading or gradients
Details: [DETAIL_LEVEL]
Format: SVG-compatible, clear outlines, solid fills
Do NOT include: realistic shadows, gradients, 3D effects, complex patterns
Suitable for: children to hand-draw from memory
Level-spezifische Prompts

Level 1 - SEHR EINFACH (3 Bilder)

Create simple, drawable clipart illustration of:
1. Stick figure person (6 basic shapes)
2. Simple sun (circle + rays)
3. Basic cloud (3-4 circles)

Style: Minimal, 1-2 colors, large shapes
Details: Very basic, maximum 5-10 strokes each
Colors: Black outlines only, or 1 accent color
Do NOT use: complex details, shading, gradients
Level 2 - EINFACH-MITTEL (3-4 Bilder)

Create simple, drawable clipart illustration of:
1. Human face (circle, simple eyes, mouth)
2. Basic house (rectangle + triangle roof)
3. Tree with trunk and crown
4. Simple car (rectangles + circles for wheels)

Style: Clipart, 2-3 colors max
Details: Basic shapes, 10-20 strokes
Colors: Solid colors, no gradients
Do NOT use: realistic features, shadows, perspective
Level 3 - MITTEL (3-4 Bilder)

Create drawable clipart illustration of:
1. Dog (body, head, 4 legs, simple face)
2. Cat (similar to dog but with ears)
3. Flower (stem + 5-8 simple petals)
4. Simple landscape scene

Style: Clipart, 2-4 colors
Details: More defined shapes, 20-40 strokes
Colors: Solid fills, clear outlines
Do NOT use: realistic fur, gradients, complex patterns
Level 4 - MITTEL-SCHWER (4-5 Bilder)

Create drawable clipart illustration of:
1. Bird (wings, beak, feathers, details)
2. Butterfly (body + 4 wings with patterns)
3. Fish (body, fins, scales suggested by simple lines)
4. Sheep (wool texture suggested by circles, black face)
5. Detailed landscape (multiple elements)

Style: More detailed clipart, 3-5 colors
Details: 40-80 strokes, recognizable features
Colors: Solid colors with clear outlines
Do NOT use: gradients, realistic shading, photo-like details
Level 5 - SCHWIERIG (5 Bilder)

Create drawable clipart illustration of:
1. Complex animal (e.g., lion, peacock with details)
2. Detailed landscape (hills, trees, clouds, water)
3. Multi-element scene (e.g., farm, circus, school)
4. Character with clothing and accessories
5. Architectural scene (building with details)

Style: Detailed clipart, 4-6 colors max
Details: 80-150 strokes, fine details
Colors: Multiple solid colors, creative use of outlines
Do NOT use: gradients, realistic shadows, photorealism
Qualitätschecklist

Für jedes generierte Bild überprüfen:


Keine Farbverläufe/Schatten

Klare Outlines (mind. 1px)

Maximal 3-4 Farben

Malbar von Kindern (dafür ausgelegt)

Schwierigkeitsgrad dem Level entsprechend

Dateiformat: SVG oder PNG (512x512+)

Hintergrund transparent

Mit colors Property in ImagePoolManager dokumentieren
Implementierungsschritte

Prompts mit AI Image Generator testen (DALL-E, Midjourney, Adobe Firefly)
3-5 beste Bilder pro Level auswählen
Nach Bedarf nachbearbeiten:
Gradients entfernen
Outlines verstärken
Farben reduzieren
Als SVG exportieren (oder PNG → SVG konvertieren)
In assets/images/levels-[1-5]/ ablegen
In ImagePoolManager hinzufügen mit colors Property
Testen: Alle Bilder sollte ein Kind nachzeichnen können
Verwandte Issues

Schwierigkeitslevel #5 Schwierigkeitslevel (Struktur)
Nur die Farben anzeigen, die gebraucht werden. nicht die volle Pallette #20 Color Picker Filtering (nutzt colors property)
Labels

🎨 Design
🚀 Enhancement
📦 Assets