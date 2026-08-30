import React from 'react';
import Svg, { Circle, Line, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* arm 1 */}
      <Line
        x1="100"
        y1="30"
        x2="100"
        y2="170"
        stroke="#3498DB"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* arm 2 */}
      <Line
        x1="30"
        y1="65"
        x2="170"
        y2="135"
        stroke="#3498DB"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* arm 3 */}
      <Line
        x1="30"
        y1="135"
        x2="170"
        y2="65"
        stroke="#3498DB"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* branch top */}
      <Path
        d="M 100 55 L 84 70 M 100 55 L 116 70"
        stroke="#3498DB"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* branch bottom */}
      <Path
        d="M 100 145 L 84 130 M 100 145 L 116 130"
        stroke="#3498DB"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* branch left */}
      <Path
        d="M 55 78 L 68 88 M 55 78 L 62 63"
        stroke="#3498DB"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* branch right */}
      <Path
        d="M 145 122 L 132 112 M 145 122 L 138 137"
        stroke="#3498DB"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* center */}
      <Circle cx="100" cy="100" r="10" fill="#87CEEB" stroke="#3498DB" strokeWidth="2" />
      {/* tip top */}
      <Circle cx="100" cy="32" r="3" fill="#87CEEB" />
      {/* tip left */}
      <Circle cx="33" cy="66" r="3" fill="#87CEEB" />
      {/* tip right */}
      <Circle cx="167" cy="66" r="3" fill="#87CEEB" />
    </Svg>
  );
}
