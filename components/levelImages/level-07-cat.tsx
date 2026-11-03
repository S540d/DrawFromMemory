import React from 'react';
import Svg, { Circle, Ellipse, Rect, Line, Path, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Cat Body */}
      <Ellipse cx="100" cy="120" rx="40" ry="30" fill="#FFA500" stroke="#FF8C00" strokeWidth="3" />
      {/* Cat Head */}
      <Circle cx="100" cy="70" r="30" fill="#FFA500" stroke="#FF8C00" strokeWidth="3" />
      {/* Ears Left */}
      <Polygon points="75,45 70,20 85,50" fill="#FFA500" stroke="#FF8C00" strokeWidth="3" />
      {/* Ears Right */}
      <Polygon points="125,45 130,20 115,50" fill="#FFA500" stroke="#FF8C00" strokeWidth="3" />
      {/* Eyes */}
      <Circle cx="90" cy="65" r="5" fill="#000000" />
      <Circle cx="110" cy="65" r="5" fill="#000000" />
      {/* Nose */}
      <Polygon points="100,75 95,82 105,82" fill="#FFB6C1" />
      {/* Mouth */}
      <Path d="M 95 82 Q 100 85 105 82" stroke="#000000" strokeWidth="2" fill="none" />
      {/* Whiskers Left */}
      <Line x1="60" y1="70" x2="85" y2="68" stroke="#000000" strokeWidth="1" />
      <Line x1="60" y1="75" x2="85" y2="75" stroke="#000000" strokeWidth="1" />
      {/* Whiskers Right */}
      <Line x1="140" y1="70" x2="115" y2="68" stroke="#000000" strokeWidth="1" />
      <Line x1="140" y1="75" x2="115" y2="75" stroke="#000000" strokeWidth="1" />
      {/* Tail */}
      <Path
        d="M 130 130 Q 160 120 170 150"
        stroke="#FFA500"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      {/* Legs */}
      <Rect
        x="75"
        y="140"
        width="10"
        height="25"
        fill="#FFA500"
        stroke="#FF8C00"
        strokeWidth="2"
        rx="3"
      />
      <Rect
        x="115"
        y="140"
        width="10"
        height="25"
        fill="#FFA500"
        stroke="#FF8C00"
        strokeWidth="2"
        rx="3"
      />
    </Svg>
  );
}
