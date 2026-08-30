import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Body */}
      <Ellipse cx="100" cy="132" rx="50" ry="46" fill="#795548" stroke="#4E342E" strokeWidth="2" />
      {/* Head */}
      <Circle cx="100" cy="76" r="35" fill="#795548" stroke="#4E342E" strokeWidth="2" />
      {/* Left ear outer */}
      <Circle cx="70" cy="48" r="16" fill="#795548" stroke="#4E342E" strokeWidth="2" />
      {/* Left ear inner */}
      <Circle cx="70" cy="48" r="10" fill="#A1887F" stroke="none" />
      {/* Right ear outer */}
      <Circle cx="130" cy="48" r="16" fill="#795548" stroke="#4E342E" strokeWidth="2" />
      {/* Right ear inner */}
      <Circle cx="130" cy="48" r="10" fill="#A1887F" stroke="none" />
      {/* Muzzle */}
      <Ellipse cx="100" cy="88" rx="18" ry="14" fill="#A1887F" stroke="#6D4C41" strokeWidth="1.5" />
      {/* Left eye */}
      <Circle cx="88" cy="68" r="5" fill="#1A1A1A" />
      {/* Right eye */}
      <Circle cx="112" cy="68" r="5" fill="#1A1A1A" />
      {/* Nose */}
      <Circle cx="100" cy="84" r="5" fill="#1A1A1A" />
      {/* Smile */}
      <Path
        d="M 88 93 Q 100 100 112 93"
        stroke="#4E342E"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
