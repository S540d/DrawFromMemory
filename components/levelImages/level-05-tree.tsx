import React from 'react';
import Svg, { Circle, Ellipse, Rect } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Trunk */}
      <Rect
        x="88"
        y="110"
        width="24"
        height="60"
        fill="#8B4513"
        stroke="#000000"
        strokeWidth="2"
        rx="2"
      />
      {/* Root bumps */}
      <Ellipse cx="92" cy="168" rx="10" ry="5" fill="#8B4513" stroke="#000000" strokeWidth="1.5" />
      <Ellipse cx="108" cy="168" rx="10" ry="5" fill="#8B4513" stroke="#000000" strokeWidth="1.5" />
      {/* Crown - bottom layer */}
      <Circle cx="100" cy="85" r="35" fill="#27AE60" stroke="#000000" strokeWidth="2" />
      {/* Crown - left */}
      <Circle cx="75" cy="90" r="25" fill="#27AE60" stroke="#000000" strokeWidth="2" />
      {/* Crown - right */}
      <Circle cx="125" cy="90" r="25" fill="#27AE60" stroke="#000000" strokeWidth="2" />
      {/* Crown - top */}
      <Circle cx="100" cy="60" r="28" fill="#2ECC71" stroke="#000000" strokeWidth="2" />
      {/* Crown highlights */}
      <Circle cx="85" cy="70" r="12" fill="#2ECC71" stroke="none" opacity="0.6" />
    </Svg>
  );
}
