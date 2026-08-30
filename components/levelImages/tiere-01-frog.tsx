import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Body */}
      <Ellipse cx="100" cy="118" rx="55" ry="42" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2" />
      {/* Left eye dome */}
      <Circle cx="76" cy="78" r="18" fill="#66BB6A" stroke="#2E7D32" strokeWidth="2" />
      {/* Right eye dome */}
      <Circle cx="124" cy="78" r="18" fill="#66BB6A" stroke="#2E7D32" strokeWidth="2" />
      {/* Left pupil */}
      <Circle cx="76" cy="75" r="9" fill="#1A1A1A" />
      {/* Right pupil */}
      <Circle cx="124" cy="75" r="9" fill="#1A1A1A" />
      {/* Left eye shine */}
      <Circle cx="79" cy="73" r="3" fill="#FFFFFF" />
      {/* Right eye shine */}
      <Circle cx="127" cy="73" r="3" fill="#FFFFFF" />
      {/* Smile */}
      <Path
        d="M 78 105 Q 100 118 122 105"
        stroke="#2E7D32"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Left back leg */}
      <Ellipse
        cx="52"
        cy="152"
        rx="22"
        ry="13"
        fill="#4CAF50"
        stroke="#2E7D32"
        strokeWidth="2"
        transform="rotate(-25 52 152)"
      />
      {/* Right back leg */}
      <Ellipse
        cx="148"
        cy="152"
        rx="22"
        ry="13"
        fill="#4CAF50"
        stroke="#2E7D32"
        strokeWidth="2"
        transform="rotate(25 148 152)"
      />
    </Svg>
  );
}
