import React from 'react';
import Svg, { Circle, Ellipse, Line } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox="0 0 240 200">
      {/* Rear wheel */}
      <Circle cx="65" cy="130" r="48" fill="none" stroke="#333333" strokeWidth="5" />
      <Circle cx="65" cy="130" r="5" fill="#333333" />
      {/* Rear spokes */}
      <Line x1="65" y1="82" x2="65" y2="178" stroke="#888888" strokeWidth="1.5" />
      <Line x1="17" y1="130" x2="113" y2="130" stroke="#888888" strokeWidth="1.5" />
      <Line x1="31" y1="96" x2="99" y2="164" stroke="#888888" strokeWidth="1.5" />
      <Line x1="99" y1="96" x2="31" y2="164" stroke="#888888" strokeWidth="1.5" />
      {/* Front wheel */}
      <Circle cx="178" cy="130" r="48" fill="none" stroke="#333333" strokeWidth="5" />
      <Circle cx="178" cy="130" r="5" fill="#333333" />
      {/* Front spokes */}
      <Line x1="178" y1="82" x2="178" y2="178" stroke="#888888" strokeWidth="1.5" />
      <Line x1="130" y1="130" x2="226" y2="130" stroke="#888888" strokeWidth="1.5" />
      <Line x1="144" y1="96" x2="212" y2="164" stroke="#888888" strokeWidth="1.5" />
      <Line x1="212" y1="96" x2="144" y2="164" stroke="#888888" strokeWidth="1.5" />
      {/* Frame */}
      <Line
        x1="65"
        y1="130"
        x2="115"
        y2="75"
        stroke="#E74C3C"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <Line
        x1="115"
        y1="75"
        x2="178"
        y2="130"
        stroke="#E74C3C"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <Line
        x1="115"
        y1="75"
        x2="140"
        y2="130"
        stroke="#E74C3C"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <Line
        x1="65"
        y1="130"
        x2="140"
        y2="130"
        stroke="#E74C3C"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Seat post */}
      <Line
        x1="115"
        y1="75"
        x2="105"
        y2="50"
        stroke="#333333"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Seat */}
      <Ellipse cx="100" cy="48" rx="18" ry="6" fill="#333333" stroke="#000000" strokeWidth="1.5" />
      {/* Handlebar stem */}
      <Line
        x1="140"
        y1="130"
        x2="148"
        y2="60"
        stroke="#333333"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Handlebar */}
      <Line
        x1="135"
        y1="60"
        x2="165"
        y2="60"
        stroke="#333333"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Pedal crank */}
      <Circle cx="140" cy="130" r="10" fill="#888888" stroke="#333333" strokeWidth="2" />
      {/* Pedals */}
      <Line
        x1="130"
        y1="140"
        x2="118"
        y2="148"
        stroke="#333333"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Line
        x1="150"
        y1="120"
        x2="162"
        y2="112"
        stroke="#333333"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  );
}
