import React from 'react';
import { render } from '@testing-library/react-native';
import type { LevelImage } from '../../types';

// react-native-svg's fabric native components aren't available under this
// jsdom-based test environment. Mock with plain View stand-ins so we can
// verify LevelImageDisplay's own prop-transformation logic (outline/mirror).
jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  const passthrough = (name: string) => {
    const Comp = (props: any) => <View {...props} testID={name} />;
    Comp.displayName = name;
    return Comp;
  };
  return {
    __esModule: true,
    default: passthrough('Svg'),
    Circle: passthrough('Circle'),
    Ellipse: passthrough('Ellipse'),
    Rect: passthrough('Rect'),
    Line: passthrough('Line'),
    Path: passthrough('Path'),
    Polygon: passthrough('Polygon'),
  };
});

import LevelImageDisplay from '../LevelImageDisplay';

const sunImage: LevelImage = {
  filename: 'level-01-sun.svg',
  difficulty: 1,
  displayName: 'Sonne',
  displayNameEn: 'Sun',
  strokeCount: 9,
  colors: ['#FFD700'],
};

const stickFigureImage: LevelImage = {
  filename: 'extra-01-stick-figure.svg',
  difficulty: 1,
  displayName: 'Strichmännchen',
  displayNameEn: 'Stick figure',
  strokeCount: 6,
  colors: ['#000000'],
};

describe('LevelImageDisplay', () => {
  it('renders the full-color image by default', () => {
    const { UNSAFE_root } = render(<LevelImageDisplay image={sunImage} />);
    const filled = UNSAFE_root.findAll((node: any) => node.props.fill === '#FFD700');
    expect(filled.length).toBeGreaterThan(0);
  });

  it('strips fills and forces a uniform stroke in outline mode', () => {
    const { UNSAFE_root } = render(<LevelImageDisplay image={sunImage} mode="outline" />);
    const stillColored = UNSAFE_root.findAll((node: any) => node.props.fill === '#FFD700');
    expect(stillColored.length).toBe(0);
    const outlined = UNSAFE_root.findAll((node: any) => node.props.stroke === '#3a3a3a');
    expect(outlined.length).toBeGreaterThan(0);
  });

  it('applies a horizontal flip transform in mirror mode', () => {
    const { UNSAFE_root } = render(<LevelImageDisplay image={sunImage} mirror />);
    const flipped = UNSAFE_root.findAll(
      (node: any) =>
        Array.isArray(node.props.style) &&
        node.props.style.some(
          (s: any) => s && Array.isArray(s.transform) && s.transform[0]?.scaleX === -1,
        ),
    );
    expect(flipped.length).toBeGreaterThan(0);
  });

  it('combines outline mode with progressive reveal without crashing', () => {
    expect(() =>
      render(<LevelImageDisplay image={sunImage} mode="outline" revealStep={2} />),
    ).not.toThrow();
  });

  it('renders an empty placeholder for an unknown image without crashing', () => {
    const unknown: LevelImage = { ...sunImage, filename: 'does-not-exist.svg' };
    expect(() => render(<LevelImageDisplay image={unknown} mode="outline" mirror />)).not.toThrow();
  });

  it('recolors unfilled black strokes in dark theme, including <Line> elements without a fill prop (#335)', () => {
    const { UNSAFE_root } = render(<LevelImageDisplay image={stickFigureImage} theme="dark" />);
    const stillBlack = UNSAFE_root.findAll(
      (node: any) => node.props.stroke === '#000000' || node.props.stroke === 'black',
    );
    expect(stillBlack.length).toBe(0);
    const recolored = UNSAFE_root.findAll((node: any) => node.props.stroke === '#D8D4E8');
    // Kopf (Circle, fill="none") + 5 Gliedmaßen (Line, ohne fill-Prop)
    expect(recolored.length).toBeGreaterThanOrEqual(6);
  });

  it('keeps black strokes unchanged in light theme (default)', () => {
    const { UNSAFE_root } = render(<LevelImageDisplay image={stickFigureImage} />);
    const black = UNSAFE_root.findAll(
      (node: any) => node.props.stroke === '#000000' || node.props.stroke === 'black',
    );
    expect(black.length).toBeGreaterThan(0);
  });

  it('uses a theme-appropriate outline color in outline mode', () => {
    const { UNSAFE_root: darkRoot } = render(
      <LevelImageDisplay image={sunImage} mode="outline" theme="dark" />,
    );
    expect(darkRoot.findAll((node: any) => node.props.stroke === '#D8D4E8').length).toBeGreaterThan(
      0,
    );
    expect(darkRoot.findAll((node: any) => node.props.stroke === '#3a3a3a').length).toBe(0);
  });
});
