import React from 'react';
import Svg, { Circle, Rect, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox="0 0 300 200">
      {/* Sky */}
      <Rect width="300" height="100" fill="#87CEEB" />
      {/* Ground */}
      <Rect y="100" width="300" height="100" fill="#90EE90" />
      {/* Mountains */}
      <Polygon points="0,100 80,40 160,100" fill="#8B7355" stroke="#000000" strokeWidth="2" />
      <Polygon points="140,100 200,50 260,100" fill="#A0826D" stroke="#000000" strokeWidth="2" />
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
}
