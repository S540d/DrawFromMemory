# UI/UX Design System — DrawFromMemory (Issue #176)

> Ausgelagert aus `CLAUDE.md` im Rahmen der CLAUDE.md-Wartung (Issue #160,
> project-templates). Aktuell gültiges Design-System-Wissen, das nicht in
> jeder Session gebraucht wird.

Stand `main`: Phase A, B, C, D und E vollständig abgeschlossen (Lottie-Teil aus Phase D via PR #286).

## Phase-Übersicht

| Phase                                                                       | Status     | Branch/PR                                                                        |
| --------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------- |
| **A: Foundation** — Farbpalette, Dark Mode, Nunito-Font, Typografie         | ✅ in main | PR merged                                                                        |
| **B: Components** — Gradient-Buttons, Glassmorphism-Cards, Sterne-Animation | ✅ in main | PR #178 merged                                                                   |
| **C: Screens** — Timer-Visualisierung, Phase-Übergänge, Home-Refresh        | ✅ in main | PR #257 merged                                                                   |
| **D: Delight** — Lottie, Konfetti, Mikro-Sounds                             | ✅ in main | Konfetti/Sound PR #253, TimerArc/Crossfade/Stats PR #257, Lottie-Sparkle PR #286 |
| **E: Onboarding** — First-Run-Tour                                          | ✅ in main | PR #261 merged (In-Game Coach-Marks)                                             |

## Lottie (PR #286, Issue #279 2.2)

`lottie-react-native` war bereits als Dependency installiert, aber nie verdrahtet — `components/MascotSparkle.tsx` ist die erste echte Nutzung: ein hand-authored Lottie-JSON (`assets/lottie/sparkle.json`) als Twinkle-Effekt neben der Mascot bei 5-Sterne-Ergebnissen und neuen Accessoire-Unlocks. Respektiert `prefers-reduced-motion`.

- **Web-Plattform braucht zusätzlich `@lottiefiles/dotlottie-react`** als Peer-Dependency von `lottie-react-native` — ohne sie bricht `expo export --platform web`, sobald `LottieView` real importiert wird (war vorher nie der Fall, da ungenutzt).
- **Jest-Mock:** `__mocks__/lottie-react-native.js` (analog zu den Skia-/react-native-svg-Mocks) — die native/Web-Implementierungen laufen nicht unter jsdom.

## Neue Primitiven (Phase B)

**`AnimatedPrimitives.tsx`** exportiert:

| Komponente         | Zweck                                                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `AnimatedCard`     | Fade-in + Slide-up Eingangs-Animation mit Stagger (50 ms/Item)                                                                         |
| `GlassCard`        | Glassmorphism + Eingangs-Animation + optionaler Press-Lift (scale 0.97, Spring) — `prefers-reduced-motion`-aware                       |
| `AnimatedFeedback` | Scale + Fade beim Erscheinen (z.B. Feedback-Text)                                                                                      |
| `AnimatedStar`     | Spring-Bounce-Pop beim Füllen, Stagger 80 ms/Stern, goldener Textglow — `prefers-reduced-motion`-aware                                 |
| `PressableScale`   | Generischer Pressable mit Spring-Scale-Down beim Drücken — taktiles Feedback für schmucklose Kacheln, `prefers-reduced-motion`-aware   |
| `PulseView`        | Sanfter Dauer-Puls (Scale-Oszillation) als Aufmerksamkeits-Hinweis für Primäraktionen; `enabled`-Prop + `prefers-reduced-motion`-aware |

**`GlassCard` verwenden:**

```tsx
import { GlassCard } from '@components/AnimatedPrimitives';
import Colors from '../constants/Colors';

const { theme } = useTheme();
const glassSurface = theme === 'dark' ? Colors.glass.darkSurface : Colors.glass.lightSurface;
const glassBorder  = theme === 'dark' ? Colors.glass.darkBorder  : Colors.glass.lightBorder;
const glassShadow  = theme === 'dark' ? Colors.glass.darkShadow  : Colors.glass.lightShadow;

<GlassCard
  index={index}
  onPress={...}       // optional — aktiviert Press-Lift
  style={[{ backgroundColor: glassSurface, borderColor: glassBorder, borderWidth: 1.5 }, glassShadow]}
>
  {children}
</GlassCard>
```

**`Colors.glass`-Tokens:**

```ts
Colors.glass.lightSurface; // 'rgba(255,255,255,0.88)'
Colors.glass.darkSurface; // 'rgba(42,35,64,0.88)'
Colors.glass.lightBorder; // 'rgba(255,255,255,0.70)'
Colors.glass.darkBorder; // 'rgba(255,255,255,0.10)'
Colors.glass.lightShadow; // { boxShadow, elevation } — lila Tönung
Colors.glass.darkShadow; // { boxShadow, elevation } — dunkel
```

**`Colors.shadow.buttonPrimary`** — lila-getönter Schatten für primäre CTAs (`Button` variant=`primary` verwendet ihn intern).
