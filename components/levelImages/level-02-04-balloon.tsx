import React from 'react';
import Svg, { Circle, Ellipse, Rect, Line } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox="0 0 200 260">
      {/* Balloon */}
      <Circle cx="100" cy="70" r="40" fill="#FF1493" stroke="#000000" strokeWidth="2" />
      {/* String line */}
      <Line x1="100" y1="110" x2="100" y2="220" stroke="#000000" strokeWidth="2" />
      {/* Basket */}
      <Rect x="75" y="220" width="50" height="35" fill="#CD853F" stroke="#000000" strokeWidth="2" />
      {/* Basket weave pattern */}
      <Line x1="85" y1="220" x2="85" y2="255" stroke="#000000" strokeWidth="1" />
      <Line x1="95" y1="220" x2="95" y2="255" stroke="#000000" strokeWidth="1" />
      <Line x1="105" y1="220" x2="105" y2="255" stroke="#000000" strokeWidth="1" />
      <Line x1="115" y1="220" x2="115" y2="255" stroke="#000000" strokeWidth="1" />
      {/* Highlight on balloon */}
      <Ellipse cx="85" cy="50" rx="12" ry="15" fill="#FFFFFF" opacity="0.3" />
    </Svg>
  );
}
