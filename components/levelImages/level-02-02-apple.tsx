import React from 'react';
import Svg, { Circle, Ellipse, Rect } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox="0 0 200 200">
      {/* Apple body */}
      <Circle cx="100" cy="110" r="50" fill="#E74C3C" stroke="#000000" strokeWidth="2" />
      {/* Apple top indent */}
      <Ellipse cx="100" cy="65" rx="15" ry="10" fill="#E74C3C" stroke="#000000" strokeWidth="2" />
      {/* Stem */}
      <Rect x="96" y="50" width="8" height="20" fill="#8B4513" stroke="#000000" strokeWidth="1.5" />
      {/* Leaf */}
      <Ellipse cx="85" cy="55" rx="20" ry="12" fill="#27AE60" stroke="#000000" strokeWidth="1.5" />
      {/* Highlight */}
      <Ellipse cx="80" cy="100" rx="15" ry="20" fill="#FFFFFF" opacity="0.4" />
    </Svg>
  );
}
