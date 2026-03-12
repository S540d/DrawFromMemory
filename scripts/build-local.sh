#!/usr/bin/env bash
# Lokaler Android Build ohne EAS-Credits
# Nutzung: ./scripts/build-local.sh [preview|production]
# Voraussetzung: Android Studio installiert, EAS CLI installiert, eas login

set -e

PROFILE=${1:-preview}

# Android Studio SDK/JDK Pfade setzen (Fallback auf bestehende Env-Variablen)
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export JAVA_HOME="${JAVA_HOME:-/Applications/Android Studio.app/Contents/jbr/Contents/Home}"
export PATH="$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$HOME/.npm-global/bin:$PATH"

# Output-Format je nach Profil
if [ "$PROFILE" = "production" ]; then
  OUTPUT_FILE="build/app-production.aab"
else
  OUTPUT_FILE="build/app-$PROFILE.apk"
fi

echo "📱 Android Build (lokal, ohne EAS-Credits)"
echo "   Profil:       $PROFILE"
echo "   Output:       $OUTPUT_FILE"
echo "   ANDROID_HOME: $ANDROID_HOME"
echo "   JAVA_HOME:    $JAVA_HOME"
echo ""

# Voraussetzungen prüfen
if [ ! -d "$ANDROID_HOME" ]; then
  echo "❌ Android SDK nicht gefunden: $ANDROID_HOME"
  echo "   Bitte Android Studio öffnen und SDK installieren."
  exit 1
fi

if [ ! -d "$JAVA_HOME" ]; then
  echo "❌ JDK nicht gefunden: $JAVA_HOME"
  echo "   Bitte Android Studio installieren (enthält Bundled JDK)."
  exit 1
fi

if ! command -v eas &> /dev/null; then
  echo "❌ EAS CLI nicht gefunden."
  echo "   Installation: npm install -g eas-cli --prefix ~/.npm-global"
  exit 1
fi

# Output-Verzeichnis anlegen
mkdir -p build

# Sentry Source Map Upload deaktivieren (kein Sentry-Projekt lokal konfiguriert)
# Sentry lädt Source Maps nur in CI hoch, wo SENTRY_DSN/Org gesetzt sind
export SENTRY_DISABLE_AUTO_UPLOAD=true

# Build starten
eas build \
  --platform android \
  --profile "$PROFILE" \
  --local \
  --non-interactive \
  --output "$OUTPUT_FILE"

echo ""
echo "✅ Build abgeschlossen!"
echo "   Datei: $OUTPUT_FILE"

if [ "$PROFILE" != "production" ]; then
  echo ""
  echo "📲 APK auf Gerät installieren:"
  echo "   adb install $OUTPUT_FILE"
fi
