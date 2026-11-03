import React from 'react';
import Svg, { Circle, Ellipse, Line, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* wing left */}
      <Ellipse cx="90" cy="95" rx="22" ry="16" fill="#FFD700" stroke="#1A1A1A" strokeWidth="2" />
      {/* wing right */}
      <Ellipse
        cx="130"
        cy="95"
        rx="22"
        ry="16"
        fill="#E6F7FF"
        stroke="#90A4AE"
        strokeWidth="1.5"
        opacity="0.8"
      />
      {/* body */}
      <Ellipse cx="100" cy="118" rx="40" ry="26" fill="#FFD700" stroke="#1A1A1A" strokeWidth="2" />
      {/* stripe1 */}
      <Path d="M 66 106 L 134 106" stroke="#1A1A1A" strokeWidth="8" />
      {/* stripe2 */}
      <Path d="M 66 130 L 134 130" stroke="#1A1A1A" strokeWidth="8" />
      {/* head */}
      <Circle cx="100" cy="80" r="16" fill="#1A1A1A" />
      {/* antenna left */}
      <Line
        x1="92"
        y1="66"
        x2="84"
        y2="52"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* antenna right */}
      <Line
        x1="108"
        y1="66"
        x2="116"
        y2="52"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* eye left */}
      <Circle cx="95" cy="80" r="2.5" fill="#FFFFFF" />
      {/* eye right */}
      <Circle cx="105" cy="80" r="2.5" fill="#FFFFFF" />
      {/* sparkle trail */}
      <Circle cx="155" cy="55" r="3" fill="#FFD700" opacity="0.7" />
    </Svg>
  );
}
