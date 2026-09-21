import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* mountain */}
      <Path d="M 100 30 L 165 170 L 35 170 Z" fill="#8D6E63" stroke="#5D4037" strokeWidth="2.5" />
      {/* crater lava */}
      <Path d="M 85 55 L 100 30 L 115 55 Z" fill="#E74C3C" stroke="#B71C1C" strokeWidth="2" />
      {/* lava streak left */}
      <Path d="M 75 90 L 100 65 L 60 100 Z" fill="#FF7043" opacity="0.85" />
      {/* lava streak right */}
      <Path d="M 125 90 L 100 65 L 140 100 Z" fill="#FF7043" opacity="0.85" />
      {/* lava streak center */}
      <Path d="M 95 120 L 100 100 L 108 125 Z" fill="#FFB74D" opacity="0.85" />
      {/* smoke1 */}
      <Circle cx="100" cy="5" r="12" fill="#CFD8DC" opacity="0.75" />
      {/* smoke2 */}
      <Circle cx="118" cy="12" r="10" fill="#CFD8DC" opacity="0.7" />
      {/* smoke3 */}
      <Circle cx="132" cy="0" r="7" fill="#CFD8DC" opacity="0.6" />
      {/* smoke4 */}
      <Circle cx="85" cy="-5" r="6" fill="#CFD8DC" opacity="0.6" />
      {/* ground */}
      <Ellipse cx="100" cy="172" rx="70" ry="8" fill="#2E7D32" />
      {/* bush left */}
      <Circle cx="40" cy="168" r="6" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1.5" />
      {/* bush right */}
      <Circle cx="160" cy="168" r="6" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1.5" />
      {/* cloud */}
      <Circle cx="20" cy="40" r="8" fill="#ECEFF1" opacity="0.7" />
    </Svg>
  );

  // ===== maerchen-v1 Pack =====
}
