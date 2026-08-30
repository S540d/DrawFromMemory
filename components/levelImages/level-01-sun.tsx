import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Sonne - Kreis in der Mitte */}
      <Circle cx="100" cy="100" r="40" fill="#FFD700" stroke="#FFA500" strokeWidth="3" />
      {/* 8 Strahlen */}
      <Line
        x1="100"
        y1="20"
        x2="100"
        y2="50"
        stroke="#FFA500"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <Line
        x1="100"
        y1="150"
        x2="100"
        y2="180"
        stroke="#FFA500"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <Line
        x1="20"
        y1="100"
        x2="50"
        y2="100"
        stroke="#FFA500"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <Line
        x1="150"
        y1="100"
        x2="180"
        y2="100"
        stroke="#FFA500"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <Line
        x1="35"
        y1="35"
        x2="60"
        y2="60"
        stroke="#FFA500"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <Line
        x1="140"
        y1="140"
        x2="165"
        y2="165"
        stroke="#FFA500"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <Line
        x1="165"
        y1="35"
        x2="140"
        y2="60"
        stroke="#FFA500"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <Line
        x1="60"
        y1="140"
        x2="35"
        y2="165"
        stroke="#FFA500"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </Svg>
  );
}
