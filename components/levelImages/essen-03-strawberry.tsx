import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* body */}
      <Path
        d="M 100 55 C 50 55 40 110 65 150 C 80 172 120 172 135 150 C 160 110 150 55 100 55 Z"
        fill="#E74C3C"
        stroke="#B71C1C"
        strokeWidth="2.5"
      />
      {/* leaf */}
      <Path
        d="M 100 55 L 80 30 L 92 42 L 100 25 L 108 42 L 120 30 Z"
        fill="#4CAF50"
        stroke="#2E7D32"
        strokeWidth="2"
      />
      {/* seed1 */}
      <Circle cx="82" cy="90" r="3" fill="#FFD700" />
      {/* seed2 */}
      <Circle cx="108" cy="85" r="3" fill="#FFD700" />
      {/* seed3 */}
      <Circle cx="122" cy="105" r="3" fill="#FFD700" />
      {/* seed4 */}
      <Circle cx="90" cy="118" r="3" fill="#FFD700" />
      {/* seed5 */}
      <Circle cx="110" cy="135" r="3" fill="#FFD700" />
      {/* seed6 */}
      <Circle cx="75" cy="130" r="3" fill="#FFD700" />
      {/* seed7 */}
      <Circle cx="95" cy="155" r="3" fill="#FFD700" />
    </Svg>
  );
}
