import React from 'react';
import Svg, { Circle } from 'react-native-svg';

export default function render(svgSize: number, viewBox: string): React.ReactElement {
  return (
    <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
      {/* cookie */}
      <Circle cx="100" cy="100" r="65" fill="#D2A679" stroke="#A6764A" strokeWidth="2.5" />
      {/* choc1 */}
      <Circle cx="75" cy="75" r="8" fill="#5D3A1A" />
      {/* choc2 */}
      <Circle cx="120" cy="70" r="7" fill="#5D3A1A" />
      {/* choc3 */}
      <Circle cx="135" cy="105" r="8" fill="#5D3A1A" />
      {/* choc4 */}
      <Circle cx="100" cy="120" r="7" fill="#5D3A1A" />
      {/* choc5 */}
      <Circle cx="68" cy="118" r="6" fill="#5D3A1A" />
      {/* choc6 */}
      <Circle cx="110" cy="95" r="6" fill="#5D3A1A" />
      {/* choc7 */}
      <Circle cx="90" cy="145" r="5" fill="#5D3A1A" />
      {/* choc8 */}
      <Circle cx="140" cy="135" r="5" fill="#5D3A1A" />
    </Svg>
  );
}
