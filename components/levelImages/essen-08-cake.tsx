import React from 'react';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* bottom tier */}
      <Rect
        x="45"
        y="120"
        width="110"
        height="50"
        rx="6"
        fill="#FF9EC4"
        stroke="#C2185B"
        strokeWidth="2.5"
      />
      {/* top tier */}
      <Rect
        x="65"
        y="85"
        width="70"
        height="40"
        rx="6"
        fill="#FFB6D9"
        stroke="#C2185B"
        strokeWidth="2.5"
      />
      {/* bottom frosting */}
      <Path
        d="M 45 122 Q 60 112 75 122 Q 90 112 105 122 Q 120 112 135 122 Q 148 112 155 122 L 155 130 L 45 130 Z"
        fill="#FFFFFF"
        stroke="none"
      />
      {/* top frosting */}
      <Path
        d="M 65 87 Q 78 78 90 87 Q 103 78 116 87 Q 128 78 135 87 L 135 94 L 65 94 Z"
        fill="#FFFFFF"
        stroke="none"
      />
      {/* candle1 */}
      <Rect x="82" y="55" width="5" height="30" fill="#FFD700" />
      {/* candle2 */}
      <Rect x="98" y="50" width="5" height="35" fill="#3498DB" />
      {/* candle3 */}
      <Rect x="114" y="55" width="5" height="30" fill="#FFD700" />
      {/* flame1 */}
      <Circle cx="84" cy="52" r="4" fill="#FF7043" />
      {/* flame2 */}
      <Circle cx="100" cy="47" r="4" fill="#FF7043" />
      {/* flame3 */}
      <Circle cx="116" cy="52" r="4" fill="#FF7043" />
      {/* sprinkle1 */}
      <Circle cx="60" cy="145" r="4" fill="#3498DB" />
      {/* sprinkle2 */}
      <Circle cx="140" cy="150" r="4" fill="#FFD700" />
      {/* sprinkle3 */}
      <Circle cx="80" cy="155" r="3.5" fill="#27AE60" />
      {/* sprinkle4 */}
      <Circle cx="120" cy="158" r="3.5" fill="#FF69B4" />
    </Svg>
  );
}
