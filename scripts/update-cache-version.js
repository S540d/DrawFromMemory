#!/usr/bin/env node

/**
 * Cache Version Updater - Automatic Cache Busting for Expo Web Build
 *
 * This script automatically updates cache versions across the dist folder
 * to ensure users always get the latest version without manual cache clearing.
 * Optimized for Expo Web + GitHub Pages subpath deployment.
 */

const fs = require('fs');
const path = require('path');

// Get current timestamp for cache busting
const now = new Date();
const buildDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
const buildTime = now.getTime(); // Unix timestamp

const distPath = path.join(__dirname, '..', 'dist');
const packageJson = require(path.join(__dirname, '..', 'package.json'));

console.log('🔄 Updating cache versions for DrawFromMemory...');

/**
 * Update all HTML files with cache-busting query parameters
 * This forces browsers to fetch fresh files instead of using cached versions
 */
function updateHtmlFiles() {
  const htmlFiles = fs.readdirSync(distPath)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(distPath, file));

  console.log(`📄 Found ${htmlFiles.length} HTML files to process`);

  htmlFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);

    // Add cache-busting to all script tags (including Expo bundle)
    const originalScripts = content.match(/src="[^"]+\.js(\?v=[^"]*)?"/g) || [];
    content = content.replace(
      /src="([^"]+\.js)(\?v=[^"]*)?"/g,
      `src="$1?v=${buildTime}"`
    );

    // Add cache-busting to all link tags (CSS)
    content = content.replace(
      /href="([^"]+\.(css|woff2|ttf))(\?v=[^"]*)?"/g,
      `href="$1?v=${buildTime}"`
    );

    // Add cache-busting to image sources
    content = content.replace(
      /src="([^"]+\.(png|jpg|jpeg|svg|webp|gif))(\?v=[^"]*)?"/g,
      `src="$1?v=${buildTime}"`
    );

    fs.writeFileSync(filePath, content);
    console.log(`  ✓ ${fileName} - ${originalScripts.length} scripts cached`);
  });
}

/**
 * Create version.json file for version info endpoint
 */
function createVersionInfo() {
  const versionInfo = {
    version: packageJson.version,
    name: packageJson.name,
    buildDate: buildDate,
    buildTime: buildTime,
    timestamp: now.toISOString(),
    commit: process.env.GITHUB_SHA || 'local'
  };

  const versionPath = path.join(distPath, 'version.json');
  fs.writeFileSync(versionPath, JSON.stringify(versionInfo, null, 2));
  console.log('✅ version.json created');
  return versionInfo;
}

/**
 * Add .nojekyll file to dist (prevents Jekyll processing on GitHub Pages)
 * Essential for GitHub Pages to serve all files correctly
 */
function addNoJekyll() {
  const nojekyllPath = path.join(distPath, '.nojekyll');

  if (!fs.existsSync(nojekyllPath)) {
    fs.writeFileSync(nojekyllPath, '');
    console.log('✅ .nojekyll added to dist/');
  } else {
    console.log('✅ .nojekyll already exists');
  }
}

/**
 * Add cache-control meta tags to index.html
 * Helps prevent aggressive browser caching
 */
function addCacheMetaTags() {
  const indexPath = path.join(distPath, 'index.html');

  if (!fs.existsSync(indexPath)) {
    console.log('⚠️  index.html not found, skipping meta tags');
    return;
  }

  let content = fs.readFileSync(indexPath, 'utf8');

  // Check if meta tags already exist
  if (content.includes('Cache-Control')) {
    console.log('✅ Cache-control meta tags already present');
    return;
  }

  // Add cache control meta tags
  const metaTags = `<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />`;

  content = content.replace(
    /(<meta charset=[^>]+>)/,
    `$1\n    ${metaTags}`
  );

  fs.writeFileSync(indexPath, content);
  console.log('✅ Cache-control meta tags added to index.html');
}

// Run all updates
try {
  updateHtmlFiles();
  const versionInfo = createVersionInfo();
  addNoJekyll();
  addCacheMetaTags();

  console.log('\n🎉 Cache version update complete!');
  console.log(`📅 Build Date: ${buildDate}`);
  console.log(`⏰ Build Time: ${buildTime}`);
  console.log(`📦 Version: ${versionInfo.version}`);
  console.log(`\n💡 All static assets now have unique cache-busting parameters`);
  console.log(`   Users will receive fresh content on next visit!`);

} catch (error) {
  console.error('❌ Cache update failed:', error.message);
  process.exit(1);
}
