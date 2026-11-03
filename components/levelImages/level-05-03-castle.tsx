import React from 'react';
import Svg, { Circle, Rect, Line, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox="0 0 280 260">
      {/* Central tower body */}
      <Rect
        x="100"
        y="100"
        width="80"
        height="120"
        fill="#D3D3D3"
        stroke="#000000"
        strokeWidth="2"
      />
      {/* Left tower */}
      <Rect x="30" y="130" width="40" height="90" fill="#A9A9A9" stroke="#000000" strokeWidth="2" />
      {/* Right tower */}
      <Rect
        x="210"
        y="130"
        width="40"
        height="90"
        fill="#A9A9A9"
        stroke="#000000"
        strokeWidth="2"
      />
      {/* Central tower roof */}
      <Polygon points="100,100 140,40 180,100" fill="#8B4513" stroke="#000000" strokeWidth="2" />
      {/* Left tower roof */}
      <Polygon points="30,130 50,80 70,130" fill="#8B4513" stroke="#000000" strokeWidth="2" />
      {/* Right tower roof */}
      <Polygon points="210,130 230,80 250,130" fill="#8B4513" stroke="#000000" strokeWidth="2" />
      {/* Central tower door */}
      <Rect
        x="125"
        y="160"
        width="30"
        height="50"
        fill="#654321"
        stroke="#000000"
        strokeWidth="2"
      />
      {/* Door handle */}
      <Circle cx="150" cy="185" r="3" fill="#FFD700" />
      {/* Left tower window */}
      <Rect x="40" y="150" width="20" height="20" fill="#87CEEB" stroke="#000000" strokeWidth="2" />
      {/* Right tower window */}
      <Rect
        x="220"
        y="150"
        width="20"
        height="20"
        fill="#87CEEB"
        stroke="#000000"
        strokeWidth="2"
      />
      {/* Central tower windows */}
      <Rect
        x="115"
        y="130"
        width="18"
        height="18"
        fill="#87CEEB"
        stroke="#000000"
        strokeWidth="1.5"
      />
      <Rect
        x="147"
        y="130"
        width="18"
        height="18"
        fill="#87CEEB"
        stroke="#000000"
        strokeWidth="1.5"
      />
      {/* Flag */}
      <Rect x="138" y="35" width="4" height="15" fill="#FFD700" stroke="#000000" strokeWidth="1" />
      <Polygon points="142,40 142,50 158,45" fill="#FF1493" stroke="#000000" strokeWidth="1.5" />
      {/* Ground */}
      <Line x1="20" y1="220" x2="260" y2="220" stroke="#000000" strokeWidth="3" />
    </Svg>
  );
}
