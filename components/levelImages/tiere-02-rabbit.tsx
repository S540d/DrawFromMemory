import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Body */}
      <Ellipse cx="100" cy="130" rx="38" ry="44" fill="#F5F5F5" stroke="#BDBDBD" strokeWidth="2" />
      {/* Head */}
      <Circle cx="100" cy="82" r="28" fill="#F5F5F5" stroke="#BDBDBD" strokeWidth="2" />
      {/* Left ear outer */}
      <Ellipse cx="80" cy="38" rx="12" ry="30" fill="#F5F5F5" stroke="#BDBDBD" strokeWidth="2" />
      {/* Left ear inner */}
      <Ellipse cx="80" cy="38" rx="6" ry="20" fill="#FFB6C1" stroke="none" />
      {/* Right ear outer */}
      <Ellipse cx="120" cy="38" rx="12" ry="30" fill="#F5F5F5" stroke="#BDBDBD" strokeWidth="2" />
      {/* Right ear inner */}
      <Ellipse cx="120" cy="38" rx="6" ry="20" fill="#FFB6C1" stroke="none" />
      {/* Left eye */}
      <Circle cx="90" cy="77" r="5" fill="#1A1A1A" />
      {/* Right eye */}
      <Circle cx="110" cy="77" r="5" fill="#1A1A1A" />
      {/* Nose */}
      <Circle cx="100" cy="90" r="5" fill="#FFB6C1" />
      {/* Mouth */}
      <Path d="M 90 96 Q 100 102 110 96" stroke="#BDBDBD" strokeWidth="1.5" fill="none" />
      {/* Fluffy tail */}
      <Circle cx="100" cy="155" r="9" fill="#F5F5F5" stroke="#BDBDBD" strokeWidth="1.5" />
    </Svg>
  );
}
