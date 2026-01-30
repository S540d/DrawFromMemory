#!/bin/bash

# Play Store Release Preparation Script
# Prüft ob alle notwendigen Assets und Konfigurationen vorhanden sind

set -e

echo "🔍 Play Store Release Preparation Check"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to check file existence
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $2 missing: $1"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# Function to check directory
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2 exists"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $2 missing: $1"
        WARNINGS=$((WARNINGS + 1))
        return 1
    fi
}

# Function to check JSON field
check_json_field() {
    local file=$1
    local field=$2
    local description=$3

    if command -v jq &> /dev/null; then
        local value=$(jq -r "$field" "$file" 2>/dev/null)
        if [ "$value" != "null" ] && [ "$value" != "your-project-id-here" ] && [ ! -z "$value" ]; then
            echo -e "${GREEN}✓${NC} $description: $value"
            return 0
        else
            echo -e "${RED}✗${NC} $description not configured in $file"
            ERRORS=$((ERRORS + 1))
            return 1
        fi
    else
        echo -e "${YELLOW}⚠${NC} jq not installed, skipping JSON validation"
        WARNINGS=$((WARNINGS + 1))
        return 1
    fi
}

echo "📱 Checking App Assets..."
echo "------------------------"
check_file "assets/icons/app-icon.png" "App Icon (1024x1024)"
check_file "assets/icons/adaptive-icon.png" "Adaptive Icon (1024x1024)"
check_file "assets/icons/app-icon.svg" "Icon Source SVG"

if check_dir "assets/icons/screenshots" "Screenshots Directory"; then
    SCREENSHOT_COUNT=$(find assets/icons/screenshots -name "*.png" -o -name "*.jpg" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$SCREENSHOT_COUNT" -ge 2 ]; then
        echo -e "${GREEN}✓${NC} Screenshots: $SCREENSHOT_COUNT found (minimum 2 required)"
    else
        echo -e "${RED}✗${NC} Screenshots: Only $SCREENSHOT_COUNT found (minimum 2 required)"
        ERRORS=$((ERRORS + 1))
    fi
fi

check_file "assets/icons/feature-graphic.png" "Feature Graphic (1024x500)" || true # Optional
echo ""

echo "⚙️  Checking App Configuration..."
echo "--------------------------------"
check_file "app.json" "app.json configuration"
check_file "eas.json" "EAS build configuration"
check_file "package.json" "package.json"

if [ -f "app.json" ]; then
    check_json_field "app.json" ".expo.version" "App Version"
    check_json_field "app.json" ".expo.android.versionCode" "Android Version Code"
    check_json_field "app.json" ".expo.android.package" "Android Package Name"
    check_json_field "app.json" ".expo.extra.eas.projectId" "EAS Project ID"

    # Check for placeholder values
    if grep -q "your-project-id-here" app.json; then
        echo -e "${RED}✗${NC} EAS Project ID still contains placeholder 'your-project-id-here'"
        ERRORS=$((ERRORS + 1))
    fi
fi
echo ""

echo "📄 Checking Documentation..."
echo "---------------------------"
check_file "PRIVACY_POLICY.md" "Privacy Policy"
check_file "docs/PLAY_STORE_METADATA.md" "Play Store Metadata"
check_file "docs/DEPLOYMENT_GUIDE.md" "Deployment Guide"
check_file "README.md" "README"
echo ""

echo "🔧 Checking Dependencies..."
echo "--------------------------"
if command -v eas &> /dev/null; then
    echo -e "${GREEN}✓${NC} EAS CLI installed ($(eas --version))"
else
    echo -e "${RED}✗${NC} EAS CLI not installed"
    echo "   Install with: npm install -g eas-cli"
    ERRORS=$((ERRORS + 1))
fi

if command -v expo &> /dev/null; then
    echo -e "${GREEN}✓${NC} Expo CLI installed"
else
    echo -e "${YELLOW}⚠${NC} Expo CLI not installed (optional)"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Node modules installed"
else
    echo -e "${RED}✗${NC} Node modules not installed"
    echo "   Run: npm install"
    ERRORS=$((ERRORS + 1))
fi
echo ""

echo "🔐 Checking EAS Authentication..."
echo "--------------------------------"
if command -v eas &> /dev/null; then
    if eas whoami &> /dev/null; then
        echo -e "${GREEN}✓${NC} EAS authenticated as: $(eas whoami)"
    else
        echo -e "${RED}✗${NC} Not logged into EAS"
        echo "   Run: eas login"
        ERRORS=$((ERRORS + 1))
    fi
fi
echo ""

echo "📋 Pre-Release Checklist..."
echo "--------------------------"
echo "Manual checks (review before release):"
echo ""
echo "  [ ] Privacy Policy hosted and accessible"
echo "  [ ] Support email configured"
echo "  [ ] Play Console account created"
echo "  [ ] Store listing text reviewed"
echo "  [ ] Content rating completed"
echo "  [ ] Data safety form filled"
echo "  [ ] Screenshots show latest app version"
echo "  [ ] All texts spell-checked"
echo "  [ ] App tested on physical device"
echo "  [ ] No TODOs in metadata files"
echo ""

echo "========================================"
echo "📊 Summary"
echo "========================================"
echo -e "Errors:   ${RED}$ERRORS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All critical checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review manual checklist above"
    echo "2. Run: eas build --platform android --profile production"
    echo "3. Follow docs/DEPLOYMENT_GUIDE.md for upload"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Please fix errors before proceeding with release${NC}"
    echo ""
    echo "See docs/DEPLOYMENT_GUIDE.md for guidance"
    echo ""
    exit 1
fi
