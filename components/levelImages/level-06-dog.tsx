import React from 'react';
import Svg, { Circle, Ellipse, Rect, Line, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Dog Body */}
      <Ellipse cx="110" cy="120" rx="45" ry="30" fill="#D2691E" stroke="#8B4513" strokeWidth="3" />
      {/* Dog Head */}
      <Circle cx="65" cy="100" r="28" fill="#D2691E" stroke="#8B4513" strokeWidth="3" />
      {/* Ear (floppy) */}
      <Ellipse
        cx="55"
        cy="85"
        rx="12"
        ry="25"
        fill="#A0522D"
        stroke="#8B4513"
        strokeWidth="2"
        transform="rotate(-20 55 85)"
      />
      {/* Snout */}
      <Ellipse cx="45" cy="105" rx="15" ry="12" fill="#CD853F" stroke="#8B4513" strokeWidth="2" />
      {/* Nose */}
      <Circle cx="42" cy="105" r="5" fill="#000000" />
      {/* Eye */}
      <Circle cx="68" cy="95" r="4" fill="#000000" />
      <Circle cx="70" cy="93" r="2" fill="#FFFFFF" />
      {/* Mouth */}
      <Line
        x1="42"
        y1="110"
        x2="42"
        y2="115"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path d="M 42 115 Q 38 117 35 115" stroke="#000000" strokeWidth="2" fill="none" />
      <Path d="M 42 115 Q 46 117 49 115" stroke="#000000" strokeWidth="2" fill="none" />
      {/* Front Legs */}
      <Rect
        x="90"
        y="140"
        width="10"
        height="30"
        fill="#D2691E"
        stroke="#8B4513"
        strokeWidth="2"
        rx="3"
      />
      <Rect
        x="115"
        y="140"
        width="10"
        height="30"
        fill="#D2691E"
        stroke="#8B4513"
        strokeWidth="2"
        rx="3"
      />
      {/* Back Legs (shorter) */}
      <Rect
        x="140"
        y="145"
        width="10"
        height="25"
        fill="#D2691E"
        stroke="#8B4513"
        strokeWidth="2"
        rx="3"
      />
      {/* Tail (curved) */}
      <Path
        d="M 155 115 Q 175 105 170 85"
        stroke="#8B4513"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      {/* Paws (white spots) */}
      <Ellipse cx="95" cy="167" rx="6" ry="4" fill="#FFFFFF" />
      <Ellipse cx="120" cy="167" rx="6" ry="4" fill="#FFFFFF" />
      <Ellipse cx="145" cy="167" rx="6" ry="4" fill="#FFFFFF" />
      {/* Collar */}
      <Ellipse cx="80" cy="115" rx="18" ry="8" fill="none" stroke="#FF0000" strokeWidth="3" />
      <Circle cx="85" cy="115" r="3" fill="#FFD700" />
    </Svg>
  );
}
