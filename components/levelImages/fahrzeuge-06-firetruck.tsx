import React from 'react';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Body */}
      <Rect
        x="22"
        y="95"
        width="158"
        height="55"
        fill="#E74C3C"
        stroke="#C0392B"
        strokeWidth="2.5"
        rx="5"
      />
      {/* Cabin */}
      <Rect
        x="148"
        y="80"
        width="32"
        height="28"
        fill="#C0392B"
        stroke="#922B21"
        strokeWidth="2"
        rx="4"
      />
      {/* Cabin window */}
      <Rect
        x="152"
        y="84"
        width="24"
        height="16"
        fill="#87CEEB"
        stroke="#922B21"
        strokeWidth="1.5"
        rx="3"
      />
      {/* Equipment compartment */}
      <Rect
        x="30"
        y="103"
        width="35"
        height="38"
        fill="#C0392B"
        stroke="#922B21"
        strokeWidth="1.5"
        rx="3"
      />
      {/* Hose reel */}
      <Circle cx="100" cy="99" r="16" fill="#CC3D2A" stroke="#922B21" strokeWidth="1.5" />
      {/* Hose reel center */}
      <Circle cx="100" cy="99" r="6" fill="#E74C3C" />
      {/* Ladder */}
      <Rect
        x="22"
        y="85"
        width="125"
        height="6"
        fill="#FFD700"
        stroke="#FFC300"
        strokeWidth="1.5"
        rx="2"
      />
      {/* Ladder rungs */}
      <Path
        d="M 40 85 L 40 91 M 65 85 L 65 91 M 90 85 L 90 91 M 115 85 L 115 91"
        stroke="#FFA000"
        strokeWidth="1.5"
      />
      {/* Left wheel */}
      <Circle cx="52" cy="157" r="18" fill="#333333" stroke="#1A1A1A" strokeWidth="2" />
      {/* Left wheel hub */}
      <Circle cx="52" cy="157" r="7" fill="#888888" />
      {/* Right wheel */}
      <Circle cx="148" cy="157" r="18" fill="#333333" stroke="#1A1A1A" strokeWidth="2" />
      {/* Right wheel hub */}
      <Circle cx="148" cy="157" r="7" fill="#888888" />
      {/* Headlight */}
      <Circle cx="179" cy="110" r="7" fill="#FFFDE7" stroke="#FFA000" strokeWidth="1.5" />
    </Svg>
  );
}
