import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* red arc */}
      <Path
        d="M 30 150 A 70 70 0 0 1 170 150"
        fill="none"
        stroke="#E74C3C"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* orange arc */}
      <Path
        d="M 42 150 A 58 58 0 0 1 158 150"
        fill="none"
        stroke="#FFA500"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* yellow arc */}
      <Path
        d="M 54 150 A 46 46 0 0 1 146 150"
        fill="none"
        stroke="#FFD700"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* green arc */}
      <Path
        d="M 66 150 A 34 34 0 0 1 134 150"
        fill="none"
        stroke="#27AE60"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* blue arc */}
      <Path
        d="M 78 150 A 22 22 0 0 1 122 150"
        fill="none"
        stroke="#3498DB"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* left cloud */}
      <Ellipse cx="28" cy="152" rx="22" ry="15" fill="#FFFFFF" stroke="#CFD8DC" strokeWidth="2" />
      {/* right cloud */}
      <Ellipse cx="172" cy="152" rx="22" ry="15" fill="#FFFFFF" stroke="#CFD8DC" strokeWidth="2" />
      {/* sparkle1 */}
      <Circle cx="60" cy="40" r="4" fill="#FFD700" />
      {/* sparkle2 */}
      <Circle cx="140" cy="55" r="3" fill="#FFD700" />
    </Svg>
  );
}
