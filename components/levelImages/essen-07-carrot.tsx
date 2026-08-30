import React from 'react';
import Svg, { Line, Path } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* root */}
      <Path
        d="M 75 70 L 125 70 L 105 170 Q 100 178 95 170 Z"
        fill="#FFA500"
        stroke="#E67E00"
        strokeWidth="2.5"
      />
      {/* texture1 */}
      <Line x1="82" y1="90" x2="92" y2="92" stroke="#E67E00" strokeWidth="1.5" />
      {/* texture2 */}
      <Line x1="108" y1="105" x2="118" y2="107" stroke="#E67E00" strokeWidth="1.5" />
      {/* texture3 */}
      <Line x1="90" y1="125" x2="98" y2="127" stroke="#E67E00" strokeWidth="1.5" />
      {/* texture4 */}
      <Line x1="96" y1="145" x2="104" y2="147" stroke="#E67E00" strokeWidth="1.5" />
      {/* leaf left */}
      <Path
        d="M 100 70 L 85 25"
        fill="none"
        stroke="#4CAF50"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* leaf center */}
      <Path
        d="M 100 70 L 100 20"
        fill="none"
        stroke="#388E3C"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* leaf right */}
      <Path
        d="M 100 70 L 115 25"
        fill="none"
        stroke="#4CAF50"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* leaf tip left */}
      <Path
        d="M 85 25 L 78 15"
        fill="none"
        stroke="#2E7D32"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* leaf tip right */}
      <Path
        d="M 115 25 L 122 15"
        fill="none"
        stroke="#2E7D32"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  );
}
