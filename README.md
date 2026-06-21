# Merke und Male

A memory training app for children — look at a picture, memorize it, draw it from memory, then compare.

## Live

[https://s540d.github.io/DrawFromMemory/](https://s540d.github.io/DrawFromMemory/)

## Tech Stack

| Technology                  | Role                          |
| --------------------------- | ----------------------------- |
| React Native + Expo         | Cross-platform framework      |
| TypeScript                  | Type safety                   |
| expo-router                 | File-based navigation         |
| @shopify/react-native-skia  | Drawing canvas (Native)       |
| HTML5 Canvas                | Drawing (Web)                 |
| Web Audio API               | Sound effects                 |
| expo-haptics                | Haptic feedback (Native)      |
| AsyncStorage                | Progress saving               |

## How it Works

1. **Memorize** — look at a picture for a few seconds
2. **Draw** — recreate it from memory
3. **Compare** — overlay your drawing with the original
4. **Rate** — give yourself 1–5 stars

## Features

- **51 images** across difficulty levels 1–5 including a vehicles theme pack
- **Progressive reveal** — SVG elements appear one by one during memorization
- **Drawing timelapse** — stroke-by-stroke replay of your drawing
- **Gallery** — save and revisit drawings; share via system share sheet
- **Confetti + sounds** — celebration on 4–5 star ratings
- **Sound effects** — timer tick, phase change chime, star rating
- **Haptic feedback** — vibration on interactions (Native)
- **Dark mode** support
- **Bilingual** — German and English
- **Offline-first** — all images bundled, no internet required
- **No ads, no in-app purchases**

## License

MIT License — see [LICENSE](LICENSE).
