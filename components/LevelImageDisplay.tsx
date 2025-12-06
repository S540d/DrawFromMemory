import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Ellipse, Rect, Line, Path, Polygon } from 'react-native-svg';
import type { LevelImage } from '../types';

interface Props {
  image: LevelImage;
  size?: number;
}

/**
 * Zeigt ein Level-Bild an (SVG inline)
 * Rendert die SVG-Bilder als React Native SVG Komponenten
 */
export default function LevelImageDisplay({ image, size = 300 }: Props) {
  const svgSize = size;
  const viewBox = "0 0 200 200";

  // Render basierend auf Dateinamen
  const renderSvg = () => {
    switch (image.filename) {
      case 'level-01-sun.svg':
        return (
          <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
            {/* Sonne - Kreis in der Mitte */}
            <Circle cx="100" cy="100" r="40" fill="#FFD700" stroke="#FFA500" strokeWidth="3" />
            {/* 8 Strahlen */}
            <Line x1="100" y1="20" x2="100" y2="50" stroke="#FFA500" strokeWidth="4" strokeLinecap="round" />
            <Line x1="100" y1="150" x2="100" y2="180" stroke="#FFA500" strokeWidth="4" strokeLinecap="round" />
            <Line x1="20" y1="100" x2="50" y2="100" stroke="#FFA500" strokeWidth="4" strokeLinecap="round" />
            <Line x1="150" y1="100" x2="180" y2="100" stroke="#FFA500" strokeWidth="4" strokeLinecap="round" />
            <Line x1="35" y1="35" x2="60" y2="60" stroke="#FFA500" strokeWidth="4" strokeLinecap="round" />
            <Line x1="140" y1="140" x2="165" y2="165" stroke="#FFA500" strokeWidth="4" strokeLinecap="round" />
            <Line x1="165" y1="35" x2="140" y2="60" stroke="#FFA500" strokeWidth="4" strokeLinecap="round" />
            <Line x1="60" y1="140" x2="35" y2="165" stroke="#FFA500" strokeWidth="4" strokeLinecap="round" />
          </Svg>
        );

      case 'level-02-face.svg':
        return (
          <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
            {/* Gesicht - Kreis */}
            <Circle cx="100" cy="100" r="60" fill="#FDBCB4" stroke="#000000" strokeWidth="3" />
            {/* Augen */}
            <Circle cx="80" cy="90" r="8" fill="#000000" />
            <Circle cx="120" cy="90" r="8" fill="#000000" />
            <Circle cx="82" cy="88" r="3" fill="#FFFFFF" />
            <Circle cx="122" cy="88" r="3" fill="#FFFFFF" />
            {/* Lächeln */}
            <Path d="M 70 110 Q 100 130 130 110" stroke="#000000" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Rote Wangen */}
            <Circle cx="65" cy="105" r="8" fill="#FF69B4" opacity="0.4" />
            <Circle cx="135" cy="105" r="8" fill="#FF69B4" opacity="0.4" />
          </Svg>
        );

      case 'level-03-cloud.svg':
        return (
          <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
            {/* Wolke - mehrere überlappende Kreise */}
            <Circle cx="80" cy="100" r="30" fill="#FFFFFF" stroke="#B0C4DE" strokeWidth="2" />
            <Circle cx="110" cy="95" r="35" fill="#FFFFFF" stroke="#B0C4DE" strokeWidth="2" />
            <Circle cx="140" cy="100" r="28" fill="#FFFFFF" stroke="#B0C4DE" strokeWidth="2" />
            <Circle cx="95" cy="110" r="25" fill="#FFFFFF" stroke="#B0C4DE" strokeWidth="2" />
            <Circle cx="125" cy="112" r="26" fill="#FFFFFF" stroke="#B0C4DE" strokeWidth="2" />
          </Svg>
        );

      case 'extra-01-stick-figure.svg':
        return (
          <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
            {/* Kopf */}
            <Circle cx="100" cy="50" r="20" fill="none" stroke="#000000" strokeWidth="3" />
            {/* Körper */}
            <Line x1="100" y1="70" x2="100" y2="130" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            {/* Arme */}
            <Line x1="100" y1="90" x2="70" y2="110" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Line x1="100" y1="90" x2="130" y2="110" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            {/* Beine */}
            <Line x1="100" y1="130" x2="75" y2="170" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Line x1="100" y1="130" x2="125" y2="170" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
          </Svg>
        );

      default:
        // Fallback für noch nicht implementierte Bilder
        return (
          <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
            <Rect x="50" y="50" width="100" height="100" fill="#F5F5F5" stroke="#CCCCCC" strokeWidth="2" />
            <Line x1="50" y1="50" x2="150" y2="150" stroke="#CCCCCC" strokeWidth="2" />
            <Line x1="150" y1="50" x2="50" y2="150" stroke="#CCCCCC" strokeWidth="2" />
          </Svg>
        );
    }
  };

  return (
    <View style={[styles.container, { width: svgSize, height: svgSize }]}>
      {renderSvg()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
