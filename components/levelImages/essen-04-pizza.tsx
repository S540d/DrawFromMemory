import React from 'react';
import Svg, { Circle, Line, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* crust wedge */}
      <Path d="M 100 35 L 165 165 L 35 165 Z" fill="#FFD54F" stroke="#E6A800" strokeWidth="2.5" />
      {/* crust edge */}
      <Path
        d="M 40 155 L 160 155 L 165 165 L 35 165 Z"
        fill="#F0C060"
        stroke="#E6A800"
        strokeWidth="2"
      />
      {/* pepperoni1 */}
      <Circle cx="90" cy="90" r="12" fill="#E74C3C" stroke="#B71C1C" strokeWidth="1.5" />
      {/* pepperoni2 */}
      <Circle cx="118" cy="115" r="11" fill="#E74C3C" stroke="#B71C1C" strokeWidth="1.5" />
      {/* pepperoni3 */}
      <Circle cx="100" cy="140" r="10" fill="#E74C3C" stroke="#B71C1C" strokeWidth="1.5" />
      {/* pepperoni4 */}
      <Circle cx="78" cy="130" r="9" fill="#E74C3C" stroke="#B71C1C" strokeWidth="1.5" />
      {/* basil1 */}
      <Circle cx="105" cy="70" r="5" fill="#4CAF50" />
      {/* basil2 */}
      <Circle cx="75" cy="120" r="5" fill="#4CAF50" />
      {/* basil3 */}
      <Circle cx="130" cy="145" r="4" fill="#4CAF50" />
      {/* crust texture */}
      <Line x1="60" y1="100" x2="70" y2="95" stroke="#E6A800" strokeWidth="1.5" opacity="0.6" />
    </Svg>
  );
}
