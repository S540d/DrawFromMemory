import React from 'react';
import Svg, { Circle, Ellipse, Rect, Path, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox="0 0 240 220">
      {/* Mane outer */}
      <Circle cx="120" cy="90" r="50" fill="#FFA500" stroke="#000000" strokeWidth="2" />
      {/* Mane details */}
      <Circle cx="85" cy="70" r="22" fill="#FFA500" stroke="#000000" strokeWidth="1.5" />
      <Circle cx="155" cy="70" r="22" fill="#FFA500" stroke="#000000" strokeWidth="1.5" />
      {/* Head */}
      <Circle cx="120" cy="100" r="35" fill="#CD853F" stroke="#000000" strokeWidth="2" />
      {/* Ears */}
      <Polygon points="95,70 85,40 100,65" fill="#CD853F" stroke="#000000" strokeWidth="1.5" />
      <Polygon points="145,70 155,40 140,65" fill="#CD853F" stroke="#000000" strokeWidth="1.5" />
      {/* Eyes */}
      <Circle cx="110" cy="90" r="4" fill="#000000" />
      <Circle cx="130" cy="90" r="4" fill="#000000" />
      {/* Nose */}
      <Polygon points="120,105 115,115 125,115" fill="#000000" />
      {/* Snout */}
      <Ellipse cx="120" cy="108" rx="12" ry="10" fill="#F4A460" />
      {/* Body */}
      <Ellipse cx="120" cy="160" rx="30" ry="40" fill="#CD853F" stroke="#000000" strokeWidth="2" />
      {/* Front left leg */}
      <Rect
        x="105"
        y="185"
        width="10"
        height="30"
        fill="#8B6914"
        stroke="#000000"
        strokeWidth="2"
      />
      {/* Front right leg */}
      <Rect
        x="125"
        y="185"
        width="10"
        height="30"
        fill="#8B6914"
        stroke="#000000"
        strokeWidth="2"
      />
      {/* Tail */}
      <Path
        d="M 85 165 Q 40 160 45 110"
        stroke="#CD853F"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 45 110 Q 35 100 30 105"
        stroke="#FFA500"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
