import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
import { LEVEL_IMAGE_RENDERERS } from './levelImages/registry';
import type { LevelImage } from '../types';

interface Props {
  image: LevelImage;
  size?: number;
  revealStep?: number; // If set, only show SVG children 0..revealStep (for progressive reveal)
  mode?: 'normal' | 'outline'; // 'outline' strips colors, showing only the silhouette (game variant "Nur Umriss merken")
  mirror?: boolean; // Horizontally flips the image (game variant "Spiegelbild")
}

const OUTLINE_COLOR = '#3a3a3a';

/**
 * Recursively strips fill colors from an SVG element tree and forces a uniform
 * outline stroke, so only the silhouette remains visible (no color information).
 */
function toOutlineElement(node: React.ReactNode): React.ReactNode {
  if (!React.isValidElement(node)) return node;
  const props: Record<string, unknown> = { ...(node.props as Record<string, unknown>) };

  if ('fill' in props) props.fill = 'none';
  props.stroke = OUTLINE_COLOR;
  if (!props.strokeWidth || Number(props.strokeWidth) < 2) props.strokeWidth = '2';
  delete props.opacity;

  if (props.children) {
    props.children = React.Children.map(props.children as React.ReactNode, toOutlineElement);
  }

  return React.cloneElement(node, props);
}

/**
 * Static lookup for SVG child element counts per image.
 * Avoids rendering SVG elements outside a render cycle (which crashes on Android native).
 */
const IMAGE_ELEMENT_COUNTS: Record<string, number> = {
  'level-01-sun.svg': 9,
  'level-02-face.svg': 8,
  'level-03-cloud.svg': 5,
  'extra-01-stick-figure.svg': 6,
  'level-02-01-house.svg': 6,
  'level-02-02-apple.svg': 5,
  'level-02-03-rocket.svg': 8,
  'level-02-04-balloon.svg': 8,
  'level-05-01-lion.svg': 15,
  'level-05-02-landscape.svg': 9,
  'level-05-03-castle.svg': 15,
  'level-06-dog.svg': 19,
  'level-07-cat.svg': 15,
  'level-08-sheep.svg': 18,
  'extra-03-flower.svg': 12,
  'extra-04-bird.svg': 16,
  'level-04-house.svg': 13,
  'level-05-tree.svg': 8,
  'extra-02-car.svg': 15,
  'level-09-fish.svg': 15,
  'level-10-butterfly.svg': 16,
  'level-11-cat-simple.svg': 11,
  'level-12-dog-simple.svg': 9,
  'level-13-bird-simple.svg': 8,
  'level-14-car-v2.svg': 18,
  'level-15-train.svg': 18,
  'level-16-bicycle.svg': 23,
  'level-17-tree-detailed.svg': 14,
  'level-18-flower-detailed.svg': 16,
  'level-19-fish-tropical.svg': 17,
  'level-20-house-detailed.svg': 25,
  // Fahrzeuge v1 Pack
  'fahrzeuge-01-bus.svg': 11,
  'fahrzeuge-02-airplane.svg': 10,
  'fahrzeuge-03-sailboat.svg': 9,
  'fahrzeuge-04-tractor.svg': 13,
  'fahrzeuge-05-helicopter.svg': 12,
  'fahrzeuge-06-firetruck.svg': 13,
  'fahrzeuge-07-ambulance.svg': 12,
  'fahrzeuge-08-submarine.svg': 13,
  'fahrzeuge-09-speedboat.svg': 12,
  'fahrzeuge-10-spaceshuttle.svg': 14,
  // Tiere v1 Pack
  'tiere-01-frog.svg': 10,
  'tiere-02-rabbit.svg': 11,
  'tiere-03-duck.svg': 10,
  'tiere-04-owl.svg': 12,
  'tiere-05-bear.svg': 11,
  'tiere-06-penguin.svg': 12,
  'tiere-07-snail.svg': 11,
  'tiere-08-horse.svg': 14,
  'tiere-09-elephant.svg': 14,
  'tiere-10-fox.svg': 13,
  // Natur v1 Pack
  'natur-01-rainbow.svg': 9,
  'natur-02-mushroom.svg': 9,
  'natur-03-seashell.svg': 9,
  'natur-04-cactus.svg': 10,
  'natur-05-bee.svg': 11,
  'natur-06-ladybug.svg': 11,
  'natur-07-snowflake.svg': 11,
  'natur-08-palmtree.svg': 14,
  'natur-09-waterfall.svg': 13,
  'natur-10-volcano.svg': 13,
  // Märchen v1 Pack
  'maerchen-01-crown.svg': 9,
  'maerchen-02-wand.svg': 9,
  'maerchen-03-wizardhat.svg': 8,
  'maerchen-04-fairy.svg': 11,
  'maerchen-05-frogprince.svg': 11,
  'maerchen-06-pumpkincarriage.svg': 10,
  'maerchen-07-spellbook.svg': 10,
  'maerchen-08-unicorn.svg': 13,
  'maerchen-09-dragon.svg': 13,
  'maerchen-10-castletower.svg': 13,
  // Essen v1 Pack
  'essen-01-popsicle.svg': 8,
  'essen-02-cookie.svg': 9,
  'essen-03-strawberry.svg': 9,
  'essen-04-pizza.svg': 10,
  'essen-05-cupcake.svg': 11,
  'essen-06-banana.svg': 10,
  'essen-07-carrot.svg': 10,
  'essen-08-cake.svg': 14,
  'essen-09-hamburger.svg': 13,
  'essen-10-watermelon.svg': 13,
};

