import React from 'react';
import Svg, { Circle, Ellipse, Path, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* body */}
      <Ellipse
        cx="100"
        cy="130"
        rx="52"
        ry="40"
        fill="#4CAF50"
        stroke="#2E7D32"
        strokeWidth="2.5"
      />
      {/* eye dome left */}
      <Circle cx="68" cy="92" r="20" fill="#66BB6A" stroke="#2E7D32" strokeWidth="2.5" />
      {/* eye dome right */}
      <Circle cx="132" cy="92" r="20" fill="#66BB6A" stroke="#2E7D32" strokeWidth="2.5" />
      {/* pupil left */}
      <Circle cx="68" cy="90" r="9" fill="#1A1A1A" />
      {/* pupil right */}
      <Circle cx="132" cy="90" r="9" fill="#1A1A1A" />
      {/* smile */}
      <Path
        d="M 75 130 Q 100 150 125 130"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* crown */}
      <Polygon
        points="80,68 92,68 100,50 108,68 120,68 116,80 84,80"
        fill="#FFD700"
        stroke="#B8860B"
        strokeWidth="2"
      />
      {/* crown jewel */}
      <Circle cx="100" cy="60" r="4" fill="#E74C3C" />
      {/* foot left */}
      <Ellipse cx="55" cy="158" rx="20" ry="11" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2" />
      {/* foot right */}
      <Ellipse cx="145" cy="158" rx="20" ry="11" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2" />
      {/* sparkle */}
      <Circle cx="165" cy="60" r="3" fill="#FFD700" opacity="0.7" />
    </Svg>
  );
}
