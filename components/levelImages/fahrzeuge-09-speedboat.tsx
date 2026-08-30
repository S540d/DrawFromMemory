import React from 'react';
import Svg, { Rect, Line, Path, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
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
}
