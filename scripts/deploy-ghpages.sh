#!/bin/bash
# Secure GitHub Pages Deployment Script
# Only deploys built web assets, excludes sensitive data

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🔒 Secure GitHub Pages Deployment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 1: Check dependencies
echo -e "${BLUE}1. Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}node_modules not found, installing dependencies...${NC}"
    npm install --legacy-peer-deps
fi

# Step 2: Clean previous build
echo -e "${BLUE}2. Cleaning previous build...${NC}"
rm -rf dist/

# Step 3: Build for web
echo -e "${BLUE}3. Building web version...${NC}"
npx expo export --platform web

if [ ! -d "dist" ]; then
    echo -e "${RED}✗${NC} Build failed: dist/ directory not created"
    exit 1
fi

echo -e "${GREEN}✓${NC} Web build completed"

# Step 4: Security check - verify no sensitive files
echo -e "${BLUE}4. Running security checks...${NC}"

# Check for node_modules (but allow dist/assets/node_modules which contains required assets)
if find dist -name "node_modules" -type d ! -path "dist/assets/node_modules*" | grep -q .; then
    echo -e "${RED}✗${NC} SECURITY ERROR: node_modules found in build (outside assets)!"
    ERRORS=$((ERRORS + 1))
fi

# Check for package files
if find dist -name "package.json" -o -name "package-lock.json" | grep -q .; then
    echo -e "${RED}✗${NC} SECURITY ERROR: package files found in build!"
    ERRORS=$((ERRORS + 1))
fi

# Check for .env files
if find dist -name ".env*" | grep -q .; then
    echo -e "${RED}✗${NC} SECURITY ERROR: .env files found in build!"
    ERRORS=$((ERRORS + 1))
fi

# Check for keystore files
if find dist -name "*.keystore" -o -name "*.jks" -o -name "*.pem" | grep -q .; then
    echo -e "${RED}✗${NC} SECURITY ERROR: keystore/certificate files found in build!"
    ERRORS=$((ERRORS + 1))
fi

# Check for source TypeScript files
if find dist -name "*.ts" -o -name "*.tsx" | grep -q .; then
    echo -e "${YELLOW}⚠${NC}  WARNING: TypeScript source files found in build"
    # Not a critical error, but should be noted
fi

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}✗ Security checks failed! Aborting deployment.${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Security checks passed"

# Step 5: Deploy to gh-pages
echo -e "${BLUE}5. Deploying to gh-pages branch...${NC}"

# Save current branch
CURRENT_BRANCH=$(git branch --show-current)

# Check if gh-pages branch exists
if git show-ref --verify --quiet refs/heads/gh-pages; then
    # Branch exists, check it out
    git checkout gh-pages

    # Remove old files (except .git and CNAME if exists)
    find . -maxdepth 1 ! -name '.git' ! -name 'CNAME' ! -name '.' ! -name '..' -exec rm -rf {} +
else
    # Create orphan gh-pages branch
    git checkout --orphan gh-pages
    git rm -rf .
fi

# Copy built files
cp -r dist/* .

# Add .nojekyll to prevent Jekyll processing
touch .nojekyll

# Show what will be deployed
echo -e "${BLUE}Files to be deployed:${NC}"
du -sh * | head -20

# Step 6: Commit and push
echo -e "${BLUE}6. Committing changes...${NC}"

git add .
git commit -m "deploy: $(git rev-parse --short ${CURRENT_BRANCH}@{0}) - Secure build without sensitive data

Built from: ${CURRENT_BRANCH}
Date: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
Security: Verified no node_modules, .env, or sensitive files included"

# Ask for confirmation before pushing
echo ""
echo -e "${YELLOW}Ready to push to origin/gh-pages. Continue? [y/N]${NC}"
read -r CONFIRM

if [[ $CONFIRM =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Pushing to origin/gh-pages...${NC}"
    git push origin gh-pages --force

    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✓ Deployment successful!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "Your site will be available at:"
    echo -e "${BLUE}https://s540d.github.io/DrawFromMemory/${NC}"
    echo ""
else
    echo -e "${YELLOW}Deployment cancelled.${NC}"
fi

# Return to original branch
git checkout "$CURRENT_BRANCH"

echo ""
echo -e "${GREEN}Done! Back on ${CURRENT_BRANCH} branch.${NC}"
