import React from 'react';
import Svg, { Circle, Ellipse, Rect, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* cone */}
      <Polygon points="100,20 130,140 70,140" fill="#7C5CFF" stroke="#4A2FBF" strokeWidth="2.5" />
      {/* brim */}
      <Ellipse
        cx="100"
        cy="142"
        rx="55"
        ry="14"
        fill="#5A3FE0"
        stroke="#4A2FBF"
        strokeWidth="2.5"
      />
      {/* band */}
      <Rect
        x="78"
        y="100"
        width="44"
        height="12"
        fill="#FFD700"
        stroke="#B8860B"
        strokeWidth="1.5"
      />
      {/* star large */}
      <Polygon
        points="100,55 105,68 118,68 108,76 112,89 100,81 88,89 92,76 82,68 95,68"
        fill="#FFD700"
        stroke="none"
      />
      {/* star small */}
      <Polygon
        points="75,80 78,87 85,87 79,91 81,98 75,94 69,98 71,91 65,87 72,87"
        fill="#FFD700"
        stroke="none"
      />
      {/* sparkle1 */}
      <Circle cx="70" cy="45" r="3" fill="#FFD700" />
      {/* sparkle2 */}
      <Circle cx="128" cy="55" r="2.5" fill="#FFD700" />
      {/* sparkle3 */}
      <Circle cx="100" cy="30" r="2" fill="#FFD700" />
    </Svg>
  );
}
