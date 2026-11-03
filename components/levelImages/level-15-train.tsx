import React from 'react';
import Svg, { Circle, Rect, Line } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox="0 0 280 200">
      {/* Main body */}
      <Rect
        x="20"
        y="70"
        width="200"
        height="80"
        fill="#E74C3C"
        stroke="#000000"
        strokeWidth="2"
        rx="10"
      />
      {/* Locomotive front */}
      <Rect
        x="200"
        y="80"
        width="45"
        height="60"
        fill="#C0392B"
        stroke="#000000"
        strokeWidth="2"
        rx="6"
      />
      {/* Chimney */}
      <Rect
        x="215"
        y="55"
        width="16"
        height="28"
        fill="#333333"
        stroke="#000000"
        strokeWidth="2"
        rx="3"
      />
      {/* Steam */}
      <Circle
        cx="215"
        cy="50"
        r="8"
        fill="#DDDDDD"
        stroke="#AAAAAA"
        strokeWidth="1"
        opacity="0.8"
      />
      {/* Window 1 */}
      <Rect
        x="35"
        y="82"
        width="35"
        height="28"
        fill="#87CEEB"
        stroke="#000000"
        strokeWidth="2"
        rx="3"
      />
      {/* Window 2 */}
      <Rect
        x="85"
        y="82"
        width="35"
        height="28"
        fill="#87CEEB"
        stroke="#000000"
        strokeWidth="2"
        rx="3"
      />
      {/* Window 3 */}
      <Rect
        x="135"
        y="82"
        width="35"
        height="28"
        fill="#87CEEB"
        stroke="#000000"
        strokeWidth="2"
        rx="3"
      />
      {/* Front window */}
      <Rect
        x="210"
        y="88"
        width="25"
        height="22"
        fill="#87CEEB"
        stroke="#000000"
        strokeWidth="2"
        rx="3"
      />
      {/* Wheels */}
      <Circle cx="55" cy="148" r="18" fill="#333333" stroke="#000000" strokeWidth="2" />
      <Circle cx="55" cy="148" r="9" fill="#808080" />
      <Circle cx="120" cy="148" r="18" fill="#333333" stroke="#000000" strokeWidth="2" />
      <Circle cx="120" cy="148" r="9" fill="#808080" />
      <Circle cx="185" cy="148" r="18" fill="#333333" stroke="#000000" strokeWidth="2" />
      <Circle cx="185" cy="148" r="9" fill="#808080" />
      <Circle cx="230" cy="148" r="14" fill="#333333" stroke="#000000" strokeWidth="2" />
      <Circle cx="230" cy="148" r="7" fill="#808080" />
      {/* Rail */}
      <Line
        x1="10"
        y1="165"
        x2="270"
        y2="165"
        stroke="#555555"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Headlight */}
      <Circle cx="242" cy="110" r="7" fill="#FFD700" stroke="#000000" strokeWidth="1.5" />
    </Svg>
  );
}
