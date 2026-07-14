import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Ellipse, Rect, Line, Path, Polygon } from 'react-native-svg';
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
  switch (image.filename) {
    case 'level-01-sun.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Sonne - Kreis in der Mitte */}
          <Circle cx="100" cy="100" r="40" fill="#FFD700" stroke="#FFA500" strokeWidth="3" />
          {/* 8 Strahlen */}
          <Line
            x1="100"
            y1="20"
            x2="100"
            y2="50"
            stroke="#FFA500"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <Line
            x1="100"
            y1="150"
            x2="100"
            y2="180"
            stroke="#FFA500"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <Line
            x1="20"
            y1="100"
            x2="50"
            y2="100"
            stroke="#FFA500"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <Line
            x1="150"
            y1="100"
            x2="180"
            y2="100"
            stroke="#FFA500"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <Line
            x1="35"
            y1="35"
            x2="60"
            y2="60"
            stroke="#FFA500"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <Line
            x1="140"
            y1="140"
            x2="165"
            y2="165"
            stroke="#FFA500"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <Line
            x1="165"
            y1="35"
            x2="140"
            y2="60"
            stroke="#FFA500"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <Line
            x1="60"
            y1="140"
            x2="35"
            y2="165"
            stroke="#FFA500"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'level-02-face.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Gesicht - Kreis */}
          <Circle cx="100" cy="100" r="60" fill="#FDBCB4" stroke="#000000" strokeWidth="3" />
          {/* Augen */}
          <Circle cx="80" cy="90" r="8" fill="#000000" />
          <Circle cx="120" cy="90" r="8" fill="#000000" />
          <Circle cx="82" cy="88" r="3" fill="#FFFFFF" />
          <Circle cx="122" cy="88" r="3" fill="#FFFFFF" />
          {/* Lächeln */}
          <Path
            d="M 70 110 Q 100 130 130 110"
            stroke="#000000"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          {/* Rote Wangen */}
          <Circle cx="65" cy="105" r="8" fill="#FF69B4" opacity="0.4" />
          <Circle cx="135" cy="105" r="8" fill="#FF69B4" opacity="0.4" />
        </Svg>
      );

    case 'level-03-cloud.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Wolke - mehrere überlappende Kreise */}
          <Circle cx="80" cy="100" r="30" fill="#FFFFFF" stroke="#B0C4DE" strokeWidth="2" />
          <Circle cx="110" cy="95" r="35" fill="#FFFFFF" stroke="#B0C4DE" strokeWidth="2" />
          <Circle cx="140" cy="100" r="28" fill="#FFFFFF" stroke="#B0C4DE" strokeWidth="2" />
          <Circle cx="95" cy="110" r="25" fill="#FFFFFF" stroke="#B0C4DE" strokeWidth="2" />
          <Circle cx="125" cy="112" r="26" fill="#FFFFFF" stroke="#B0C4DE" strokeWidth="2" />
        </Svg>
      );

    case 'extra-01-stick-figure.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Kopf */}
          <Circle cx="100" cy="50" r="20" fill="none" stroke="#000000" strokeWidth="3" />
          {/* Körper */}
          <Line
            x1="100"
            y1="70"
            x2="100"
            y2="130"
            stroke="#000000"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Arme */}
          <Line
            x1="100"
            y1="90"
            x2="70"
            y2="110"
            stroke="#000000"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <Line
            x1="100"
            y1="90"
            x2="130"
            y2="110"
            stroke="#000000"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Beine */}
          <Line
            x1="100"
            y1="130"
            x2="75"
            y2="170"
            stroke="#000000"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <Line
            x1="100"
            y1="130"
            x2="125"
            y2="170"
            stroke="#000000"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'level-02-01-house.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox="0 0 200 240">
          {/* House body */}
          <Rect
            x="40"
            y="100"
            width="120"
            height="100"
            fill="#E74C3C"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Roof */}
          <Polygon points="40,100 100,30 160,100" fill="#8B4513" stroke="#000000" strokeWidth="2" />
          {/* Door */}
          <Rect
            x="85"
            y="150"
            width="30"
            height="50"
            fill="#8B4513"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Door handle */}
          <Circle cx="112" cy="175" r="3" fill="#FFD700" />
          {/* Left window */}
          <Rect
            x="55"
            y="115"
            width="25"
            height="25"
            fill="#87CEEB"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Right window */}
          <Rect
            x="120"
            y="115"
            width="25"
            height="25"
            fill="#87CEEB"
            stroke="#000000"
            strokeWidth="2"
          />
        </Svg>
      );

    case 'level-02-02-apple.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox="0 0 200 200">
          {/* Apple body */}
          <Circle cx="100" cy="110" r="50" fill="#E74C3C" stroke="#000000" strokeWidth="2" />
          {/* Apple top indent */}
          <Ellipse
            cx="100"
            cy="65"
            rx="15"
            ry="10"
            fill="#E74C3C"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Stem */}
          <Rect
            x="96"
            y="50"
            width="8"
            height="20"
            fill="#8B4513"
            stroke="#000000"
            strokeWidth="1.5"
          />
          {/* Leaf */}
          <Ellipse
            cx="85"
            cy="55"
            rx="20"
            ry="12"
            fill="#27AE60"
            stroke="#000000"
            strokeWidth="1.5"
          />
          {/* Highlight */}
          <Ellipse cx="80" cy="100" rx="15" ry="20" fill="#FFFFFF" opacity="0.4" />
        </Svg>
      );

    case 'level-02-03-rocket.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox="0 0 200 280">
          {/* Rocket body */}
          <Rect
            x="70"
            y="40"
            width="60"
            height="140"
            fill="#FF6B6B"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Rocket nose */}
          <Polygon points="100,20 85,40 115,40" fill="#FFD700" stroke="#000000" strokeWidth="2" />
          {/* Window */}
          <Circle cx="100" cy="70" r="12" fill="#3498DB" stroke="#000000" strokeWidth="1.5" />
          {/* Left fin */}
          <Polygon points="70,160 45,200 65,165" fill="#3498DB" stroke="#000000" strokeWidth="2" />
          {/* Right fin */}
          <Polygon
            points="130,160 155,200 135,165"
            fill="#3498DB"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Flame 1 */}
          <Polygon
            points="80,180 75,240 85,200"
            fill="#FF8C00"
            stroke="#000000"
            strokeWidth="1.5"
          />
          {/* Flame 2 */}
          <Polygon
            points="100,180 100,250 105,200"
            fill="#FFD700"
            stroke="#000000"
            strokeWidth="1.5"
          />
          {/* Flame 3 */}
          <Polygon
            points="120,180 125,240 115,200"
            fill="#FF8C00"
            stroke="#000000"
            strokeWidth="1.5"
          />
        </Svg>
      );

    case 'level-02-04-balloon.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox="0 0 200 260">
          {/* Balloon */}
          <Circle cx="100" cy="70" r="40" fill="#FF1493" stroke="#000000" strokeWidth="2" />
          {/* String line */}
          <Line x1="100" y1="110" x2="100" y2="220" stroke="#000000" strokeWidth="2" />
          {/* Basket */}
          <Rect
            x="75"
            y="220"
            width="50"
            height="35"
            fill="#CD853F"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Basket weave pattern */}
          <Line x1="85" y1="220" x2="85" y2="255" stroke="#000000" strokeWidth="1" />
          <Line x1="95" y1="220" x2="95" y2="255" stroke="#000000" strokeWidth="1" />
          <Line x1="105" y1="220" x2="105" y2="255" stroke="#000000" strokeWidth="1" />
          <Line x1="115" y1="220" x2="115" y2="255" stroke="#000000" strokeWidth="1" />
          {/* Highlight on balloon */}
          <Ellipse cx="85" cy="50" rx="12" ry="15" fill="#FFFFFF" opacity="0.3" />
        </Svg>
      );

    case 'level-05-01-lion.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox="0 0 240 220">
          {/* Mane outer */}
          <Circle cx="120" cy="90" r="50" fill="#FFA500" stroke="#000000" strokeWidth="2" />
          {/* Mane details */}
          <Circle cx="85" cy="70" r="22" fill="#FFA500" stroke="#000000" strokeWidth="1.5" />
          <Circle cx="155" cy="70" r="22" fill="#FFA500" stroke="#000000" strokeWidth="1.5" />
          {/* Head */}
          <Circle cx="120" cy="100" r="35" fill="#CD853F" stroke="#000000" strokeWidth="2" />
          {/* Ears */}
          <Polygon points="95,70 85,40 100,65" fill="#CD853F" stroke="#000000" strokeWidth="1.5" />
          <Polygon
            points="145,70 155,40 140,65"
            fill="#CD853F"
            stroke="#000000"
            strokeWidth="1.5"
          />
          {/* Eyes */}
          <Circle cx="110" cy="90" r="4" fill="#000000" />
          <Circle cx="130" cy="90" r="4" fill="#000000" />
          {/* Nose */}
          <Polygon points="120,105 115,115 125,115" fill="#000000" />
          {/* Snout */}
          <Ellipse cx="120" cy="108" rx="12" ry="10" fill="#F4A460" />
          {/* Body */}
          <Ellipse
            cx="120"
            cy="160"
            rx="30"
            ry="40"
            fill="#CD853F"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Front left leg */}
          <Rect
            x="105"
            y="185"
            width="10"
            height="30"
            fill="#8B6914"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Front right leg */}
          <Rect
            x="125"
            y="185"
            width="10"
            height="30"
            fill="#8B6914"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Tail */}
          <Path
            d="M 85 165 Q 40 160 45 110"
            stroke="#CD853F"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M 45 110 Q 35 100 30 105"
            stroke="#FFA500"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'level-05-02-landscape.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox="0 0 300 200">
          {/* Sky */}
          <Rect width="300" height="100" fill="#87CEEB" />
          {/* Ground */}
          <Rect y="100" width="300" height="100" fill="#90EE90" />
          {/* Mountains */}
          <Polygon points="0,100 80,40 160,100" fill="#8B7355" stroke="#000000" strokeWidth="2" />
          <Polygon
            points="140,100 200,50 260,100"
            fill="#A0826D"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Sun */}
          <Circle cx="270" cy="30" r="25" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
          {/* Tree 1 */}
          <Rect
            x="30"
            y="130"
            width="12"
            height="30"
            fill="#8B4513"
            stroke="#000000"
            strokeWidth="1.5"
          />
          <Circle cx="36" cy="115" r="20" fill="#27AE60" stroke="#000000" strokeWidth="2" />
          {/* Cloud */}
          <Circle cx="50" cy="35" r="15" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
          <Circle cx="70" cy="35" r="18" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
        </Svg>
      );

    case 'level-05-03-castle.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox="0 0 280 260">
          {/* Central tower body */}
          <Rect
            x="100"
            y="100"
            width="80"
            height="120"
            fill="#D3D3D3"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Left tower */}
          <Rect
            x="30"
            y="130"
            width="40"
            height="90"
            fill="#A9A9A9"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Right tower */}
          <Rect
            x="210"
            y="130"
            width="40"
            height="90"
            fill="#A9A9A9"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Central tower roof */}
          <Polygon
            points="100,100 140,40 180,100"
            fill="#8B4513"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Left tower roof */}
          <Polygon points="30,130 50,80 70,130" fill="#8B4513" stroke="#000000" strokeWidth="2" />
          {/* Right tower roof */}
          <Polygon
            points="210,130 230,80 250,130"
            fill="#8B4513"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Central tower door */}
          <Rect
            x="125"
            y="160"
            width="30"
            height="50"
            fill="#654321"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Door handle */}
          <Circle cx="150" cy="185" r="3" fill="#FFD700" />
          {/* Left tower window */}
          <Rect
            x="40"
            y="150"
            width="20"
            height="20"
            fill="#87CEEB"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Right tower window */}
          <Rect
            x="220"
            y="150"
            width="20"
            height="20"
            fill="#87CEEB"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Central tower windows */}
          <Rect
            x="115"
            y="130"
            width="18"
            height="18"
            fill="#87CEEB"
            stroke="#000000"
            strokeWidth="1.5"
          />
          <Rect
            x="147"
            y="130"
            width="18"
            height="18"
            fill="#87CEEB"
            stroke="#000000"
            strokeWidth="1.5"
          />
          {/* Flag */}
          <Rect
            x="138"
            y="35"
            width="4"
            height="15"
            fill="#FFD700"
            stroke="#000000"
            strokeWidth="1"
          />
          <Polygon
            points="142,40 142,50 158,45"
            fill="#FF1493"
            stroke="#000000"
            strokeWidth="1.5"
          />
          {/* Ground */}
          <Line x1="20" y1="220" x2="260" y2="220" stroke="#000000" strokeWidth="3" />
        </Svg>
      );

    case 'level-06-dog.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Dog Body */}
          <Ellipse
            cx="110"
            cy="120"
            rx="45"
            ry="30"
            fill="#D2691E"
            stroke="#8B4513"
            strokeWidth="3"
          />
          {/* Dog Head */}
          <Circle cx="65" cy="100" r="28" fill="#D2691E" stroke="#8B4513" strokeWidth="3" />
          {/* Ear (floppy) */}
          <Ellipse
            cx="55"
            cy="85"
            rx="12"
            ry="25"
            fill="#A0522D"
            stroke="#8B4513"
            strokeWidth="2"
            transform="rotate(-20 55 85)"
          />
          {/* Snout */}
          <Ellipse
            cx="45"
            cy="105"
            rx="15"
            ry="12"
            fill="#CD853F"
            stroke="#8B4513"
            strokeWidth="2"
          />
          {/* Nose */}
          <Circle cx="42" cy="105" r="5" fill="#000000" />
          {/* Eye */}
          <Circle cx="68" cy="95" r="4" fill="#000000" />
          <Circle cx="70" cy="93" r="2" fill="#FFFFFF" />
          {/* Mouth */}
          <Line
            x1="42"
            y1="110"
            x2="42"
            y2="115"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <Path d="M 42 115 Q 38 117 35 115" stroke="#000000" strokeWidth="2" fill="none" />
          <Path d="M 42 115 Q 46 117 49 115" stroke="#000000" strokeWidth="2" fill="none" />
          {/* Front Legs */}
          <Rect
            x="90"
            y="140"
            width="10"
            height="30"
            fill="#D2691E"
            stroke="#8B4513"
            strokeWidth="2"
            rx="3"
          />
          <Rect
            x="115"
            y="140"
            width="10"
            height="30"
            fill="#D2691E"
            stroke="#8B4513"
            strokeWidth="2"
            rx="3"
          />
          {/* Back Legs (shorter) */}
          <Rect
            x="140"
            y="145"
            width="10"
            height="25"
            fill="#D2691E"
            stroke="#8B4513"
            strokeWidth="2"
            rx="3"
          />
          {/* Tail (curved) */}
          <Path
            d="M 155 115 Q 175 105 170 85"
            stroke="#8B4513"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Paws (white spots) */}
          <Ellipse cx="95" cy="167" rx="6" ry="4" fill="#FFFFFF" />
          <Ellipse cx="120" cy="167" rx="6" ry="4" fill="#FFFFFF" />
          <Ellipse cx="145" cy="167" rx="6" ry="4" fill="#FFFFFF" />
          {/* Collar */}
          <Ellipse cx="80" cy="115" rx="18" ry="8" fill="none" stroke="#FF0000" strokeWidth="3" />
          <Circle cx="85" cy="115" r="3" fill="#FFD700" />
        </Svg>
      );

    case 'level-07-cat.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Cat Body */}
          <Ellipse
            cx="100"
            cy="120"
            rx="40"
            ry="30"
            fill="#FFA500"
            stroke="#FF8C00"
            strokeWidth="3"
          />
          {/* Cat Head */}
          <Circle cx="100" cy="70" r="30" fill="#FFA500" stroke="#FF8C00" strokeWidth="3" />
          {/* Ears Left */}
          <Polygon points="75,45 70,20 85,50" fill="#FFA500" stroke="#FF8C00" strokeWidth="3" />
          {/* Ears Right */}
          <Polygon points="125,45 130,20 115,50" fill="#FFA500" stroke="#FF8C00" strokeWidth="3" />
          {/* Eyes */}
          <Circle cx="90" cy="65" r="5" fill="#000000" />
          <Circle cx="110" cy="65" r="5" fill="#000000" />
          {/* Nose */}
          <Polygon points="100,75 95,82 105,82" fill="#FFB6C1" />
          {/* Mouth */}
          <Path d="M 95 82 Q 100 85 105 82" stroke="#000000" strokeWidth="2" fill="none" />
          {/* Whiskers Left */}
          <Line x1="60" y1="70" x2="85" y2="68" stroke="#000000" strokeWidth="1" />
          <Line x1="60" y1="75" x2="85" y2="75" stroke="#000000" strokeWidth="1" />
          {/* Whiskers Right */}
          <Line x1="140" y1="70" x2="115" y2="68" stroke="#000000" strokeWidth="1" />
          <Line x1="140" y1="75" x2="115" y2="75" stroke="#000000" strokeWidth="1" />
          {/* Tail */}
          <Path
            d="M 130 130 Q 160 120 170 150"
            stroke="#FFA500"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Legs */}
          <Rect
            x="75"
            y="140"
            width="10"
            height="25"
            fill="#FFA500"
            stroke="#FF8C00"
            strokeWidth="2"
            rx="3"
          />
          <Rect
            x="115"
            y="140"
            width="10"
            height="25"
            fill="#FFA500"
            stroke="#FF8C00"
            strokeWidth="2"
            rx="3"
          />
        </Svg>
      );

    case 'level-08-sheep.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Sheep Body (fluffy wool - multiple circles) */}
          <Circle cx="90" cy="110" r="22" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
          <Circle cx="115" cy="110" r="22" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
          <Circle cx="102" cy="95" r="20" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
          <Circle cx="102" cy="125" r="20" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
          <Circle cx="125" cy="100" r="18" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
          <Circle cx="80" cy="100" r="18" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
          {/* Sheep Head (black face) */}
          <Ellipse
            cx="60"
            cy="105"
            rx="20"
            ry="22"
            fill="#2F4F4F"
            stroke="#1C1C1C"
            strokeWidth="2"
          />
          {/* Ears */}
          <Ellipse
            cx="52"
            cy="90"
            rx="8"
            ry="12"
            fill="#2F4F4F"
            stroke="#1C1C1C"
            strokeWidth="2"
            transform="rotate(-15 52 90)"
          />
          <Ellipse
            cx="68"
            cy="90"
            rx="8"
            ry="12"
            fill="#2F4F4F"
            stroke="#1C1C1C"
            strokeWidth="2"
            transform="rotate(15 68 90)"
          />
          {/* Eyes (white dots on black face) */}
          <Circle cx="56" cy="102" r="3" fill="#FFFFFF" />
          <Circle cx="64" cy="102" r="3" fill="#FFFFFF" />
          {/* Nose */}
          <Ellipse cx="60" cy="110" rx="4" ry="3" fill="#1C1C1C" />
          {/* Wool on head (fluffy top) */}
          <Circle cx="60" cy="85" r="12" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
          {/* Legs (black, thin) */}
          <Rect
            x="85"
            y="135"
            width="6"
            height="25"
            fill="#2F4F4F"
            stroke="#1C1C1C"
            strokeWidth="1"
            rx="2"
          />
          <Rect
            x="105"
            y="135"
            width="6"
            height="25"
            fill="#2F4F4F"
            stroke="#1C1C1C"
            strokeWidth="1"
            rx="2"
          />
          <Rect
            x="95"
            y="135"
            width="6"
            height="25"
            fill="#2F4F4F"
            stroke="#1C1C1C"
            strokeWidth="1"
            rx="2"
          />
          <Rect
            x="115"
            y="135"
            width="6"
            height="25"
            fill="#2F4F4F"
            stroke="#1C1C1C"
            strokeWidth="1"
            rx="2"
          />
          {/* Tail (small fluffy) */}
          <Circle cx="130" cy="120" r="8" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
        </Svg>
      );

    case 'extra-03-flower.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Stem */}
          <Line
            x1="100"
            y1="180"
            x2="100"
            y2="80"
            stroke="#228B22"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Leaves */}
          <Ellipse
            cx="85"
            cy="130"
            rx="15"
            ry="25"
            fill="#32CD32"
            stroke="#228B22"
            strokeWidth="2"
            transform="rotate(-30 85 130)"
          />
          <Ellipse
            cx="115"
            cy="150"
            rx="15"
            ry="25"
            fill="#32CD32"
            stroke="#228B22"
            strokeWidth="2"
            transform="rotate(30 115 150)"
          />
          {/* Flower Center */}
          <Circle cx="100" cy="60" r="15" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
          {/* Petals */}
          <Ellipse
            cx="100"
            cy="30"
            rx="12"
            ry="20"
            fill="#FF69B4"
            stroke="#FF1493"
            strokeWidth="2"
          />
          <Ellipse
            cx="130"
            cy="60"
            rx="20"
            ry="12"
            fill="#FF69B4"
            stroke="#FF1493"
            strokeWidth="2"
          />
          <Ellipse
            cx="100"
            cy="90"
            rx="12"
            ry="20"
            fill="#FF69B4"
            stroke="#FF1493"
            strokeWidth="2"
          />
          <Ellipse
            cx="70"
            cy="60"
            rx="20"
            ry="12"
            fill="#FF69B4"
            stroke="#FF1493"
            strokeWidth="2"
          />
          {/* Diagonal Petals */}
          <Ellipse
            cx="120"
            cy="40"
            rx="15"
            ry="18"
            fill="#FF69B4"
            stroke="#FF1493"
            strokeWidth="2"
            transform="rotate(45 120 40)"
          />
          <Ellipse
            cx="120"
            cy="80"
            rx="15"
            ry="18"
            fill="#FF69B4"
            stroke="#FF1493"
            strokeWidth="2"
            transform="rotate(-45 120 80)"
          />
          <Ellipse
            cx="80"
            cy="40"
            rx="15"
            ry="18"
            fill="#FF69B4"
            stroke="#FF1493"
            strokeWidth="2"
            transform="rotate(-45 80 40)"
          />
          <Ellipse
            cx="80"
            cy="80"
            rx="15"
            ry="18"
            fill="#FF69B4"
            stroke="#FF1493"
            strokeWidth="2"
            transform="rotate(45 80 80)"
          />
        </Svg>
      );

    case 'extra-04-bird.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Bird Body */}
          <Ellipse
            cx="100"
            cy="100"
            rx="35"
            ry="25"
            fill="#1E90FF"
            stroke="#0000CD"
            strokeWidth="3"
          />
          {/* Bird Head */}
          <Circle cx="130" cy="85" r="20" fill="#1E90FF" stroke="#0000CD" strokeWidth="3" />
          {/* Eye */}
          <Circle cx="135" cy="82" r="4" fill="#000000" />
          <Circle cx="137" cy="80" r="2" fill="#FFFFFF" />
          {/* Beak */}
          <Polygon points="150,85 165,82 150,90" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
          {/* Wing */}
          <Ellipse
            cx="90"
            cy="100"
            rx="30"
            ry="20"
            fill="#4169E1"
            stroke="#0000CD"
            strokeWidth="3"
            transform="rotate(-20 90 100)"
          />
          {/* Wing Detail Lines */}
          <Line x1="70" y1="95" x2="85" y2="105" stroke="#0000CD" strokeWidth="2" />
          <Line x1="75" y1="90" x2="90" y2="100" stroke="#0000CD" strokeWidth="2" />
          {/* Tail Feathers */}
          <Ellipse
            cx="60"
            cy="105"
            rx="20"
            ry="12"
            fill="#4169E1"
            stroke="#0000CD"
            strokeWidth="2"
            transform="rotate(-30 60 105)"
          />
          <Ellipse
            cx="65"
            cy="110"
            rx="18"
            ry="10"
            fill="#4169E1"
            stroke="#0000CD"
            strokeWidth="2"
            transform="rotate(-20 65 110)"
          />
          {/* Legs */}
          <Line
            x1="100"
            y1="120"
            x2="95"
            y2="135"
            stroke="#FFA500"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <Line
            x1="110"
            y1="120"
            x2="115"
            y2="135"
            stroke="#FFA500"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Feet */}
          <Line x1="90" y1="135" x2="95" y2="135" stroke="#FFA500" strokeWidth="2" />
          <Line x1="95" y1="135" x2="100" y2="135" stroke="#FFA500" strokeWidth="2" />
          <Line x1="110" y1="135" x2="115" y2="135" stroke="#FFA500" strokeWidth="2" />
          <Line x1="115" y1="135" x2="120" y2="135" stroke="#FFA500" strokeWidth="2" />
        </Svg>
      );

    case 'level-04-house.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox="0 0 200 240">
          {/* House body */}
          <Rect
            x="35"
            y="100"
            width="130"
            height="110"
            fill="#E74C3C"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Roof */}
          <Polygon points="30,100 100,25 170,100" fill="#8B4513" stroke="#000000" strokeWidth="2" />
          {/* Chimney */}
          <Rect
            x="135"
            y="45"
            width="20"
            height="40"
            fill="#A0522D"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Door */}
          <Rect
            x="80"
            y="150"
            width="40"
            height="60"
            fill="#654321"
            stroke="#000000"
            strokeWidth="2"
            rx="3"
          />
          {/* Door handle */}
          <Circle cx="113" cy="180" r="3" fill="#FFD700" />
          {/* Door arch */}
          <Path d="M 80 150 Q 100 135 120 150" fill="#654321" stroke="#000000" strokeWidth="2" />
          {/* Left window */}
          <Rect
            x="45"
            y="120"
            width="28"
            height="28"
            fill="#87CEEB"
            stroke="#000000"
            strokeWidth="2"
          />
          <Line x1="59" y1="120" x2="59" y2="148" stroke="#000000" strokeWidth="1.5" />
          <Line x1="45" y1="134" x2="73" y2="134" stroke="#000000" strokeWidth="1.5" />
          {/* Right window */}
          <Rect
            x="127"
            y="120"
            width="28"
            height="28"
            fill="#87CEEB"
            stroke="#000000"
            strokeWidth="2"
          />
          <Line x1="141" y1="120" x2="141" y2="148" stroke="#000000" strokeWidth="1.5" />
          <Line x1="127" y1="134" x2="155" y2="134" stroke="#000000" strokeWidth="1.5" />
          {/* Ground */}
          <Line x1="20" y1="210" x2="180" y2="210" stroke="#000000" strokeWidth="2" />
        </Svg>
      );

    case 'level-05-tree.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Trunk */}
          <Rect
            x="88"
            y="110"
            width="24"
            height="60"
            fill="#8B4513"
            stroke="#000000"
            strokeWidth="2"
            rx="2"
          />
          {/* Root bumps */}
          <Ellipse
            cx="92"
            cy="168"
            rx="10"
            ry="5"
            fill="#8B4513"
            stroke="#000000"
            strokeWidth="1.5"
          />
          <Ellipse
            cx="108"
            cy="168"
            rx="10"
            ry="5"
            fill="#8B4513"
            stroke="#000000"
            strokeWidth="1.5"
          />
          {/* Crown - bottom layer */}
          <Circle cx="100" cy="85" r="35" fill="#27AE60" stroke="#000000" strokeWidth="2" />
          {/* Crown - left */}
          <Circle cx="75" cy="90" r="25" fill="#27AE60" stroke="#000000" strokeWidth="2" />
          {/* Crown - right */}
          <Circle cx="125" cy="90" r="25" fill="#27AE60" stroke="#000000" strokeWidth="2" />
          {/* Crown - top */}
          <Circle cx="100" cy="60" r="28" fill="#2ECC71" stroke="#000000" strokeWidth="2" />
          {/* Crown highlights */}
          <Circle cx="85" cy="70" r="12" fill="#2ECC71" stroke="none" opacity="0.6" />
        </Svg>
      );

    case 'extra-02-car.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox="0 0 240 180">
          {/* Car body */}
          <Rect
            x="30"
            y="80"
            width="180"
            height="50"
            fill="#E74C3C"
            stroke="#000000"
            strokeWidth="2"
            rx="8"
          />
          {/* Car roof/cabin */}
          <Path
            d="M 70 80 L 85 45 L 165 45 L 180 80"
            fill="#E74C3C"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Windshield */}
          <Path
            d="M 88 48 L 78 78 L 115 78 L 115 48 Z"
            fill="#87CEEB"
            stroke="#000000"
            strokeWidth="1.5"
          />
          {/* Rear window */}
          <Path
            d="M 125 48 L 125 78 L 172 78 L 162 48 Z"
            fill="#87CEEB"
            stroke="#000000"
            strokeWidth="1.5"
          />
          {/* Front bumper */}
          <Rect
            x="195"
            y="90"
            width="20"
            height="30"
            fill="#C0392B"
            stroke="#000000"
            strokeWidth="2"
            rx="4"
          />
          {/* Rear bumper */}
          <Rect
            x="25"
            y="90"
            width="15"
            height="30"
            fill="#C0392B"
            stroke="#000000"
            strokeWidth="2"
            rx="4"
          />
          {/* Headlight */}
          <Circle cx="210" cy="100" r="6" fill="#FFD700" stroke="#000000" strokeWidth="1.5" />
          {/* Taillight */}
          <Circle cx="30" cy="100" r="5" fill="#FF4500" stroke="#000000" strokeWidth="1.5" />
          {/* Front wheel */}
          <Circle cx="170" cy="130" r="22" fill="#333333" stroke="#000000" strokeWidth="2" />
          <Circle cx="170" cy="130" r="12" fill="#808080" stroke="#000000" strokeWidth="1.5" />
          <Circle cx="170" cy="130" r="4" fill="#333333" />
          {/* Rear wheel */}
          <Circle cx="75" cy="130" r="22" fill="#333333" stroke="#000000" strokeWidth="2" />
          <Circle cx="75" cy="130" r="12" fill="#808080" stroke="#000000" strokeWidth="1.5" />
          <Circle cx="75" cy="130" r="4" fill="#333333" />
          {/* Door handle */}
          <Line
            x1="120"
            y1="95"
            x2="140"
            y2="95"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'level-09-fish.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Fish body */}
          <Ellipse
            cx="100"
            cy="100"
            rx="50"
            ry="30"
            fill="#FFA500"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Tail fin */}
          <Polygon
            points="150,100 180,75 180,125"
            fill="#FF6347"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Dorsal fin */}
          <Path d="M 80 70 Q 100 45 120 70" fill="#FF6347" stroke="#000000" strokeWidth="2" />
          {/* Bottom fin */}
          <Path d="M 90 130 Q 100 150 115 130" fill="#FF6347" stroke="#000000" strokeWidth="2" />
          {/* Eye */}
          <Circle cx="70" cy="95" r="8" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
          <Circle cx="72" cy="95" r="4" fill="#000000" />
          <Circle cx="73" cy="93" r="2" fill="#FFFFFF" />
          {/* Mouth */}
          <Path d="M 50 100 Q 55 105 50 110" stroke="#000000" strokeWidth="2" fill="none" />
          {/* Scales pattern */}
          <Path d="M 85 90 Q 95 85 105 90" stroke="#E8860C" strokeWidth="1.5" fill="none" />
          <Path d="M 95 100 Q 105 95 115 100" stroke="#E8860C" strokeWidth="1.5" fill="none" />
          <Path d="M 85 110 Q 95 105 105 110" stroke="#E8860C" strokeWidth="1.5" fill="none" />
          <Path d="M 105 90 Q 115 85 125 90" stroke="#E8860C" strokeWidth="1.5" fill="none" />
          <Path d="M 105 110 Q 115 105 125 110" stroke="#E8860C" strokeWidth="1.5" fill="none" />
          {/* Bubbles */}
          <Circle cx="42" cy="85" r="4" fill="none" stroke="#87CEEB" strokeWidth="1.5" />
          <Circle cx="35" cy="75" r="3" fill="none" stroke="#87CEEB" strokeWidth="1.5" />
        </Svg>
      );

    case 'level-10-butterfly.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Body */}
          <Ellipse cx="100" cy="100" rx="5" ry="35" fill="#000000" />
          {/* Head */}
          <Circle cx="100" cy="60" r="8" fill="#000000" />
          {/* Antennae */}
          <Path
            d="M 96 55 Q 80 35 75 30"
            stroke="#000000"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <Circle cx="75" cy="30" r="3" fill="#000000" />
          <Path
            d="M 104 55 Q 120 35 125 30"
            stroke="#000000"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <Circle cx="125" cy="30" r="3" fill="#000000" />
          {/* Upper left wing */}
          <Ellipse
            cx="65"
            cy="80"
            rx="35"
            ry="28"
            fill="#9B59B6"
            stroke="#000000"
            strokeWidth="2"
            transform="rotate(-20 65 80)"
          />
          <Ellipse
            cx="60"
            cy="78"
            rx="15"
            ry="12"
            fill="#FF69B4"
            stroke="none"
            opacity="0.7"
            transform="rotate(-20 60 78)"
          />
          <Circle cx="55" cy="75" r="5" fill="#FFD700" stroke="none" opacity="0.8" />
          {/* Upper right wing */}
          <Ellipse
            cx="135"
            cy="80"
            rx="35"
            ry="28"
            fill="#9B59B6"
            stroke="#000000"
            strokeWidth="2"
            transform="rotate(20 135 80)"
          />
          <Ellipse
            cx="140"
            cy="78"
            rx="15"
            ry="12"
            fill="#FF69B4"
            stroke="none"
            opacity="0.7"
            transform="rotate(20 140 78)"
          />
          <Circle cx="145" cy="75" r="5" fill="#FFD700" stroke="none" opacity="0.8" />
          {/* Lower left wing */}
          <Ellipse
            cx="70"
            cy="115"
            rx="28"
            ry="22"
            fill="#BB6BD9"
            stroke="#000000"
            strokeWidth="2"
            transform="rotate(15 70 115)"
          />
          <Ellipse
            cx="65"
            cy="115"
            rx="12"
            ry="10"
            fill="#FFFFFF"
            stroke="none"
            opacity="0.4"
            transform="rotate(15 65 115)"
          />
          {/* Lower right wing */}
          <Ellipse
            cx="130"
            cy="115"
            rx="28"
            ry="22"
            fill="#BB6BD9"
            stroke="#000000"
            strokeWidth="2"
            transform="rotate(-15 130 115)"
          />
          <Ellipse
            cx="135"
            cy="115"
            rx="12"
            ry="10"
            fill="#FFFFFF"
            stroke="none"
            opacity="0.4"
            transform="rotate(-15 135 115)"
          />
        </Svg>
      );

    case 'level-11-cat-simple.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Head */}
          <Circle cx="100" cy="85" r="38" fill="#FFA500" stroke="#000000" strokeWidth="2" />
          {/* Left ear */}
          <Polygon points="72,55 65,25 88,52" fill="#FFA500" stroke="#000000" strokeWidth="2" />
          {/* Right ear */}
          <Polygon points="128,55 135,25 112,52" fill="#FFA500" stroke="#000000" strokeWidth="2" />
          {/* Left eye */}
          <Circle cx="88" cy="80" r="6" fill="#000000" />
          {/* Right eye */}
          <Circle cx="112" cy="80" r="6" fill="#000000" />
          {/* Nose */}
          <Polygon points="100,92 95,100 105,100" fill="#FFB6C1" />
          {/* Body */}
          <Ellipse
            cx="100"
            cy="145"
            rx="35"
            ry="30"
            fill="#FFA500"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Tail */}
          <Path
            d="M 130 155 Q 165 145 160 115"
            stroke="#FFA500"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          {/* Left whisker 1 */}
          <Line x1="55" y1="88" x2="88" y2="92" stroke="#000000" strokeWidth="1.5" />
          {/* Left whisker 2 */}
          <Line x1="55" y1="96" x2="88" y2="97" stroke="#000000" strokeWidth="1.5" />
          {/* Right whisker 1 */}
          <Line x1="145" y1="88" x2="112" y2="92" stroke="#000000" strokeWidth="1.5" />
        </Svg>
      );

    case 'level-12-dog-simple.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Body */}
          <Ellipse
            cx="105"
            cy="130"
            rx="45"
            ry="28"
            fill="#D2691E"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Head */}
          <Circle cx="65" cy="95" r="30" fill="#D2691E" stroke="#000000" strokeWidth="2" />
          {/* Floppy ear */}
          <Ellipse
            cx="52"
            cy="82"
            rx="13"
            ry="26"
            fill="#A0522D"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Snout */}
          <Ellipse
            cx="46"
            cy="102"
            rx="16"
            ry="12"
            fill="#CD853F"
            stroke="#000000"
            strokeWidth="1.5"
          />
          {/* Nose */}
          <Circle cx="43" cy="100" r="5" fill="#000000" />
          {/* Eye */}
          <Circle cx="68" cy="90" r="5" fill="#000000" />
          {/* Front left leg */}
          <Rect
            x="85"
            y="148"
            width="10"
            height="28"
            fill="#D2691E"
            stroke="#000000"
            strokeWidth="2"
            rx="3"
          />
          {/* Front right leg */}
          <Rect
            x="108"
            y="148"
            width="10"
            height="28"
            fill="#D2691E"
            stroke="#000000"
            strokeWidth="2"
            rx="3"
          />
          {/* Tail */}
          <Path
            d="M 148 118 Q 172 105 168 82"
            stroke="#A0522D"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'level-13-bird-simple.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Body */}
          <Ellipse
            cx="100"
            cy="110"
            rx="38"
            ry="25"
            fill="#1E90FF"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Head */}
          <Circle cx="130" cy="88" r="22" fill="#1E90FF" stroke="#000000" strokeWidth="2" />
          {/* Beak */}
          <Polygon
            points="152,88 170,84 152,94"
            fill="#FFD700"
            stroke="#000000"
            strokeWidth="1.5"
          />
          {/* Eye */}
          <Circle cx="136" cy="84" r="4" fill="#000000" />
          {/* Wing */}
          <Ellipse
            cx="88"
            cy="105"
            rx="30"
            ry="18"
            fill="#4169E1"
            stroke="#000000"
            strokeWidth="2"
            transform="rotate(-15 88 105)"
          />
          {/* Tail */}
          <Polygon points="62,110 38,100 38,120" fill="#4169E1" stroke="#000000" strokeWidth="2" />
          {/* Left leg */}
          <Line
            x1="95"
            y1="133"
            x2="90"
            y2="152"
            stroke="#FFD700"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Right leg */}
          <Line
            x1="108"
            y1="133"
            x2="113"
            y2="152"
            stroke="#FFD700"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'level-14-car-v2.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox="0 0 240 180">
          {/* Car body */}
          <Rect
            x="25"
            y="80"
            width="190"
            height="55"
            fill="#2ECC71"
            stroke="#000000"
            strokeWidth="2"
            rx="8"
          />
          {/* Roof */}
          <Path
            d="M 65 80 L 80 42 L 170 42 L 185 80"
            fill="#27AE60"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Windshield */}
          <Path
            d="M 83 45 L 73 78 L 118 78 L 118 45 Z"
            fill="#87CEEB"
            stroke="#000000"
            strokeWidth="1.5"
          />
          {/* Rear window */}
          <Path
            d="M 122 45 L 122 78 L 167 78 L 157 45 Z"
            fill="#87CEEB"
            stroke="#000000"
            strokeWidth="1.5"
          />
          {/* Front bumper */}
          <Rect
            x="200"
            y="92"
            width="18"
            height="28"
            fill="#1E8449"
            stroke="#000000"
            strokeWidth="2"
            rx="4"
          />
          {/* Rear bumper */}
          <Rect
            x="22"
            y="92"
            width="14"
            height="28"
            fill="#1E8449"
            stroke="#000000"
            strokeWidth="2"
            rx="4"
          />
          {/* Headlight */}
          <Circle cx="213" cy="103" r="6" fill="#FFD700" stroke="#000000" strokeWidth="1.5" />
          {/* Taillight */}
          <Circle cx="28" cy="103" r="5" fill="#E74C3C" stroke="#000000" strokeWidth="1.5" />
          {/* Front wheel */}
          <Circle cx="172" cy="133" r="22" fill="#333333" stroke="#000000" strokeWidth="2" />
          <Circle cx="172" cy="133" r="12" fill="#808080" stroke="#000000" strokeWidth="1.5" />
          <Circle cx="172" cy="133" r="4" fill="#333333" />
          {/* Rear wheel */}
          <Circle cx="68" cy="133" r="22" fill="#333333" stroke="#000000" strokeWidth="2" />
          <Circle cx="68" cy="133" r="12" fill="#808080" stroke="#000000" strokeWidth="1.5" />
          <Circle cx="68" cy="133" r="4" fill="#333333" />
          {/* Door line */}
          <Line x1="125" y1="82" x2="125" y2="132" stroke="#000000" strokeWidth="1.5" />
          {/* Door handle front */}
          <Line
            x1="148"
            y1="100"
            x2="165"
            y2="100"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Door handle rear */}
          <Line
            x1="80"
            y1="100"
            x2="97"
            y2="100"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Exhaust */}
          <Rect
            x="22"
            y="125"
            width="12"
            height="5"
            fill="#888888"
            stroke="#000000"
            strokeWidth="1"
            rx="2"
          />
        </Svg>
      );

    case 'level-15-train.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox="0 0 280 200">
          {/* Main body */}
          <Rect
            x="20"
            y="70"
            width="200"
            height="80"
            fill="#E74C3C"
            stroke="#000000"
            strokeWidth="2"
            rx="10"
          />
          {/* Locomotive front */}
          <Rect
            x="200"
            y="80"
            width="45"
            height="60"
            fill="#C0392B"
            stroke="#000000"
            strokeWidth="2"
            rx="6"
          />
          {/* Chimney */}
          <Rect
            x="215"
            y="55"
            width="16"
            height="28"
            fill="#333333"
            stroke="#000000"
            strokeWidth="2"
            rx="3"
          />
          {/* Steam */}
          <Circle
            cx="215"
            cy="50"
            r="8"
            fill="#DDDDDD"
            stroke="#AAAAAA"
            strokeWidth="1"
            opacity="0.8"
          />
          {/* Window 1 */}
          <Rect
            x="35"
            y="82"
            width="35"
            height="28"
            fill="#87CEEB"
            stroke="#000000"
            strokeWidth="2"
            rx="3"
          />
          {/* Window 2 */}
          <Rect
            x="85"
            y="82"
            width="35"
            height="28"
            fill="#87CEEB"
            stroke="#000000"
            strokeWidth="2"
            rx="3"
          />
          {/* Window 3 */}
          <Rect
            x="135"
            y="82"
            width="35"
            height="28"
            fill="#87CEEB"
            stroke="#000000"
            strokeWidth="2"
            rx="3"
          />
          {/* Front window */}
          <Rect
            x="210"
            y="88"
            width="25"
            height="22"
            fill="#87CEEB"
            stroke="#000000"
            strokeWidth="2"
            rx="3"
          />
          {/* Wheels */}
          <Circle cx="55" cy="148" r="18" fill="#333333" stroke="#000000" strokeWidth="2" />
          <Circle cx="55" cy="148" r="9" fill="#808080" />
          <Circle cx="120" cy="148" r="18" fill="#333333" stroke="#000000" strokeWidth="2" />
          <Circle cx="120" cy="148" r="9" fill="#808080" />
          <Circle cx="185" cy="148" r="18" fill="#333333" stroke="#000000" strokeWidth="2" />
          <Circle cx="185" cy="148" r="9" fill="#808080" />
          <Circle cx="230" cy="148" r="14" fill="#333333" stroke="#000000" strokeWidth="2" />
          <Circle cx="230" cy="148" r="7" fill="#808080" />
          {/* Rail */}
          <Line
            x1="10"
            y1="165"
            x2="270"
            y2="165"
            stroke="#555555"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Headlight */}
          <Circle cx="242" cy="110" r="7" fill="#FFD700" stroke="#000000" strokeWidth="1.5" />
        </Svg>
      );

    case 'level-16-bicycle.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox="0 0 240 200">
          {/* Rear wheel */}
          <Circle cx="65" cy="130" r="48" fill="none" stroke="#333333" strokeWidth="5" />
          <Circle cx="65" cy="130" r="5" fill="#333333" />
          {/* Rear spokes */}
          <Line x1="65" y1="82" x2="65" y2="178" stroke="#888888" strokeWidth="1.5" />
          <Line x1="17" y1="130" x2="113" y2="130" stroke="#888888" strokeWidth="1.5" />
          <Line x1="31" y1="96" x2="99" y2="164" stroke="#888888" strokeWidth="1.5" />
          <Line x1="99" y1="96" x2="31" y2="164" stroke="#888888" strokeWidth="1.5" />
          {/* Front wheel */}
          <Circle cx="178" cy="130" r="48" fill="none" stroke="#333333" strokeWidth="5" />
          <Circle cx="178" cy="130" r="5" fill="#333333" />
          {/* Front spokes */}
          <Line x1="178" y1="82" x2="178" y2="178" stroke="#888888" strokeWidth="1.5" />
          <Line x1="130" y1="130" x2="226" y2="130" stroke="#888888" strokeWidth="1.5" />
          <Line x1="144" y1="96" x2="212" y2="164" stroke="#888888" strokeWidth="1.5" />
          <Line x1="212" y1="96" x2="144" y2="164" stroke="#888888" strokeWidth="1.5" />
          {/* Frame */}
          <Line
            x1="65"
            y1="130"
            x2="115"
            y2="75"
            stroke="#E74C3C"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <Line
            x1="115"
            y1="75"
            x2="178"
            y2="130"
            stroke="#E74C3C"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <Line
            x1="115"
            y1="75"
            x2="140"
            y2="130"
            stroke="#E74C3C"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <Line
            x1="65"
            y1="130"
            x2="140"
            y2="130"
            stroke="#E74C3C"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Seat post */}
          <Line
            x1="115"
            y1="75"
            x2="105"
            y2="50"
            stroke="#333333"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Seat */}
          <Ellipse
            cx="100"
            cy="48"
            rx="18"
            ry="6"
            fill="#333333"
            stroke="#000000"
            strokeWidth="1.5"
          />
          {/* Handlebar stem */}
          <Line
            x1="140"
            y1="130"
            x2="148"
            y2="60"
            stroke="#333333"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Handlebar */}
          <Line
            x1="135"
            y1="60"
            x2="165"
            y2="60"
            stroke="#333333"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Pedal crank */}
          <Circle cx="140" cy="130" r="10" fill="#888888" stroke="#333333" strokeWidth="2" />
          {/* Pedals */}
          <Line
            x1="130"
            y1="140"
            x2="118"
            y2="148"
            stroke="#333333"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <Line
            x1="150"
            y1="120"
            x2="162"
            y2="112"
            stroke="#333333"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'level-17-tree-detailed.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Trunk */}
          <Rect
            x="86"
            y="115"
            width="28"
            height="65"
            fill="#8B4513"
            stroke="#000000"
            strokeWidth="2"
            rx="3"
          />
          {/* Trunk texture */}
          <Line x1="92" y1="120" x2="90" y2="175" stroke="#6B3410" strokeWidth="1.5" />
          <Line x1="108" y1="120" x2="110" y2="175" stroke="#6B3410" strokeWidth="1.5" />
          {/* Roots */}
          <Ellipse
            cx="90"
            cy="178"
            rx="12"
            ry="5"
            fill="#8B4513"
            stroke="#000000"
            strokeWidth="1.5"
          />
          <Ellipse
            cx="110"
            cy="178"
            rx="12"
            ry="5"
            fill="#8B4513"
            stroke="#000000"
            strokeWidth="1.5"
          />
          {/* Bottom crown layer */}
          <Circle cx="100" cy="92" r="42" fill="#27AE60" stroke="#000000" strokeWidth="2" />
          {/* Left crown */}
          <Circle cx="68" cy="98" r="28" fill="#27AE60" stroke="#000000" strokeWidth="2" />
          {/* Right crown */}
          <Circle cx="132" cy="98" r="28" fill="#27AE60" stroke="#000000" strokeWidth="2" />
          {/* Top crown */}
          <Circle cx="100" cy="62" r="32" fill="#2ECC71" stroke="#000000" strokeWidth="2" />
          {/* Highlight */}
          <Circle cx="82" cy="68" r="14" fill="#2ECC71" stroke="none" opacity="0.6" />
          {/* Small branches */}
          <Line
            x1="100"
            y1="115"
            x2="75"
            y2="100"
            stroke="#8B4513"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <Line
            x1="100"
            y1="115"
            x2="125"
            y2="100"
            stroke="#8B4513"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Apple */}
          <Circle cx="125" cy="88" r="7" fill="#E74C3C" stroke="#000000" strokeWidth="1.5" />
          {/* Apple stem */}
          <Line
            x1="125"
            y1="81"
            x2="127"
            y2="75"
            stroke="#8B4513"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'level-18-flower-detailed.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Pot */}
          <Polygon
            points="75,185 125,185 118,160 82,160"
            fill="#8B4513"
            stroke="#000000"
            strokeWidth="2"
          />
          <Rect
            x="72"
            y="182"
            width="56"
            height="8"
            fill="#A0522D"
            stroke="#000000"
            strokeWidth="2"
            rx="2"
          />
          {/* Soil */}
          <Ellipse cx="100" cy="160" rx="18" ry="5" fill="#5D3A1A" />
          {/* Stem */}
          <Path
            d="M 100 158 Q 95 130 100 80"
            stroke="#27AE60"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Left leaf */}
          <Ellipse
            cx="80"
            cy="125"
            rx="18"
            ry="28"
            fill="#32CD32"
            stroke="#27AE60"
            strokeWidth="2"
            transform="rotate(-35 80 125)"
          />
          {/* Right leaf */}
          <Ellipse
            cx="120"
            cy="105"
            rx="18"
            ry="28"
            fill="#32CD32"
            stroke="#27AE60"
            strokeWidth="2"
            transform="rotate(35 120 105)"
          />
          {/* Flower center */}
          <Circle cx="100" cy="58" r="16" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
          {/* Petals top/bottom */}
          <Ellipse
            cx="100"
            cy="27"
            rx="11"
            ry="20"
            fill="#FF69B4"
            stroke="#FF1493"
            strokeWidth="1.5"
          />
          <Ellipse
            cx="100"
            cy="89"
            rx="11"
            ry="20"
            fill="#FF69B4"
            stroke="#FF1493"
            strokeWidth="1.5"
          />
          {/* Petals left/right */}
          <Ellipse
            cx="69"
            cy="58"
            rx="20"
            ry="11"
            fill="#FF69B4"
            stroke="#FF1493"
            strokeWidth="1.5"
          />
          <Ellipse
            cx="131"
            cy="58"
            rx="20"
            ry="11"
            fill="#FF69B4"
            stroke="#FF1493"
            strokeWidth="1.5"
          />
          {/* Diagonal petals */}
          <Ellipse
            cx="79"
            cy="37"
            rx="13"
            ry="18"
            fill="#FF85C1"
            stroke="#FF1493"
            strokeWidth="1.5"
            transform="rotate(-45 79 37)"
          />
          <Ellipse
            cx="121"
            cy="37"
            rx="13"
            ry="18"
            fill="#FF85C1"
            stroke="#FF1493"
            strokeWidth="1.5"
            transform="rotate(45 121 37)"
          />
          <Ellipse
            cx="79"
            cy="79"
            rx="13"
            ry="18"
            fill="#FF85C1"
            stroke="#FF1493"
            strokeWidth="1.5"
            transform="rotate(45 79 79)"
          />
          <Ellipse
            cx="121"
            cy="79"
            rx="13"
            ry="18"
            fill="#FF85C1"
            stroke="#FF1493"
            strokeWidth="1.5"
            transform="rotate(-45 121 79)"
          />
          {/* Center dot */}
          <Circle cx="100" cy="58" r="6" fill="#FFA500" stroke="#000000" strokeWidth="1" />
        </Svg>
      );

    case 'level-19-fish-tropical.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Fish body */}
          <Ellipse
            cx="105"
            cy="100"
            rx="52"
            ry="35"
            fill="#FF6347"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Tail fin */}
          <Polygon
            points="157,100 185,72 185,128"
            fill="#FFD700"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Dorsal fin */}
          <Path d="M 88 65 Q 105 42 125 65" fill="#FFD700" stroke="#000000" strokeWidth="2" />
          {/* Pectoral fin */}
          <Ellipse
            cx="115"
            cy="118"
            rx="18"
            ry="10"
            fill="#FFD700"
            stroke="#000000"
            strokeWidth="2"
            transform="rotate(30 115 118)"
          />
          {/* Eye ring */}
          <Circle cx="72" cy="92" r="12" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
          {/* Eye */}
          <Circle cx="74" cy="92" r="6" fill="#000000" />
          <Circle cx="76" cy="90" r="2" fill="#FFFFFF" />
          {/* Mouth */}
          <Path d="M 53 100 Q 57 106 53 112" stroke="#000000" strokeWidth="2" fill="none" />
          {/* Stripe 1 */}
          <Path
            d="M 90 65 Q 88 100 90 135"
            stroke="#FFFFFF"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Stripe 2 */}
          <Path
            d="M 110 65 Q 108 100 110 135"
            stroke="#FFFFFF"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Stripe 3 */}
          <Path
            d="M 130 68 Q 128 100 130 132"
            stroke="#FFFFFF"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Bubbles */}
          <Circle cx="45" cy="82" r="5" fill="none" stroke="#87CEEB" strokeWidth="1.5" />
          <Circle cx="37" cy="68" r="4" fill="none" stroke="#87CEEB" strokeWidth="1.5" />
          <Circle cx="30" cy="56" r="3" fill="none" stroke="#87CEEB" strokeWidth="1.5" />
          {/* Scale pattern */}
          <Path d="M 92 86 Q 105 80 118 86" stroke="#CC3333" strokeWidth="1.5" fill="none" />
          <Path d="M 98 100 Q 112 94 126 100" stroke="#CC3333" strokeWidth="1.5" fill="none" />
          <Path d="M 92 114 Q 105 108 118 114" stroke="#CC3333" strokeWidth="1.5" fill="none" />
        </Svg>
      );

    case 'level-20-house-detailed.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox="0 0 220 240">
          {/* Sky / background */}
          <Rect width="220" height="240" fill="#E8F4F8" />
          {/* House body */}
          <Rect
            x="40"
            y="100"
            width="130"
            height="115"
            fill="#E74C3C"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Roof */}
          <Polygon points="30,100 110,28 190,100" fill="#8B4513" stroke="#000000" strokeWidth="2" />
          {/* Chimney */}
          <Rect
            x="148"
            y="48"
            width="18"
            height="38"
            fill="#A0522D"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Door */}
          <Rect
            x="88"
            y="148"
            width="34"
            height="55"
            fill="#654321"
            stroke="#000000"
            strokeWidth="2"
            rx="3"
          />
          {/* Door arch */}
          <Path d="M 88 148 Q 105 132 122 148" fill="#654321" stroke="#000000" strokeWidth="2" />
          {/* Door handle */}
          <Circle cx="116" cy="175" r="3" fill="#FFD700" />
          {/* Left window */}
          <Rect
            x="52"
            y="118"
            width="30"
            height="28"
            fill="#87CEEB"
            stroke="#000000"
            strokeWidth="2"
            rx="2"
          />
          <Line x1="67" y1="118" x2="67" y2="146" stroke="#000000" strokeWidth="1.5" />
          <Line x1="52" y1="132" x2="82" y2="132" stroke="#000000" strokeWidth="1.5" />
          {/* Right window */}
          <Rect
            x="138"
            y="118"
            width="30"
            height="28"
            fill="#87CEEB"
            stroke="#000000"
            strokeWidth="2"
            rx="2"
          />
          <Line x1="153" y1="118" x2="153" y2="146" stroke="#000000" strokeWidth="1.5" />
          <Line x1="138" y1="132" x2="168" y2="132" stroke="#000000" strokeWidth="1.5" />
          {/* Ground */}
          <Rect x="0" y="214" width="220" height="26" fill="#27AE60" />
          {/* Path */}
          <Polygon
            points="88,215 122,215 130,238 80,238"
            fill="#F0D080"
            stroke="#000000"
            strokeWidth="1"
          />
          {/* Left tree */}
          <Rect
            x="16"
            y="165"
            width="8"
            height="30"
            fill="#8B4513"
            stroke="#000000"
            strokeWidth="1.5"
          />
          <Circle cx="20" cy="152" r="18" fill="#27AE60" stroke="#000000" strokeWidth="1.5" />
          {/* Right bush */}
          <Circle cx="188" cy="200" r="14" fill="#2ECC71" stroke="#000000" strokeWidth="1.5" />
          <Circle cx="200" cy="205" r="10" fill="#27AE60" stroke="#000000" strokeWidth="1.5" />
          {/* Fence left */}
          <Line x1="0" y1="215" x2="75" y2="215" stroke="#8B4513" strokeWidth="3" />
          <Line
            x1="10"
            y1="205"
            x2="10"
            y2="215"
            stroke="#8B4513"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <Line
            x1="25"
            y1="205"
            x2="25"
            y2="215"
            stroke="#8B4513"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <Line
            x1="40"
            y1="205"
            x2="40"
            y2="215"
            stroke="#8B4513"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <Line
            x1="55"
            y1="205"
            x2="55"
            y2="215"
            stroke="#8B4513"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <Line
            x1="70"
            y1="205"
            x2="70"
            y2="215"
            stroke="#8B4513"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </Svg>
      );

    // ── Tiere v1 Pack ──────────────────────────────────────────────────────

    case 'tiere-01-frog.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Body */}
          <Ellipse
            cx="100"
            cy="118"
            rx="55"
            ry="42"
            fill="#4CAF50"
            stroke="#2E7D32"
            strokeWidth="2"
          />
          {/* Left eye dome */}
          <Circle cx="76" cy="78" r="18" fill="#66BB6A" stroke="#2E7D32" strokeWidth="2" />
          {/* Right eye dome */}
          <Circle cx="124" cy="78" r="18" fill="#66BB6A" stroke="#2E7D32" strokeWidth="2" />
          {/* Left pupil */}
          <Circle cx="76" cy="75" r="9" fill="#1A1A1A" />
          {/* Right pupil */}
          <Circle cx="124" cy="75" r="9" fill="#1A1A1A" />
          {/* Left eye shine */}
          <Circle cx="79" cy="73" r="3" fill="#FFFFFF" />
          {/* Right eye shine */}
          <Circle cx="127" cy="73" r="3" fill="#FFFFFF" />
          {/* Smile */}
          <Path
            d="M 78 105 Q 100 118 122 105"
            stroke="#2E7D32"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Left back leg */}
          <Ellipse
            cx="52"
            cy="152"
            rx="22"
            ry="13"
            fill="#4CAF50"
            stroke="#2E7D32"
            strokeWidth="2"
            transform="rotate(-25 52 152)"
          />
          {/* Right back leg */}
          <Ellipse
            cx="148"
            cy="152"
            rx="22"
            ry="13"
            fill="#4CAF50"
            stroke="#2E7D32"
            strokeWidth="2"
            transform="rotate(25 148 152)"
          />
        </Svg>
      );

    case 'tiere-02-rabbit.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Body */}
          <Ellipse
            cx="100"
            cy="130"
            rx="38"
            ry="44"
            fill="#F5F5F5"
            stroke="#BDBDBD"
            strokeWidth="2"
          />
          {/* Head */}
          <Circle cx="100" cy="82" r="28" fill="#F5F5F5" stroke="#BDBDBD" strokeWidth="2" />
          {/* Left ear outer */}
          <Ellipse
            cx="80"
            cy="38"
            rx="12"
            ry="30"
            fill="#F5F5F5"
            stroke="#BDBDBD"
            strokeWidth="2"
          />
          {/* Left ear inner */}
          <Ellipse cx="80" cy="38" rx="6" ry="20" fill="#FFB6C1" stroke="none" />
          {/* Right ear outer */}
          <Ellipse
            cx="120"
            cy="38"
            rx="12"
            ry="30"
            fill="#F5F5F5"
            stroke="#BDBDBD"
            strokeWidth="2"
          />
          {/* Right ear inner */}
          <Ellipse cx="120" cy="38" rx="6" ry="20" fill="#FFB6C1" stroke="none" />
          {/* Left eye */}
          <Circle cx="90" cy="77" r="5" fill="#1A1A1A" />
          {/* Right eye */}
          <Circle cx="110" cy="77" r="5" fill="#1A1A1A" />
          {/* Nose */}
          <Circle cx="100" cy="90" r="5" fill="#FFB6C1" />
          {/* Mouth */}
          <Path d="M 90 96 Q 100 102 110 96" stroke="#BDBDBD" strokeWidth="1.5" fill="none" />
          {/* Fluffy tail */}
          <Circle cx="100" cy="155" r="9" fill="#F5F5F5" stroke="#BDBDBD" strokeWidth="1.5" />
        </Svg>
      );

    case 'tiere-03-duck.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Body */}
          <Ellipse
            cx="95"
            cy="120"
            rx="48"
            ry="38"
            fill="#FFD700"
            stroke="#FF8C00"
            strokeWidth="2"
          />
          {/* Head */}
          <Circle cx="125" cy="78" r="26" fill="#FFD700" stroke="#FF8C00" strokeWidth="2" />
          {/* Beak */}
          <Polygon
            points="151,75 175,70 151,84"
            fill="#FF8C00"
            stroke="#CC6600"
            strokeWidth="1.5"
          />
          {/* Eye */}
          <Circle cx="130" cy="73" r="5" fill="#1A1A1A" />
          {/* Eye shine */}
          <Circle cx="132" cy="71" r="2" fill="#FFFFFF" />
          {/* Wing */}
          <Ellipse
            cx="75"
            cy="115"
            rx="32"
            ry="20"
            fill="#F9A825"
            stroke="#FF8C00"
            strokeWidth="2"
            transform="rotate(-15 75 115)"
          />
          {/* Tail feather */}
          <Polygon points="47,118 22,108 22,128" fill="#F9A825" stroke="#FF8C00" strokeWidth="2" />
          {/* Left foot */}
          <Line
            x1="90"
            y1="155"
            x2="80"
            y2="172"
            stroke="#FF8C00"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Right foot */}
          <Line
            x1="110"
            y1="155"
            x2="120"
            y2="172"
            stroke="#FF8C00"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Webbed feet base */}
          <Ellipse
            cx="100"
            cy="175"
            rx="20"
            ry="6"
            fill="#FF8C00"
            stroke="#CC6600"
            strokeWidth="1.5"
          />
        </Svg>
      );

    case 'tiere-04-owl.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Body */}
          <Ellipse
            cx="100"
            cy="120"
            rx="45"
            ry="55"
            fill="#795548"
            stroke="#4E342E"
            strokeWidth="2"
          />
          {/* Head */}
          <Circle cx="100" cy="72" r="38" fill="#8D6E63" stroke="#4E342E" strokeWidth="2" />
          {/* Left ear tuft */}
          <Polygon points="78,38 70,15 90,42" fill="#795548" stroke="#4E342E" strokeWidth="2" />
          {/* Right ear tuft */}
          <Polygon points="122,38 130,15 110,42" fill="#795548" stroke="#4E342E" strokeWidth="2" />
          {/* Left eye ring */}
          <Circle cx="86" cy="72" r="14" fill="#FFFFFF" stroke="#4E342E" strokeWidth="1.5" />
          {/* Right eye ring */}
          <Circle cx="114" cy="72" r="14" fill="#FFFFFF" stroke="#4E342E" strokeWidth="1.5" />
          {/* Left pupil */}
          <Circle cx="86" cy="73" r="8" fill="#1A1A1A" />
          {/* Right pupil */}
          <Circle cx="114" cy="73" r="8" fill="#1A1A1A" />
          {/* Beak */}
          <Polygon points="100,83 93,93 107,93" fill="#FFD700" stroke="#E65100" strokeWidth="1.5" />
          {/* Belly patch */}
          <Ellipse
            cx="100"
            cy="128"
            rx="28"
            ry="36"
            fill="#D7CCC8"
            stroke="#A1887F"
            strokeWidth="1.5"
          />
          {/* Left talon */}
          <Line
            x1="78"
            y1="168"
            x2="68"
            y2="182"
            stroke="#4E342E"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Right talon */}
          <Line
            x1="122"
            y1="168"
            x2="132"
            y2="182"
            stroke="#4E342E"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'tiere-05-bear.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Body */}
          <Ellipse
            cx="100"
            cy="132"
            rx="50"
            ry="46"
            fill="#795548"
            stroke="#4E342E"
            strokeWidth="2"
          />
          {/* Head */}
          <Circle cx="100" cy="76" r="35" fill="#795548" stroke="#4E342E" strokeWidth="2" />
          {/* Left ear outer */}
          <Circle cx="70" cy="48" r="16" fill="#795548" stroke="#4E342E" strokeWidth="2" />
          {/* Left ear inner */}
          <Circle cx="70" cy="48" r="10" fill="#A1887F" stroke="none" />
          {/* Right ear outer */}
          <Circle cx="130" cy="48" r="16" fill="#795548" stroke="#4E342E" strokeWidth="2" />
          {/* Right ear inner */}
          <Circle cx="130" cy="48" r="10" fill="#A1887F" stroke="none" />
          {/* Muzzle */}
          <Ellipse
            cx="100"
            cy="88"
            rx="18"
            ry="14"
            fill="#A1887F"
            stroke="#6D4C41"
            strokeWidth="1.5"
          />
          {/* Left eye */}
          <Circle cx="88" cy="68" r="5" fill="#1A1A1A" />
          {/* Right eye */}
          <Circle cx="112" cy="68" r="5" fill="#1A1A1A" />
          {/* Nose */}
          <Circle cx="100" cy="84" r="5" fill="#1A1A1A" />
          {/* Smile */}
          <Path
            d="M 88 93 Q 100 100 112 93"
            stroke="#4E342E"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'tiere-06-penguin.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Body */}
          <Ellipse
            cx="100"
            cy="118"
            rx="45"
            ry="60"
            fill="#212121"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Head */}
          <Circle cx="100" cy="65" r="30" fill="#212121" stroke="#000000" strokeWidth="2" />
          {/* White belly */}
          <Ellipse cx="100" cy="118" rx="28" ry="44" fill="#FFFFFF" stroke="none" />
          {/* White face */}
          <Ellipse cx="100" cy="68" rx="18" ry="20" fill="#FFFFFF" stroke="none" />
          {/* Left eye */}
          <Circle cx="90" cy="60" r="5" fill="#1A1A1A" />
          {/* Right eye */}
          <Circle cx="110" cy="60" r="5" fill="#1A1A1A" />
          {/* Left eye shine */}
          <Circle cx="92" cy="58" r="2" fill="#FFFFFF" />
          {/* Right eye shine */}
          <Circle cx="112" cy="58" r="2" fill="#FFFFFF" />
          {/* Beak */}
          <Polygon points="100,72 92,80 108,80" fill="#FF9800" stroke="#E65100" strokeWidth="1.5" />
          {/* Left wing */}
          <Ellipse
            cx="53"
            cy="118"
            rx="18"
            ry="35"
            fill="#212121"
            stroke="#000000"
            strokeWidth="1.5"
            transform="rotate(10 53 118)"
          />
          {/* Right wing */}
          <Ellipse
            cx="147"
            cy="118"
            rx="18"
            ry="35"
            fill="#212121"
            stroke="#000000"
            strokeWidth="1.5"
            transform="rotate(-10 147 118)"
          />
          {/* Feet */}
          <Ellipse
            cx="100"
            cy="178"
            rx="25"
            ry="8"
            fill="#FF9800"
            stroke="#E65100"
            strokeWidth="1.5"
          />
        </Svg>
      );

    case 'tiere-07-snail.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Body/foot */}
          <Ellipse
            cx="78"
            cy="148"
            rx="65"
            ry="24"
            fill="#66BB6A"
            stroke="#388E3C"
            strokeWidth="2"
          />
          {/* Head */}
          <Circle cx="48" cy="136" r="16" fill="#66BB6A" stroke="#388E3C" strokeWidth="2" />
          {/* Left antennae */}
          <Line
            x1="42"
            y1="122"
            x2="34"
            y2="100"
            stroke="#388E3C"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Left antennae tip */}
          <Circle cx="34" cy="98" r="4" fill="#1A1A1A" />
          {/* Right antennae */}
          <Line
            x1="54"
            y1="122"
            x2="62"
            y2="100"
            stroke="#388E3C"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Right antennae tip */}
          <Circle cx="62" cy="98" r="4" fill="#1A1A1A" />
          {/* Eye */}
          <Circle cx="42" cy="132" r="3" fill="#1A1A1A" />
          {/* Shell outer */}
          <Circle cx="135" cy="118" r="50" fill="#FF8A65" stroke="#BF360C" strokeWidth="2" />
          {/* Shell middle ring */}
          <Circle cx="135" cy="118" r="30" fill="#FFAB91" stroke="#BF360C" strokeWidth="1.5" />
          {/* Shell inner */}
          <Circle cx="135" cy="118" r="12" fill="#FF7043" stroke="#BF360C" strokeWidth="1" />
          {/* Shell spiral accent */}
          <Path d="M 135 68 A 50 50 0 0 1 185 118" stroke="#BF360C" strokeWidth="2" fill="none" />
        </Svg>
      );

    case 'tiere-08-horse.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Body */}
          <Ellipse
            cx="97"
            cy="128"
            rx="65"
            ry="40"
            fill="#C8A47E"
            stroke="#8B6914"
            strokeWidth="2"
          />
          {/* Neck */}
          <Rect
            x="130"
            y="75"
            width="28"
            height="42"
            fill="#C8A47E"
            stroke="#8B6914"
            strokeWidth="2"
            rx="8"
          />
          {/* Head */}
          <Ellipse
            cx="160"
            cy="66"
            rx="22"
            ry="18"
            fill="#C8A47E"
            stroke="#8B6914"
            strokeWidth="2"
          />
          {/* Ear */}
          <Polygon points="150,50 148,30 162,50" fill="#C8A47E" stroke="#8B6914" strokeWidth="2" />
          {/* Muzzle */}
          <Ellipse
            cx="174"
            cy="72"
            rx="10"
            ry="8"
            fill="#B08060"
            stroke="#8B6914"
            strokeWidth="1.5"
          />
          {/* Nostril */}
          <Circle cx="174" cy="73" r="3" fill="#8B6914" />
          {/* Eye */}
          <Circle cx="157" cy="61" r="5" fill="#1A1A1A" />
          {/* Eye shine */}
          <Circle cx="159" cy="59" r="2" fill="#FFFFFF" />
          {/* Mane */}
          <Path
            d="M 130 75 Q 142 55 152 50 Q 148 62 150 68 Q 140 60 136 72"
            fill="#7A5230"
            stroke="none"
          />
          {/* Front left leg */}
          <Rect
            x="55"
            y="160"
            width="14"
            height="32"
            fill="#C8A47E"
            stroke="#8B6914"
            strokeWidth="2"
            rx="3"
          />
          {/* Front right leg */}
          <Rect
            x="82"
            y="160"
            width="14"
            height="32"
            fill="#C8A47E"
            stroke="#8B6914"
            strokeWidth="2"
            rx="3"
          />
          {/* Rear left leg */}
          <Rect
            x="116"
            y="160"
            width="14"
            height="32"
            fill="#C8A47E"
            stroke="#8B6914"
            strokeWidth="2"
            rx="3"
          />
          {/* Rear right leg */}
          <Rect
            x="143"
            y="160"
            width="14"
            height="32"
            fill="#C8A47E"
            stroke="#8B6914"
            strokeWidth="2"
            rx="3"
          />
          {/* Tail */}
          <Path
            d="M 35 118 Q 18 103 20 82"
            stroke="#7A5230"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'tiere-09-elephant.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Body */}
          <Ellipse
            cx="100"
            cy="132"
            rx="65"
            ry="48"
            fill="#9E9E9E"
            stroke="#616161"
            strokeWidth="2"
          />
          {/* Head */}
          <Circle cx="72" cy="76" r="38" fill="#9E9E9E" stroke="#616161" strokeWidth="2" />
          {/* Left ear */}
          <Ellipse
            cx="36"
            cy="74"
            rx="28"
            ry="38"
            fill="#BDBDBD"
            stroke="#616161"
            strokeWidth="2"
          />
          {/* Left ear inner */}
          <Ellipse cx="36" cy="74" rx="18" ry="26" fill="#FFCDD2" stroke="none" />
          {/* Trunk */}
          <Path
            d="M 55 110 Q 32 128 38 152 Q 44 162 52 160 Q 60 157 56 148 Q 48 130 68 118"
            fill="#9E9E9E"
            stroke="#616161"
            strokeWidth="2"
          />
          {/* Trunk tip */}
          <Circle cx="50" cy="157" r="5" fill="#757575" />
          {/* Eye */}
          <Circle cx="80" cy="68" r="7" fill="#1A1A1A" />
          {/* Eye shine */}
          <Circle cx="82" cy="66" r="3" fill="#FFFFFF" />
          {/* Tusk */}
          <Path
            d="M 56 108 Q 40 122 36 134"
            stroke="#FAFAFA"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          {/* Front left leg */}
          <Rect
            x="42"
            y="170"
            width="18"
            height="26"
            fill="#9E9E9E"
            stroke="#616161"
            strokeWidth="2"
            rx="4"
          />
          {/* Front right leg */}
          <Rect
            x="72"
            y="170"
            width="18"
            height="26"
            fill="#9E9E9E"
            stroke="#616161"
            strokeWidth="2"
            rx="4"
          />
          {/* Rear left leg */}
          <Rect
            x="108"
            y="170"
            width="18"
            height="26"
            fill="#9E9E9E"
            stroke="#616161"
            strokeWidth="2"
            rx="4"
          />
          {/* Rear right leg */}
          <Rect
            x="138"
            y="170"
            width="18"
            height="26"
            fill="#9E9E9E"
            stroke="#616161"
            strokeWidth="2"
            rx="4"
          />
          {/* Tail */}
          <Path
            d="M 165 122 Q 180 108 182 90"
            stroke="#757575"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'tiere-10-fox.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Body */}
          <Ellipse
            cx="100"
            cy="130"
            rx="48"
            ry="38"
            fill="#FF6F00"
            stroke="#E65100"
            strokeWidth="2"
          />
          {/* Head */}
          <Circle cx="100" cy="78" r="33" fill="#FF6F00" stroke="#E65100" strokeWidth="2" />
          {/* Left ear */}
          <Polygon points="76,50 68,18 90,52" fill="#FF6F00" stroke="#E65100" strokeWidth="2" />
          {/* Right ear */}
          <Polygon points="124,50 132,18 110,52" fill="#FF6F00" stroke="#E65100" strokeWidth="2" />
          {/* White muzzle */}
          <Ellipse
            cx="100"
            cy="90"
            rx="20"
            ry="16"
            fill="#FFECB3"
            stroke="#E65100"
            strokeWidth="1"
          />
          {/* Left eye */}
          <Circle cx="88" cy="72" r="5" fill="#1A1A1A" />
          {/* Right eye */}
          <Circle cx="112" cy="72" r="5" fill="#1A1A1A" />
          {/* Nose */}
          <Circle cx="100" cy="86" r="4" fill="#1A1A1A" />
          {/* Bushy tail */}
          <Ellipse
            cx="153"
            cy="152"
            rx="35"
            ry="25"
            fill="#FF6F00"
            stroke="#E65100"
            strokeWidth="2"
            transform="rotate(30 153 152)"
          />
          {/* Tail tip white */}
          <Ellipse
            cx="153"
            cy="152"
            rx="20"
            ry="14"
            fill="#FFFFFF"
            stroke="none"
            transform="rotate(30 153 152)"
          />
          {/* Front left leg */}
          <Rect
            x="78"
            y="160"
            width="12"
            height="28"
            fill="#FF6F00"
            stroke="#E65100"
            strokeWidth="2"
            rx="3"
          />
          {/* Front right leg */}
          <Rect
            x="110"
            y="160"
            width="12"
            height="28"
            fill="#FF6F00"
            stroke="#E65100"
            strokeWidth="2"
            rx="3"
          />
          {/* White chest patch */}
          <Ellipse cx="100" cy="130" rx="20" ry="26" fill="#FFECB3" stroke="none" />
        </Svg>
      );

    // ── Fahrzeuge v1 Pack ──────────────────────────────────────────────────

    case 'fahrzeuge-01-bus.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Body */}
          <Rect
            x="18"
            y="88"
            width="162"
            height="60"
            fill="#FFD700"
            stroke="#FFA000"
            strokeWidth="2.5"
            rx="6"
          />
          {/* Roof */}
          <Rect
            x="28"
            y="75"
            width="142"
            height="18"
            fill="#FFC300"
            stroke="#FFA000"
            strokeWidth="2"
            rx="5"
          />
          {/* Front windshield */}
          <Rect
            x="150"
            y="92"
            width="24"
            height="26"
            fill="#87CEEB"
            stroke="#FFA000"
            strokeWidth="1.5"
            rx="3"
          />
          {/* Window 1 */}
          <Rect
            x="28"
            y="92"
            width="26"
            height="22"
            fill="#87CEEB"
            stroke="#FFA000"
            strokeWidth="1.5"
            rx="3"
          />
          {/* Window 2 */}
          <Rect
            x="62"
            y="92"
            width="26"
            height="22"
            fill="#87CEEB"
            stroke="#FFA000"
            strokeWidth="1.5"
            rx="3"
          />
          {/* Window 3 */}
          <Rect
            x="96"
            y="92"
            width="26"
            height="22"
            fill="#87CEEB"
            stroke="#FFA000"
            strokeWidth="1.5"
            rx="3"
          />
          {/* Left wheel */}
          <Circle cx="52" cy="156" r="17" fill="#333333" stroke="#1A1A1A" strokeWidth="2" />
          {/* Left wheel hub */}
          <Circle cx="52" cy="156" r="7" fill="#999999" />
          {/* Right wheel */}
          <Circle cx="148" cy="156" r="17" fill="#333333" stroke="#1A1A1A" strokeWidth="2" />
          {/* Right wheel hub */}
          <Circle cx="148" cy="156" r="7" fill="#999999" />
          {/* Headlight */}
          <Circle cx="179" cy="108" r="7" fill="#FFFDE7" stroke="#FFA000" strokeWidth="1.5" />
        </Svg>
      );

    case 'fahrzeuge-02-airplane.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Fuselage */}
          <Ellipse
            cx="100"
            cy="108"
            rx="78"
            ry="18"
            fill="#87CEEB"
            stroke="#4A90D9"
            strokeWidth="2.5"
          />
          {/* Nose cone */}
          <Ellipse
            cx="176"
            cy="108"
            rx="15"
            ry="11"
            fill="#6BB5D5"
            stroke="#4A90D9"
            strokeWidth="2"
          />
          {/* Main wing upper */}
          <Polygon points="100,108 72,58 132,108" fill="#4A90D9" stroke="#2C5F9A" strokeWidth="2" />
          {/* Main wing lower */}
          <Polygon
            points="100,108 72,158 132,108"
            fill="#4A90D9"
            stroke="#2C5F9A"
            strokeWidth="2"
          />
          {/* Tail fin (vertical) */}
          <Polygon points="30,104 28,74 52,104" fill="#4A90D9" stroke="#2C5F9A" strokeWidth="2" />
          {/* Tail horizontal left */}
          <Polygon points="32,108 12,94 52,108" fill="#4A90D9" stroke="#2C5F9A" strokeWidth="1.5" />
          {/* Tail horizontal right */}
          <Polygon
            points="32,108 12,122 52,108"
            fill="#4A90D9"
            stroke="#2C5F9A"
            strokeWidth="1.5"
          />
          {/* Window 1 */}
          <Circle cx="140" cy="105" r="8" fill="#FFFFFF" stroke="#4A90D9" strokeWidth="1.5" />
          {/* Window 2 */}
          <Circle cx="160" cy="105" r="8" fill="#FFFFFF" stroke="#4A90D9" strokeWidth="1.5" />
          {/* Engine pod */}
          <Ellipse
            cx="88"
            cy="122"
            rx="16"
            ry="7"
            fill="#7FB3D3"
            stroke="#4A90D9"
            strokeWidth="1.5"
          />
        </Svg>
      );

    case 'fahrzeuge-03-sailboat.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Hull */}
          <Path
            d="M 28 138 Q 100 158 172 138 L 162 118 Q 100 132 38 118 Z"
            fill="#8B4513"
            stroke="#5D2E0C"
            strokeWidth="2.5"
          />
          {/* Mast */}
          <Line
            x1="100"
            y1="50"
            x2="100"
            y2="138"
            stroke="#5D2E0C"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Main sail */}
          <Polygon
            points="100,55 100,128 162,118"
            fill="#FFFFFF"
            stroke="#4A90D9"
            strokeWidth="2"
          />
          {/* Jib (front sail) */}
          <Polygon points="100,75 100,128 48,118" fill="#FFD700" stroke="#FFA000" strokeWidth="2" />
          {/* Flag */}
          <Polygon points="100,50 100,65 118,57" fill="#E74C3C" stroke="none" />
          {/* Water wave 1 */}
          <Path
            d="M 8 152 Q 28 144 48 152 Q 68 160 88 152"
            stroke="#4A90D9"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Water wave 2 */}
          <Path
            d="M 108 157 Q 128 149 148 157 Q 168 165 188 157"
            stroke="#4A90D9"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Porthole */}
          <Circle cx="68" cy="130" r="6" fill="#87CEEB" stroke="#5D2E0C" strokeWidth="1.5" />
          {/* Boom */}
          <Line
            x1="100"
            y1="128"
            x2="156"
            y2="120"
            stroke="#5D2E0C"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'fahrzeuge-04-tractor.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Body */}
          <Rect
            x="62"
            y="95"
            width="80"
            height="55"
            fill="#4CAF50"
            stroke="#2E7D32"
            strokeWidth="2.5"
            rx="5"
          />
          {/* Hood */}
          <Rect
            x="118"
            y="108"
            width="48"
            height="35"
            fill="#388E3C"
            stroke="#2E7D32"
            strokeWidth="2"
            rx="4"
          />
          {/* Cabin roof */}
          <Rect
            x="65"
            y="75"
            width="74"
            height="25"
            fill="#2E7D32"
            stroke="#1B5E20"
            strokeWidth="2"
            rx="4"
          />
          {/* Cabin window */}
          <Rect
            x="70"
            y="79"
            width="62"
            height="17"
            fill="#87CEEB"
            stroke="#1B5E20"
            strokeWidth="1.5"
            rx="3"
          />
          {/* Exhaust pipe */}
          <Rect
            x="128"
            y="88"
            width="8"
            height="24"
            fill="#424242"
            stroke="#212121"
            strokeWidth="1.5"
            rx="2"
          />
          {/* Front small wheel */}
          <Circle cx="150" cy="154" r="18" fill="#333333" stroke="#1A1A1A" strokeWidth="2" />
          {/* Front wheel hub */}
          <Circle cx="150" cy="154" r="7" fill="#888888" />
          {/* Big rear wheel outer */}
          <Circle cx="72" cy="158" r="35" fill="#333333" stroke="#1A1A1A" strokeWidth="2.5" />
          {/* Big rear wheel inner */}
          <Circle cx="72" cy="158" r="22" fill="#555555" />
          {/* Rear wheel hub */}
          <Circle cx="72" cy="158" r="10" fill="#888888" />
          {/* Rear mudguard */}
          <Path
            d="M 38 126 Q 36 112 46 108"
            stroke="#2E7D32"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Headlight */}
          <Circle cx="164" cy="120" r="7" fill="#FFFDE7" stroke="#FFA000" strokeWidth="1.5" />
          {/* Rear wheel lug */}
          <Line x1="72" y1="136" x2="72" y2="146" stroke="#AAAAAA" strokeWidth="3" />
        </Svg>
      );

    case 'fahrzeuge-05-helicopter.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Fuselage */}
          <Ellipse
            cx="95"
            cy="118"
            rx="62"
            ry="30"
            fill="#FF6B35"
            stroke="#E64A19"
            strokeWidth="2.5"
          />
          {/* Cockpit bubble */}
          <Ellipse
            cx="138"
            cy="112"
            rx="30"
            ry="24"
            fill="#87CEEB"
            stroke="#E64A19"
            strokeWidth="2"
          />
          {/* Tail boom */}
          <Rect
            x="20"
            y="112"
            width="42"
            height="14"
            fill="#FF6B35"
            stroke="#E64A19"
            strokeWidth="2"
            rx="4"
          />
          {/* Tail fin */}
          <Polygon points="20,112 10,90 35,112" fill="#E64A19" stroke="#BF360C" strokeWidth="2" />
          {/* Tail rotor */}
          <Ellipse
            cx="22"
            cy="100"
            rx="4"
            ry="18"
            fill="#D32F2F"
            stroke="#B71C1C"
            strokeWidth="1.5"
          />
          {/* Main rotor mast */}
          <Rect
            x="95"
            y="85"
            width="6"
            height="20"
            fill="#757575"
            stroke="#424242"
            strokeWidth="1.5"
            rx="2"
          />
          {/* Main rotor blade left */}
          <Ellipse
            cx="76"
            cy="84"
            rx="28"
            ry="7"
            fill="#D32F2F"
            stroke="#B71C1C"
            strokeWidth="1.5"
          />
          {/* Main rotor blade right */}
          <Ellipse
            cx="122"
            cy="84"
            rx="28"
            ry="7"
            fill="#D32F2F"
            stroke="#B71C1C"
            strokeWidth="1.5"
          />
          {/* Pilot window */}
          <Circle cx="142" cy="110" r="14" fill="#FFFFFF" stroke="#E64A19" strokeWidth="1.5" />
          {/* Skid bar */}
          <Rect
            x="68"
            y="146"
            width="52"
            height="7"
            fill="#757575"
            stroke="#424242"
            strokeWidth="1.5"
            rx="3"
          />
          {/* Skid front post */}
          <Line x1="72" y1="145" x2="72" y2="150" stroke="#424242" strokeWidth="3" />
          {/* Skid rear post */}
          <Line x1="115" y1="145" x2="115" y2="150" stroke="#424242" strokeWidth="3" />
        </Svg>
      );

    case 'fahrzeuge-06-firetruck.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Body */}
          <Rect
            x="22"
            y="95"
            width="158"
            height="55"
            fill="#E74C3C"
            stroke="#C0392B"
            strokeWidth="2.5"
            rx="5"
          />
          {/* Cabin */}
          <Rect
            x="148"
            y="80"
            width="32"
            height="28"
            fill="#C0392B"
            stroke="#922B21"
            strokeWidth="2"
            rx="4"
          />
          {/* Cabin window */}
          <Rect
            x="152"
            y="84"
            width="24"
            height="16"
            fill="#87CEEB"
            stroke="#922B21"
            strokeWidth="1.5"
            rx="3"
          />
          {/* Equipment compartment */}
          <Rect
            x="30"
            y="103"
            width="35"
            height="38"
            fill="#C0392B"
            stroke="#922B21"
            strokeWidth="1.5"
            rx="3"
          />
          {/* Hose reel */}
          <Circle cx="100" cy="99" r="16" fill="#CC3D2A" stroke="#922B21" strokeWidth="1.5" />
          {/* Hose reel center */}
          <Circle cx="100" cy="99" r="6" fill="#E74C3C" />
          {/* Ladder */}
          <Rect
            x="22"
            y="85"
            width="125"
            height="6"
            fill="#FFD700"
            stroke="#FFC300"
            strokeWidth="1.5"
            rx="2"
          />
          {/* Ladder rungs */}
          <Path
            d="M 40 85 L 40 91 M 65 85 L 65 91 M 90 85 L 90 91 M 115 85 L 115 91"
            stroke="#FFA000"
            strokeWidth="1.5"
          />
          {/* Left wheel */}
          <Circle cx="52" cy="157" r="18" fill="#333333" stroke="#1A1A1A" strokeWidth="2" />
          {/* Left wheel hub */}
          <Circle cx="52" cy="157" r="7" fill="#888888" />
          {/* Right wheel */}
          <Circle cx="148" cy="157" r="18" fill="#333333" stroke="#1A1A1A" strokeWidth="2" />
          {/* Right wheel hub */}
          <Circle cx="148" cy="157" r="7" fill="#888888" />
          {/* Headlight */}
          <Circle cx="179" cy="110" r="7" fill="#FFFDE7" stroke="#FFA000" strokeWidth="1.5" />
        </Svg>
      );

    case 'fahrzeuge-07-ambulance.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Body */}
          <Rect
            x="22"
            y="90"
            width="158"
            height="62"
            fill="#FFFFFF"
            stroke="#BDBDBD"
            strokeWidth="2.5"
            rx="5"
          />
          {/* Cabin roof */}
          <Rect
            x="130"
            y="75"
            width="52"
            height="20"
            fill="#F5F5F5"
            stroke="#BDBDBD"
            strokeWidth="2"
            rx="4"
          />
          {/* Windshield */}
          <Rect
            x="134"
            y="79"
            width="42"
            height="16"
            fill="#87CEEB"
            stroke="#BDBDBD"
            strokeWidth="1.5"
            rx="3"
          />
          {/* Red cross vertical */}
          <Rect x="68" y="96" width="12" height="36" fill="#E74C3C" stroke="none" rx="2" />
          {/* Red cross horizontal */}
          <Rect x="56" y="108" width="36" height="12" fill="#E74C3C" stroke="none" rx="2" />
          {/* Red stripe */}
          <Rect x="22" y="116" width="158" height="10" fill="#E74C3C" stroke="none" />
          {/* Side window */}
          <Rect
            x="110"
            y="96"
            width="55"
            height="22"
            fill="#E3F2FD"
            stroke="#BDBDBD"
            strokeWidth="1"
            rx="2"
          />
          {/* Siren light */}
          <Rect
            x="148"
            y="73"
            width="20"
            height="8"
            fill="#2196F3"
            stroke="#1565C0"
            strokeWidth="1.5"
            rx="3"
          />
          {/* Left wheel */}
          <Circle cx="52" cy="158" r="17" fill="#333333" stroke="#1A1A1A" strokeWidth="2" />
          {/* Left wheel hub */}
          <Circle cx="52" cy="158" r="6" fill="#999999" />
          {/* Right wheel */}
          <Circle cx="148" cy="158" r="17" fill="#333333" stroke="#1A1A1A" strokeWidth="2" />
          {/* Right wheel hub */}
          <Circle cx="148" cy="158" r="6" fill="#999999" />
        </Svg>
      );

    case 'fahrzeuge-08-submarine.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Water surface */}
          <Path
            d="M 8 100 Q 28 90 48 100 Q 68 110 88 100 Q 108 90 128 100 Q 148 110 168 100 Q 188 90 200 100"
            stroke="#87CEEB"
            strokeWidth="3"
            fill="none"
          />
          {/* Sub body */}
          <Ellipse
            cx="100"
            cy="130"
            rx="82"
            ry="30"
            fill="#FFD700"
            stroke="#FFC107"
            strokeWidth="2.5"
          />
          {/* Conning tower */}
          <Rect
            x="82"
            y="98"
            width="36"
            height="36"
            fill="#FFC300"
            stroke="#FFA000"
            strokeWidth="2"
            rx="5"
          />
          {/* Periscope shaft */}
          <Rect
            x="96"
            y="72"
            width="8"
            height="30"
            fill="#FFA000"
            stroke="#E65100"
            strokeWidth="1.5"
            rx="2"
          />
          {/* Periscope head */}
          <Rect
            x="88"
            y="70"
            width="24"
            height="8"
            fill="#FFA000"
            stroke="#E65100"
            strokeWidth="1.5"
            rx="2"
          />
          {/* Propeller */}
          <Ellipse
            cx="18"
            cy="130"
            rx="6"
            ry="18"
            fill="#FFC107"
            stroke="#FFA000"
            strokeWidth="2"
          />
          {/* Porthole 1 */}
          <Circle cx="68" cy="132" r="10" fill="#87CEEB" stroke="#FFA000" strokeWidth="2" />
          {/* Porthole 2 */}
          <Circle cx="110" cy="132" r="10" fill="#87CEEB" stroke="#FFA000" strokeWidth="2" />
          {/* Porthole 3 */}
          <Circle cx="148" cy="132" r="10" fill="#87CEEB" stroke="#FFA000" strokeWidth="2" />
          {/* Nose cone */}
          <Ellipse
            cx="180"
            cy="130"
            rx="18"
            ry="22"
            fill="#FFD700"
            stroke="#FFC107"
            strokeWidth="2"
          />
          {/* Torpedo tube */}
          <Rect
            x="192"
            y="124"
            width="10"
            height="12"
            fill="#FFA000"
            stroke="#E65100"
            strokeWidth="1.5"
            rx="2"
          />
          {/* Fin top */}
          <Polygon points="130,98 124,76 146,98" fill="#FFC107" stroke="#FFA000" strokeWidth="2" />
          {/* Fin bottom */}
          <Polygon
            points="130,162 124,182 146,162"
            fill="#FFC107"
            stroke="#FFA000"
            strokeWidth="2"
          />
        </Svg>
      );

    case 'fahrzeuge-09-speedboat.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Hull */}
          <Path
            d="M 20 140 Q 100 115 180 132 L 172 155 Q 100 165 28 158 Z"
            fill="#E74C3C"
            stroke="#C0392B"
            strokeWidth="2.5"
          />
          {/* Deck */}
          <Path
            d="M 42 140 Q 100 120 172 135 L 168 138 Q 100 124 46 143 Z"
            fill="#C0392B"
            stroke="none"
          />
          {/* Windshield */}
          <Polygon
            points="110,128 110,112 145,118 145,130"
            fill="#87CEEB"
            stroke="#C0392B"
            strokeWidth="2"
          />
          {/* Steering post */}
          <Line
            x1="120"
            y1="120"
            x2="120"
            y2="138"
            stroke="#7F8C8D"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Bow wave */}
          <Path
            d="M 18 148 Q 10 140 18 133"
            stroke="#4A90D9"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          {/* Water wave 1 */}
          <Path
            d="M 8 165 Q 28 157 48 165 Q 68 173 88 165"
            stroke="#4A90D9"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Water wave 2 */}
          <Path
            d="M 108 168 Q 128 160 148 168 Q 168 176 188 168"
            stroke="#4A90D9"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Engine block */}
          <Rect
            x="15"
            y="138"
            width="18"
            height="20"
            fill="#7F8C8D"
            stroke="#2C3E50"
            strokeWidth="2"
            rx="3"
          />
          {/* White racing stripe */}
          <Path d="M 42 150 Q 100 132 168 146" stroke="#FFFFFF" strokeWidth="3" fill="none" />
          {/* Wake left */}
          <Path
            d="M 14 148 Q 5 153 12 162"
            stroke="#87CEEB"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Wake right */}
          <Path
            d="M 22 158 Q 12 165 18 175"
            stroke="#87CEEB"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Flag pole */}
          <Line
            x1="168"
            y1="136"
            x2="168"
            y2="112"
            stroke="#7F8C8D"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'fahrzeuge-10-spaceshuttle.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Orbiter body */}
          <Ellipse
            cx="100"
            cy="112"
            rx="20"
            ry="70"
            fill="#ECEFF1"
            stroke="#B0BEC5"
            strokeWidth="2.5"
          />
          {/* Nose cone */}
          <Polygon points="100,40 84,80 116,80" fill="#CFD8DC" stroke="#B0BEC5" strokeWidth="2" />
          {/* Left wing */}
          <Polygon points="82,140 35,178 100,160" fill="#CFD8DC" stroke="#B0BEC5" strokeWidth="2" />
          {/* Right wing */}
          <Polygon
            points="118,140 165,178 100,160"
            fill="#CFD8DC"
            stroke="#B0BEC5"
            strokeWidth="2"
          />
          {/* Left wing edge */}
          <Line x1="35" y1="178" x2="100" y2="190" stroke="#B0BEC5" strokeWidth="1.5" />
          {/* Right wing edge */}
          <Line x1="165" y1="178" x2="100" y2="190" stroke="#B0BEC5" strokeWidth="1.5" />
          {/* Cockpit window */}
          <Ellipse
            cx="100"
            cy="76"
            rx="12"
            ry="16"
            fill="#87CEEB"
            stroke="#78909C"
            strokeWidth="2"
          />
          {/* Engine left */}
          <Circle cx="88" cy="180" r="10" fill="#FF7043" stroke="#E64A19" strokeWidth="2" />
          {/* Engine center */}
          <Circle cx="100" cy="183" r="10" fill="#FF7043" stroke="#E64A19" strokeWidth="2" />
          {/* Engine right */}
          <Circle cx="112" cy="180" r="10" fill="#FF7043" stroke="#E64A19" strokeWidth="2" />
          {/* Flame left */}
          <Ellipse cx="88" cy="193" rx="7" ry="10" fill="#FFD700" stroke="none" />
          {/* Flame center */}
          <Ellipse cx="100" cy="197" rx="7" ry="11" fill="#FFD700" stroke="none" />
          {/* Flame right */}
          <Ellipse cx="112" cy="193" rx="7" ry="10" fill="#FFD700" stroke="none" />
          {/* Payload door line */}
          <Line x1="90" y1="88" x2="90" y2="155" stroke="#78909C" strokeWidth="1.5" />
        </Svg>
      );

  // ===== natur-v1 Pack =====
    case 'natur-01-rainbow.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* red arc */}
          <Path d="M 30 150 A 70 70 0 0 1 170 150" fill="none" stroke="#E74C3C" strokeWidth="10" strokeLinecap="round" />
          {/* orange arc */}
          <Path d="M 42 150 A 58 58 0 0 1 158 150" fill="none" stroke="#FFA500" strokeWidth="10" strokeLinecap="round" />
          {/* yellow arc */}
          <Path d="M 54 150 A 46 46 0 0 1 146 150" fill="none" stroke="#FFD700" strokeWidth="10" strokeLinecap="round" />
          {/* green arc */}
          <Path d="M 66 150 A 34 34 0 0 1 134 150" fill="none" stroke="#27AE60" strokeWidth="10" strokeLinecap="round" />
          {/* blue arc */}
          <Path d="M 78 150 A 22 22 0 0 1 122 150" fill="none" stroke="#3498DB" strokeWidth="10" strokeLinecap="round" />
          {/* left cloud */}
          <Ellipse cx="28" cy="152" rx="22" ry="15" fill="#FFFFFF" stroke="#CFD8DC" strokeWidth="2" />
          {/* right cloud */}
          <Ellipse cx="172" cy="152" rx="22" ry="15" fill="#FFFFFF" stroke="#CFD8DC" strokeWidth="2" />
          {/* sparkle1 */}
          <Circle cx="60" cy="40" r="4" fill="#FFD700" />
          {/* sparkle2 */}
          <Circle cx="140" cy="55" r="3" fill="#FFD700" />
        </Svg>
      );

    case 'natur-02-mushroom.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* stem */}
          <Rect x="88" y="110" width="24" height="55" rx="8" fill="#FFF3E0" stroke="#D7A86E" strokeWidth="2" />
          {/* cap */}
          <Path d="M 40 112 Q 40 55 100 55 Q 160 55 160 112 Q 100 132 40 112 Z" fill="#E74C3C" stroke="#B71C1C" strokeWidth="2" />
          {/* spot1 */}
          <Circle cx="70" cy="88" r="9" fill="#FFFFFF" />
          {/* spot2 */}
          <Circle cx="105" cy="75" r="7" fill="#FFFFFF" />
          {/* spot3 */}
          <Circle cx="132" cy="92" r="8" fill="#FFFFFF" />
          {/* grass */}
          <Ellipse cx="100" cy="172" rx="60" ry="8" fill="#4CAF50" />
          {/* grass blade1 */}
          <Path d="M 40 172 Q 36 158 42 150" fill="none" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" />
          {/* grass blade2 */}
          <Path d="M 160 172 Q 166 158 158 150" fill="none" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" />
          {/* sparkle1 */}
          <Circle cx="96" cy="22" r="3" fill="#FFD700" />
        </Svg>
      );

    case 'natur-03-seashell.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* shell body */}
          <Path d="M 100 170 C 40 170 30 100 60 60 C 75 40 100 35 100 35 C 100 35 125 40 140 60 C 170 100 160 170 100 170 Z" fill="#FFB6C1" stroke="#D46A8C" strokeWidth="2" />
          {/* ridge center */}
          <Path d="M 100 168 L 100 42" stroke="#D46A8C" strokeWidth="2" strokeLinecap="round" />
          {/* ridge left1 */}
          <Path d="M 82 165 L 92 48" stroke="#D46A8C" strokeWidth="1.5" strokeLinecap="round" />
          {/* ridge left2 */}
          <Path d="M 62 155 L 82 60" stroke="#D46A8C" strokeWidth="1.5" strokeLinecap="round" />
          {/* ridge right1 */}
          <Path d="M 118 165 L 108 48" stroke="#D46A8C" strokeWidth="1.5" strokeLinecap="round" />
          {/* ridge right2 */}
          <Path d="M 138 155 L 118 60" stroke="#D46A8C" strokeWidth="1.5" strokeLinecap="round" />
          {/* pearl */}
          <Circle cx="100" cy="160" r="6" fill="#F8E1E7" stroke="none" />
          {/* bubble1 */}
          <Circle cx="45" cy="100" r="4" fill="#87CEEB" opacity="0.6" />
          {/* bubble2 */}
          <Circle cx="158" cy="90" r="3" fill="#87CEEB" opacity="0.6" />
        </Svg>
      );

    case 'natur-04-cactus.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* pot base */}
          <Ellipse cx="100" cy="175" rx="42" ry="12" fill="#D2691E" stroke="#8B4513" strokeWidth="2" />
          {/* pot */}
          <Path d="M 66 175 L 74 132 Q 76 128 82 128 L 118 128 Q 124 128 126 132 L 134 175 Z" fill="#CD853F" stroke="#8B4513" strokeWidth="2" />
          {/* main body */}
          <Rect x="86" y="55" width="28" height="90" rx="14" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2" />
          {/* left arm */}
          <Path d="M 86 95 Q 55 95 55 75 Q 55 65 65 65 Q 75 65 75 78 L 75 100" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2" />
          {/* right arm */}
          <Path d="M 114 110 Q 145 110 145 90 Q 145 80 135 80 Q 125 80 125 93 L 125 115" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2" />
          {/* spine line center */}
          <Line x1="100" y1="60" x2="100" y2="140" stroke="#2E7D32" strokeWidth="1.5" />
          {/* spine line left */}
          <Line x1="90" y1="65" x2="90" y2="138" stroke="#2E7D32" strokeWidth="1" opacity="0.7" />
          {/* spine line right */}
          <Line x1="110" y1="65" x2="110" y2="138" stroke="#2E7D32" strokeWidth="1" opacity="0.7" />
          {/* flower main */}
          <Circle cx="100" cy="50" r="10" fill="#FF69B4" stroke="#C2185B" strokeWidth="2" />
          {/* flower small */}
          <Circle cx="65" cy="60" r="6" fill="#FF69B4" stroke="#C2185B" strokeWidth="1.5" />
        </Svg>
      );

    case 'natur-05-bee.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* wing left */}
          <Ellipse cx="90" cy="95" rx="22" ry="16" fill="#FFD700" stroke="#1A1A1A" strokeWidth="2" />
          {/* wing right */}
          <Ellipse cx="130" cy="95" rx="22" ry="16" fill="#E6F7FF" stroke="#90A4AE" strokeWidth="1.5" opacity="0.8" />
          {/* body */}
          <Ellipse cx="100" cy="118" rx="40" ry="26" fill="#FFD700" stroke="#1A1A1A" strokeWidth="2" />
          {/* stripe1 */}
          <Path d="M 66 106 L 134 106" stroke="#1A1A1A" strokeWidth="8" />
          {/* stripe2 */}
          <Path d="M 66 130 L 134 130" stroke="#1A1A1A" strokeWidth="8" />
          {/* head */}
          <Circle cx="100" cy="80" r="16" fill="#1A1A1A" />
          {/* antenna left */}
          <Line x1="92" y1="66" x2="84" y2="52" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
          {/* antenna right */}
          <Line x1="108" y1="66" x2="116" y2="52" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
          {/* eye left */}
          <Circle cx="95" cy="80" r="2.5" fill="#FFFFFF" />
          {/* eye right */}
          <Circle cx="105" cy="80" r="2.5" fill="#FFFFFF" />
          {/* sparkle trail */}
          <Circle cx="155" cy="55" r="3" fill="#FFD700" opacity="0.7" />
        </Svg>
      );

    case 'natur-06-ladybug.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* body */}
          <Ellipse cx="100" cy="115" rx="48" ry="40" fill="#E74C3C" stroke="#1A1A1A" strokeWidth="2.5" />
          {/* wing split */}
          <Line x1="100" y1="78" x2="100" y2="152" stroke="#1A1A1A" strokeWidth="2.5" />
          {/* head */}
          <Circle cx="100" cy="65" r="22" fill="#1A1A1A" />
          {/* spot1 */}
          <Circle cx="78" cy="100" r="8" fill="#1A1A1A" />
          {/* spot2 */}
          <Circle cx="122" cy="100" r="8" fill="#1A1A1A" />
          {/* spot3 */}
          <Circle cx="82" cy="132" r="7" fill="#1A1A1A" />
          {/* spot4 */}
          <Circle cx="118" cy="132" r="7" fill="#1A1A1A" />
          {/* antenna left */}
          <Line x1="90" y1="48" x2="82" y2="32" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
          {/* antenna right */}
          <Line x1="110" y1="48" x2="118" y2="32" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
          {/* eye left */}
          <Circle cx="91" cy="62" r="3" fill="#FFFFFF" />
          {/* eye right */}
          <Circle cx="109" cy="62" r="3" fill="#FFFFFF" />
        </Svg>
      );

    case 'natur-07-snowflake.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* arm 1 */}
          <Line x1="100" y1="30" x2="100" y2="170" stroke="#3498DB" strokeWidth="5" strokeLinecap="round" />
          {/* arm 2 */}
          <Line x1="30" y1="65" x2="170" y2="135" stroke="#3498DB" strokeWidth="5" strokeLinecap="round" />
          {/* arm 3 */}
          <Line x1="30" y1="135" x2="170" y2="65" stroke="#3498DB" strokeWidth="5" strokeLinecap="round" />
          {/* branch top */}
          <Path d="M 100 55 L 84 70 M 100 55 L 116 70" stroke="#3498DB" strokeWidth="4" strokeLinecap="round" />
          {/* branch bottom */}
          <Path d="M 100 145 L 84 130 M 100 145 L 116 130" stroke="#3498DB" strokeWidth="4" strokeLinecap="round" />
          {/* branch left */}
          <Path d="M 55 78 L 68 88 M 55 78 L 62 63" stroke="#3498DB" strokeWidth="4" strokeLinecap="round" />
          {/* branch right */}
          <Path d="M 145 122 L 132 112 M 145 122 L 138 137" stroke="#3498DB" strokeWidth="4" strokeLinecap="round" />
          {/* center */}
          <Circle cx="100" cy="100" r="10" fill="#87CEEB" stroke="#3498DB" strokeWidth="2" />
          {/* tip top */}
          <Circle cx="100" cy="32" r="3" fill="#87CEEB" />
          {/* tip left */}
          <Circle cx="33" cy="66" r="3" fill="#87CEEB" />
          {/* tip right */}
          <Circle cx="167" cy="66" r="3" fill="#87CEEB" />
        </Svg>
      );

    case 'natur-08-palmtree.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* trunk */}
          <Path d="M 92 175 C 88 130 108 100 112 65" fill="none" stroke="#8B5A2B" strokeWidth="12" strokeLinecap="round" />
          {/* trunk ring1 */}
          <Line x1="96" y1="155" x2="104" y2="153" stroke="#5D3A1A" strokeWidth="2" />
          {/* trunk ring2 */}
          <Line x1="94" y1="125" x2="104" y2="122" stroke="#5D3A1A" strokeWidth="2" />
          {/* frond1 */}
          <Path d="M 112 65 Q 60 45 30 70" fill="none" stroke="#2E7D32" strokeWidth="10" strokeLinecap="round" />
          {/* frond2 */}
          <Path d="M 112 65 Q 70 30 45 35" fill="none" stroke="#388E3C" strokeWidth="10" strokeLinecap="round" />
          {/* frond3 */}
          <Path d="M 112 65 Q 108 20 92 12" fill="none" stroke="#2E7D32" strokeWidth="10" strokeLinecap="round" />
          {/* frond4 */}
          <Path d="M 112 65 Q 140 25 155 32" fill="none" stroke="#388E3C" strokeWidth="10" strokeLinecap="round" />
          {/* frond5 */}
          <Path d="M 112 65 Q 160 50 178 72" fill="none" stroke="#2E7D32" strokeWidth="10" strokeLinecap="round" />
          {/* coconut1 */}
          <Circle cx="108" cy="70" r="7" fill="#8B5A2B" stroke="#5D3A1A" strokeWidth="1.5" />
          {/* coconut2 */}
          <Circle cx="122" cy="76" r="7" fill="#8B5A2B" stroke="#5D3A1A" strokeWidth="1.5" />
          {/* coconut3 */}
          <Circle cx="114" cy="82" r="6" fill="#8B5A2B" stroke="#5D3A1A" strokeWidth="1.5" />
          {/* sand */}
          <Ellipse cx="100" cy="180" rx="55" ry="8" fill="#F4D19B" />
          {/* pebble1 */}
          <Circle cx="150" cy="145" r="5" fill="#F4D19B" stroke="#D7A86E" strokeWidth="1" />
          {/* pebble2 */}
          <Circle cx="45" cy="150" r="4" fill="#F4D19B" stroke="#D7A86E" strokeWidth="1" />
        </Svg>
      );

    case 'natur-09-waterfall.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* rock cliff */}
          <Path d="M 40 20 L 130 20 L 145 60 L 100 60 L 115 100 L 70 100 L 70 175 L 40 175 Z" fill="#8D6E63" stroke="#5D4037" strokeWidth="2" />
          {/* water fall */}
          <Rect x="78" y="30" width="26" height="145" fill="#81D4FA" stroke="#0288D1" strokeWidth="2" opacity="0.85" />
          {/* water line1 */}
          <Path d="M 80 50 L 104 55" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />
          {/* water line2 */}
          <Path d="M 78 80 L 102 86" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />
          {/* water line3 */}
          <Path d="M 78 115 L 102 121" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />
          {/* pool */}
          <Ellipse cx="91" cy="172" rx="45" ry="14" fill="#B3E5FC" stroke="#0288D1" strokeWidth="2" />
          {/* splash1 */}
          <Circle cx="60" cy="168" r="5" fill="#FFFFFF" opacity="0.8" />
          {/* splash2 */}
          <Circle cx="118" cy="165" r="4" fill="#FFFFFF" opacity="0.8" />
          {/* splash3 */}
          <Circle cx="68" cy="178" r="3" fill="#FFFFFF" opacity="0.7" />
          {/* bush1 */}
          <Circle cx="40" cy="40" r="10" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1.5" />
          {/* bush2 */}
          <Circle cx="150" cy="30" r="8" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1.5" />
          {/* bush3 */}
          <Circle cx="160" cy="45" r="6" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1.5" />
          {/* cloud */}
          <Circle cx="165" cy="20" r="12" fill="#ECEFF1" opacity="0.8" />
        </Svg>
      );

    case 'natur-10-volcano.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* mountain */}
          <Path d="M 100 30 L 165 170 L 35 170 Z" fill="#8D6E63" stroke="#5D4037" strokeWidth="2.5" />
          {/* crater lava */}
          <Path d="M 85 55 L 100 30 L 115 55 Z" fill="#E74C3C" stroke="#B71C1C" strokeWidth="2" />
          {/* lava streak left */}
          <Path d="M 75 90 L 100 65 L 60 100 Z" fill="#FF7043" opacity="0.85" />
          {/* lava streak right */}
          <Path d="M 125 90 L 100 65 L 140 100 Z" fill="#FF7043" opacity="0.85" />
          {/* lava streak center */}
          <Path d="M 95 120 L 100 100 L 108 125 Z" fill="#FFB74D" opacity="0.85" />
          {/* smoke1 */}
          <Circle cx="100" cy="5" r="12" fill="#CFD8DC" opacity="0.75" />
          {/* smoke2 */}
          <Circle cx="118" cy="12" r="10" fill="#CFD8DC" opacity="0.7" />
          {/* smoke3 */}
          <Circle cx="132" cy="0" r="7" fill="#CFD8DC" opacity="0.6" />
          {/* smoke4 */}
          <Circle cx="85" cy="-5" r="6" fill="#CFD8DC" opacity="0.6" />
          {/* ground */}
          <Ellipse cx="100" cy="172" rx="70" ry="8" fill="#2E7D32" />
          {/* bush left */}
          <Circle cx="40" cy="168" r="6" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1.5" />
          {/* bush right */}
          <Circle cx="160" cy="168" r="6" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1.5" />
          {/* cloud */}
          <Circle cx="20" cy="40" r="8" fill="#ECEFF1" opacity="0.7" />
        </Svg>
      );

  // ===== maerchen-v1 Pack =====
    case 'maerchen-01-crown.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* crown body */}
          <Polygon points="40,150 40,95 65,120 100,70 135,120 160,95 160,150" fill="#FFD700" stroke="#B8860B" strokeWidth="2.5" />
          {/* crown base */}
          <Rect x="36" y="148" width="128" height="18" rx="4" fill="#FFD700" stroke="#B8860B" strokeWidth="2.5" />
          {/* jewel center */}
          <Circle cx="100" cy="88" r="9" fill="#E74C3C" stroke="#B71C1C" strokeWidth="1.5" />
          {/* jewel left */}
          <Circle cx="65" cy="112" r="6" fill="#3498DB" stroke="#1565C0" strokeWidth="1.5" />
          {/* jewel right */}
          <Circle cx="135" cy="112" r="6" fill="#3498DB" stroke="#1565C0" strokeWidth="1.5" />
          {/* jewel far left */}
          <Circle cx="40" cy="100" r="4" fill="#9B59B6" />
          {/* jewel far right */}
          <Circle cx="160" cy="100" r="4" fill="#9B59B6" />
          {/* jewel base */}
          <Circle cx="100" cy="157" r="5" fill="#FF69B4" stroke="none" />
          {/* sparkle */}
          <Circle cx="100" cy="45" r="3" fill="#FFD700" />
        </Svg>
      );

    case 'maerchen-02-wand.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* stick */}
          <Rect x="93" y="90" width="12" height="90" rx="6" fill="#8B5A2B" stroke="#5D3A1A" strokeWidth="2" transform="rotate(20 100 135)" />
          {/* star tip */}
          <Polygon points="100,25 110,55 140,58 116,78 124,108 100,90 76,108 84,78 60,58 90,55" fill="#FFD700" stroke="#B8860B" strokeWidth="2" />
          {/* sparkle1 */}
          <Circle cx="55" cy="45" r="4" fill="#87CEEB" />
          {/* sparkle2 */}
          <Circle cx="155" cy="40" r="5" fill="#FF69B4" />
          {/* sparkle3 */}
          <Circle cx="145" cy="90" r="3" fill="#87CEEB" />
          {/* sparkle4 */}
          <Circle cx="40" cy="75" r="3" fill="#FFD700" />
          {/* sparkle5 */}
          <Circle cx="165" cy="120" r="3.5" fill="#9B59B6" />
          {/* sparkle6 */}
          <Circle cx="60" cy="130" r="2.5" fill="#FF69B4" />
          {/* trail swirl */}
          <Path d="M 130 70 Q 145 85 135 100" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        </Svg>
      );

    case 'maerchen-03-wizardhat.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* cone */}
          <Polygon points="100,20 130,140 70,140" fill="#7C5CFF" stroke="#4A2FBF" strokeWidth="2.5" />
          {/* brim */}
          <Ellipse cx="100" cy="142" rx="55" ry="14" fill="#5A3FE0" stroke="#4A2FBF" strokeWidth="2.5" />
          {/* band */}
          <Rect x="78" y="100" width="44" height="12" fill="#FFD700" stroke="#B8860B" strokeWidth="1.5" />
          {/* star large */}
          <Polygon points="100,55 105,68 118,68 108,76 112,89 100,81 88,89 92,76 82,68 95,68" fill="#FFD700" stroke="none" />
          {/* star small */}
          <Polygon points="75,80 78,87 85,87 79,91 81,98 75,94 69,98 71,91 65,87 72,87" fill="#FFD700" stroke="none" />
          {/* sparkle1 */}
          <Circle cx="70" cy="45" r="3" fill="#FFD700" />
          {/* sparkle2 */}
          <Circle cx="128" cy="55" r="2.5" fill="#FFD700" />
          {/* sparkle3 */}
          <Circle cx="100" cy="30" r="2" fill="#FFD700" />
        </Svg>
      );

    case 'maerchen-04-fairy.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* wing left */}
          <Path d="M 100 90 C 40 70 25 110 55 130 C 75 143 95 120 100 100" fill="#FF69B4" stroke="#C2185B" strokeWidth="2" opacity="0.85" />
          {/* wing right */}
          <Path d="M 100 90 C 160 70 175 110 145 130 C 125 143 105 120 100 100" fill="#FF69B4" stroke="#C2185B" strokeWidth="2" opacity="0.85" />
          {/* head */}
          <Circle cx="100" cy="62" r="20" fill="#FDBCB4" stroke="#E8998D" strokeWidth="2" />
          {/* hair */}
          <Path d="M 80 50 Q 100 30 120 50 Q 122 65 116 68 L 84 68 Q 78 65 80 50" fill="#9B59B6" stroke="#6C3483" strokeWidth="1.5" />
          {/* dress */}
          <Path d="M 82 118 L 100 92 L 118 118 Z" fill="#7C5CFF" stroke="#4A2FBF" strokeWidth="2" />
          {/* eye left */}
          <Circle cx="93" cy="60" r="2.5" fill="#1A1A1A" />
          {/* eye right */}
          <Circle cx="107" cy="60" r="2.5" fill="#1A1A1A" />
          {/* wand */}
          <Path d="M 100 118 L 100 150" stroke="#8B5A2B" strokeWidth="4" strokeLinecap="round" />
          {/* wand tip */}
          <Circle cx="100" cy="148" r="5" fill="#FFD700" />
          {/* sparkle1 */}
          <Circle cx="130" cy="145" r="3" fill="#FFD700" />
          {/* sparkle2 */}
          <Circle cx="145" cy="130" r="2.5" fill="#87CEEB" />
        </Svg>
      );

    case 'maerchen-05-frogprince.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* body */}
          <Ellipse cx="100" cy="130" rx="52" ry="40" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2.5" />
          {/* eye dome left */}
          <Circle cx="68" cy="92" r="20" fill="#66BB6A" stroke="#2E7D32" strokeWidth="2.5" />
          {/* eye dome right */}
          <Circle cx="132" cy="92" r="20" fill="#66BB6A" stroke="#2E7D32" strokeWidth="2.5" />
          {/* pupil left */}
          <Circle cx="68" cy="90" r="9" fill="#1A1A1A" />
          {/* pupil right */}
          <Circle cx="132" cy="90" r="9" fill="#1A1A1A" />
          {/* smile */}
          <Path d="M 75 130 Q 100 150 125 130" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
          {/* crown */}
          <Polygon points="80,68 92,68 100,50 108,68 120,68 116,80 84,80" fill="#FFD700" stroke="#B8860B" strokeWidth="2" />
          {/* crown jewel */}
          <Circle cx="100" cy="60" r="4" fill="#E74C3C" />
          {/* foot left */}
          <Ellipse cx="55" cy="158" rx="20" ry="11" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2" />
          {/* foot right */}
          <Ellipse cx="145" cy="158" rx="20" ry="11" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2" />
          {/* sparkle */}
          <Circle cx="165" cy="60" r="3" fill="#FFD700" opacity="0.7" />
        </Svg>
      );

    case 'maerchen-06-pumpkincarriage.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* body */}
          <Ellipse cx="100" cy="105" rx="62" ry="45" fill="#FF7043" stroke="#E64A19" strokeWidth="2.5" />
          {/* rib1 */}
          <Line x1="65" y1="65" x2="65" y2="145" stroke="#E64A19" strokeWidth="2" />
          {/* rib2 */}
          <Line x1="100" y1="60" x2="100" y2="150" stroke="#E64A19" strokeWidth="2" />
          {/* rib3 */}
          <Line x1="135" y1="65" x2="135" y2="145" stroke="#E64A19" strokeWidth="2" />
          {/* window */}
          <Rect x="82" y="78" width="36" height="30" rx="6" fill="#87CEEB" stroke="#E64A19" strokeWidth="2" />
          {/* side lantern */}
          <Circle cx="55" cy="90" r="8" fill="#FFD700" stroke="#B8860B" strokeWidth="1.5" />
          {/* vine stem */}
          <Path d="M 96 40 Q 100 22 110 30" fill="none" stroke="#4CAF50" strokeWidth="5" strokeLinecap="round" />
          {/* vine leaf */}
          <Circle cx="112" cy="25" r="5" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1" />
          {/* wheel left */}
          <Circle cx="40" cy="165" r="18" fill="#FFD700" stroke="#B8860B" strokeWidth="2.5" />
          {/* wheel right */}
          <Circle cx="160" cy="165" r="18" fill="#FFD700" stroke="#B8860B" strokeWidth="2.5" />
        </Svg>
      );

    case 'maerchen-07-spellbook.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* cover left */}
          <Path d="M 45 45 L 100 55 L 100 165 L 45 155 Z" fill="#7C5CFF" stroke="#4A2FBF" strokeWidth="2.5" />
          {/* cover right */}
          <Path d="M 155 45 L 100 55 L 100 165 L 155 155 Z" fill="#9B7BFF" stroke="#4A2FBF" strokeWidth="2.5" />
          {/* page line left1 */}
          <Line x1="55" y1="68" x2="90" y2="74" stroke="#E6DFFF" strokeWidth="2" />
          {/* page line left2 */}
          <Line x1="55" y1="85" x2="90" y2="90" stroke="#E6DFFF" strokeWidth="2" />
          {/* page line right1 */}
          <Line x1="110" y1="74" x2="145" y2="68" stroke="#E6DFFF" strokeWidth="2" />
          {/* page line right2 */}
          <Line x1="110" y1="90" x2="145" y2="85" stroke="#E6DFFF" strokeWidth="2" />
          {/* star */}
          <Polygon points="100,95 106,110 122,110 109,120 114,136 100,127 86,136 91,120 78,110 94,110" fill="#FFD700" stroke="#B8860B" strokeWidth="1.5" />
          {/* bookmark ribbon */}
          <Rect x="96" y="40" width="8" height="30" fill="#E74C3C" />
          {/* sparkle1 */}
          <Circle cx="130" cy="40" r="3" fill="#FFD700" />
          {/* sparkle2 */}
          <Circle cx="65" cy="35" r="2.5" fill="#87CEEB" />
        </Svg>
      );

    case 'maerchen-08-unicorn.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* body */}
          <Ellipse cx="105" cy="120" rx="55" ry="34" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="2.5" />
          {/* head */}
          <Circle cx="65" cy="78" r="30" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="2.5" />
          {/* horn */}
          <Polygon points="65,48 58,15 74,44" fill="#FFD700" stroke="#B8860B" strokeWidth="2" />
          {/* mane */}
          <Path d="M 55 60 Q 40 40 55 25 Q 65 42 62 55 Q 78 40 85 55 Q 72 55 66 68" fill="#FF69B4" stroke="#C2185B" strokeWidth="1.5" />
          {/* eye */}
          <Circle cx="55" cy="78" r="3" fill="#1A1A1A" />
          {/* leg1 */}
          <Rect x="55" y="145" width="12" height="30" rx="5" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="2" />
          {/* leg2 */}
          <Rect x="85" y="148" width="12" height="30" rx="5" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="2" />
          {/* leg3 */}
          <Rect x="115" y="148" width="12" height="30" rx="5" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="2" />
          {/* leg4 */}
          <Rect x="143" y="145" width="12" height="30" rx="5" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="2" />
          {/* tail */}
          <Path d="M 158 110 Q 178 120 170 145 Q 160 135 158 145" fill="#9B59B6" stroke="#6C3483" strokeWidth="1.5" />
          {/* sparkle1 */}
          <Circle cx="30" cy="40" r="3" fill="#FFD700" opacity="0.8" />
          {/* sparkle2 */}
          <Circle cx="165" cy="60" r="3" fill="#87CEEB" opacity="0.8" />
          {/* sparkle3 */}
          <Circle cx="175" cy="90" r="2.5" fill="#FF69B4" opacity="0.8" />
        </Svg>
      );

    case 'maerchen-09-dragon.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* body */}
          <Ellipse cx="100" cy="125" rx="50" ry="34" fill="#27AE60" stroke="#1B5E20" strokeWidth="2.5" />
          {/* head */}
          <Circle cx="145" cy="90" r="26" fill="#2ECC71" stroke="#1B5E20" strokeWidth="2.5" />
          {/* jaw/snout */}
          <Path d="M 165 78 L 178 68 L 172 84 Z" fill="#2ECC71" stroke="#1B5E20" strokeWidth="2" />
          {/* spike1 */}
          <Polygon points="130,68 128,50 140,64" fill="#1B5E20" stroke="none" />
          {/* spike2 */}
          <Polygon points="145,62 146,44 156,60" fill="#1B5E20" stroke="none" />
          {/* spike3 back */}
          <Polygon points="110,95 105,80 118,88" fill="#1B5E20" stroke="none" />
          {/* eye */}
          <Circle cx="150" cy="84" r="3.5" fill="#1A1A1A" />
          {/* tail */}
          <Path d="M 65 105 Q 25 95 20 70" fill="none" stroke="#1B5E20" strokeWidth="8" strokeLinecap="round" />
          {/* tail spike */}
          <Polygon points="18,66 12,55 24,58" fill="#1B5E20" stroke="none" />
          {/* wing */}
          <Path d="M 90 95 C 60 70 30 85 45 105 C 60 100 75 100 90 108" fill="#66BB6A" stroke="#1B5E20" strokeWidth="2" opacity="0.9" />
          {/* fire breath */}
          <Path d="M 168 66 Q 185 55 190 65 Q 178 68 175 76" fill="#FF7043" stroke="#E64A19" strokeWidth="1.5" />
          {/* foot */}
          <Circle cx="60" cy="155" r="8" fill="#27AE60" stroke="#1B5E20" strokeWidth="2" />
          {/* foot2 */}
          <Circle cx="130" cy="158" r="8" fill="#27AE60" stroke="#1B5E20" strokeWidth="2" />
        </Svg>
      );

    case 'maerchen-10-castletower.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* tower body */}
          <Rect x="62" y="75" width="76" height="105" fill="#D3D3D3" stroke="#8A8A8A" strokeWidth="2.5" />
          {/* roof */}
          <Polygon points="55,80 100,25 145,80" fill="#7C5CFF" stroke="#4A2FBF" strokeWidth="2.5" />
          {/* battlement1 */}
          <Rect x="60" y="68" width="12" height="14" fill="#D3D3D3" stroke="#8A8A8A" strokeWidth="2" />
          {/* battlement2 */}
          <Rect x="94" y="68" width="12" height="14" fill="#D3D3D3" stroke="#8A8A8A" strokeWidth="2" />
          {/* battlement3 */}
          <Rect x="128" y="68" width="12" height="14" fill="#D3D3D3" stroke="#8A8A8A" strokeWidth="2" />
          {/* door */}
          <Rect x="88" y="130" width="24" height="50" rx="12" fill="#5D4037" stroke="#3E2723" strokeWidth="2" />
          {/* window left */}
          <Rect x="80" y="95" width="18" height="20" fill="#87CEEB" stroke="#5D4037" strokeWidth="1.5" />
          {/* window right */}
          <Rect x="102" y="95" width="18" height="20" fill="#87CEEB" stroke="#5D4037" strokeWidth="1.5" />
          {/* window glow left */}
          <Circle cx="89" cy="105" r="4" fill="#FFD700" opacity="0.6" />
          {/* window glow right */}
          <Circle cx="111" cy="105" r="4" fill="#FFD700" opacity="0.6" />
          {/* flagpole */}
          <Line x1="100" y1="25" x2="100" y2="8" stroke="#5D4037" strokeWidth="3" />
          {/* flag */}
          <Polygon points="100,8 122,15 100,22" fill="#E74C3C" stroke="#B71C1C" strokeWidth="1.5" />
          {/* bush */}
          <Circle cx="40" cy="100" r="5" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1.5" />
        </Svg>
      );

  // ===== essen-v1 Pack =====
    case 'essen-01-popsicle.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* stick */}
          <Rect x="96" y="130" width="8" height="45" rx="3" fill="#E0C097" stroke="#B8935F" strokeWidth="1.5" />
          {/* body */}
          <Path d="M 60 40 Q 60 20 100 20 Q 140 20 140 40 L 140 120 Q 140 138 100 138 Q 60 138 60 120 Z" fill="#FF6B9D" stroke="#C2185B" strokeWidth="2.5" />
          {/* drip line1 */}
          <Path d="M 65 55 L 135 55" stroke="#FFFFFF" strokeWidth="3" opacity="0.6" />
          {/* drip line2 */}
          <Path d="M 65 80 L 135 80" stroke="#FFFFFF" strokeWidth="2" opacity="0.4" />
          {/* drip1 */}
          <Circle cx="78" cy="90" r="5" fill="#FFFFFF" opacity="0.5" />
          {/* drip2 */}
          <Circle cx="122" cy="100" r="4" fill="#FFFFFF" opacity="0.5" />
          {/* melt drip */}
          <Path d="M 100 138 L 96 150 L 104 150 Z" fill="#FF6B9D" stroke="none" />
          {/* shine */}
          <Circle cx="90" cy="35" r="4" fill="#FFFFFF" opacity="0.5" />
        </Svg>
      );

    case 'essen-02-cookie.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* cookie */}
          <Circle cx="100" cy="100" r="65" fill="#D2A679" stroke="#A6764A" strokeWidth="2.5" />
          {/* choc1 */}
          <Circle cx="75" cy="75" r="8" fill="#5D3A1A" />
          {/* choc2 */}
          <Circle cx="120" cy="70" r="7" fill="#5D3A1A" />
          {/* choc3 */}
          <Circle cx="135" cy="105" r="8" fill="#5D3A1A" />
          {/* choc4 */}
          <Circle cx="100" cy="120" r="7" fill="#5D3A1A" />
          {/* choc5 */}
          <Circle cx="68" cy="118" r="6" fill="#5D3A1A" />
          {/* choc6 */}
          <Circle cx="110" cy="95" r="6" fill="#5D3A1A" />
          {/* choc7 */}
          <Circle cx="90" cy="145" r="5" fill="#5D3A1A" />
          {/* choc8 */}
          <Circle cx="140" cy="135" r="5" fill="#5D3A1A" />
        </Svg>
      );

    case 'essen-03-strawberry.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* body */}
          <Path d="M 100 55 C 50 55 40 110 65 150 C 80 172 120 172 135 150 C 160 110 150 55 100 55 Z" fill="#E74C3C" stroke="#B71C1C" strokeWidth="2.5" />
          {/* leaf */}
          <Path d="M 100 55 L 80 30 L 92 42 L 100 25 L 108 42 L 120 30 Z" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2" />
          {/* seed1 */}
          <Circle cx="82" cy="90" r="3" fill="#FFD700" />
          {/* seed2 */}
          <Circle cx="108" cy="85" r="3" fill="#FFD700" />
          {/* seed3 */}
          <Circle cx="122" cy="105" r="3" fill="#FFD700" />
          {/* seed4 */}
          <Circle cx="90" cy="118" r="3" fill="#FFD700" />
          {/* seed5 */}
          <Circle cx="110" cy="135" r="3" fill="#FFD700" />
          {/* seed6 */}
          <Circle cx="75" cy="130" r="3" fill="#FFD700" />
          {/* seed7 */}
          <Circle cx="95" cy="155" r="3" fill="#FFD700" />
        </Svg>
      );

    case 'essen-04-pizza.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* crust wedge */}
          <Path d="M 100 35 L 165 165 L 35 165 Z" fill="#FFD54F" stroke="#E6A800" strokeWidth="2.5" />
          {/* crust edge */}
          <Path d="M 40 155 L 160 155 L 165 165 L 35 165 Z" fill="#F0C060" stroke="#E6A800" strokeWidth="2" />
          {/* pepperoni1 */}
          <Circle cx="90" cy="90" r="12" fill="#E74C3C" stroke="#B71C1C" strokeWidth="1.5" />
          {/* pepperoni2 */}
          <Circle cx="118" cy="115" r="11" fill="#E74C3C" stroke="#B71C1C" strokeWidth="1.5" />
          {/* pepperoni3 */}
          <Circle cx="100" cy="140" r="10" fill="#E74C3C" stroke="#B71C1C" strokeWidth="1.5" />
          {/* pepperoni4 */}
          <Circle cx="78" cy="130" r="9" fill="#E74C3C" stroke="#B71C1C" strokeWidth="1.5" />
          {/* basil1 */}
          <Circle cx="105" cy="70" r="5" fill="#4CAF50" />
          {/* basil2 */}
          <Circle cx="75" cy="120" r="5" fill="#4CAF50" />
          {/* basil3 */}
          <Circle cx="130" cy="145" r="4" fill="#4CAF50" />
          {/* crust texture */}
          <Line x1="60" y1="100" x2="70" y2="95" stroke="#E6A800" strokeWidth="1.5" opacity="0.6" />
        </Svg>
      );

    case 'essen-05-cupcake.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* wrapper */}
          <Path d="M 60 120 L 140 120 L 128 172 L 72 172 Z" fill="#FF7043" stroke="#E64A19" strokeWidth="2" />
          {/* wrapper line1 */}
          <Line x1="75" y1="122" x2="68" y2="168" stroke="#E64A19" strokeWidth="1.5" />
          {/* wrapper line2 */}
          <Line x1="100" y1="122" x2="100" y2="170" stroke="#E64A19" strokeWidth="1.5" />
          {/* wrapper line3 */}
          <Line x1="125" y1="122" x2="132" y2="168" stroke="#E64A19" strokeWidth="1.5" />
          {/* frosting */}
          <Path d="M 55 120 Q 60 70 100 75 Q 140 70 145 120 Z" fill="#FFFFFF" stroke="#D0D0D0" strokeWidth="2" />
          {/* frosting swirl */}
          <Path d="M 65 90 Q 100 60 135 90" fill="none" stroke="#D0D0D0" strokeWidth="2" />
          {/* cherry */}
          <Circle cx="100" cy="68" r="9" fill="#E74C3C" stroke="#B71C1C" strokeWidth="1.5" />
          {/* sprinkle1 */}
          <Circle cx="80" cy="95" r="3" fill="#3498DB" />
          {/* sprinkle2 */}
          <Circle cx="120" cy="100" r="3" fill="#FFD700" />
          {/* sprinkle3 */}
          <Circle cx="95" cy="105" r="3" fill="#27AE60" />
          {/* sprinkle4 */}
          <Circle cx="112" cy="88" r="3" fill="#FF69B4" />
        </Svg>
      );

    case 'essen-06-banana.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* body */}
          <Path d="M 55 60 C 40 100 55 150 105 160 C 145 168 165 145 160 125 C 145 150 110 150 90 130 C 65 108 65 75 80 55 Z" fill="#FFD700" stroke="#D4A017" strokeWidth="2.5" />
          {/* stem */}
          <Path d="M 55 60 C 60 50 72 48 80 55" fill="none" stroke="#8B6914" strokeWidth="3" strokeLinecap="round" />
          {/* ridge line1 */}
          <Path d="M 70 75 C 60 100 65 130 100 145" fill="none" stroke="#D4A017" strokeWidth="1.5" opacity="0.7" />
          {/* ridge line2 */}
          <Path d="M 85 65 C 78 95 82 125 115 148" fill="none" stroke="#D4A017" strokeWidth="1.5" opacity="0.5" />
          {/* tip */}
          <Circle cx="158" cy="128" r="5" fill="#4E342E" />
          {/* shine */}
          <Circle cx="95" cy="95" r="4" fill="#FFFFFF" opacity="0.4" />
          {/* bruise mark1 */}
          <Path d="M 145 130 L 150 138" stroke="#8B6914" strokeWidth="1.5" opacity="0.6" />
          {/* bruise mark2 */}
          <Path d="M 110 140 L 116 145" stroke="#8B6914" strokeWidth="1.5" opacity="0.5" />
          {/* sparkle */}
          <Circle cx="175" cy="110" r="2.5" fill="#FFD700" opacity="0.7" />
          {/* sparkle2 */}
          <Circle cx="45" cy="45" r="2.5" fill="#FFD700" opacity="0.6" />
        </Svg>
      );

    case 'essen-07-carrot.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* root */}
          <Path d="M 75 70 L 125 70 L 105 170 Q 100 178 95 170 Z" fill="#FFA500" stroke="#E67E00" strokeWidth="2.5" />
          {/* texture1 */}
          <Line x1="82" y1="90" x2="92" y2="92" stroke="#E67E00" strokeWidth="1.5" />
          {/* texture2 */}
          <Line x1="108" y1="105" x2="118" y2="107" stroke="#E67E00" strokeWidth="1.5" />
          {/* texture3 */}
          <Line x1="90" y1="125" x2="98" y2="127" stroke="#E67E00" strokeWidth="1.5" />
          {/* texture4 */}
          <Line x1="96" y1="145" x2="104" y2="147" stroke="#E67E00" strokeWidth="1.5" />
          {/* leaf left */}
          <Path d="M 100 70 L 85 25" fill="none" stroke="#4CAF50" strokeWidth="6" strokeLinecap="round" />
          {/* leaf center */}
          <Path d="M 100 70 L 100 20" fill="none" stroke="#388E3C" strokeWidth="6" strokeLinecap="round" />
          {/* leaf right */}
          <Path d="M 100 70 L 115 25" fill="none" stroke="#4CAF50" strokeWidth="6" strokeLinecap="round" />
          {/* leaf tip left */}
          <Path d="M 85 25 L 78 15" fill="none" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" />
          {/* leaf tip right */}
          <Path d="M 115 25 L 122 15" fill="none" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" />
        </Svg>
      );

    case 'essen-08-cake.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* bottom tier */}
          <Rect x="45" y="120" width="110" height="50" rx="6" fill="#FF9EC4" stroke="#C2185B" strokeWidth="2.5" />
          {/* top tier */}
          <Rect x="65" y="85" width="70" height="40" rx="6" fill="#FFB6D9" stroke="#C2185B" strokeWidth="2.5" />
          {/* bottom frosting */}
          <Path d="M 45 122 Q 60 112 75 122 Q 90 112 105 122 Q 120 112 135 122 Q 148 112 155 122 L 155 130 L 45 130 Z" fill="#FFFFFF" stroke="none" />
          {/* top frosting */}
          <Path d="M 65 87 Q 78 78 90 87 Q 103 78 116 87 Q 128 78 135 87 L 135 94 L 65 94 Z" fill="#FFFFFF" stroke="none" />
          {/* candle1 */}
          <Rect x="82" y="55" width="5" height="30" fill="#FFD700" />
          {/* candle2 */}
          <Rect x="98" y="50" width="5" height="35" fill="#3498DB" />
          {/* candle3 */}
          <Rect x="114" y="55" width="5" height="30" fill="#FFD700" />
          {/* flame1 */}
          <Circle cx="84" cy="52" r="4" fill="#FF7043" />
          {/* flame2 */}
          <Circle cx="100" cy="47" r="4" fill="#FF7043" />
          {/* flame3 */}
          <Circle cx="116" cy="52" r="4" fill="#FF7043" />
          {/* sprinkle1 */}
          <Circle cx="60" cy="145" r="4" fill="#3498DB" />
          {/* sprinkle2 */}
          <Circle cx="140" cy="150" r="4" fill="#FFD700" />
          {/* sprinkle3 */}
          <Circle cx="80" cy="155" r="3.5" fill="#27AE60" />
          {/* sprinkle4 */}
          <Circle cx="120" cy="158" r="3.5" fill="#FF69B4" />
        </Svg>
      );

    case 'essen-09-hamburger.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* bun top */}
          <Path d="M 40 90 Q 40 55 100 55 Q 160 55 160 90 Z" fill="#E8B063" stroke="#B8804A" strokeWidth="2.5" />
          {/* sesame1 */}
          <Circle cx="70" cy="68" r="3" fill="#FFFFFF" />
          {/* sesame2 */}
          <Circle cx="100" cy="62" r="3" fill="#FFFFFF" />
          {/* sesame3 */}
          <Circle cx="130" cy="68" r="3" fill="#FFFFFF" />
          {/* sesame4 */}
          <Circle cx="85" cy="75" r="2.5" fill="#FFFFFF" />
          {/* lettuce */}
          <Path d="M 38 92 L 162 92 L 162 100 Q 100 110 38 100 Z" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2" />
          {/* patty */}
          <Rect x="40" y="100" width="120" height="18" fill="#8B5A2B" stroke="#5D3A1A" strokeWidth="2" />
          {/* cheese */}
          <Path d="M 40 118 L 160 118 L 155 128 L 45 128 Z" fill="#FFD700" stroke="#D4A017" strokeWidth="2" />
          {/* tomato */}
          <Ellipse cx="100" cy="128" rx="20" ry="6" fill="#E74C3C" stroke="#B71C1C" strokeWidth="1.5" />
          {/* onion ring */}
          <Circle cx="65" cy="128" r="5" fill="#9B59B6" stroke="#6C3483" strokeWidth="1" />
          {/* pickle */}
          <Circle cx="135" cy="128" r="5" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1" />
          {/* bun bottom */}
          <Rect x="42" y="133" width="116" height="30" rx="14" fill="#E8B063" stroke="#B8804A" strokeWidth="2.5" />
          {/* lettuce peek */}
          <Path d="M 60 133 Q 62 145 58 155" fill="none" stroke="#4CAF50" strokeWidth="2" opacity="0.6" />
        </Svg>
      );

    case 'essen-10-watermelon.svg':
      return (
        <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* rind outer */}
          <Path d="M 30 90 A 70 70 0 0 0 170 90 Z" fill="#4CAF50" stroke="#1B5E20" strokeWidth="2.5" />
          {/* rind inner white */}
          <Path d="M 40 90 A 60 60 0 0 0 160 90 Z" fill="#F1F8E9" stroke="none" />
          {/* flesh */}
          <Path d="M 48 90 A 52 52 0 0 0 152 90 Z" fill="#FF6B6B" stroke="#E74C3C" strokeWidth="2" />
          {/* seed1 */}
          <Circle cx="80" cy="78" r="3.5" fill="#1A1A1A" />
          {/* seed2 */}
          <Circle cx="100" cy="70" r="3.5" fill="#1A1A1A" />
          {/* seed3 */}
          <Circle cx="120" cy="78" r="3.5" fill="#1A1A1A" />
          {/* seed4 */}
          <Circle cx="90" cy="88" r="3.5" fill="#1A1A1A" />
          {/* seed5 */}
          <Circle cx="110" cy="88" r="3.5" fill="#1A1A1A" />
          {/* flat edge */}
          <Line x1="30" y1="90" x2="170" y2="90" stroke="#1B5E20" strokeWidth="2.5" />
          {/* juice drip1 */}
          <Circle cx="65" cy="95" r="3" fill="#FFFFFF" opacity="0.5" />
          {/* juice drip2 */}
          <Circle cx="135" cy="92" r="2.5" fill="#FFFFFF" opacity="0.4" />
          {/* seed6 */}
          <Circle cx="100" cy="88" r="3.5" fill="#1A1A1A" />
          {/* shine sparkle */}
          <Circle cx="40" cy="60" r="2.5" fill="#FFFFFF" opacity="0.5" />
        </Svg>
      );

    default:
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
