import React from 'react';
import Svg, { Circle, Ellipse, Path, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Fish body */}
      <Ellipse cx="100" cy="100" rx="50" ry="30" fill="#FFA500" stroke="#000000" strokeWidth="2" />
      {/* Tail fin */}
      <Polygon points="150,100 180,75 180,125" fill="#FF6347" stroke="#000000" strokeWidth="2" />
      {/* Dorsal fin */}
      <Path d="M 80 70 Q 100 45 120 70" fill="#FF6347" stroke="#000000" strokeWidth="2" />
      {/* Bottom fin */}
      <Path d="M 90 130 Q 100 150 115 130" fill="#FF6347" stroke="#000000" strokeWidth="2" />
      {/* Eye */}
      <Circle cx="70" cy="95" r="8" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
      <Circle cx="72" cy="95" r="4" fill="#000000" />
      <Circle cx="73" cy="93" r="2" fill="#FFFFFF" />
      {/* Mouth */}
      <Path d="M 50 100 Q 55 105 50 110" stroke="#000000" strokeWidth="2" fill="none" />
      {/* Scales pattern */}
      <Path d="M 85 90 Q 95 85 105 90" stroke="#E8860C" strokeWidth="1.5" fill="none" />
      <Path d="M 95 100 Q 105 95 115 100" stroke="#E8860C" strokeWidth="1.5" fill="none" />
      <Path d="M 85 110 Q 95 105 105 110" stroke="#E8860C" strokeWidth="1.5" fill="none" />
      <Path d="M 105 90 Q 115 85 125 90" stroke="#E8860C" strokeWidth="1.5" fill="none" />
      <Path d="M 105 110 Q 115 105 125 110" stroke="#E8860C" strokeWidth="1.5" fill="none" />
      {/* Bubbles */}
      <Circle cx="42" cy="85" r="4" fill="none" stroke="#87CEEB" strokeWidth="1.5" />
      <Circle cx="35" cy="75" r="3" fill="none" stroke="#87CEEB" strokeWidth="1.5" />
    </Svg>
  );
}
