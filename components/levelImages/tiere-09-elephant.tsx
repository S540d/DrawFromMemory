import React from 'react';
import Svg, { Circle, Ellipse, Rect, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Body */}
      <Ellipse cx="100" cy="132" rx="65" ry="48" fill="#9E9E9E" stroke="#616161" strokeWidth="2" />
      {/* Head */}
      <Circle cx="72" cy="76" r="38" fill="#9E9E9E" stroke="#616161" strokeWidth="2" />
      {/* Left ear */}
      <Ellipse cx="36" cy="74" rx="28" ry="38" fill="#BDBDBD" stroke="#616161" strokeWidth="2" />
      {/* Left ear inner */}
      <Ellipse cx="36" cy="74" rx="18" ry="26" fill="#FFCDD2" stroke="none" />
      {/* Trunk */}
      <Path
        d="M 55 110 Q 32 128 38 152 Q 44 162 52 160 Q 60 157 56 148 Q 48 130 68 118"
        fill="#9E9E9E"
        stroke="#616161"
        strokeWidth="2"
      />
      {/* Trunk tip */}
      <Circle cx="50" cy="157" r="5" fill="#757575" />
      {/* Eye */}
      <Circle cx="80" cy="68" r="7" fill="#1A1A1A" />
      {/* Eye shine */}
      <Circle cx="82" cy="66" r="3" fill="#FFFFFF" />
      {/* Tusk */}
      <Path
        d="M 56 108 Q 40 122 36 134"
        stroke="#FAFAFA"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      {/* Front left leg */}
      <Rect
        x="42"
        y="170"
        width="18"
        height="26"
        fill="#9E9E9E"
        stroke="#616161"
        strokeWidth="2"
        rx="4"
      />
      {/* Front right leg */}
      <Rect
        x="72"
        y="170"
        width="18"
        height="26"
        fill="#9E9E9E"
        stroke="#616161"
        strokeWidth="2"
        rx="4"
      />
      {/* Rear left leg */}
      <Rect
        x="108"
        y="170"
        width="18"
        height="26"
        fill="#9E9E9E"
        stroke="#616161"
        strokeWidth="2"
        rx="4"
      />
      {/* Rear right leg */}
      <Rect
        x="138"
        y="170"
        width="18"
        height="26"
        fill="#9E9E9E"
        stroke="#616161"
        strokeWidth="2"
        rx="4"
      />
      {/* Tail */}
      <Path
        d="M 165 122 Q 180 108 182 90"
        stroke="#757575"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
