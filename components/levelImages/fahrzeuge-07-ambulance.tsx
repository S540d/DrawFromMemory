import React from 'react';
import Svg, { Circle, Rect } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Body */}
      <Rect
        x="22"
        y="90"
        width="158"
        height="62"
        fill="#FFFFFF"
        stroke="#BDBDBD"
        strokeWidth="2.5"
        rx="5"
      />
      {/* Cabin roof */}
      <Rect
        x="130"
        y="75"
        width="52"
        height="20"
        fill="#F5F5F5"
        stroke="#BDBDBD"
        strokeWidth="2"
        rx="4"
      />
      {/* Windshield */}
      <Rect
        x="134"
        y="79"
        width="42"
        height="16"
        fill="#87CEEB"
        stroke="#BDBDBD"
        strokeWidth="1.5"
        rx="3"
      />
      {/* Red cross vertical */}
      <Rect x="68" y="96" width="12" height="36" fill="#E74C3C" stroke="none" rx="2" />
      {/* Red cross horizontal */}
      <Rect x="56" y="108" width="36" height="12" fill="#E74C3C" stroke="none" rx="2" />
      {/* Red stripe */}
      <Rect x="22" y="116" width="158" height="10" fill="#E74C3C" stroke="none" />
      {/* Side window */}
      <Rect
        x="110"
        y="96"
        width="55"
        height="22"
        fill="#E3F2FD"
        stroke="#BDBDBD"
        strokeWidth="1"
        rx="2"
      />
      {/* Siren light */}
      <Rect
        x="148"
        y="73"
        width="20"
        height="8"
        fill="#2196F3"
        stroke="#1565C0"
        strokeWidth="1.5"
        rx="3"
      />
      {/* Left wheel */}
      <Circle cx="52" cy="158" r="17" fill="#333333" stroke="#1A1A1A" strokeWidth="2" />
      {/* Left wheel hub */}
      <Circle cx="52" cy="158" r="6" fill="#999999" />
      {/* Right wheel */}
      <Circle cx="148" cy="158" r="17" fill="#333333" stroke="#1A1A1A" strokeWidth="2" />
      {/* Right wheel hub */}
      <Circle cx="148" cy="158" r="6" fill="#999999" />
    </Svg>
  );
}
