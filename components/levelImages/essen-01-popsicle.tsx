import React from 'react';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* stick */}
      <Rect
        x="96"
        y="130"
        width="8"
        height="45"
        rx="3"
        fill="#E0C097"
        stroke="#B8935F"
        strokeWidth="1.5"
      />
      {/* body */}
      <Path
        d="M 60 40 Q 60 20 100 20 Q 140 20 140 40 L 140 120 Q 140 138 100 138 Q 60 138 60 120 Z"
        fill="#FF6B9D"
        stroke="#C2185B"
        strokeWidth="2.5"
      />
      {/* drip line1 */}
      <Path d="M 65 55 L 135 55" stroke="#FFFFFF" strokeWidth="3" opacity="0.6" />
      {/* drip line2 */}
      <Path d="M 65 80 L 135 80" stroke="#FFFFFF" strokeWidth="2" opacity="0.4" />
      {/* drip1 */}
      <Circle cx="78" cy="90" r="5" fill="#FFFFFF" opacity="0.5" />
      {/* drip2 */}
      <Circle cx="122" cy="100" r="4" fill="#FFFFFF" opacity="0.5" />
      {/* melt drip */}
      <Path d="M 100 138 L 96 150 L 104 150 Z" fill="#FF6B9D" stroke="none" />
      {/* shine */}
      <Circle cx="90" cy="35" r="4" fill="#FFFFFF" opacity="0.5" />
    </Svg>
  );
}
