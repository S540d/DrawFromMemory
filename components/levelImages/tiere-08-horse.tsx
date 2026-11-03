import React from 'react';
import Svg, { Circle, Ellipse, Rect, Path, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Body */}
      <Ellipse cx="97" cy="128" rx="65" ry="40" fill="#C8A47E" stroke="#8B6914" strokeWidth="2" />
      {/* Neck */}
      <Rect
        x="130"
        y="75"
        width="28"
        height="42"
        fill="#C8A47E"
        stroke="#8B6914"
        strokeWidth="2"
        rx="8"
      />
      {/* Head */}
      <Ellipse cx="160" cy="66" rx="22" ry="18" fill="#C8A47E" stroke="#8B6914" strokeWidth="2" />
      {/* Ear */}
      <Polygon points="150,50 148,30 162,50" fill="#C8A47E" stroke="#8B6914" strokeWidth="2" />
      {/* Muzzle */}
      <Ellipse cx="174" cy="72" rx="10" ry="8" fill="#B08060" stroke="#8B6914" strokeWidth="1.5" />
      {/* Nostril */}
      <Circle cx="174" cy="73" r="3" fill="#8B6914" />
      {/* Eye */}
      <Circle cx="157" cy="61" r="5" fill="#1A1A1A" />
      {/* Eye shine */}
      <Circle cx="159" cy="59" r="2" fill="#FFFFFF" />
      {/* Mane */}
      <Path
        d="M 130 75 Q 142 55 152 50 Q 148 62 150 68 Q 140 60 136 72"
        fill="#7A5230"
        stroke="none"
      />
      {/* Front left leg */}
      <Rect
        x="55"
        y="160"
        width="14"
        height="32"
        fill="#C8A47E"
        stroke="#8B6914"
        strokeWidth="2"
        rx="3"
      />
      {/* Front right leg */}
      <Rect
        x="82"
        y="160"
        width="14"
        height="32"
        fill="#C8A47E"
        stroke="#8B6914"
        strokeWidth="2"
        rx="3"
      />
      {/* Rear left leg */}
      <Rect
        x="116"
        y="160"
        width="14"
        height="32"
        fill="#C8A47E"
        stroke="#8B6914"
        strokeWidth="2"
        rx="3"
      />
      {/* Rear right leg */}
      <Rect
        x="143"
        y="160"
        width="14"
        height="32"
        fill="#C8A47E"
        stroke="#8B6914"
        strokeWidth="2"
        rx="3"
      />
      {/* Tail */}
      <Path
        d="M 35 118 Q 18 103 20 82"
        stroke="#7A5230"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
