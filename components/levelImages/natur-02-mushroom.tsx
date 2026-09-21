import React from 'react';
import Svg, { Circle, Ellipse, Rect, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* stem */}
      <Rect
        x="88"
        y="110"
        width="24"
        height="55"
        rx="8"
        fill="#FFF3E0"
        stroke="#D7A86E"
        strokeWidth="2"
      />
      {/* cap */}
      <Path
        d="M 40 112 Q 40 55 100 55 Q 160 55 160 112 Q 100 132 40 112 Z"
        fill="#E74C3C"
        stroke="#B71C1C"
        strokeWidth="2"
      />
      {/* spot1 */}
      <Circle cx="70" cy="88" r="9" fill="#FFFFFF" />
      {/* spot2 */}
      <Circle cx="105" cy="75" r="7" fill="#FFFFFF" />
      {/* spot3 */}
      <Circle cx="132" cy="92" r="8" fill="#FFFFFF" />
      {/* grass */}
      <Ellipse cx="100" cy="172" rx="60" ry="8" fill="#4CAF50" />
      {/* grass blade1 */}
      <Path
        d="M 40 172 Q 36 158 42 150"
        fill="none"
        stroke="#2E7D32"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* grass blade2 */}
      <Path
        d="M 160 172 Q 166 158 158 150"
        fill="none"
        stroke="#2E7D32"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* sparkle1 */}
      <Circle cx="96" cy="22" r="3" fill="#FFD700" />
    </Svg>
  );
}
