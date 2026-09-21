import React from 'react';
import Svg, { Circle, Rect, Line, Path, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
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
      <Rect x="135" y="45" width="20" height="40" fill="#A0522D" stroke="#000000" strokeWidth="2" />
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
      <Rect x="45" y="120" width="28" height="28" fill="#87CEEB" stroke="#000000" strokeWidth="2" />
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
}
