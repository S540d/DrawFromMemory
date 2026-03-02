/**
 * Tests for scripts/validate-svg-counts.js
 *
 * Validates that extractImageElementCounts and extractCaseCounts parse
 * LevelImageDisplay.tsx source correctly, and that all declared counts
 * match the actual inline SVG elements in each case.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { extractImageElementCounts, extractCaseCounts } = require('../validate-svg-counts');

const fs = require('fs');
const path = require('path');

const LEVEL_IMAGE_DISPLAY = path.resolve(
  __dirname,
  '../../components/LevelImageDisplay.tsx'
);

describe('extractImageElementCounts', () => {
  it('parses IMAGE_ELEMENT_COUNTS map from source', () => {
    const source = `
      const IMAGE_ELEMENT_COUNTS: Record<string, number> = {
        'level-01-sun.svg': 9,
        'level-02-face.svg': 8,
      };
    `;
    const counts = extractImageElementCounts(source);
    expect(counts).toEqual({ 'level-01-sun.svg': 9, 'level-02-face.svg': 8 });
  });

  it('throws if IMAGE_ELEMENT_COUNTS map is missing', () => {
    expect(() => extractImageElementCounts('no map here')).toThrow(
      'Could not find IMAGE_ELEMENT_COUNTS map in source'
    );
  });
});

describe('extractCaseCounts', () => {
  it('counts Circle elements in a single case', () => {
    const source = `
      case 'test.svg':
        return (
          <Svg>
            <Circle cx="1" cy="1" r="5" />
            <Circle cx="2" cy="2" r="5" />
          </Svg>
        );
    `;
    const counts = extractCaseCounts(source);
    expect(counts['test.svg']).toBe(2);
  });

  it('counts mixed SVG primitives (Circle, Rect, Line, Path, Ellipse, Polygon)', () => {
    const source = `
      case 'mix.svg':
        return (
          <Svg>
            <Circle cx="1" cy="1" r="5" />
            <Rect x="0" y="0" width="10" height="10" />
            <Line x1="0" y1="0" x2="10" y2="10" />
            <Path d="M 0 0" />
            <Ellipse cx="5" cy="5" rx="3" ry="3" />
            <Polygon points="0,0 10,0 5,10" />
          </Svg>
        );
    `;
    const counts = extractCaseCounts(source);
    expect(counts['mix.svg']).toBe(6);
  });

  it('correctly separates multiple cases', () => {
    const source = `
      case 'a.svg':
        return (<Svg><Circle cx="1" cy="1" r="1" /></Svg>);
      case 'b.svg':
        return (<Svg><Rect x="0" y="0" width="1" height="1" /><Rect x="1" y="1" width="1" height="1" /></Svg>);
    `;
    const counts = extractCaseCounts(source);
    expect(counts['a.svg']).toBe(1);
    expect(counts['b.svg']).toBe(2);
  });

  it('returns empty object for source with no svg cases', () => {
    const counts = extractCaseCounts('no cases here');
    expect(counts).toEqual({});
  });
});

describe('IMAGE_ELEMENT_COUNTS vs. actual renderSvgForImage elements', () => {
  it('LevelImageDisplay.tsx file exists', () => {
    expect(fs.existsSync(LEVEL_IMAGE_DISPLAY)).toBe(true);
  });

  it('all declared counts match actual SVG element counts in renderSvgForImage', () => {
    const source = fs.readFileSync(LEVEL_IMAGE_DISPLAY, 'utf8');
    const declared = extractImageElementCounts(source);
    const actual = extractCaseCounts(source);

    const mismatches: string[] = [];

    for (const [filename, declaredCount] of Object.entries(declared) as [string, number][]) {
      if (!(filename in actual)) {
        mismatches.push(`MISSING case for '${filename}' (declared count: ${declaredCount})`);
        continue;
      }
      if (actual[filename] !== declaredCount) {
        mismatches.push(
          `MISMATCH '${filename}': IMAGE_ELEMENT_COUNTS=${declaredCount}, actual=${actual[filename]}`
        );
      }
    }

    for (const filename of Object.keys(actual)) {
      if (!(filename in declared)) {
        mismatches.push(`UNDECLARED: '${filename}' has a case but is missing from IMAGE_ELEMENT_COUNTS`);
      }
    }

    expect(mismatches).toEqual([]);
  });

  it('IMAGE_ELEMENT_COUNTS has at least 20 entries', () => {
    const source = fs.readFileSync(LEVEL_IMAGE_DISPLAY, 'utf8');
    const declared = extractImageElementCounts(source);
    expect(Object.keys(declared).length).toBeGreaterThanOrEqual(20);
  });
});
