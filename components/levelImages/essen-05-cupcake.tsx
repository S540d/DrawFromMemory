import React from 'react';
import Svg, { Circle, Line, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* wrapper */}
      <Path
        d="M 60 120 L 140 120 L 128 172 L 72 172 Z"
        fill="#FF7043"
        stroke="#E64A19"
        strokeWidth="2"
      />
      {/* wrapper line1 */}
      <Line x1="75" y1="122" x2="68" y2="168" stroke="#E64A19" strokeWidth="1.5" />
      {/* wrapper line2 */}
      <Line x1="100" y1="122" x2="100" y2="170" stroke="#E64A19" strokeWidth="1.5" />
      {/* wrapper line3 */}
      <Line x1="125" y1="122" x2="132" y2="168" stroke="#E64A19" strokeWidth="1.5" />
      {/* frosting */}
      <Path
        d="M 55 120 Q 60 70 100 75 Q 140 70 145 120 Z"
        fill="#FFFFFF"
        stroke="#D0D0D0"
        strokeWidth="2"
      />
      {/* frosting swirl */}
      <Path d="M 65 90 Q 100 60 135 90" fill="none" stroke="#D0D0D0" strokeWidth="2" />
      {/* cherry */}
      <Circle cx="100" cy="68" r="9" fill="#E74C3C" stroke="#B71C1C" strokeWidth="1.5" />
      {/* sprinkle1 */}
      <Circle cx="80" cy="95" r="3" fill="#3498DB" />
      {/* sprinkle2 */}
      <Circle cx="120" cy="100" r="3" fill="#FFD700" />
      {/* sprinkle3 */}
      <Circle cx="95" cy="105" r="3" fill="#27AE60" />
      {/* sprinkle4 */}
      <Circle cx="112" cy="88" r="3" fill="#FF69B4" />
    </Svg>
  );
}
