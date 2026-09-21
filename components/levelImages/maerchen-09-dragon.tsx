import React from 'react';
import Svg, { Circle, Ellipse, Path, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* body */}
      <Ellipse
        cx="100"
        cy="125"
        rx="50"
        ry="34"
        fill="#27AE60"
        stroke="#1B5E20"
        strokeWidth="2.5"
      />
      {/* head */}
      <Circle cx="145" cy="90" r="26" fill="#2ECC71" stroke="#1B5E20" strokeWidth="2.5" />
      {/* jaw/snout */}
      <Path d="M 165 78 L 178 68 L 172 84 Z" fill="#2ECC71" stroke="#1B5E20" strokeWidth="2" />
      {/* spike1 */}
      <Polygon points="130,68 128,50 140,64" fill="#1B5E20" stroke="none" />
      {/* spike2 */}
      <Polygon points="145,62 146,44 156,60" fill="#1B5E20" stroke="none" />
      {/* spike3 back */}
      <Polygon points="110,95 105,80 118,88" fill="#1B5E20" stroke="none" />
      {/* eye */}
      <Circle cx="150" cy="84" r="3.5" fill="#1A1A1A" />
      {/* tail */}
      <Path
        d="M 65 105 Q 25 95 20 70"
        fill="none"
        stroke="#1B5E20"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* tail spike */}
      <Polygon points="18,66 12,55 24,58" fill="#1B5E20" stroke="none" />
      {/* wing */}
      <Path
        d="M 90 95 C 60 70 30 85 45 105 C 60 100 75 100 90 108"
        fill="#66BB6A"
        stroke="#1B5E20"
        strokeWidth="2"
        opacity="0.9"
      />
      {/* fire breath */}
      <Path
        d="M 168 66 Q 185 55 190 65 Q 178 68 175 76"
        fill="#FF7043"
        stroke="#E64A19"
        strokeWidth="1.5"
      />
      {/* foot */}
      <Circle cx="60" cy="155" r="8" fill="#27AE60" stroke="#1B5E20" strokeWidth="2" />
      {/* foot2 */}
      <Circle cx="130" cy="158" r="8" fill="#27AE60" stroke="#1B5E20" strokeWidth="2" />
    </Svg>
  );
}
