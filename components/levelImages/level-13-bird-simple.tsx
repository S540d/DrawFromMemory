import React from 'react';
import Svg, { Circle, Ellipse, Line, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Body */}
      <Ellipse cx="100" cy="110" rx="38" ry="25" fill="#1E90FF" stroke="#000000" strokeWidth="2" />
      {/* Head */}
      <Circle cx="130" cy="88" r="22" fill="#1E90FF" stroke="#000000" strokeWidth="2" />
      {/* Beak */}
      <Polygon points="152,88 170,84 152,94" fill="#FFD700" stroke="#000000" strokeWidth="1.5" />
      {/* Eye */}
      <Circle cx="136" cy="84" r="4" fill="#000000" />
      {/* Wing */}
      <Ellipse
        cx="88"
        cy="105"
        rx="30"
        ry="18"
        fill="#4169E1"
        stroke="#000000"
        strokeWidth="2"
        transform="rotate(-15 88 105)"
      />
      {/* Tail */}
      <Polygon points="62,110 38,100 38,120" fill="#4169E1" stroke="#000000" strokeWidth="2" />
      {/* Left leg */}
      <Line
        x1="95"
        y1="133"
        x2="90"
        y2="152"
        stroke="#FFD700"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Right leg */}
      <Line
        x1="108"
        y1="133"
        x2="113"
        y2="152"
        stroke="#FFD700"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  );
}
