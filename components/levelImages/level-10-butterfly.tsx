import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Body */}
      <Ellipse cx="100" cy="100" rx="5" ry="35" fill="#000000" />
      {/* Head */}
      <Circle cx="100" cy="60" r="8" fill="#000000" />
      {/* Antennae */}
      <Path
        d="M 96 55 Q 80 35 75 30"
        stroke="#000000"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <Circle cx="75" cy="30" r="3" fill="#000000" />
      <Path
        d="M 104 55 Q 120 35 125 30"
        stroke="#000000"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <Circle cx="125" cy="30" r="3" fill="#000000" />
      {/* Upper left wing */}
      <Ellipse
        cx="65"
        cy="80"
        rx="35"
        ry="28"
        fill="#9B59B6"
        stroke="#000000"
        strokeWidth="2"
        transform="rotate(-20 65 80)"
      />
      <Ellipse
        cx="60"
        cy="78"
        rx="15"
        ry="12"
        fill="#FF69B4"
        stroke="none"
        opacity="0.7"
        transform="rotate(-20 60 78)"
      />
      <Circle cx="55" cy="75" r="5" fill="#FFD700" stroke="none" opacity="0.8" />
      {/* Upper right wing */}
      <Ellipse
        cx="135"
        cy="80"
        rx="35"
        ry="28"
        fill="#9B59B6"
        stroke="#000000"
        strokeWidth="2"
        transform="rotate(20 135 80)"
      />
      <Ellipse
        cx="140"
        cy="78"
        rx="15"
        ry="12"
        fill="#FF69B4"
        stroke="none"
        opacity="0.7"
        transform="rotate(20 140 78)"
      />
      <Circle cx="145" cy="75" r="5" fill="#FFD700" stroke="none" opacity="0.8" />
      {/* Lower left wing */}
      <Ellipse
        cx="70"
        cy="115"
        rx="28"
        ry="22"
        fill="#BB6BD9"
        stroke="#000000"
        strokeWidth="2"
        transform="rotate(15 70 115)"
      />
      <Ellipse
        cx="65"
        cy="115"
        rx="12"
        ry="10"
        fill="#FFFFFF"
        stroke="none"
        opacity="0.4"
        transform="rotate(15 65 115)"
      />
      {/* Lower right wing */}
      <Ellipse
        cx="130"
        cy="115"
        rx="28"
        ry="22"
        fill="#BB6BD9"
        stroke="#000000"
        strokeWidth="2"
        transform="rotate(-15 130 115)"
      />
      <Ellipse
        cx="135"
        cy="115"
        rx="12"
        ry="10"
        fill="#FFFFFF"
        stroke="none"
        opacity="0.4"
        transform="rotate(-15 135 115)"
      />
    </Svg>
  );
}
