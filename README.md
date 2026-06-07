# Merke und Male

> A memory training app for children - look at a picture, draw it from memory, compare!

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://s540d.github.io/DrawFromMemory/)
[![Status](https://img.shields.io/badge/Status-Play%20Store%20Ready-blue)](https://github.com/S540d/DrawFromMemory)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Android%20%7C%20iOS-lightgrey)](https://github.com/S540d/DrawFromMemory)

## Live

- **Web App:** [https://s540d.github.io/DrawFromMemory/](https://s540d.github.io/DrawFromMemory/)

[![Play Store](https://img.shields.io/badge/Google_Play-Download-green?logo=google-play)](https://play.google.com/store/apps/details?id=com.s540d.merkeundmale)

**📚 Documentation:**
- 🚀 [Play Store Deployment](docs/DEPLOYMENT_GUIDE.md) - Complete publishing guide
- 🧪 [Testing Guide](docs/TESTING_README.md) - Developer testing guide
- 📝 [Store Metadata](docs/PLAY_STORE_METADATA.md) - App store texts
- 🔒 [Privacy Policy](PRIVACY_POLICY.md) - Data privacy

## 🛠 Tech Stack

| Technology | Role |
|---|---|
| React Native + Expo 54 | Cross-platform framework |
| TypeScript | Type safety |
| expo-router | File-based navigation |
| @shopify/react-native-skia | Drawing canvas (Native) |
| HTML5 Canvas | Drawing (Web) |
| Web Audio API | Sound effects (no assets needed) |
| expo-haptics | Haptic feedback (Native) |
| AsyncStorage | Progress saving |
| GitHub Pages + GitHub Actions | Web deployment |

## 🚀 Installation & Development

```bash
# Clone repository
git clone https://github.com/S540d/DrawFromMemory.git
cd DrawFromMemory

# Install dependencies
npm install

# Start development server
npm start

# Web (in browser)
npm run web

# Android (with Expo Go)
npm run android

# iOS (with Expo Go, macOS only)
npm run ios

# Web production build
npm run build:web
```

---

## 📱 About the App

**Draw From Memory** is a playful memory training app where users briefly see an image, memorize it, and then draw it from memory.

### How it works

1. **Memorize** - Look at a picture for 5 seconds
2. **Draw** - Draw the picture from memory
3. **Compare** - Overlay your drawing with the original
4. **Rate** - Give yourself 1-5 stars

---

## ✨ Features

- 🎯 **10+ Levels** with increasing difficulty
- 🎨 **Simple drawing tools** (brush, fill, colors, line widths)
- 🔍 **Progressive reveal** - SVG elements appear one by one
- 🎬 **Drawing timelapse** - Stroke-by-stroke replay animation
- 🔊 **Sound effects** - Timer tick, phase change chime, star rating
- 📳 **Haptic feedback** - Vibration on interactions (Native)
- 🖼️ **Gallery** - Save and view drawings
- 💾 **Save progress** (AsyncStorage)
- 🌓 **Dark Mode** support
- 🌍 **Multilingual** (German, English)
- 📱 **Cross-Platform** (Web, Android, iOS via React Native/Expo)
- 🎮 **No internet required** (all images bundled)
- 🚀 **100% free** - No ads, no in-app purchases

---

## 🚀 Roadmap & Release Status

**Current status:** App Store preparation in progress - [Detailed status →](STATUS.md) | [Play Store Issue #48 →](https://github.com/S540d/DrawFromMemory/issues/48)

### Phase 1: MVP - **95% COMPLETE**
- ✅ Concept & project outline
- ✅ Expo project setup with expo-router
- ✅ Home screen (complete)
- ✅ Game screen (complete)
- ✅ 10 levels + 4 extra images (all SVG present)
- ✅ Progress saving (AsyncStorage with completedLevels)
- ✅ GitHub Pages deployment (web testing on phone)
- ✅ i18n (DE/EN) service present
- ✅ Settings screen (theme, language, sound)
- ✅ Dark Mode support

**Next steps:**
1. Variable timer (difficulty affects memorize time)
2. Color picker popup improvement (#32)
3. More levels & perspective images

### Phase 2: Extended Features
- ✅ Gallery for saving drawings
- ✅ Sound effects (Web Audio API)
- ✅ Haptic feedback (Native)
- ✅ Progressive reveal
- ✅ Drawing timelapse (replay animation)
- 🔲 10 more levels (difficulty 4-5)
- 🔲 Perspective drawings (Level 11+)

### Phase 3: Advanced Features
- 🔲 Automatic similarity recognition (ML)
- 🔲 Multiplayer
- 🔲 Upload custom images
- 🔲 Community levels

---

## 📂 Project Structure

```
DrawFromMemory/
├── app/                         # Expo Router (file-based routing)
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Home screen
│   ├── game.tsx                 # Game screen (3 phases)
│   ├── levels.tsx               # Level selection
│   ├── gallery.tsx              # Saved drawings
│   └── settings.tsx             # Settings
│
├── components/
│   ├── DrawingCanvas.tsx        # Drawing surface (Skia Native / Canvas Web)
│   ├── LevelImageDisplay.tsx    # SVG image display with progressive reveal
│   └── ErrorBoundary.tsx        # Error handling
│
├── services/
│   ├── StorageManager.ts        # AsyncStorage + web fallback
│   ├── SoundManager.ts          # Sound effects + haptics
│   ├── ImagePoolManager.ts      # Random image selection per level
│   ├── LevelManager.ts          # Level configuration
│   └── i18n.ts                  # Internationalization (DE/EN)
│
├── assets/
│   └── images/levels/           # Level images (SVG as TSX)
│
└── docs/                        # Documentation
    ├── DEPLOYMENT_GUIDE.md
    ├── PLAY_STORE_METADATA.md
    └── TESTING_README.md
```

---

## 🎨 Design System: "Soft & Modern"

**Design philosophy:** Warm, soft aesthetics with subtle depth and elegance - specially optimized for children.

---

## 🧒 Team

- **Claude** - Development (AI-assisted)
- **Kid** - Ideas (level design, images, feedback)
- **Sven** - Moderator & product manager

---

## 🚧 Status

**Currently:** Play Store preparation - [Issue #48](https://github.com/S540d/DrawFromMemory/issues/48)

👉 **[Try live demo](https://s540d.github.io/DrawFromMemory/)** | **[Play Store Issue #48](https://github.com/S540d/DrawFromMemory/issues/48)**

---

## 📄 License

MIT License - see [LICENSE](LICENSE)

**Open Source • No Ads • Made with ❤️**

---

## 📞 Contact

- **Feedback:** [devsven@posteo.de](mailto:devsven@posteo.de)
- **GitHub Issues:** [Issues](https://github.com/S540d/DrawFromMemory/issues)
- **Live Demo:** [https://s540d.github.io/DrawFromMemory/](https://s540d.github.io/DrawFromMemory/)

---

**Note:** This app is in MVP phase. Features and design may still change.
