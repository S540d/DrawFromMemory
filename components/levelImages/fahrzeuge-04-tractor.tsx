import React from 'react';
import Svg, { Circle, Rect, Line, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Body */}
      <Rect
        x="62"
        y="95"
        width="80"
        height="55"
        fill="#4CAF50"
        stroke="#2E7D32"
        strokeWidth="2.5"
        rx="5"
      />
      {/* Hood */}
      <Rect
        x="118"
        y="108"
        width="48"
        height="35"
        fill="#388E3C"
        stroke="#2E7D32"
        strokeWidth="2"
        rx="4"
      />
      {/* Cabin roof */}
      <Rect
        x="65"
        y="75"
        width="74"
        height="25"
        fill="#2E7D32"
        stroke="#1B5E20"
        strokeWidth="2"
        rx="4"
      />
      {/* Cabin window */}
      <Rect
        x="70"
        y="79"
        width="62"
        height="17"
        fill="#87CEEB"
        stroke="#1B5E20"
        strokeWidth="1.5"
        rx="3"
      />
      {/* Exhaust pipe */}
      <Rect
        x="128"
        y="88"
        width="8"
        height="24"
        fill="#424242"
        stroke="#212121"
        strokeWidth="1.5"
        rx="2"
      />
      {/* Front small wheel */}
      <Circle cx="150" cy="154" r="18" fill="#333333" stroke="#1A1A1A" strokeWidth="2" />
      {/* Front wheel hub */}
      <Circle cx="150" cy="154" r="7" fill="#888888" />
      {/* Big rear wheel outer */}
      <Circle cx="72" cy="158" r="35" fill="#333333" stroke="#1A1A1A" strokeWidth="2.5" />
      {/* Big rear wheel inner */}
      <Circle cx="72" cy="158" r="22" fill="#555555" />
      {/* Rear wheel hub */}
      <Circle cx="72" cy="158" r="10" fill="#888888" />
      {/* Rear mudguard */}
      <Path
        d="M 38 126 Q 36 112 46 108"
        stroke="#2E7D32"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      {/* Headlight */}
      <Circle cx="164" cy="120" r="7" fill="#FFFDE7" stroke="#FFA000" strokeWidth="1.5" />
      {/* Rear wheel lug */}
      <Line x1="72" y1="136" x2="72" y2="146" stroke="#AAAAAA" strokeWidth="3" />
    </Svg>
  );
}
