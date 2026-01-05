# AI Prompt Templates - Icon & Clipart Generation

Dieses Dokument enthält schnell zugängliche Prompt-Templates für:
- 🎨 **Cliparts für Spielbilder** (Issue #26) - Bilder die Kinder nachzeichnen
- 🎯 **Icons für UI** (Issue #8) - Schaltflächen, Menü-Icons

Vollständige Details siehe [ICON_GENERATION_PLAN.md](ICON_GENERATION_PLAN.md).

---

## 🎨 CLIPARTS FÜR SPIELBILDER (Issue #26)

**Verweck:** Generiere Cliparts für alle 5 Schwierigkeitslevel, die Kinder nachzeichnen können.

### ⚠️ KRITISCHE ANFORDERUNGEN FÜR CLIPARTS

```
DO NOT USE:
❌ Farbverläufe (gradients) - Kinder können diese nicht zeichnen
❌ Schatten/3D-Effekte - Nur flache Designs
❌ Komplexe Texturen/Muster
❌ Photorealistischer Stil
❌ Zu viele Farben (max. 3-4)

DO USE:
✅ Flaches Design (flat design)
✅ Clipart-Stil (wie OpenDoodle, SimpleIcons)
✅ Klare Outlines (≥1px Stroke)
✅ Feste Farben (Solid Colors)
✅ Cartoon/kindlich
```

### LEVEL 1 - SEHR EINFACH (3 Bilder, 5-12 Striche)

```
Subject: Simple drawable clipart illustration

Requirements:
- VERY simple shapes (stick figures, basic geometry)
- 1-2 colors maximum (mainly black outlines)
- NO gradients, NO shadows
- 6-12 strokes total
- Clear, thick outlines
- Suitable for 4-year-olds to memorize and redraw

Examples:
1. Stick figure person (circle head, stick body/legs)
2. Simple sun (circle + 8 rays)
3. Basic cloud (3-4 circles)
4. Simple star (5 points)
5. Basic apple (circle + stem)

Prompt Template:
"Create a VERY simple [SUBJECT] clipart for young children.
Flat design, NO gradients, NO shadows.
Only 1-2 solid colors, thick black outlines (2-3px).
6-12 strokes maximum.
SVG format, 512x512px, transparent background.
Drawable by 4-year-olds from memory."
```

### LEVEL 2 - EINFACH-MITTEL (3-4 Bilder, 8-15 Striche)

```
Subject: Simple clipart with basic shapes

Requirements:
- 2-3 colors maximum
- NO gradients, NO shadows
- 8-15 strokes total
- Clear outlines
- Recognizable shapes
- Suitable for 5-year-olds

Examples:
1. Human face (circle + simple eyes/mouth)
2. Basic house (rectangle roof + triangle)
3. Simple tree (trunk + round crown)
4. Car (rectangle body + circle wheels)
5. Flower (stem + 5-6 petals)

Prompt Template:
"Create a simple [SUBJECT] clipart illustration.
Flat design, NO gradients, NO shadows, NO shading.
2-3 solid colors with clear black outlines.
8-15 strokes total, basic geometric shapes.
SVG format, 512x512px, transparent background.
Drawable by children age 5-6 from memory."
```

### LEVEL 3 - MITTEL (3-4 Bilder, 12-20 Striche)

```
Subject: Recognizable clipart with more details

Requirements:
- 3-4 colors maximum
- NO gradients, NO realistic shadows
- 12-20 strokes total
- More defined shapes
- Recognizable features
- Suitable for 6-7 year-olds

Examples:
1. Dog (body, head, 4 legs, ears, tail)
2. Cat (similar to dog with pointed ears)
3. Simple bird (wings, body, beak)
4. Butterfly (body + 4 simple wings)
5. Detailed landscape (multiple elements)

Prompt Template:
"Create a [SUBJECT] clipart illustration suitable for children age 6-7.
Flat design, NO gradients, NO realistic shadows.
3-4 solid colors, black outlines (1.5-2px).
12-20 strokes, recognizable but simple shapes.
SVG format, 512x512px, transparent background.
Drawable from memory with clear features."
```

### LEVEL 4 - MITTEL-SCHWER (4-5 Bilder, 18-28 Striche)

```
Subject: More detailed clipart with patterns

Requirements:
- 3-5 colors maximum
- NO gradients, NO photorealistic effects
- 18-28 strokes total
- Detailed but still simple
- Clear patterns/textures suggested by lines
- Suitable for 7-8 year-olds

Examples:
1. Complex animal with details (lion, peacock)
2. Fish with fin and scale patterns
3. Sheep (wool texture as circles, black face)
4. Detailed flower or plant
5. Building or landscape with multiple elements

Prompt Template:
"Create a detailed [SUBJECT] clipart for children age 7-8.
Flat design, NO gradients, NO shadows.
3-5 solid colors, pattern details as line drawings (NOT shaded).
18-28 strokes, recognizable features and details.
SVG format, 512x512px, transparent background.
Drawable from memory with pattern suggestions via lines only."
```

### LEVEL 5 - SCHWIERIG (5 Bilder, 25-40 Striche)

```
Subject: Complex drawable clipart with fine details

Requirements:
- 4-6 colors maximum
- NO gradients, NO realistic shading
- 25-40 strokes total
- Fine details and patterns
- Multiple elements/components
- Suitable for 8+ year-olds

Examples:
1. Complex animal (elaborate patterns, clothing, accessories)
2. Detailed landscape scene (multiple buildings, nature)
3. Character with clothing and details
4. Vehicle with mechanical details
5. Scene with multiple interacting elements

Prompt Template:
"Create a complex drawable [SUBJECT] clipart for children age 8+.
Flat design, NO gradients, NO realistic shadows.
4-6 solid colors, fine details as line patterns.
25-40 strokes, multiple recognizable elements.
SVG format, 512x512px, transparent background.
Drawable from memory with fine detail patterns."
```

---

## 📦 COLORS PROPERTY DOKUMENTATION

Jedes Clipart muss mit einer `colors` Property in `ImagePoolManager.ts` dokumentiert werden:

```typescript
{
  filename: 'level-XX-name.svg',
  difficulty: 3,
  displayName: 'Name',
  displayNameEn: 'English Name',
  strokeCount: 15,
  colors: ['#000000', '#E74C3C', '#8B4513']  // Nur SOLID colors!
}
```

**Wichtig:** Die `colors` Array muss EXAKT den im Bild verwendeten Farben entsprechen:
- `#000000` für schwarze Outlines (immer enthalten)
- Feste Farben aus der [Colors.ts Palette](constants/Colors.ts)
- KEINE Hex-Codes für Gradienten oder transparente Farben

---

## 🎯 Basis-Prompt (Master Template für Icons)

Verwenden Sie diesen Prompt als Ausgangspunkt für alle Icon-Generierungen:

```
Create a simple, child-friendly clipart-style icon in SVG format with the following specifications:

**Subject:** [ICON_NAME]

**Style Requirements:**
- Clipart style: clean, simple lines
- Child-friendly: friendly, not photorealistic
- Minimalistic: focus on essential features
- Clear outlines: 2-3px stroke width
- Flat design with minimal shading
- [For Level 10+: Add perspective and depth]

**Technical Specifications:**
- Format: SVG (vector graphic)
- Canvas size: 512x512px
- File size: Max 50KB
- Background: Transparent
- Color palette: 2-4 colors maximum
- Bright, saturated colors suitable for children

**Complexity Level:** [DIFFICULTY_LEVEL]
- Difficulty 1: 5-12 strokes, basic shapes
- Difficulty 2: 8-15 strokes, simple objects
- Difficulty 3: 12-20 strokes, combined shapes
- Difficulty 4: 18-28 strokes, multiple details
- Difficulty 5: 25-40 strokes, complex patterns
- Difficulty 6+: 40+ strokes, perspective

**Number of Strokes:** [TARGET_COUNT]

**Additional Notes:**
- Memorable and easy to redraw
- High contrast for clarity
- Rounded corners for friendliness
```

---

## 📝 Schnell-Prompts nach Schwierigkeit

### Difficulty 1: Sehr Einfach (5-12 Striche)

**Beispiel: Stern**
```
Create a simple 5-pointed star icon in clipart style. SVG format, 512x512px, transparent background, yellow color (#FFD700), 2-3px outline. Exactly 5 strokes forming the star. Child-friendly, minimalistic design suitable for 4-year-olds to memorize and redraw.
```

**Beispiel: Herz**
```
Create a simple heart icon in clipart style. SVG format, 512x512px, transparent background, red color (#FF0000), 2-3px outline. 2-3 strokes total. Symmetrical, rounded, child-friendly design. Easy to memorize and redraw.
```

---

### Difficulty 2: Einfach (8-15 Striche)

**Beispiel: Regenbogen**
```
Create a simple rainbow icon in clipart style. SVG format, 512x512px, transparent background. 4 colored arcs (red, yellow, green, blue) forming a semicircle. 8-10 strokes total. 2-3px outline. Child-friendly, symmetrical design. Easy to memorize and redraw.
```

**Beispiel: Pilz**
```
Create a simple mushroom (fly agaric) icon in clipart style. SVG format, 512x512px, transparent background. Red cap with white dots, white stem. 10 strokes total. 2-3px outline. Child-friendly design suitable for children to memorize and redraw.
```

---

### Difficulty 3: Mittel (12-20 Strokes)

**Beispiel: Boot**
```
Create a simple sailboat icon in clipart style. SVG format, 512x512px, transparent background. Blue boat hull, white triangular sail, simple mast. 12-15 strokes total. 2-3px outline. Side view, child-friendly, minimalistic. Include water line. Easy to memorize and redraw.
```

**Beispiel: Rakete**
```
Create a simple rocket icon in clipart style. SVG format, 512x512px, transparent background. Red body, 3 fins at base, pointed nose cone, small circular window. 15-18 strokes total. 2-3px outline. Vertical orientation, child-friendly design. Easy to memorize and redraw.
```

---

### Difficulty 4: Mittel-Schwer (18-28 Striche)

**Beispiel: Fuchs**
```
Create a simple fox icon in clipart style. SVG format, 512x512px, transparent background. Orange body, white chest, black ear tips, bushy tail. 22-25 strokes total. 2-3px outline. Sitting position, side view, friendly expression. Emphasize pointy ears and bushy tail. Child-friendly design.
```

**Beispiel: Igel**
```
Create a simple hedgehog icon in clipart style. SVG format, 512x512px, transparent background. Brown body with simplified spikes, small black nose, tiny legs. 20-24 strokes total. 2-3px outline. Side view, curled position. Child-friendly, cute design. Easy to memorize pattern of spikes.
```

---

### Difficulty 5: Schwierig (25-40 Striche)

**Beispiel: Fahrrad**
```
Create a detailed bicycle icon in clipart style. SVG format, 512x512px, transparent background. Two wheels with simplified spokes (6-8 per wheel), red frame in triangle shape, handlebars, seat, pedals, simplified chain. 30-35 strokes total. 2-3px outline. Side view, clear silhouette. Child-friendly design with recognizable features.
```

**Beispiel: Windmühle**
```
Create a detailed windmill icon in clipart style. SVG format, 512x512px, transparent background. Tower structure (beige/brown), 4 rotating blades (white/red), windows, door. 28-32 strokes total. 2-3px outline. Front view with slight angle, child-friendly design. Traditional Dutch windmill style.
```

---

### Difficulty 6+: Perspektivisch (40+ Striche)

**Beispiel: Würfel in 3D**
```
Create a simple 3D cube icon in isometric perspective. SVG format, 512x512px, transparent background. Show three visible faces with different shading (light top, medium front, darker side). 12 strokes forming the cube edges. 2-3px outline. Simple shading to emphasize 3D effect. Child-friendly, clear perspective. Suitable for learning perspective drawing.
```

**Beispiel: Haus in Perspektive**
```
Create a house in two-point perspective in clipart style. SVG format, 512x512px, transparent background. Show two visible walls (yellow), roof with ridge (red), 2-3 windows per side (blue), one door (brown). 35-40 strokes total. 2-3px outline. Add simple shading on one side for depth. Child-friendly, clear perspective lines. Ground line for context.
```

**Beispiel: Straße mit Fluchtpunkt**
```
Create a road with vanishing point in perspective in clipart style. SVG format, 512x512px, transparent background. Gray road narrowing toward horizon, white center line, green grass on sides. 30-35 strokes total. 2-3px outline. Clear vanishing point, simple perspective. Child-friendly design suitable for learning perspective.
```

---

## 🔧 Anpassungs-Tipps

### Wenn Icon zu komplex ist:
- Reduziere Details: "simplified", "minimalistic", "only essential features"
- Weniger Farben: "2 colors maximum", "monochrome"
- Weniger Striche: "reduce to X strokes"

### Wenn Icon zu einfach ist:
- Mehr Details: "add details like", "include texture"
- Mehr Farben: "3-4 colors", "colorful"
- Mehr Striche: "increase to X strokes", "add patterns"

### Für bessere Kindfreundlichkeit:
- "rounded corners", "friendly expression"
- "bright, cheerful colors"
- "simple, iconic representation"
- "suitable for 4-year-olds"

### Für perspektivische Zeichnungen:
- "two-point perspective", "isometric view"
- "show depth with shading"
- "clear vanishing point"
- "emphasize 3D form"

---

## 💡 Verwendung mit AI-Tools

### DALL-E / ChatGPT
1. Kopiere kompletten Prompt
2. Füge ein: "Generate this as SVG code"
3. Oder: "Create this image" und exportiere dann als SVG

### Midjourney
1. Beginne mit `/imagine`
2. Füge Prompt ein
3. Ergänze: `--style raw --v 6` für konsistente Ergebnisse

### Stable Diffusion
1. Verwende Basis-Prompt
2. Ergänze: "vector art, svg, clipart style"
3. Negative prompt: "photo, realistic, 3d render, complex"

### Adobe Firefly
1. Wähle "Text to Vector"
2. Füge Prompt ein
3. Exportiere direkt als SVG

---

## 📋 Schnell-Referenz: Strichzahlen

| Difficulty | Striche | Beispiele |
|------------|---------|-----------|
| 1 | 5-12 | Stern, Kreis, Herz, Strichmännchen |
| 2 | 8-15 | Wolke, Regenbogen, Pilz, Ballon |
| 3 | 12-20 | Haus, Baum, Boot, Rakete |
| 4 | 18-28 | Hund, Katze, Fuchs, Igel |
| 5 | 25-40 | Fahrrad, Fisch, Windmühle, Schmetterling |
| 6+ | 40+ | Würfel 3D, Haus perspektivisch, Stadtszene |

---

**Hinweis:** Diese Templates sind Ausgangspunkte. Passen Sie sie an Ihre spezifischen Bedürfnisse an.

---

## 📍 Verwandte Issues & Dokumentation

### Für Cliparts (Spielbilder zum Nachzeichnen)
- **[Issue #26](https://github.com/S540d/DrawFromMemory/issues/26)** - AI-generated Clipart für alle Schwierigkeitslevel
- **[Issue #5](https://github.com/S540d/DrawFromMemory/issues/5)** - Schwierigkeitslevel Struktur
- **[Issue #20](https://github.com/S540d/DrawFromMemory/issues/20)** - Color Picker Filtering (nutzt colors property)

### Für UI-Icons
- **[Issue #8](https://github.com/S540d/DrawFromMemory/issues/8)** - Icon-System für UI-Elemente
- [ICON_GENERATION_PLAN.md](ICON_GENERATION_PLAN.md) - Vollständiger Icon-Plan
- [BILDERPOOL.md](assets/images/levels/BILDERPOOL.md) - Aktueller Bilderpool

### Implementierungsleitfaden
1. **Cliparts erzeugen** → Issue #26 Prompts verwenden
2. **SVG optimieren** → Farbverläufe entfernen, Outlines prüfen
3. **In assets ablegen** → `assets/images/levels/` mit Level-Nummer
4. **ImagePoolManager aktualisieren** → `colors` Property hinzufügen
5. **Testen** → Alle 14+ Bilder sollte ein Kind nachzeichnen können
