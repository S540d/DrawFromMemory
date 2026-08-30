import React from 'react';
import Svg, { Circle, Ellipse, Line, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Body */}
      <Ellipse cx="95" cy="120" rx="48" ry="38" fill="#FFD700" stroke="#FF8C00" strokeWidth="2" />
      {/* Head */}
      <Circle cx="125" cy="78" r="26" fill="#FFD700" stroke="#FF8C00" strokeWidth="2" />
      {/* Beak */}
      <Polygon points="151,75 175,70 151,84" fill="#FF8C00" stroke="#CC6600" strokeWidth="1.5" />
      {/* Eye */}
      <Circle cx="130" cy="73" r="5" fill="#1A1A1A" />
      {/* Eye shine */}
      <Circle cx="132" cy="71" r="2" fill="#FFFFFF" />
      {/* Wing */}
      <Ellipse
        cx="75"
        cy="115"
        rx="32"
        ry="20"
        fill="#F9A825"
        stroke="#FF8C00"
        strokeWidth="2"
        transform="rotate(-15 75 115)"
      />
      {/* Tail feather */}
      <Polygon points="47,118 22,108 22,128" fill="#F9A825" stroke="#FF8C00" strokeWidth="2" />
      {/* Left foot */}
      <Line
        x1="90"
        y1="155"
        x2="80"
        y2="172"
        stroke="#FF8C00"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Right foot */}
      <Line
        x1="110"
        y1="155"
        x2="120"
        y2="172"
        stroke="#FF8C00"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Webbed feet base */}
      <Ellipse cx="100" cy="175" rx="20" ry="6" fill="#FF8C00" stroke="#CC6600" strokeWidth="1.5" />
    </Svg>
  );
}
