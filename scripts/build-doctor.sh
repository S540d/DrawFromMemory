#!/usr/bin/env bash
# Build-Doctor — Preflight-Checks vor einem lokalen Android-Build.
# Verwandelt kryptische Gradle-/Toolchain-Abbrüche in klare Diagnosen.
# Nutzung: npm run build:doctor   (oder: bash scripts/build-doctor.sh)
#
# Prüft die Fallstricke, die in echten Sessions Zeit gekostet haben:
#   - zu wenig Disk (Skia braucht ~5-8 GB)
#   - JDK/Toolchain-Drift
#   - foojay-resolver-Pin inkompatibel mit Gradle 9 (Issue #276)
#   - Dependency-Drift vs. Expo-SDK-Sollstand
#   - hängengebliebene Gradle-Daemons / Lock-Dateien
#   - falscher Branch
#
# Exit-Code: 0 = alles grün oder nur Warnungen, 1 = harter Blocker gefunden.

set -uo pipefail
cd "$(dirname "$0")/.."

GREEN='\033[32m'; YELLOW='\033[33m'; RED='\033[31m'; BOLD='\033[1m'; RESET='\033[0m'
ERRORS=0
WARNINGS=0

ok()   { echo -e "  ${GREEN}✅${RESET} $1"; }
warn() { echo -e "  ${YELLOW}⚠️ ${RESET} $1"; WARNINGS=$((WARNINGS+1)); }
fail() { echo -e "  ${RED}❌${RESET} $1"; ERRORS=$((ERRORS+1)); }

echo -e "${BOLD}🩺 Build-Doctor — Preflight für lokalen Android-Build${RESET}\n"

# ── 1. Disk ────────────────────────────────────────────────────────────────
echo -e "${BOLD}Disk${RESET}"
FREE_GB=$(df -g "$HOME" 2>/dev/null | tail -1 | awk '{print $4}')
if [ -z "$FREE_GB" ]; then
  warn "Freien Speicher konnte nicht ermittelt werden."
elif [ "$FREE_GB" -lt 5 ]; then
  fail "Nur ${FREE_GB} GB frei — Skia-Libraries brauchen ~5-8 GB."
  echo -e "     Aufräumen: ${BOLD}npm cache clean --force && rm -rf ~/.npm/_npx${RESET}"
elif [ "$FREE_GB" -lt 10 ]; then
  warn "${FREE_GB} GB frei — knapp, ein Build könnte reichen. Vor Serien-Builds aufräumen."
else
  ok "${FREE_GB} GB frei."
fi

# ── 2. JDK ─────────────────────────────────────────────────────────────────
echo -e "\n${BOLD}JDK / Toolchain${RESET}"
JBR="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
JH="${JAVA_HOME:-$JBR}"
if [ ! -d "$JH" ]; then
  fail "JAVA_HOME/JBR nicht gefunden: $JH — Android Studio installieren."
else
  JVER=$("$JH/bin/java" -version 2>&1 | head -1 | sed 's/.*version "\([^"]*\)".*/\1/')
  ok "JDK $JVER ($JH)"
fi

# ── 3. foojay-resolver-Pin (Issue #276) ─────────────────────────────────────
echo -e "\n${BOLD}foojay-resolver ↔ Gradle 9 (Issue #276)${RESET}"
FOOJAY_FILE="node_modules/@react-native/gradle-plugin/settings.gradle.kts"
if [ ! -f "$FOOJAY_FILE" ]; then
  warn "node_modules noch nicht installiert — 'npm install' vor dem Build."
else
  FOOJAY_VER=$(grep -o 'foojay-resolver-convention").version("[^"]*"' "$FOOJAY_FILE" | grep -o '[0-9][^"]*' | head -1)
  if [ -z "$FOOJAY_VER" ]; then
    warn "foojay-Version in $FOOJAY_FILE nicht gefunden (Plugin-Layout geändert?)."
  elif [ "$FOOJAY_VER" = "0.5.0" ]; then
    fail "foojay $FOOJAY_VER ist inkompatibel mit Gradle 9 (IBM_SEMERU-Crash)."
    echo -e "     Patch nicht angewendet. Fix: ${BOLD}npm install${RESET} (postinstall→patch-package)"
    echo -e "     oder prüfen, ob patches/@react-native+gradle-plugin+*.patch existiert."
  else
    ok "foojay $FOOJAY_VER (Gradle-9-kompatibel, Patch aktiv)."
  fi
fi

# ── 4. Dependency-Sollstand vs. Expo SDK ────────────────────────────────────
echo -e "\n${BOLD}Expo-Dependency-Sollstand${RESET}"
if [ ! -d node_modules ]; then
  warn "node_modules fehlt — Check übersprungen."
else
  CHECK_OUT=$(JAVA_HOME="$JH" npx expo install --check 2>&1)
  if echo "$CHECK_OUT" | grep -q "up to date"; then
    ok "Dependencies auf SDK-Sollstand."
  else
    warn "Dependency-Drift — 'npx expo install --fix' erwägen:"
    echo "$CHECK_OUT" | grep -E "expected version|should be" | sed 's/^/       /'
  fi
fi

# ── 5. Gradle-Daemon / Lock ─────────────────────────────────────────────────
echo -e "\n${BOLD}Gradle-Daemon-Status${RESET}"
if pgrep -f GradleDaemon >/dev/null 2>&1; then
  warn "GradleDaemon läuft. Bei 'Cannot lock file hash cache'-Fehler: pkill -f GradleDaemon"
else
  ok "Kein hängender GradleDaemon."
fi

# ── 6. Branch ───────────────────────────────────────────────────────────────
echo -e "\n${BOLD}Git-Branch${RESET}"
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
if [ "$BRANCH" = "main" ]; then
  warn "Auf 'main' — Builds normalerweise von 'testing' oder einem Feature-Branch."
else
  ok "Branch: $BRANCH"
fi

# ── Fazit ───────────────────────────────────────────────────────────────────
echo ""
if [ "$ERRORS" -gt 0 ]; then
  echo -e "${RED}${BOLD}✗ $ERRORS Blocker, $WARNINGS Warnung(en) — Build würde vermutlich fehlschlagen.${RESET}"
  exit 1
elif [ "$WARNINGS" -gt 0 ]; then
  echo -e "${YELLOW}${BOLD}⚠ $WARNINGS Warnung(en), keine Blocker — Build kann starten.${RESET}"
  exit 0
else
  echo -e "${GREEN}${BOLD}✓ Alles grün — bereit für den Build.${RESET}"
  exit 0
fi
