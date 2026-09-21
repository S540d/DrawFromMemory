import React from 'react';
import Svg, { Circle, Ellipse, Line, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Body */}
      <Ellipse cx="100" cy="120" rx="45" ry="55" fill="#795548" stroke="#4E342E" strokeWidth="2" />
      {/* Head */}
      <Circle cx="100" cy="72" r="38" fill="#8D6E63" stroke="#4E342E" strokeWidth="2" />
      {/* Left ear tuft */}
      <Polygon points="78,38 70,15 90,42" fill="#795548" stroke="#4E342E" strokeWidth="2" />
      {/* Right ear tuft */}
      <Polygon points="122,38 130,15 110,42" fill="#795548" stroke="#4E342E" strokeWidth="2" />
      {/* Left eye ring */}
      <Circle cx="86" cy="72" r="14" fill="#FFFFFF" stroke="#4E342E" strokeWidth="1.5" />
      {/* Right eye ring */}
      <Circle cx="114" cy="72" r="14" fill="#FFFFFF" stroke="#4E342E" strokeWidth="1.5" />
      {/* Left pupil */}
      <Circle cx="86" cy="73" r="8" fill="#1A1A1A" />
      {/* Right pupil */}
      <Circle cx="114" cy="73" r="8" fill="#1A1A1A" />
      {/* Beak */}
      <Polygon points="100,83 93,93 107,93" fill="#FFD700" stroke="#E65100" strokeWidth="1.5" />
      {/* Belly patch */}
      <Ellipse
        cx="100"
        cy="128"
        rx="28"
        ry="36"
        fill="#D7CCC8"
        stroke="#A1887F"
        strokeWidth="1.5"
      />
      {/* Left talon */}
      <Line
        x1="78"
        y1="168"
        x2="68"
        y2="182"
        stroke="#4E342E"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Right talon */}
      <Line
        x1="122"
        y1="168"
        x2="132"
        y2="182"
        stroke="#4E342E"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  );
}
