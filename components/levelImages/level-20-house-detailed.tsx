import React from 'react';
import Svg, { Circle, Rect, Line, Path, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox="0 0 220 240">
      {/* Sky / background */}
      <Rect width="220" height="240" fill="#E8F4F8" />
      {/* House body */}
      <Rect
        x="40"
        y="100"
        width="130"
        height="115"
        fill="#E74C3C"
        stroke="#000000"
        strokeWidth="2"
      />
      {/* Roof */}
      <Polygon points="30,100 110,28 190,100" fill="#8B4513" stroke="#000000" strokeWidth="2" />
      {/* Chimney */}
      <Rect x="148" y="48" width="18" height="38" fill="#A0522D" stroke="#000000" strokeWidth="2" />
      {/* Door */}
      <Rect
        x="88"
        y="148"
        width="34"
        height="55"
        fill="#654321"
        stroke="#000000"
        strokeWidth="2"
        rx="3"
      />
      {/* Door arch */}
      <Path d="M 88 148 Q 105 132 122 148" fill="#654321" stroke="#000000" strokeWidth="2" />
      {/* Door handle */}
      <Circle cx="116" cy="175" r="3" fill="#FFD700" />
      {/* Left window */}
      <Rect
        x="52"
        y="118"
        width="30"
        height="28"
        fill="#87CEEB"
        stroke="#000000"
        strokeWidth="2"
        rx="2"
      />
      <Line x1="67" y1="118" x2="67" y2="146" stroke="#000000" strokeWidth="1.5" />
      <Line x1="52" y1="132" x2="82" y2="132" stroke="#000000" strokeWidth="1.5" />
      {/* Right window */}
      <Rect
        x="138"
        y="118"
        width="30"
        height="28"
        fill="#87CEEB"
        stroke="#000000"
        strokeWidth="2"
        rx="2"
      />
      <Line x1="153" y1="118" x2="153" y2="146" stroke="#000000" strokeWidth="1.5" />
      <Line x1="138" y1="132" x2="168" y2="132" stroke="#000000" strokeWidth="1.5" />
      {/* Ground */}
      <Rect x="0" y="214" width="220" height="26" fill="#27AE60" />
      {/* Path */}
      <Polygon
        points="88,215 122,215 130,238 80,238"
        fill="#F0D080"
        stroke="#000000"
        strokeWidth="1"
      />
      {/* Left tree */}
      <Rect
        x="16"
        y="165"
        width="8"
        height="30"
        fill="#8B4513"
        stroke="#000000"
        strokeWidth="1.5"
      />
      <Circle cx="20" cy="152" r="18" fill="#27AE60" stroke="#000000" strokeWidth="1.5" />
      {/* Right bush */}
      <Circle cx="188" cy="200" r="14" fill="#2ECC71" stroke="#000000" strokeWidth="1.5" />
      <Circle cx="200" cy="205" r="10" fill="#27AE60" stroke="#000000" strokeWidth="1.5" />
      {/* Fence left */}
      <Line x1="0" y1="215" x2="75" y2="215" stroke="#8B4513" strokeWidth="3" />
      <Line
        x1="10"
        y1="205"
        x2="10"
        y2="215"
        stroke="#8B4513"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Line
        x1="25"
        y1="205"
        x2="25"
        y2="215"
        stroke="#8B4513"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Line
        x1="40"
        y1="205"
        x2="40"
        y2="215"
        stroke="#8B4513"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Line
        x1="55"
        y1="205"
        x2="55"
        y2="215"
        stroke="#8B4513"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Line
        x1="70"
        y1="205"
        x2="70"
        y2="215"
        stroke="#8B4513"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  );

  // ── Tiere v1 Pack ──────────────────────────────────────────────────────
}