/**
 * Returns the total number of SVG child elements for a given image.
 * Uses a static lookup to avoid native SVG rendering outside render cycle.
 */
export function getImageElementCount(image: LevelImage): number {
  return IMAGE_ELEMENT_COUNTS[image.filename] || 1;
}

/**
 * Standalone SVG render function (extracted so it can be used by getImageElementCount)
 */
function renderSvgForImage(
  image: LevelImage,
  svgSize: number,
  viewBox: string,
): React.ReactElement | null {
  const renderer = LEVEL_IMAGE_RENDERERS[image.filename];
  if (renderer) {
    return renderer(svgSize, viewBox);
  }

  // Fallback für noch nicht implementierte Bilder
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      <Rect
        x="50"
        y="50"
        width="100"
        height="100"
        fill="#F5F5F5"
        stroke="#CCCCCC"
        strokeWidth="2"
      />
      <Line x1="50" y1="50" x2="150" y2="150" stroke="#CCCCCC" strokeWidth="2" />
      <Line x1="150" y1="50" x2="50" y2="150" stroke="#CCCCCC" strokeWidth="2" />
    </Svg>
  );
}

/**
 * Zeigt ein Level-Bild an (SVG inline)
 * Rendert die SVG-Bilder als React Native SVG Komponenten
 * Optional: revealStep für schrittweises Aufdecken
 */
export default function LevelImageDisplay({
  image,
  size = 300,
  revealStep,
  mode = 'normal',
  mirror = false,
}: Props) {
  const svgSize = size;
  const viewBox = '0 0 200 200';

  let svgElement = renderSvgForImage(image, svgSize, viewBox);

  if (!svgElement) {
    return <View style={[styles.container, { width: svgSize, height: svgSize }]} />;
  }

  if (mode === 'outline') {
    const outlinedChildren = React.Children.map(
      (svgElement.props as React.ComponentProps<typeof Svg>).children,
      toOutlineElement,
    );
    svgElement = React.cloneElement(svgElement, {}, outlinedChildren);
  }

  const containerStyle = [
    styles.container,
    { width: svgSize, height: svgSize },
    mirror && styles.mirrored,
  ];

  // Progressive reveal: only show children up to revealStep
  if (revealStep !== undefined) {
    const children = React.Children.toArray(
      (svgElement.props as React.ComponentProps<typeof Svg>).children,
    );
    const visibleChildren = children.slice(0, revealStep + 1);
    const cloned = React.cloneElement(svgElement, {}, ...visibleChildren);
    return <View style={containerStyle}>{cloned}</View>;
  }

  return <View style={containerStyle}>{svgElement}</View>;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mirrored: {
    transform: [{ scaleX: -1 }],
  },
});
