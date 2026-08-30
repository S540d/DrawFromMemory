import React from 'react';
import Svg, { Circle, Ellipse, Path, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Fish body */}
      <Ellipse cx="105" cy="100" rx="52" ry="35" fill="#FF6347" stroke="#000000" strokeWidth="2" />
      {/* Tail fin */}
      <Polygon points="157,100 185,72 185,128" fill="#FFD700" stroke="#000000" strokeWidth="2" />
      {/* Dorsal fin */}
      <Path d="M 88 65 Q 105 42 125 65" fill="#FFD700" stroke="#000000" strokeWidth="2" />
      {/* Pectoral fin */}
      <Ellipse
        cx="115"
        cy="118"
        rx="18"
        ry="10"
        fill="#FFD700"
        stroke="#000000"
        strokeWidth="2"
        transform="rotate(30 115 118)"
      />
      {/* Eye ring */}
      <Circle cx="72" cy="92" r="12" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
      {/* Eye */}
      <Circle cx="74" cy="92" r="6" fill="#000000" />
      <Circle cx="76" cy="90" r="2" fill="#FFFFFF" />
      {/* Mouth */}
      <Path d="M 53 100 Q 57 106 53 112" stroke="#000000" strokeWidth="2" fill="none" />
      {/* Stripe 1 */}
      <Path
        d="M 90 65 Q 88 100 90 135"
        stroke="#FFFFFF"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Stripe 2 */}
      <Path
        d="M 110 65 Q 108 100 110 135"
        stroke="#FFFFFF"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Stripe 3 */}
      <Path
        d="M 130 68 Q 128 100 130 132"
        stroke="#FFFFFF"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Bubbles */}
      <Circle cx="45" cy="82" r="5" fill="none" stroke="#87CEEB" strokeWidth="1.5" />
      <Circle cx="37" cy="68" r="4" fill="none" stroke="#87CEEB" strokeWidth="1.5" />
      <Circle cx="30" cy="56" r="3" fill="none" stroke="#87CEEB" strokeWidth="1.5" />
      {/* Scale pattern */}
      <Path d="M 92 86 Q 105 80 118 86" stroke="#CC3333" strokeWidth="1.5" fill="none" />
      <Path d="M 98 100 Q 112 94 126 100" stroke="#CC3333" strokeWidth="1.5" fill="none" />
      <Path d="M 92 114 Q 105 108 118 114" stroke="#CC3333" strokeWidth="1.5" fill="none" />
    </Svg>
  );
}
