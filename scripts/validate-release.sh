#!/bin/bash
# ==============================================================================
# Release-Validierung für Merke und Male (npm run validate)
# Prüft lokal, was vor einem Play-Store-Build stimmen muss. Bricht nicht beim
# ersten Fehler ab, sondern sammelt alle Ergebnisse.
# Usage: ./scripts/validate-release.sh
# ==============================================================================

cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 2

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'
ERRORS=0

ok() { echo -e "${GREEN}✅ $1${NC}"; }
fail() {
  echo -e "${RED}❌ $1${NC}"
  ERRORS=$((ERRORS + 1))
}
run() {
  local label=$1
  shift
  if "$@" >/dev/null 2>&1; then ok "$label"; else fail "$label (Befehl: $*)"; fi
}

echo "🚀 Release-Validierung: Merke und Male"
echo ""

# 1. Versionen
PKG_VERSION=$(node -p "require('./package.json').version")
APP_VERSION=$(node -p "require('./app.json').expo.version")
VERSION_CODE=$(node -p "require('./app.json').expo.android.versionCode")
echo "📦 package.json v$PKG_VERSION · app.json v$APP_VERSION (versionCode $VERSION_CODE)"
if [ "$PKG_VERSION" = "$APP_VERSION" ]; then ok "Versionen konsistent"; else fail "Version package.json ≠ app.json"; fi

LATEST_TAG=$(git describe --tags --abbrev=0 --match 'v*' 2>/dev/null)
if [ -n "$LATEST_TAG" ]; then
  TAG_CODE=$(git show "$LATEST_TAG:app.json" 2>/dev/null | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{console.log(JSON.parse(s).expo.android.versionCode)}catch{console.log(0)}})")
  if [ "$VERSION_CODE" -gt "$TAG_CODE" ]; then
    ok "versionCode $VERSION_CODE > $TAG_CODE (letzter Release-Tag $LATEST_TAG)"
  else
    fail "versionCode $VERSION_CODE muss größer sein als $TAG_CODE (letzter Release-Tag $LATEST_TAG)"
  fi
  if git rev-parse -q --verify "refs/tags/v$PKG_VERSION" >/dev/null; then
    fail "Tag v$PKG_VERSION existiert bereits — Version anheben"
  fi
fi

if grep -q "## \[$PKG_VERSION\]" CHANGELOG.md; then ok "CHANGELOG-Eintrag für $PKG_VERSION vorhanden"; else fail "CHANGELOG-Eintrag für $PKG_VERSION fehlt"; fi
echo ""

# 2. Code-Qualität (wie CI)
echo "🔍 Code-Qualität"
if grep -rnE "console\.(log|debug)" app components --include='*.ts' --include='*.tsx' | grep -v __tests__ >/dev/null; then
  fail "console.log/debug in app/ oder components/"
else
  ok "Kein console.log/debug in app/ und components/"
fi
run "ESLint" npm run lint
run "TypeScript" npx tsc --noEmit
run "SVG-Element-Counts" npm run validate:svg-counts
echo ""

# 3. Tests & Security
echo "🧪 Tests & Security"
run "Jest" npx jest --ci
run "Audit-Gate (high)" node scripts/audit-gate.mjs --level=high
echo ""

# 4. Bundles
echo "📱 Bundles"
OUT=$(mktemp -d)
run "Web-Export" npx expo export --platform web --output-dir "$OUT/web"
run "Android-JS-Bundle" npx expo export --platform android --output-dir "$OUT/android"
rm -rf "$OUT"
echo ""

if [ "$ERRORS" -eq 0 ]; then
  echo -e "${GREEN}🎉 Release-Validierung bestanden — bereit für npm run build:android${NC}"
  exit 0
fi
echo -e "${RED}$ERRORS Prüfung(en) fehlgeschlagen${NC}"
exit 1
