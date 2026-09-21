import React from 'react';
import Svg, { Circle, Ellipse, Rect, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* bun top */}
      <Path
        d="M 40 90 Q 40 55 100 55 Q 160 55 160 90 Z"
        fill="#E8B063"
        stroke="#B8804A"
        strokeWidth="2.5"
      />
      {/* sesame1 */}
      <Circle cx="70" cy="68" r="3" fill="#FFFFFF" />
      {/* sesame2 */}
      <Circle cx="100" cy="62" r="3" fill="#FFFFFF" />
      {/* sesame3 */}
      <Circle cx="130" cy="68" r="3" fill="#FFFFFF" />
      {/* sesame4 */}
      <Circle cx="85" cy="75" r="2.5" fill="#FFFFFF" />
      {/* lettuce */}
      <Path
        d="M 38 92 L 162 92 L 162 100 Q 100 110 38 100 Z"
        fill="#4CAF50"
        stroke="#2E7D32"
        strokeWidth="2"
      />
      {/* patty */}
      <Rect
        x="40"
        y="100"
        width="120"
        height="18"
        fill="#8B5A2B"
        stroke="#5D3A1A"
        strokeWidth="2"
      />
      {/* cheese */}
      <Path
        d="M 40 118 L 160 118 L 155 128 L 45 128 Z"
        fill="#FFD700"
        stroke="#D4A017"
        strokeWidth="2"
      />
      {/* tomato */}
      <Ellipse cx="100" cy="128" rx="20" ry="6" fill="#E74C3C" stroke="#B71C1C" strokeWidth="1.5" />
      {/* onion ring */}
      <Circle cx="65" cy="128" r="5" fill="#9B59B6" stroke="#6C3483" strokeWidth="1" />
      {/* pickle */}
      <Circle cx="135" cy="128" r="5" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1" />
      {/* bun bottom */}
      <Rect
        x="42"
        y="133"
        width="116"
        height="30"
        rx="14"
        fill="#E8B063"
        stroke="#B8804A"
        strokeWidth="2.5"
      />
      {/* lettuce peek */}
      <Path
        d="M 60 133 Q 62 145 58 155"
        fill="none"
        stroke="#4CAF50"
        strokeWidth="2"
        opacity="0.6"
      />
    </Svg>
  );
}
