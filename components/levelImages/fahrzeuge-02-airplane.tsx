import React from 'react';
import Svg, { Circle, Ellipse, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Fuselage */}
      <Ellipse
        cx="100"
        cy="108"
        rx="78"
        ry="18"
        fill="#87CEEB"
        stroke="#4A90D9"
        strokeWidth="2.5"
      />
      {/* Nose cone */}
      <Ellipse cx="176" cy="108" rx="15" ry="11" fill="#6BB5D5" stroke="#4A90D9" strokeWidth="2" />
      {/* Main wing upper */}
      <Polygon points="100,108 72,58 132,108" fill="#4A90D9" stroke="#2C5F9A" strokeWidth="2" />
      {/* Main wing lower */}
      <Polygon points="100,108 72,158 132,108" fill="#4A90D9" stroke="#2C5F9A" strokeWidth="2" />
      {/* Tail fin (vertical) */}
      <Polygon points="30,104 28,74 52,104" fill="#4A90D9" stroke="#2C5F9A" strokeWidth="2" />
      {/* Tail horizontal left */}
      <Polygon points="32,108 12,94 52,108" fill="#4A90D9" stroke="#2C5F9A" strokeWidth="1.5" />
      {/* Tail horizontal right */}
      <Polygon points="32,108 12,122 52,108" fill="#4A90D9" stroke="#2C5F9A" strokeWidth="1.5" />
      {/* Window 1 */}
      <Circle cx="140" cy="105" r="8" fill="#FFFFFF" stroke="#4A90D9" strokeWidth="1.5" />
      {/* Window 2 */}
      <Circle cx="160" cy="105" r="8" fill="#FFFFFF" stroke="#4A90D9" strokeWidth="1.5" />
      {/* Engine pod */}
      <Ellipse cx="88" cy="122" rx="16" ry="7" fill="#7FB3D3" stroke="#4A90D9" strokeWidth="1.5" />
    </Svg>
  );
}
