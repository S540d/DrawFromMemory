import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Kopf */}
      <Circle cx="100" cy="50" r="20" fill="none" stroke="#000000" strokeWidth="3" />
      {/* Körper */}
      <Line
        x1="100"
        y1="70"
        x2="100"
        y2="130"
        stroke="#000000"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Arme */}
      <Line
        x1="100"
        y1="90"
        x2="70"
        y2="110"
        stroke="#000000"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Line
        x1="100"
        y1="90"
        x2="130"
        y2="110"
        stroke="#000000"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Beine */}
      <Line
        x1="100"
        y1="130"
        x2="75"
        y2="170"
        stroke="#000000"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Line
        x1="100"
        y1="130"
        x2="125"
        y2="170"
        stroke="#000000"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  );
}
