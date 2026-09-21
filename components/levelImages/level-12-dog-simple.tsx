import React from 'react';
import Svg, { Circle, Ellipse, Rect, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Body */}
      <Ellipse cx="105" cy="130" rx="45" ry="28" fill="#D2691E" stroke="#000000" strokeWidth="2" />
      {/* Head */}
      <Circle cx="65" cy="95" r="30" fill="#D2691E" stroke="#000000" strokeWidth="2" />
      {/* Floppy ear */}
      <Ellipse cx="52" cy="82" rx="13" ry="26" fill="#A0522D" stroke="#000000" strokeWidth="2" />
      {/* Snout */}
      <Ellipse cx="46" cy="102" rx="16" ry="12" fill="#CD853F" stroke="#000000" strokeWidth="1.5" />
      {/* Nose */}
      <Circle cx="43" cy="100" r="5" fill="#000000" />
      {/* Eye */}
      <Circle cx="68" cy="90" r="5" fill="#000000" />
      {/* Front left leg */}
      <Rect
        x="85"
        y="148"
        width="10"
        height="28"
        fill="#D2691E"
        stroke="#000000"
        strokeWidth="2"
        rx="3"
      />
      {/* Front right leg */}
      <Rect
        x="108"
        y="148"
        width="10"
        height="28"
        fill="#D2691E"
        stroke="#000000"
        strokeWidth="2"
        rx="3"
      />
      {/* Tail */}
      <Path
        d="M 148 118 Q 172 105 168 82"
        stroke="#A0522D"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
