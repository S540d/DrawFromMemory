# Third-Party Licenses

This document lists the open-source libraries used in DrawFromMemory (Merke und Male) and their respective licenses.

---

## Core Runtime Dependencies

### React & React Native
- **react** — MIT License — https://github.com/facebook/react
- **react-native** — MIT License — https://github.com/facebook/react-native
- **react-native-web** — MIT License — https://github.com/necolas/react-native-web

### Expo Platform
- **expo** — MIT License — https://github.com/expo/expo
- **expo-asset** — MIT License — https://github.com/expo/expo
- **expo-constants** — MIT License — https://github.com/expo/expo
- **expo-font** — MIT License — https://github.com/expo/expo
- **expo-haptics** — MIT License — https://github.com/expo/expo
- **expo-linear-gradient** — MIT License — https://github.com/expo/expo
- **expo-linking** — MIT License — https://github.com/expo/expo
- **expo-localization** — MIT License — https://github.com/expo/expo
- **expo-router** — MIT License — https://github.com/expo/expo
- **expo-status-bar** — MIT License — https://github.com/expo/expo
- **@expo/metro-runtime** — MIT License — https://github.com/expo/expo

### Drawing / Graphics
- **@shopify/react-native-skia** — MIT License — https://github.com/Shopify/react-native-skia
  - Wraps the Skia graphics library (BSD 3-Clause) — https://skia.org/

### Animations
- **react-native-reanimated** — MIT License — https://github.com/software-mansion/react-native-reanimated
- **react-native-worklets** — MIT License — https://github.com/margelo/react-native-worklets

### Navigation & Layout
- **react-native-screens** — MIT License — https://github.com/software-mansion/react-native-screens
- **react-native-safe-area-context** — MIT License — https://github.com/th3rdwave/react-native-safe-area-context

### Storage
- **@react-native-async-storage/async-storage** — MIT License — https://github.com/react-native-async-storage/async-storage

### SVG Rendering
- **react-native-svg** — MIT License — https://github.com/software-mansion/react-native-svg
- **react-native-svg-web** — MIT License — https://github.com/bacons/react-native-svg-web

---

## Optional / Conditional Dependencies

### Crash Reporting
- **@sentry/react-native** — MIT License — https://github.com/getsentry/sentry-react-native
  - Only active when `EXPO_PUBLIC_SENTRY_DSN` environment variable is set at build time.
  - Sentry Privacy Policy: https://sentry.io/privacy/
  - Sentry Terms of Service: https://sentry.io/terms/

---

## Development Dependencies

- **jest** — MIT License — https://github.com/jestjs/jest
- **jest-expo** — MIT License — https://github.com/expo/expo
- **@testing-library/react-native** — MIT License — https://github.com/testing-library/react-native-testing-library
- **babel-jest** — MIT License — https://github.com/babel/babel
- **typescript** — Apache-2.0 License — https://github.com/microsoft/TypeScript
- **eslint** — MIT License — https://github.com/eslint/eslint

---

## License Texts

The full license texts for all MIT-licensed packages are available in each package's `LICENSE` file within `node_modules/`. The MIT License text is reproduced below for reference:

```
MIT License

Copyright (c) [year] [copyright holder]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

*Last updated: April 5, 2026*
