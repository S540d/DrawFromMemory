import React from 'react';
import Svg, { Circle, Ellipse, Rect, Path, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Pot */}
      <Polygon
        points="75,185 125,185 118,160 82,160"
        fill="#8B4513"
        stroke="#000000"
        strokeWidth="2"
      />
      <Rect
        x="72"
        y="182"
        width="56"
        height="8"
        fill="#A0522D"
        stroke="#000000"
        strokeWidth="2"
        rx="2"
      />
      {/* Soil */}
      <Ellipse cx="100" cy="160" rx="18" ry="5" fill="#5D3A1A" />
      {/* Stem */}
      <Path
        d="M 100 158 Q 95 130 100 80"
        stroke="#27AE60"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Left leaf */}
      <Ellipse
        cx="80"
        cy="125"
        rx="18"
        ry="28"
        fill="#32CD32"
        stroke="#27AE60"
        strokeWidth="2"
        transform="rotate(-35 80 125)"
      />
      {/* Right leaf */}
      <Ellipse
        cx="120"
        cy="105"
        rx="18"
        ry="28"
        fill="#32CD32"
        stroke="#27AE60"
        strokeWidth="2"
        transform="rotate(35 120 105)"
      />
      {/* Flower center */}
      <Circle cx="100" cy="58" r="16" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
      {/* Petals top/bottom */}
      <Ellipse cx="100" cy="27" rx="11" ry="20" fill="#FF69B4" stroke="#FF1493" strokeWidth="1.5" />
      <Ellipse cx="100" cy="89" rx="11" ry="20" fill="#FF69B4" stroke="#FF1493" strokeWidth="1.5" />
      {/* Petals left/right */}
      <Ellipse cx="69" cy="58" rx="20" ry="11" fill="#FF69B4" stroke="#FF1493" strokeWidth="1.5" />
      <Ellipse cx="131" cy="58" rx="20" ry="11" fill="#FF69B4" stroke="#FF1493" strokeWidth="1.5" />
      {/* Diagonal petals */}
      <Ellipse
        cx="79"
        cy="37"
        rx="13"
        ry="18"
        fill="#FF85C1"
        stroke="#FF1493"
        strokeWidth="1.5"
        transform="rotate(-45 79 37)"
      />
      <Ellipse
        cx="121"
        cy="37"
        rx="13"
        ry="18"
        fill="#FF85C1"
        stroke="#FF1493"
        strokeWidth="1.5"
        transform="rotate(45 121 37)"
      />
      <Ellipse
        cx="79"
        cy="79"
        rx="13"
        ry="18"
        fill="#FF85C1"
        stroke="#FF1493"
        strokeWidth="1.5"
        transform="rotate(45 79 79)"
      />
      <Ellipse
        cx="121"
        cy="79"
        rx="13"
        ry="18"
        fill="#FF85C1"
        stroke="#FF1493"
        strokeWidth="1.5"
        transform="rotate(-45 121 79)"
      />
      {/* Center dot */}
      <Circle cx="100" cy="58" r="6" fill="#FFA500" stroke="#000000" strokeWidth="1" />
    </Svg>
  );
}
