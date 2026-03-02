#!/usr/bin/env node
/**
 * Validates that IMAGE_ELEMENT_COUNTS in LevelImageDisplay.tsx matches
 * the actual number of SVG child elements rendered per case.
 *
 * SVG data is inline JSX, not external files. This script parses
 * LevelImageDisplay.tsx, counts SVG primitives per case, and compares
 * them against the static IMAGE_ELEMENT_COUNTS map.
 */

const fs = require('fs');
const path = require('path');

const TARGET_FILE = path.resolve(
  __dirname,
  '../components/LevelImageDisplay.tsx'
);

// SVG primitive elements counted as individual drawable steps
const SVG_PRIMITIVES = ['Circle', 'Ellipse', 'Rect', 'Line', 'Path', 'Polygon'];

function extractImageElementCounts(source) {
  const counts = {};
  const mapMatch = source.match(
    /const IMAGE_ELEMENT_COUNTS[^=]*=\s*\{([^}]+)\}/
  );
  if (!mapMatch) {
    throw new Error('Could not find IMAGE_ELEMENT_COUNTS map in source');
  }
  const entries = mapMatch[1].matchAll(/'([^']+)':\s*(\d+)/g);
  for (const [, filename, count] of entries) {
    counts[filename] = parseInt(count, 10);
  }
  return counts;
}

function extractCaseCounts(source) {
  const counts = {};

  // Find the end of the switch body to exclude default: and anything after it
  const defaultMatch = source.search(/^\s*default\s*:/m);
  const switchEnd = defaultMatch !== -1 ? defaultMatch : source.length;

  // Split on case statements, keeping the case label in each chunk
  const caseRegex = /case\s+'([^']+\.svg)':/g;
  const positions = [];
  let match;
  while ((match = caseRegex.exec(source)) !== null) {
    positions.push({ filename: match[1], index: match.index });
  }

  for (let i = 0; i < positions.length; i++) {
    const start = positions[i].index;
    const nextBoundary = i + 1 < positions.length ? positions[i + 1].index : switchEnd;
    const end = Math.min(nextBoundary, switchEnd);
    const chunk = source.slice(start, end);

    // Count opening tags of SVG primitives in this chunk (self-closing or opening)
    let elementCount = 0;
    for (const primitive of SVG_PRIMITIVES) {
      const tagRegex = new RegExp(`<${primitive}[\\s/>]`, 'g');
      const tagMatches = chunk.match(tagRegex);
      if (tagMatches) elementCount += tagMatches.length;
    }

    counts[positions[i].filename] = elementCount;
  }

  return counts;
}

function validate() {
  if (!fs.existsSync(TARGET_FILE)) {
    console.error(`ERROR: File not found: ${TARGET_FILE}`);
    process.exit(1);
  }

  const source = fs.readFileSync(TARGET_FILE, 'utf8');

  let declared;
  let actual;

  try {
    declared = extractImageElementCounts(source);
  } catch (e) {
    console.error(`ERROR: ${e.message}`);
    process.exit(1);
  }

  actual = extractCaseCounts(source);

  const failures = [];

  // Check every declared entry matches actual count
  for (const [filename, declaredCount] of Object.entries(declared)) {
    if (!(filename in actual)) {
      failures.push(`  MISSING case: '${filename}' is in IMAGE_ELEMENT_COUNTS but has no case in renderSvgForImage`);
      continue;
    }
    if (actual[filename] !== declaredCount) {
      failures.push(
        `  MISMATCH '${filename}': IMAGE_ELEMENT_COUNTS=${declaredCount}, actual elements=${actual[filename]}`
      );
    }
  }

  // Check every case has a declared entry
  for (const filename of Object.keys(actual)) {
    if (!(filename in declared)) {
      failures.push(`  UNDECLARED case: '${filename}' has a case but is missing from IMAGE_ELEMENT_COUNTS`);
    }
  }

  if (failures.length > 0) {
    console.error('SVG element count validation FAILED:\n');
    failures.forEach(f => console.error(f));
    console.error('\nFix IMAGE_ELEMENT_COUNTS in components/LevelImageDisplay.tsx.');
    process.exit(1);
  }

  const count = Object.keys(declared).length;
  console.log(`SVG element counts valid: ${count} entries all match.`);
}

// Export for unit testing; only run validate() when executed directly
if (require.main === module) {
  validate();
}

module.exports = { extractImageElementCounts, extractCaseCounts };
