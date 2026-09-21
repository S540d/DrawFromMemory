import React from 'react';
import Svg, { Circle, Rect, Line, Path, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* cover left */}
      <Path
        d="M 45 45 L 100 55 L 100 165 L 45 155 Z"
        fill="#7C5CFF"
        stroke="#4A2FBF"
        strokeWidth="2.5"
      />
      {/* cover right */}
      <Path
        d="M 155 45 L 100 55 L 100 165 L 155 155 Z"
        fill="#9B7BFF"
        stroke="#4A2FBF"
        strokeWidth="2.5"
      />
      {/* page line left1 */}
      <Line x1="55" y1="68" x2="90" y2="74" stroke="#E6DFFF" strokeWidth="2" />
      {/* page line left2 */}
      <Line x1="55" y1="85" x2="90" y2="90" stroke="#E6DFFF" strokeWidth="2" />
      {/* page line right1 */}
      <Line x1="110" y1="74" x2="145" y2="68" stroke="#E6DFFF" strokeWidth="2" />
      {/* page line right2 */}
      <Line x1="110" y1="90" x2="145" y2="85" stroke="#E6DFFF" strokeWidth="2" />
      {/* star */}
      <Polygon
        points="100,95 106,110 122,110 109,120 114,136 100,127 86,136 91,120 78,110 94,110"
        fill="#FFD700"
        stroke="#B8860B"
        strokeWidth="1.5"
      />
      {/* bookmark ribbon */}
      <Rect x="96" y="40" width="8" height="30" fill="#E74C3C" />
      {/* sparkle1 */}
      <Circle cx="130" cy="40" r="3" fill="#FFD700" />
      {/* sparkle2 */}
      <Circle cx="65" cy="35" r="2.5" fill="#87CEEB" />
    </Svg>
  );
}
