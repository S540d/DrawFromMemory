#!/usr/bin/env node

/**
 * Cache Version Updater for Expo Web Builds
 *
 * Creates version info file for cache busting on GitHub Pages
 */

const fs = require('fs');
const path = require('path');

// Get current timestamp for cache busting
const now = new Date();
const buildDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
const buildTime = now.getTime(); // Unix timestamp

console.log('🔄 Updating cache version for Expo Web...');

/**
 * Read version from package.json
 */
function getVersion() {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    return packageJson.version;
}

/**
 * Create version info file
 */
function createVersionInfo() {
    const versionInfo = {
        version: getVersion(),
        buildDate: buildDate,
        buildTime: buildTime,
        commit: process.env.GITHUB_SHA || 'local',
        timestamp: now.toISOString()
    };

    const versionPath = path.join(__dirname, '..', 'version.json');
    fs.writeFileSync(
        versionPath,
        JSON.stringify(versionInfo, null, 2)
    );

    console.log('✅ version.json created');
    return versionInfo;
}

/**
 * Add .nojekyll file to dist (prevents Jekyll processing on GitHub Pages)
 */
function addNoJekyll() {
    const distPath = path.join(__dirname, '..', 'dist');

    if (fs.existsSync(distPath)) {
        const nojekyllPath = path.join(distPath, '.nojekyll');
        fs.writeFileSync(nojekyllPath, '');
        console.log('✅ .nojekyll added to dist/');
    }
}

// Run all updates
try {
    const versionInfo = createVersionInfo();
    addNoJekyll();

    console.log('🎉 Cache version update complete!');
    console.log(`📅 Build Date: ${buildDate}`);
    console.log(`⏰ Build Time: ${buildTime}`);
    console.log(`📦 Version: ${versionInfo.version}`);

} catch (error) {
    console.error('❌ Cache update failed:', error.message);
    process.exit(1);
}
