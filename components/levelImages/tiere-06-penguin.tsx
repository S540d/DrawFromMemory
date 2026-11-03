import React from 'react';
import Svg, { Circle, Ellipse, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Body */}
      <Ellipse cx="100" cy="118" rx="45" ry="60" fill="#212121" stroke="#000000" strokeWidth="2" />
      {/* Head */}
      <Circle cx="100" cy="65" r="30" fill="#212121" stroke="#000000" strokeWidth="2" />
      {/* White belly */}
      <Ellipse cx="100" cy="118" rx="28" ry="44" fill="#FFFFFF" stroke="none" />
      {/* White face */}
      <Ellipse cx="100" cy="68" rx="18" ry="20" fill="#FFFFFF" stroke="none" />
      {/* Left eye */}
      <Circle cx="90" cy="60" r="5" fill="#1A1A1A" />
      {/* Right eye */}
      <Circle cx="110" cy="60" r="5" fill="#1A1A1A" />
      {/* Left eye shine */}
      <Circle cx="92" cy="58" r="2" fill="#FFFFFF" />
      {/* Right eye shine */}
      <Circle cx="112" cy="58" r="2" fill="#FFFFFF" />
      {/* Beak */}
      <Polygon points="100,72 92,80 108,80" fill="#FF9800" stroke="#E65100" strokeWidth="1.5" />
      {/* Left wing */}
      <Ellipse
        cx="53"
        cy="118"
        rx="18"
        ry="35"
        fill="#212121"
        stroke="#000000"
        strokeWidth="1.5"
        transform="rotate(10 53 118)"
      />
      {/* Right wing */}
      <Ellipse
        cx="147"
        cy="118"
        rx="18"
        ry="35"
        fill="#212121"
        stroke="#000000"
        strokeWidth="1.5"
        transform="rotate(-10 147 118)"
      />
      {/* Feet */}
      <Ellipse cx="100" cy="178" rx="25" ry="8" fill="#FF9800" stroke="#E65100" strokeWidth="1.5" />
    </Svg>
  );
}
