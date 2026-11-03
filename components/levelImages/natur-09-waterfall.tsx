import React from 'react';
import Svg, { Circle, Ellipse, Rect, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* rock cliff */}
      <Path
        d="M 40 20 L 130 20 L 145 60 L 100 60 L 115 100 L 70 100 L 70 175 L 40 175 Z"
        fill="#8D6E63"
        stroke="#5D4037"
        strokeWidth="2"
      />
      {/* water fall */}
      <Rect
        x="78"
        y="30"
        width="26"
        height="145"
        fill="#81D4FA"
        stroke="#0288D1"
        strokeWidth="2"
        opacity="0.85"
      />
      {/* water line1 */}
      <Path d="M 80 50 L 104 55" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />
      {/* water line2 */}
      <Path d="M 78 80 L 102 86" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />
      {/* water line3 */}
      <Path d="M 78 115 L 102 121" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />
      {/* pool */}
      <Ellipse cx="91" cy="172" rx="45" ry="14" fill="#B3E5FC" stroke="#0288D1" strokeWidth="2" />
      {/* splash1 */}
      <Circle cx="60" cy="168" r="5" fill="#FFFFFF" opacity="0.8" />
      {/* splash2 */}
      <Circle cx="118" cy="165" r="4" fill="#FFFFFF" opacity="0.8" />
      {/* splash3 */}
      <Circle cx="68" cy="178" r="3" fill="#FFFFFF" opacity="0.7" />
      {/* bush1 */}
      <Circle cx="40" cy="40" r="10" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1.5" />
      {/* bush2 */}
      <Circle cx="150" cy="30" r="8" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1.5" />
      {/* bush3 */}
      <Circle cx="160" cy="45" r="6" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1.5" />
      {/* cloud */}
      <Circle cx="165" cy="20" r="12" fill="#ECEFF1" opacity="0.8" />
    </Svg>
  );
}
