import React from 'react';
import Svg, { Circle, Ellipse, Rect, Line, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* body */}
      <Ellipse
        cx="100"
        cy="105"
        rx="62"
        ry="45"
        fill="#FF7043"
        stroke="#E64A19"
        strokeWidth="2.5"
      />
      {/* rib1 */}
      <Line x1="65" y1="65" x2="65" y2="145" stroke="#E64A19" strokeWidth="2" />
      {/* rib2 */}
      <Line x1="100" y1="60" x2="100" y2="150" stroke="#E64A19" strokeWidth="2" />
      {/* rib3 */}
      <Line x1="135" y1="65" x2="135" y2="145" stroke="#E64A19" strokeWidth="2" />
      {/* window */}
      <Rect
        x="82"
        y="78"
        width="36"
        height="30"
        rx="6"
        fill="#87CEEB"
        stroke="#E64A19"
        strokeWidth="2"
      />
      {/* side lantern */}
      <Circle cx="55" cy="90" r="8" fill="#FFD700" stroke="#B8860B" strokeWidth="1.5" />
      {/* vine stem */}
      <Path
        d="M 96 40 Q 100 22 110 30"
        fill="none"
        stroke="#4CAF50"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* vine leaf */}
      <Circle cx="112" cy="25" r="5" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1" />
      {/* wheel left */}
      <Circle cx="40" cy="165" r="18" fill="#FFD700" stroke="#B8860B" strokeWidth="2.5" />
      {/* wheel right */}
      <Circle cx="160" cy="165" r="18" fill="#FFD700" stroke="#B8860B" strokeWidth="2.5" />
    </Svg>
  );
}
