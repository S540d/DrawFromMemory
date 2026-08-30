import React from 'react';
import Svg, { Circle, Rect, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox="0 0 200 280">
      {/* Rocket body */}
      <Rect x="70" y="40" width="60" height="140" fill="#FF6B6B" stroke="#000000" strokeWidth="2" />
      {/* Rocket nose */}
      <Polygon points="100,20 85,40 115,40" fill="#FFD700" stroke="#000000" strokeWidth="2" />
      {/* Window */}
      <Circle cx="100" cy="70" r="12" fill="#3498DB" stroke="#000000" strokeWidth="1.5" />
      {/* Left fin */}
      <Polygon points="70,160 45,200 65,165" fill="#3498DB" stroke="#000000" strokeWidth="2" />
      {/* Right fin */}
      <Polygon points="130,160 155,200 135,165" fill="#3498DB" stroke="#000000" strokeWidth="2" />
      {/* Flame 1 */}
      <Polygon points="80,180 75,240 85,200" fill="#FF8C00" stroke="#000000" strokeWidth="1.5" />
      {/* Flame 2 */}
      <Polygon points="100,180 100,250 105,200" fill="#FFD700" stroke="#000000" strokeWidth="1.5" />
      {/* Flame 3 */}
      <Polygon points="120,180 125,240 115,200" fill="#FF8C00" stroke="#000000" strokeWidth="1.5" />
    </Svg>
  );
}
