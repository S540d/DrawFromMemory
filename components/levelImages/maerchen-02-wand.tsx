import React from 'react';
import Svg, { Circle, Rect, Path, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* stick */}
      <Rect
        x="93"
        y="90"
        width="12"
        height="90"
        rx="6"
        fill="#8B5A2B"
        stroke="#5D3A1A"
        strokeWidth="2"
        transform="rotate(20 100 135)"
      />
      {/* star tip */}
      <Polygon
        points="100,25 110,55 140,58 116,78 124,108 100,90 76,108 84,78 60,58 90,55"
        fill="#FFD700"
        stroke="#B8860B"
        strokeWidth="2"
      />
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
      <Path
        d="M 130 70 Q 145 85 135 100"
        fill="none"
        stroke="#FFD700"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </Svg>
  );
}
