import React from 'react';
import Svg, { Circle, Ellipse, Rect, Path, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* body */}
      <Ellipse
        cx="105"
        cy="120"
        rx="55"
        ry="34"
        fill="#FFFFFF"
        stroke="#B0BEC5"
        strokeWidth="2.5"
      />
      {/* head */}
      <Circle cx="65" cy="78" r="30" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="2.5" />
      {/* horn */}
      <Polygon points="65,48 58,15 74,44" fill="#FFD700" stroke="#B8860B" strokeWidth="2" />
      {/* mane */}
      <Path
        d="M 55 60 Q 40 40 55 25 Q 65 42 62 55 Q 78 40 85 55 Q 72 55 66 68"
        fill="#FF69B4"
        stroke="#C2185B"
        strokeWidth="1.5"
      />
      {/* eye */}
      <Circle cx="55" cy="78" r="3" fill="#1A1A1A" />
      {/* leg1 */}
      <Rect
        x="55"
        y="145"
        width="12"
        height="30"
        rx="5"
        fill="#FFFFFF"
        stroke="#B0BEC5"
        strokeWidth="2"
      />
      {/* leg2 */}
      <Rect
        x="85"
        y="148"
        width="12"
        height="30"
        rx="5"
        fill="#FFFFFF"
        stroke="#B0BEC5"
        strokeWidth="2"
      />
      {/* leg3 */}
      <Rect
        x="115"
        y="148"
        width="12"
        height="30"
        rx="5"
        fill="#FFFFFF"
        stroke="#B0BEC5"
        strokeWidth="2"
      />
      {/* leg4 */}
      <Rect
        x="143"
        y="145"
        width="12"
        height="30"
        rx="5"
        fill="#FFFFFF"
        stroke="#B0BEC5"
        strokeWidth="2"
      />
      {/* tail */}
      <Path
        d="M 158 110 Q 178 120 170 145 Q 160 135 158 145"
        fill="#9B59B6"
        stroke="#6C3483"
        strokeWidth="1.5"
      />
      {/* sparkle1 */}
      <Circle cx="30" cy="40" r="3" fill="#FFD700" opacity="0.8" />
      {/* sparkle2 */}
      <Circle cx="165" cy="60" r="3" fill="#87CEEB" opacity="0.8" />
      {/* sparkle3 */}
      <Circle cx="175" cy="90" r="2.5" fill="#FF69B4" opacity="0.8" />
    </Svg>
  );
}
