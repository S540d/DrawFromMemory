import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* body */}
      <Path
        d="M 55 60 C 40 100 55 150 105 160 C 145 168 165 145 160 125 C 145 150 110 150 90 130 C 65 108 65 75 80 55 Z"
        fill="#FFD700"
        stroke="#D4A017"
        strokeWidth="2.5"
      />
      {/* stem */}
      <Path
        d="M 55 60 C 60 50 72 48 80 55"
        fill="none"
        stroke="#8B6914"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* ridge line1 */}
      <Path
        d="M 70 75 C 60 100 65 130 100 145"
        fill="none"
        stroke="#D4A017"
        strokeWidth="1.5"
        opacity="0.7"
      />
      {/* ridge line2 */}
      <Path
        d="M 85 65 C 78 95 82 125 115 148"
        fill="none"
        stroke="#D4A017"
        strokeWidth="1.5"
        opacity="0.5"
      />
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
}
