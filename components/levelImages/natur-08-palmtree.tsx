import React from 'react';
import Svg, { Circle, Ellipse, Line, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* trunk */}
      <Path
        d="M 92 175 C 88 130 108 100 112 65"
        fill="none"
        stroke="#8B5A2B"
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* trunk ring1 */}
      <Line x1="96" y1="155" x2="104" y2="153" stroke="#5D3A1A" strokeWidth="2" />
      {/* trunk ring2 */}
      <Line x1="94" y1="125" x2="104" y2="122" stroke="#5D3A1A" strokeWidth="2" />
      {/* frond1 */}
      <Path
        d="M 112 65 Q 60 45 30 70"
        fill="none"
        stroke="#2E7D32"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* frond2 */}
      <Path
        d="M 112 65 Q 70 30 45 35"
        fill="none"
        stroke="#388E3C"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* frond3 */}
      <Path
        d="M 112 65 Q 108 20 92 12"
        fill="none"
        stroke="#2E7D32"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* frond4 */}
      <Path
        d="M 112 65 Q 140 25 155 32"
        fill="none"
        stroke="#388E3C"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* frond5 */}
      <Path
        d="M 112 65 Q 160 50 178 72"
        fill="none"
        stroke="#2E7D32"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* coconut1 */}
      <Circle cx="108" cy="70" r="7" fill="#8B5A2B" stroke="#5D3A1A" strokeWidth="1.5" />
      {/* coconut2 */}
      <Circle cx="122" cy="76" r="7" fill="#8B5A2B" stroke="#5D3A1A" strokeWidth="1.5" />
      {/* coconut3 */}
      <Circle cx="114" cy="82" r="6" fill="#8B5A2B" stroke="#5D3A1A" strokeWidth="1.5" />
      {/* sand */}
      <Ellipse cx="100" cy="180" rx="55" ry="8" fill="#F4D19B" />
      {/* pebble1 */}
      <Circle cx="150" cy="145" r="5" fill="#F4D19B" stroke="#D7A86E" strokeWidth="1" />
      {/* pebble2 */}
      <Circle cx="45" cy="150" r="4" fill="#F4D19B" stroke="#D7A86E" strokeWidth="1" />
    </Svg>
  );
}
