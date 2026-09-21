import React from 'react';
import Svg, { Circle, Ellipse, Rect, Polygon } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* Body */}
      <Ellipse cx="100" cy="130" rx="48" ry="38" fill="#FF6F00" stroke="#E65100" strokeWidth="2" />
      {/* Head */}
      <Circle cx="100" cy="78" r="33" fill="#FF6F00" stroke="#E65100" strokeWidth="2" />
      {/* Left ear */}
      <Polygon points="76,50 68,18 90,52" fill="#FF6F00" stroke="#E65100" strokeWidth="2" />
      {/* Right ear */}
      <Polygon points="124,50 132,18 110,52" fill="#FF6F00" stroke="#E65100" strokeWidth="2" />
      {/* White muzzle */}
      <Ellipse cx="100" cy="90" rx="20" ry="16" fill="#FFECB3" stroke="#E65100" strokeWidth="1" />
      {/* Left eye */}
      <Circle cx="88" cy="72" r="5" fill="#1A1A1A" />
      {/* Right eye */}
      <Circle cx="112" cy="72" r="5" fill="#1A1A1A" />
      {/* Nose */}
      <Circle cx="100" cy="86" r="4" fill="#1A1A1A" />
      {/* Bushy tail */}
      <Ellipse
        cx="153"
        cy="152"
        rx="35"
        ry="25"
        fill="#FF6F00"
        stroke="#E65100"
        strokeWidth="2"
        transform="rotate(30 153 152)"
      />
      {/* Tail tip white */}
      <Ellipse
        cx="153"
        cy="152"
        rx="20"
        ry="14"
        fill="#FFFFFF"
        stroke="none"
        transform="rotate(30 153 152)"
      />
      {/* Front left leg */}
      <Rect
        x="78"
        y="160"
        width="12"
        height="28"
        fill="#FF6F00"
        stroke="#E65100"
        strokeWidth="2"
        rx="3"
      />
      {/* Front right leg */}
      <Rect
        x="110"
        y="160"
        width="12"
        height="28"
        fill="#FF6F00"
        stroke="#E65100"
        strokeWidth="2"
        rx="3"
      />
      {/* White chest patch */}
      <Ellipse cx="100" cy="130" rx="20" ry="26" fill="#FFECB3" stroke="none" />
    </Svg>
  );

  // ── Fahrzeuge v1 Pack ──────────────────────────────────────────────────
}
