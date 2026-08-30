import React from 'react';
import Svg, { Circle, Rect } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Body */}
      <Rect
        x="18"
        y="88"
        width="162"
        height="60"
        fill="#FFD700"
        stroke="#FFA000"
        strokeWidth="2.5"
        rx="6"
      />
      {/* Roof */}
      <Rect
        x="28"
        y="75"
        width="142"
        height="18"
        fill="#FFC300"
        stroke="#FFA000"
        strokeWidth="2"
        rx="5"
      />
      {/* Front windshield */}
      <Rect
        x="150"
        y="92"
        width="24"
        height="26"
        fill="#87CEEB"
        stroke="#FFA000"
        strokeWidth="1.5"
        rx="3"
      />
      {/* Window 1 */}
      <Rect
        x="28"
        y="92"
        width="26"
        height="22"
        fill="#87CEEB"
        stroke="#FFA000"
        strokeWidth="1.5"
        rx="3"
      />
      {/* Window 2 */}
      <Rect
        x="62"
        y="92"
        width="26"
        height="22"
        fill="#87CEEB"
        stroke="#FFA000"
        strokeWidth="1.5"
        rx="3"
      />
      {/* Window 3 */}
      <Rect
        x="96"
        y="92"
        width="26"
        height="22"
        fill="#87CEEB"
        stroke="#FFA000"
        strokeWidth="1.5"
        rx="3"
      />
      {/* Left wheel */}
      <Circle cx="52" cy="156" r="17" fill="#333333" stroke="#1A1A1A" strokeWidth="2" />
      {/* Left wheel hub */}
      <Circle cx="52" cy="156" r="7" fill="#999999" />
      {/* Right wheel */}
      <Circle cx="148" cy="156" r="17" fill="#333333" stroke="#1A1A1A" strokeWidth="2" />
      {/* Right wheel hub */}
      <Circle cx="148" cy="156" r="7" fill="#999999" />
      {/* Headlight */}
      <Circle cx="179" cy="108" r="7" fill="#FFFDE7" stroke="#FFA000" strokeWidth="1.5" />
    </Svg>
  );
}
