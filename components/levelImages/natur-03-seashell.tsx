import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* shell body */}
      <Path
        d="M 100 170 C 40 170 30 100 60 60 C 75 40 100 35 100 35 C 100 35 125 40 140 60 C 170 100 160 170 100 170 Z"
        fill="#FFB6C1"
        stroke="#D46A8C"
        strokeWidth="2"
      />
      {/* ridge center */}
      <Path d="M 100 168 L 100 42" stroke="#D46A8C" strokeWidth="2" strokeLinecap="round" />
      {/* ridge left1 */}
      <Path d="M 82 165 L 92 48" stroke="#D46A8C" strokeWidth="1.5" strokeLinecap="round" />
      {/* ridge left2 */}
      <Path d="M 62 155 L 82 60" stroke="#D46A8C" strokeWidth="1.5" strokeLinecap="round" />
      {/* ridge right1 */}
      <Path d="M 118 165 L 108 48" stroke="#D46A8C" strokeWidth="1.5" strokeLinecap="round" />
      {/* ridge right2 */}
      <Path d="M 138 155 L 118 60" stroke="#D46A8C" strokeWidth="1.5" strokeLinecap="round" />
      {/* pearl */}
      <Circle cx="100" cy="160" r="6" fill="#F8E1E7" stroke="none" />
      {/* bubble1 */}
      <Circle cx="45" cy="100" r="4" fill="#87CEEB" opacity="0.6" />
      {/* bubble2 */}
      <Circle cx="158" cy="90" r="3" fill="#87CEEB" opacity="0.6" />
    </Svg>
  );
}
