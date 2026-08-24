# Merke und Male

A memory training app for children — look at a picture, memorize it, draw it from memory, then compare.

_Gedächtnistraining für Kinder: Bild kurz ansehen, aus dem Gedächtnis nachzeichnen, vergleichen. Ein Merk- und Malspiel ab 3 Jahren — ohne Werbung, ohne In-App-Käufe, komplett offline spielbar._

[![Get it on Google Play](https://img.shields.io/badge/Google%20Play-Merke%20und%20Male-34A853?logo=googleplay&logoColor=white)](https://play.google.com/store/apps/details?id=com.s540d.merkeundmale&referrer=utm_source%3Dgithub%26utm_medium%3Dreadme%26utm_campaign%3Dweb_demo)
[![Play in the browser](https://img.shields.io/badge/Web%20Demo-jetzt%20spielen-60D5FA?logo=googlechrome&logoColor=white)](https://s540d.github.io/DrawFromMemory/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Get the app

| Platform             | Link                                                                                                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Android              | [Google Play — `com.s540d.merkeundmale`](https://play.google.com/store/apps/details?id=com.s540d.merkeundmale&referrer=utm_source%3Dgithub%26utm_medium%3Dreadme%26utm_campaign%3Dweb_demo) |
| Browser (no install) | [s540d.github.io/DrawFromMemory](https://s540d.github.io/DrawFromMemory/)                                                                                                                   |
| Privacy              | [Datenschutzerklärung](https://s540d.github.io/DrawFromMemory/privacy-policy.html) · [Privacy Policy (EN)](https://s540d.github.io/DrawFromMemory/privacy-policy-en.html)                   |

> The Play Store links carry a `referrer` parameter so installs coming from GitHub and the web demo
> show up as their own acquisition channel in the Play Console instead of counting as organic.

## Tech Stack

| Technology                 | Role                     |
| -------------------------- | ------------------------ |
| React Native + Expo        | Cross-platform framework |
| TypeScript                 | Type safety              |
| expo-router                | File-based navigation    |
| @shopify/react-native-skia | Drawing canvas (Native)  |
| HTML5 Canvas               | Drawing (Web)            |
| Web Audio API              | Sound effects            |
| expo-haptics               | Haptic feedback (Native) |
| AsyncStorage               | Progress saving          |

## How it Works

1. **Memorize** — look at a picture for a few seconds
2. **Draw** — recreate it from memory
3. **Compare** — overlay your drawing with the original
4. **Rate** — give yourself 1–5 stars

## Features

- **81 images** across difficulty levels 1–5, grouped into theme packs (animals, vehicles, nature, fairy tales, food)
- **Game variants** — outline only, mirrored, plus a free creative mode
- **Progressive reveal** — SVG elements appear one by one during memorization
- **Drawing timelapse** — stroke-by-stroke replay of your drawing
- **Gallery** — save and revisit drawings; share as PNG via the system share sheet
- **Mascot "Mali"** — companion that unlocks cosmetic accessories as you collect stars
- **Age groups** — 3-5 / 6-8 / 9+ adjust display time and default brush width
- **Daily challenge + streaks**
- **Confetti + sounds** — celebration on 4–5 star ratings
- **Haptic feedback** — vibration on interactions (Native)
- **Tablet & landscape layout**
- **Dark mode** support
- **7 languages** — German, English, Spanish, French, Italian, Dutch, Polish (auto-detected)
- **Offline-first** — all images bundled, no internet required
- **No ads, no in-app purchases, no data collection**

## Documentation

- [Web discoverability & install funnel](docs/WEB_DISCOVERABILITY.md)
- [Illustration style guide](docs/ILLUSTRATION_STYLEGUIDE.md)
- [Play Store listing](docs/PLAY_STORE_LISTING.md)

## License

MIT License — see [LICENSE](LICENSE).
