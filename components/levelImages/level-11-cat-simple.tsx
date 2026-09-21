import React from 'react';
import Svg, { Circle, Ellipse, Line, Path, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Head */}
      <Circle cx="100" cy="85" r="38" fill="#FFA500" stroke="#000000" strokeWidth="2" />
      {/* Left ear */}
      <Polygon points="72,55 65,25 88,52" fill="#FFA500" stroke="#000000" strokeWidth="2" />
      {/* Right ear */}
      <Polygon points="128,55 135,25 112,52" fill="#FFA500" stroke="#000000" strokeWidth="2" />
      {/* Left eye */}
      <Circle cx="88" cy="80" r="6" fill="#000000" />
      {/* Right eye */}
      <Circle cx="112" cy="80" r="6" fill="#000000" />
      {/* Nose */}
      <Polygon points="100,92 95,100 105,100" fill="#FFB6C1" />
      {/* Body */}
      <Ellipse cx="100" cy="145" rx="35" ry="30" fill="#FFA500" stroke="#000000" strokeWidth="2" />
      {/* Tail */}
      <Path
        d="M 130 155 Q 165 145 160 115"
        stroke="#FFA500"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
      {/* Left whisker 1 */}
      <Line x1="55" y1="88" x2="88" y2="92" stroke="#000000" strokeWidth="1.5" />
      {/* Left whisker 2 */}
      <Line x1="55" y1="96" x2="88" y2="97" stroke="#000000" strokeWidth="1.5" />
      {/* Right whisker 1 */}
      <Line x1="145" y1="88" x2="112" y2="92" stroke="#000000" strokeWidth="1.5" />
    </Svg>
  );
}
