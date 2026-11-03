import React from 'react';
import Svg, { Circle, Ellipse, Rect, Path, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Water surface */}
      <Path
        d="M 8 100 Q 28 90 48 100 Q 68 110 88 100 Q 108 90 128 100 Q 148 110 168 100 Q 188 90 200 100"
        stroke="#87CEEB"
        strokeWidth="3"
        fill="none"
      />
      {/* Sub body */}
      <Ellipse
        cx="100"
        cy="130"
        rx="82"
        ry="30"
        fill="#FFD700"
        stroke="#FFC107"
        strokeWidth="2.5"
      />
      {/* Conning tower */}
      <Rect
        x="82"
        y="98"
        width="36"
        height="36"
        fill="#FFC300"
        stroke="#FFA000"
        strokeWidth="2"
        rx="5"
      />
      {/* Periscope shaft */}
      <Rect
        x="96"
        y="72"
        width="8"
        height="30"
        fill="#FFA000"
        stroke="#E65100"
        strokeWidth="1.5"
        rx="2"
      />
      {/* Periscope head */}
      <Rect
        x="88"
        y="70"
        width="24"
        height="8"
        fill="#FFA000"
        stroke="#E65100"
        strokeWidth="1.5"
        rx="2"
      />
      {/* Propeller */}
      <Ellipse cx="18" cy="130" rx="6" ry="18" fill="#FFC107" stroke="#FFA000" strokeWidth="2" />
      {/* Porthole 1 */}
      <Circle cx="68" cy="132" r="10" fill="#87CEEB" stroke="#FFA000" strokeWidth="2" />
      {/* Porthole 2 */}
      <Circle cx="110" cy="132" r="10" fill="#87CEEB" stroke="#FFA000" strokeWidth="2" />
      {/* Porthole 3 */}
      <Circle cx="148" cy="132" r="10" fill="#87CEEB" stroke="#FFA000" strokeWidth="2" />
      {/* Nose cone */}
      <Ellipse cx="180" cy="130" rx="18" ry="22" fill="#FFD700" stroke="#FFC107" strokeWidth="2" />
      {/* Torpedo tube */}
      <Rect
        x="192"
        y="124"
        width="10"
        height="12"
        fill="#FFA000"
        stroke="#E65100"
        strokeWidth="1.5"
        rx="2"
      />
      {/* Fin top */}
      <Polygon points="130,98 124,76 146,98" fill="#FFC107" stroke="#FFA000" strokeWidth="2" />
      {/* Fin bottom */}
      <Polygon points="130,162 124,182 146,162" fill="#FFC107" stroke="#FFA000" strokeWidth="2" />
    </Svg>
  );
}
