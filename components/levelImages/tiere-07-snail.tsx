import React from 'react';
import Svg, { Circle, Ellipse, Line, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Body/foot */}
      <Ellipse cx="78" cy="148" rx="65" ry="24" fill="#66BB6A" stroke="#388E3C" strokeWidth="2" />
      {/* Head */}
      <Circle cx="48" cy="136" r="16" fill="#66BB6A" stroke="#388E3C" strokeWidth="2" />
      {/* Left antennae */}
      <Line
        x1="42"
        y1="122"
        x2="34"
        y2="100"
        stroke="#388E3C"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Left antennae tip */}
      <Circle cx="34" cy="98" r="4" fill="#1A1A1A" />
      {/* Right antennae */}
      <Line
        x1="54"
        y1="122"
        x2="62"
        y2="100"
        stroke="#388E3C"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Right antennae tip */}
      <Circle cx="62" cy="98" r="4" fill="#1A1A1A" />
      {/* Eye */}
      <Circle cx="42" cy="132" r="3" fill="#1A1A1A" />
      {/* Shell outer */}
      <Circle cx="135" cy="118" r="50" fill="#FF8A65" stroke="#BF360C" strokeWidth="2" />
      {/* Shell middle ring */}
      <Circle cx="135" cy="118" r="30" fill="#FFAB91" stroke="#BF360C" strokeWidth="1.5" />
      {/* Shell inner */}
      <Circle cx="135" cy="118" r="12" fill="#FF7043" stroke="#BF360C" strokeWidth="1" />
      {/* Shell spiral accent */}
      <Path d="M 135 68 A 50 50 0 0 1 185 118" stroke="#BF360C" strokeWidth="2" fill="none" />
    </Svg>
  );
}
