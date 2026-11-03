import React from 'react';
import Svg, { Circle, Rect, Line, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* tower body */}
      <Rect
        x="62"
        y="75"
        width="76"
        height="105"
        fill="#D3D3D3"
        stroke="#8A8A8A"
        strokeWidth="2.5"
      />
      {/* roof */}
      <Polygon points="55,80 100,25 145,80" fill="#7C5CFF" stroke="#4A2FBF" strokeWidth="2.5" />
      {/* battlement1 */}
      <Rect x="60" y="68" width="12" height="14" fill="#D3D3D3" stroke="#8A8A8A" strokeWidth="2" />
      {/* battlement2 */}
      <Rect x="94" y="68" width="12" height="14" fill="#D3D3D3" stroke="#8A8A8A" strokeWidth="2" />
      {/* battlement3 */}
      <Rect x="128" y="68" width="12" height="14" fill="#D3D3D3" stroke="#8A8A8A" strokeWidth="2" />
      {/* door */}
      <Rect
        x="88"
        y="130"
        width="24"
        height="50"
        rx="12"
        fill="#5D4037"
        stroke="#3E2723"
        strokeWidth="2"
      />
      {/* window left */}
      <Rect
        x="80"
        y="95"
        width="18"
        height="20"
        fill="#87CEEB"
        stroke="#5D4037"
        strokeWidth="1.5"
      />
      {/* window right */}
      <Rect
        x="102"
        y="95"
        width="18"
        height="20"
        fill="#87CEEB"
        stroke="#5D4037"
        strokeWidth="1.5"
      />
      {/* window glow left */}
      <Circle cx="89" cy="105" r="4" fill="#FFD700" opacity="0.6" />
      {/* window glow right */}
      <Circle cx="111" cy="105" r="4" fill="#FFD700" opacity="0.6" />
      {/* flagpole */}
      <Line x1="100" y1="25" x2="100" y2="8" stroke="#5D4037" strokeWidth="3" />
      {/* flag */}
      <Polygon points="100,8 122,15 100,22" fill="#E74C3C" stroke="#B71C1C" strokeWidth="1.5" />
      {/* bush */}
      <Circle cx="40" cy="100" r="5" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1.5" />
    </Svg>
  );

  // ===== essen-v1 Pack =====
}
