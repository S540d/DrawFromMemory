import React from 'react';
import Svg, { Circle, Rect, Line, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox="0 0 240 180">
      {/* Car body */}
      <Rect
        x="30"
        y="80"
        width="180"
        height="50"
        fill="#E74C3C"
        stroke="#000000"
        strokeWidth="2"
        rx="8"
      />
      {/* Car roof/cabin */}
      <Path d="M 70 80 L 85 45 L 165 45 L 180 80" fill="#E74C3C" stroke="#000000" strokeWidth="2" />
      {/* Windshield */}
      <Path
        d="M 88 48 L 78 78 L 115 78 L 115 48 Z"
        fill="#87CEEB"
        stroke="#000000"
        strokeWidth="1.5"
      />
      {/* Rear window */}
      <Path
        d="M 125 48 L 125 78 L 172 78 L 162 48 Z"
        fill="#87CEEB"
        stroke="#000000"
        strokeWidth="1.5"
      />
      {/* Front bumper */}
      <Rect
        x="195"
        y="90"
        width="20"
        height="30"
        fill="#C0392B"
        stroke="#000000"
        strokeWidth="2"
        rx="4"
      />
      {/* Rear bumper */}
      <Rect
        x="25"
        y="90"
        width="15"
        height="30"
        fill="#C0392B"
        stroke="#000000"
        strokeWidth="2"
        rx="4"
      />
      {/* Headlight */}
      <Circle cx="210" cy="100" r="6" fill="#FFD700" stroke="#000000" strokeWidth="1.5" />
      {/* Taillight */}
      <Circle cx="30" cy="100" r="5" fill="#FF4500" stroke="#000000" strokeWidth="1.5" />
      {/* Front wheel */}
      <Circle cx="170" cy="130" r="22" fill="#333333" stroke="#000000" strokeWidth="2" />
      <Circle cx="170" cy="130" r="12" fill="#808080" stroke="#000000" strokeWidth="1.5" />
      <Circle cx="170" cy="130" r="4" fill="#333333" />
      {/* Rear wheel */}
      <Circle cx="75" cy="130" r="22" fill="#333333" stroke="#000000" strokeWidth="2" />
      <Circle cx="75" cy="130" r="12" fill="#808080" stroke="#000000" strokeWidth="1.5" />
      <Circle cx="75" cy="130" r="4" fill="#333333" />
      {/* Door handle */}
      <Line
        x1="120"
        y1="95"
        x2="140"
        y2="95"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}
