import React from 'react';
import Svg, { Circle, Ellipse, Line } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* body */}
      <Ellipse
        cx="100"
        cy="115"
        rx="48"
        ry="40"
        fill="#E74C3C"
        stroke="#1A1A1A"
        strokeWidth="2.5"
      />
      {/* wing split */}
      <Line x1="100" y1="78" x2="100" y2="152" stroke="#1A1A1A" strokeWidth="2.5" />
      {/* head */}
      <Circle cx="100" cy="65" r="22" fill="#1A1A1A" />
      {/* spot1 */}
      <Circle cx="78" cy="100" r="8" fill="#1A1A1A" />
      {/* spot2 */}
      <Circle cx="122" cy="100" r="8" fill="#1A1A1A" />
      {/* spot3 */}
      <Circle cx="82" cy="132" r="7" fill="#1A1A1A" />
      {/* spot4 */}
      <Circle cx="118" cy="132" r="7" fill="#1A1A1A" />
      {/* antenna left */}
      <Line
        x1="90"
        y1="48"
        x2="82"
        y2="32"
        stroke="#1A1A1A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* antenna right */}
      <Line
        x1="110"
        y1="48"
        x2="118"
        y2="32"
        stroke="#1A1A1A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* eye left */}
      <Circle cx="91" cy="62" r="3" fill="#FFFFFF" />
      {/* eye right */}
      <Circle cx="109" cy="62" r="3" fill="#FFFFFF" />
    </Svg>
  );
}
