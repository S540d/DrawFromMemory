import React from 'react';
import Svg, { Circle, Rect, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
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
      <Rect x="85" y="150" width="30" height="50" fill="#8B4513" stroke="#000000" strokeWidth="2" />
      {/* Door handle */}
      <Circle cx="112" cy="175" r="3" fill="#FFD700" />
      {/* Left window */}
      <Rect x="55" y="115" width="25" height="25" fill="#87CEEB" stroke="#000000" strokeWidth="2" />
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
}
