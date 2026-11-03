import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* wing left */}
      <Path
        d="M 100 90 C 40 70 25 110 55 130 C 75 143 95 120 100 100"
        fill="#FF69B4"
        stroke="#C2185B"
        strokeWidth="2"
        opacity="0.85"
      />
      {/* wing right */}
      <Path
        d="M 100 90 C 160 70 175 110 145 130 C 125 143 105 120 100 100"
        fill="#FF69B4"
        stroke="#C2185B"
        strokeWidth="2"
        opacity="0.85"
      />
      {/* head */}
      <Circle cx="100" cy="62" r="20" fill="#FDBCB4" stroke="#E8998D" strokeWidth="2" />
      {/* hair */}
      <Path
        d="M 80 50 Q 100 30 120 50 Q 122 65 116 68 L 84 68 Q 78 65 80 50"
        fill="#9B59B6"
        stroke="#6C3483"
        strokeWidth="1.5"
      />
      {/* dress */}
      <Path d="M 82 118 L 100 92 L 118 118 Z" fill="#7C5CFF" stroke="#4A2FBF" strokeWidth="2" />
      {/* eye left */}
      <Circle cx="93" cy="60" r="2.5" fill="#1A1A1A" />
      {/* eye right */}
      <Circle cx="107" cy="60" r="2.5" fill="#1A1A1A" />
      {/* wand */}
      <Path d="M 100 118 L 100 150" stroke="#8B5A2B" strokeWidth="4" strokeLinecap="round" />
      {/* wand tip */}
      <Circle cx="100" cy="148" r="5" fill="#FFD700" />
      {/* sparkle1 */}
      <Circle cx="130" cy="145" r="3" fill="#FFD700" />
      {/* sparkle2 */}
      <Circle cx="145" cy="130" r="2.5" fill="#87CEEB" />
    </Svg>
  );
}
