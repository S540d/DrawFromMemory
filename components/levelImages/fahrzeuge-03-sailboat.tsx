import React from 'react';
import Svg, { Circle, Line, Path, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
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
      <Polygon points="100,55 100,128 162,118" fill="#FFFFFF" stroke="#4A90D9" strokeWidth="2" />
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
}
