import React from 'react';
import Svg, { Circle, Ellipse, Line, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Bird Body */}
      <Ellipse cx="100" cy="100" rx="35" ry="25" fill="#1E90FF" stroke="#0000CD" strokeWidth="3" />
      {/* Bird Head */}
      <Circle cx="130" cy="85" r="20" fill="#1E90FF" stroke="#0000CD" strokeWidth="3" />
      {/* Eye */}
      <Circle cx="135" cy="82" r="4" fill="#000000" />
      <Circle cx="137" cy="80" r="2" fill="#FFFFFF" />
      {/* Beak */}
      <Polygon points="150,85 165,82 150,90" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
      {/* Wing */}
      <Ellipse
        cx="90"
        cy="100"
        rx="30"
        ry="20"
        fill="#4169E1"
        stroke="#0000CD"
        strokeWidth="3"
        transform="rotate(-20 90 100)"
      />
      {/* Wing Detail Lines */}
      <Line x1="70" y1="95" x2="85" y2="105" stroke="#0000CD" strokeWidth="2" />
      <Line x1="75" y1="90" x2="90" y2="100" stroke="#0000CD" strokeWidth="2" />
      {/* Tail Feathers */}
      <Ellipse
        cx="60"
        cy="105"
        rx="20"
        ry="12"
        fill="#4169E1"
        stroke="#0000CD"
        strokeWidth="2"
        transform="rotate(-30 60 105)"
      />
      <Ellipse
        cx="65"
        cy="110"
        rx="18"
        ry="10"
        fill="#4169E1"
        stroke="#0000CD"
        strokeWidth="2"
        transform="rotate(-20 65 110)"
      />
      {/* Legs */}
      <Line
        x1="100"
        y1="120"
        x2="95"
        y2="135"
        stroke="#FFA500"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Line
        x1="110"
        y1="120"
        x2="115"
        y2="135"
        stroke="#FFA500"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Feet */}
      <Line x1="90" y1="135" x2="95" y2="135" stroke="#FFA500" strokeWidth="2" />
      <Line x1="95" y1="135" x2="100" y2="135" stroke="#FFA500" strokeWidth="2" />
      <Line x1="110" y1="135" x2="115" y2="135" stroke="#FFA500" strokeWidth="2" />
      <Line x1="115" y1="135" x2="120" y2="135" stroke="#FFA500" strokeWidth="2" />
    </Svg>
  );
}
