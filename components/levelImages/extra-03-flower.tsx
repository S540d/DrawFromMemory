import React from 'react';
import Svg, { Circle, Ellipse, Line } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Stem */}
      <Line
        x1="100"
        y1="180"
        x2="100"
        y2="80"
        stroke="#228B22"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Leaves */}
      <Ellipse
        cx="85"
        cy="130"
        rx="15"
        ry="25"
        fill="#32CD32"
        stroke="#228B22"
        strokeWidth="2"
        transform="rotate(-30 85 130)"
      />
      <Ellipse
        cx="115"
        cy="150"
        rx="15"
        ry="25"
        fill="#32CD32"
        stroke="#228B22"
        strokeWidth="2"
        transform="rotate(30 115 150)"
      />
      {/* Flower Center */}
      <Circle cx="100" cy="60" r="15" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
      {/* Petals */}
      <Ellipse cx="100" cy="30" rx="12" ry="20" fill="#FF69B4" stroke="#FF1493" strokeWidth="2" />
      <Ellipse cx="130" cy="60" rx="20" ry="12" fill="#FF69B4" stroke="#FF1493" strokeWidth="2" />
      <Ellipse cx="100" cy="90" rx="12" ry="20" fill="#FF69B4" stroke="#FF1493" strokeWidth="2" />
      <Ellipse cx="70" cy="60" rx="20" ry="12" fill="#FF69B4" stroke="#FF1493" strokeWidth="2" />
      {/* Diagonal Petals */}
      <Ellipse
        cx="120"
        cy="40"
        rx="15"
        ry="18"
        fill="#FF69B4"
        stroke="#FF1493"
        strokeWidth="2"
        transform="rotate(45 120 40)"
      />
      <Ellipse
        cx="120"
        cy="80"
        rx="15"
        ry="18"
        fill="#FF69B4"
        stroke="#FF1493"
        strokeWidth="2"
        transform="rotate(-45 120 80)"
      />
      <Ellipse
        cx="80"
        cy="40"
        rx="15"
        ry="18"
        fill="#FF69B4"
        stroke="#FF1493"
        strokeWidth="2"
        transform="rotate(-45 80 40)"
      />
      <Ellipse
        cx="80"
        cy="80"
        rx="15"
        ry="18"
        fill="#FF69B4"
        stroke="#FF1493"
        strokeWidth="2"
        transform="rotate(45 80 80)"
      />
    </Svg>
  );
}
