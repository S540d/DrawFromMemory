import React from 'react';
import Svg, { Circle, Ellipse, Rect } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Sheep Body (fluffy wool - multiple circles) */}
      <Circle cx="90" cy="110" r="22" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
      <Circle cx="115" cy="110" r="22" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
      <Circle cx="102" cy="95" r="20" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
      <Circle cx="102" cy="125" r="20" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
      <Circle cx="125" cy="100" r="18" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
      <Circle cx="80" cy="100" r="18" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
      {/* Sheep Head (black face) */}
      <Ellipse cx="60" cy="105" rx="20" ry="22" fill="#2F4F4F" stroke="#1C1C1C" strokeWidth="2" />
      {/* Ears */}
      <Ellipse
        cx="52"
        cy="90"
        rx="8"
        ry="12"
        fill="#2F4F4F"
        stroke="#1C1C1C"
        strokeWidth="2"
        transform="rotate(-15 52 90)"
      />
      <Ellipse
        cx="68"
        cy="90"
        rx="8"
        ry="12"
        fill="#2F4F4F"
        stroke="#1C1C1C"
        strokeWidth="2"
        transform="rotate(15 68 90)"
      />
      {/* Eyes (white dots on black face) */}
      <Circle cx="56" cy="102" r="3" fill="#FFFFFF" />
      <Circle cx="64" cy="102" r="3" fill="#FFFFFF" />
      {/* Nose */}
      <Ellipse cx="60" cy="110" rx="4" ry="3" fill="#1C1C1C" />
      {/* Wool on head (fluffy top) */}
      <Circle cx="60" cy="85" r="12" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
      {/* Legs (black, thin) */}
      <Rect
        x="85"
        y="135"
        width="6"
        height="25"
        fill="#2F4F4F"
        stroke="#1C1C1C"
        strokeWidth="1"
        rx="2"
      />
      <Rect
        x="105"
        y="135"
        width="6"
        height="25"
        fill="#2F4F4F"
        stroke="#1C1C1C"
        strokeWidth="1"
        rx="2"
      />
      <Rect
        x="95"
        y="135"
        width="6"
        height="25"
        fill="#2F4F4F"
        stroke="#1C1C1C"
        strokeWidth="1"
        rx="2"
      />
      <Rect
        x="115"
        y="135"
        width="6"
        height="25"
        fill="#2F4F4F"
        stroke="#1C1C1C"
        strokeWidth="1"
        rx="2"
      />
      {/* Tail (small fluffy) */}
      <Circle cx="130" cy="120" r="8" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
    </Svg>
  );
}
