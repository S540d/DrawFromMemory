import React from 'react';
import Svg, { Circle, Ellipse, Rect, Line, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Fuselage */}
      <Ellipse cx="95" cy="118" rx="62" ry="30" fill="#FF6B35" stroke="#E64A19" strokeWidth="2.5" />
      {/* Cockpit bubble */}
      <Ellipse cx="138" cy="112" rx="30" ry="24" fill="#87CEEB" stroke="#E64A19" strokeWidth="2" />
      {/* Tail boom */}
      <Rect
        x="20"
        y="112"
        width="42"
        height="14"
        fill="#FF6B35"
        stroke="#E64A19"
        strokeWidth="2"
        rx="4"
      />
      {/* Tail fin */}
      <Polygon points="20,112 10,90 35,112" fill="#E64A19" stroke="#BF360C" strokeWidth="2" />
      {/* Tail rotor */}
      <Ellipse cx="22" cy="100" rx="4" ry="18" fill="#D32F2F" stroke="#B71C1C" strokeWidth="1.5" />
      {/* Main rotor mast */}
      <Rect
        x="95"
        y="85"
        width="6"
        height="20"
        fill="#757575"
        stroke="#424242"
        strokeWidth="1.5"
        rx="2"
      />
      {/* Main rotor blade left */}
      <Ellipse cx="76" cy="84" rx="28" ry="7" fill="#D32F2F" stroke="#B71C1C" strokeWidth="1.5" />
      {/* Main rotor blade right */}
      <Ellipse cx="122" cy="84" rx="28" ry="7" fill="#D32F2F" stroke="#B71C1C" strokeWidth="1.5" />
      {/* Pilot window */}
      <Circle cx="142" cy="110" r="14" fill="#FFFFFF" stroke="#E64A19" strokeWidth="1.5" />
      {/* Skid bar */}
      <Rect
        x="68"
        y="146"
        width="52"
        height="7"
        fill="#757575"
        stroke="#424242"
        strokeWidth="1.5"
        rx="3"
      />
      {/* Skid front post */}
      <Line x1="72" y1="145" x2="72" y2="150" stroke="#424242" strokeWidth="3" />
      {/* Skid rear post */}
      <Line x1="115" y1="145" x2="115" y2="150" stroke="#424242" strokeWidth="3" />
    </Svg>
  );
}
