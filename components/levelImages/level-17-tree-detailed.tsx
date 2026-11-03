import React from 'react';
import Svg, { Circle, Ellipse, Rect, Line } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Trunk */}
      <Rect
        x="86"
        y="115"
        width="28"
        height="65"
        fill="#8B4513"
        stroke="#000000"
        strokeWidth="2"
        rx="3"
      />
      {/* Trunk texture */}
      <Line x1="92" y1="120" x2="90" y2="175" stroke="#6B3410" strokeWidth="1.5" />
      <Line x1="108" y1="120" x2="110" y2="175" stroke="#6B3410" strokeWidth="1.5" />
      {/* Roots */}
      <Ellipse cx="90" cy="178" rx="12" ry="5" fill="#8B4513" stroke="#000000" strokeWidth="1.5" />
      <Ellipse cx="110" cy="178" rx="12" ry="5" fill="#8B4513" stroke="#000000" strokeWidth="1.5" />
      {/* Bottom crown layer */}
      <Circle cx="100" cy="92" r="42" fill="#27AE60" stroke="#000000" strokeWidth="2" />
      {/* Left crown */}
      <Circle cx="68" cy="98" r="28" fill="#27AE60" stroke="#000000" strokeWidth="2" />
      {/* Right crown */}
      <Circle cx="132" cy="98" r="28" fill="#27AE60" stroke="#000000" strokeWidth="2" />
      {/* Top crown */}
      <Circle cx="100" cy="62" r="32" fill="#2ECC71" stroke="#000000" strokeWidth="2" />
      {/* Highlight */}
      <Circle cx="82" cy="68" r="14" fill="#2ECC71" stroke="none" opacity="0.6" />
      {/* Small branches */}
      <Line
        x1="100"
        y1="115"
        x2="75"
        y2="100"
        stroke="#8B4513"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Line
        x1="100"
        y1="115"
        x2="125"
        y2="100"
        stroke="#8B4513"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Apple */}
      <Circle cx="125" cy="88" r="7" fill="#E74C3C" stroke="#000000" strokeWidth="1.5" />
      {/* Apple stem */}
      <Line
        x1="125"
        y1="81"
        x2="127"
        y2="75"
        stroke="#8B4513"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}
