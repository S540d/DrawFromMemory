import React from 'react';
import Svg, { Circle, Ellipse, Line, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Orbiter body */}
      <Ellipse
        cx="100"
        cy="112"
        rx="20"
        ry="70"
        fill="#ECEFF1"
        stroke="#B0BEC5"
        strokeWidth="2.5"
      />
      {/* Nose cone */}
      <Polygon points="100,40 84,80 116,80" fill="#CFD8DC" stroke="#B0BEC5" strokeWidth="2" />
      {/* Left wing */}
      <Polygon points="82,140 35,178 100,160" fill="#CFD8DC" stroke="#B0BEC5" strokeWidth="2" />
      {/* Right wing */}
      <Polygon points="118,140 165,178 100,160" fill="#CFD8DC" stroke="#B0BEC5" strokeWidth="2" />
      {/* Left wing edge */}
      <Line x1="35" y1="178" x2="100" y2="190" stroke="#B0BEC5" strokeWidth="1.5" />
      {/* Right wing edge */}
      <Line x1="165" y1="178" x2="100" y2="190" stroke="#B0BEC5" strokeWidth="1.5" />
      {/* Cockpit window */}
      <Ellipse cx="100" cy="76" rx="12" ry="16" fill="#87CEEB" stroke="#78909C" strokeWidth="2" />
      {/* Engine left */}
      <Circle cx="88" cy="180" r="10" fill="#FF7043" stroke="#E64A19" strokeWidth="2" />
      {/* Engine center */}
      <Circle cx="100" cy="183" r="10" fill="#FF7043" stroke="#E64A19" strokeWidth="2" />
      {/* Engine right */}
      <Circle cx="112" cy="180" r="10" fill="#FF7043" stroke="#E64A19" strokeWidth="2" />
      {/* Flame left */}
      <Ellipse cx="88" cy="193" rx="7" ry="10" fill="#FFD700" stroke="none" />
      {/* Flame center */}
      <Ellipse cx="100" cy="197" rx="7" ry="11" fill="#FFD700" stroke="none" />
      {/* Flame right */}
      <Ellipse cx="112" cy="193" rx="7" ry="10" fill="#FFD700" stroke="none" />
      {/* Payload door line */}
      <Line x1="90" y1="88" x2="90" y2="155" stroke="#78909C" strokeWidth="1.5" />
    </Svg>
  );

  // ===== natur-v1 Pack =====
}
