/**
 * Rasterisiert die SVG-Quellen in assets/icons/ zu den PNG-Assets, die
 * app.json referenziert (Issue #279, 2.3 — Icon/Feature-Graphic-Refresh).
 *
 * Ersetzt den bisherigen manuellen "Rechtsklick -> Bild speichern unter"
 * Workflow (feature-graphic-export.html) durch einen reproduzierbaren
 * Screenshot-Export via Chromium.
 *
 * Nutzt `playwright-core` (nicht als Projekt-Dependency geführt, da nur für
 * diesen einmaligen Asset-Export benötigt):
 *   npm install --no-save playwright-core
 *   node scripts/generate-icon-assets.js
 *
 * Erwartet einen bereits vorhandenen Chromium-Build (z.B. via
 * PLAYWRIGHT_BROWSERS_PATH) — siehe CHROMIUM_PATH-Override unten.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const ICONS_DIR = path.join(__dirname, '..', 'assets', 'icons');
const CHROMIUM_PATH =
  process.env.PLAYWRIGHT_CHROMIUM_PATH ||
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const TARGETS = [
  { svg: 'app-icon.svg', out: 'app-icon.png', width: 1024, height: 1024 },
  { svg: 'app-icon.svg', out: 'adaptive-icon.png', width: 1024, height: 1024 },
  { svg: 'app-icon.svg', out: 'favicon.png', width: 1024, height: 1024 },
  { svg: 'app-icon.svg', out: 'app-icon-512.png', width: 512, height: 512 },
  { svg: 'feature-graphic.svg', out: 'feature-graphic.png', width: 1024, height: 500 },
];

async function main() {
  const browser = await chromium.launch({ executablePath: CHROMIUM_PATH });
  try {
    for (const target of TARGETS) {
      const context = await browser.newContext({
        viewport: { width: target.width, height: target.height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      const svgContent = fs.readFileSync(path.join(ICONS_DIR, target.svg), 'utf8');
      await page.setContent(
        `<!doctype html><html><body style="margin:0;padding:0;width:${target.width}px;height:${target.height}px;overflow:hidden;">` +
          `<div style="width:${target.width}px;height:${target.height}px;">${svgContent}</div></body></html>`,
      );
      await page.evaluate(
        ({ width, height }) => {
          const svg = document.querySelector('svg');
          svg.setAttribute('width', String(width));
          svg.setAttribute('height', String(height));
        },
        { width: target.width, height: target.height },
      );
      const outPath = path.join(ICONS_DIR, target.out);
      await page.screenshot({ path: outPath });
      await context.close();
      console.log(`Generated ${target.out} (${target.width}x${target.height}) from ${target.svg}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
