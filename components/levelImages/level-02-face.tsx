import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Gesicht - Kreis */}
      <Circle cx="100" cy="100" r="60" fill="#FDBCB4" stroke="#000000" strokeWidth="3" />
      {/* Augen */}
      <Circle cx="80" cy="90" r="8" fill="#000000" />
      <Circle cx="120" cy="90" r="8" fill="#000000" />
      <Circle cx="82" cy="88" r="3" fill="#FFFFFF" />
      <Circle cx="122" cy="88" r="3" fill="#FFFFFF" />
      {/* Lächeln */}
      <Path
        d="M 70 110 Q 100 130 130 110"
        stroke="#000000"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Rote Wangen */}
      <Circle cx="65" cy="105" r="8" fill="#FF69B4" opacity="0.4" />
      <Circle cx="135" cy="105" r="8" fill="#FF69B4" opacity="0.4" />
    </Svg>
  );
}
