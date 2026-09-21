import React from 'react';
import Svg, { Circle } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Wolke - mehrere überlappende Kreise */}
      <Circle cx="80" cy="100" r="30" fill="#FFFFFF" stroke="#B0C4DE" strokeWidth="2" />
      <Circle cx="110" cy="95" r="35" fill="#FFFFFF" stroke="#B0C4DE" strokeWidth="2" />
      <Circle cx="140" cy="100" r="28" fill="#FFFFFF" stroke="#B0C4DE" strokeWidth="2" />
      <Circle cx="95" cy="110" r="25" fill="#FFFFFF" stroke="#B0C4DE" strokeWidth="2" />
      <Circle cx="125" cy="112" r="26" fill="#FFFFFF" stroke="#B0C4DE" strokeWidth="2" />
    </Svg>
  );
}
