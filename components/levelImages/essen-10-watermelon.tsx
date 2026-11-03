import React from 'react';
import Svg, { Circle, Line, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* rind outer */}
      <Path d="M 30 90 A 70 70 0 0 0 170 90 Z" fill="#4CAF50" stroke="#1B5E20" strokeWidth="2.5" />
      {/* rind inner white */}
      <Path d="M 40 90 A 60 60 0 0 0 160 90 Z" fill="#F1F8E9" stroke="none" />
      {/* flesh */}
      <Path d="M 48 90 A 52 52 0 0 0 152 90 Z" fill="#FF6B6B" stroke="#E74C3C" strokeWidth="2" />
      {/* seed1 */}
      <Circle cx="80" cy="78" r="3.5" fill="#1A1A1A" />
      {/* seed2 */}
      <Circle cx="100" cy="70" r="3.5" fill="#1A1A1A" />
      {/* seed3 */}
      <Circle cx="120" cy="78" r="3.5" fill="#1A1A1A" />
      {/* seed4 */}
      <Circle cx="90" cy="88" r="3.5" fill="#1A1A1A" />
      {/* seed5 */}
      <Circle cx="110" cy="88" r="3.5" fill="#1A1A1A" />
      {/* flat edge */}
      <Line x1="30" y1="90" x2="170" y2="90" stroke="#1B5E20" strokeWidth="2.5" />
      {/* juice drip1 */}
      <Circle cx="65" cy="95" r="3" fill="#FFFFFF" opacity="0.5" />
      {/* juice drip2 */}
      <Circle cx="135" cy="92" r="2.5" fill="#FFFFFF" opacity="0.4" />
      {/* seed6 */}
      <Circle cx="100" cy="88" r="3.5" fill="#1A1A1A" />
      {/* shine sparkle */}
      <Circle cx="40" cy="60" r="2.5" fill="#FFFFFF" opacity="0.5" />
    </Svg>
  );
}
