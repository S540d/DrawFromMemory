import React from 'react';
import Svg, { Circle, Rect, Line, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox="0 0 240 180">
      {/* Car body */}
      <Rect
        x="25"
        y="80"
        width="190"
        height="55"
        fill="#2ECC71"
        stroke="#000000"
        strokeWidth="2"
        rx="8"
      />
      {/* Roof */}
      <Path d="M 65 80 L 80 42 L 170 42 L 185 80" fill="#27AE60" stroke="#000000" strokeWidth="2" />
      {/* Windshield */}
      <Path
        d="M 83 45 L 73 78 L 118 78 L 118 45 Z"
        fill="#87CEEB"
        stroke="#000000"
        strokeWidth="1.5"
      />
      {/* Rear window */}
      <Path
        d="M 122 45 L 122 78 L 167 78 L 157 45 Z"
        fill="#87CEEB"
        stroke="#000000"
        strokeWidth="1.5"
      />
      {/* Front bumper */}
      <Rect
        x="200"
        y="92"
        width="18"
        height="28"
        fill="#1E8449"
        stroke="#000000"
        strokeWidth="2"
        rx="4"
      />
      {/* Rear bumper */}
      <Rect
        x="22"
        y="92"
        width="14"
        height="28"
        fill="#1E8449"
        stroke="#000000"
        strokeWidth="2"
        rx="4"
      />
      {/* Headlight */}
      <Circle cx="213" cy="103" r="6" fill="#FFD700" stroke="#000000" strokeWidth="1.5" />
      {/* Taillight */}
      <Circle cx="28" cy="103" r="5" fill="#E74C3C" stroke="#000000" strokeWidth="1.5" />
      {/* Front wheel */}
      <Circle cx="172" cy="133" r="22" fill="#333333" stroke="#000000" strokeWidth="2" />
      <Circle cx="172" cy="133" r="12" fill="#808080" stroke="#000000" strokeWidth="1.5" />
      <Circle cx="172" cy="133" r="4" fill="#333333" />
      {/* Rear wheel */}
      <Circle cx="68" cy="133" r="22" fill="#333333" stroke="#000000" strokeWidth="2" />
      <Circle cx="68" cy="133" r="12" fill="#808080" stroke="#000000" strokeWidth="1.5" />
      <Circle cx="68" cy="133" r="4" fill="#333333" />
      {/* Door line */}
      <Line x1="125" y1="82" x2="125" y2="132" stroke="#000000" strokeWidth="1.5" />
      {/* Door handle front */}
      <Line
        x1="148"
        y1="100"
        x2="165"
        y2="100"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Door handle rear */}
      <Line
        x1="80"
        y1="100"
        x2="97"
        y2="100"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Exhaust */}
      <Rect
        x="22"
        y="125"
        width="12"
        height="5"
        fill="#888888"
        stroke="#000000"
        strokeWidth="1"
        rx="2"
      />
    </Svg>
  );
}
