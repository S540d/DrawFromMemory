import React from 'react';
import Svg, { Circle, Ellipse, Rect, Line, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* pot base */}
      <Ellipse cx="100" cy="175" rx="42" ry="12" fill="#D2691E" stroke="#8B4513" strokeWidth="2" />
      {/* pot */}
      <Path
        d="M 66 175 L 74 132 Q 76 128 82 128 L 118 128 Q 124 128 126 132 L 134 175 Z"
        fill="#CD853F"
        stroke="#8B4513"
        strokeWidth="2"
      />
      {/* main body */}
      <Rect
        x="86"
        y="55"
        width="28"
        height="90"
        rx="14"
        fill="#4CAF50"
        stroke="#2E7D32"
        strokeWidth="2"
      />
      {/* left arm */}
      <Path
        d="M 86 95 Q 55 95 55 75 Q 55 65 65 65 Q 75 65 75 78 L 75 100"
        fill="#4CAF50"
        stroke="#2E7D32"
        strokeWidth="2"
      />
      {/* right arm */}
      <Path
        d="M 114 110 Q 145 110 145 90 Q 145 80 135 80 Q 125 80 125 93 L 125 115"
        fill="#4CAF50"
        stroke="#2E7D32"
        strokeWidth="2"
      />
      {/* spine line center */}
      <Line x1="100" y1="60" x2="100" y2="140" stroke="#2E7D32" strokeWidth="1.5" />
      {/* spine line left */}
      <Line x1="90" y1="65" x2="90" y2="138" stroke="#2E7D32" strokeWidth="1" opacity="0.7" />
      {/* spine line right */}
      <Line x1="110" y1="65" x2="110" y2="138" stroke="#2E7D32" strokeWidth="1" opacity="0.7" />
      {/* flower main */}
      <Circle cx="100" cy="50" r="10" fill="#FF69B4" stroke="#C2185B" strokeWidth="2" />
      {/* flower small */}
      <Circle cx="65" cy="60" r="6" fill="#FF69B4" stroke="#C2185B" strokeWidth="1.5" />
    </Svg>
  );
}
