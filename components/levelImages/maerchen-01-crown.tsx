import React from 'react';
import Svg, { Circle, Rect, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* crown body */}
      <Polygon
        points="40,150 40,95 65,120 100,70 135,120 160,95 160,150"
        fill="#FFD700"
        stroke="#B8860B"
        strokeWidth="2.5"
      />
      {/* crown base */}
      <Rect
        x="36"
        y="148"
        width="128"
        height="18"
        rx="4"
        fill="#FFD700"
        stroke="#B8860B"
        strokeWidth="2.5"
      />
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
}
