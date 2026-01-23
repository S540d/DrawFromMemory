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

      case 'level-02-01-house.svg':
        return (
          <Svg width={svgSize} height={svgSize} viewBox="0 0 200 240">
            {/* House body */}
            <Rect x="40" y="100" width="120" height="100" fill="#E74C3C" stroke="#000000" strokeWidth="2" />
            {/* Roof */}
            <Polygon points="40,100 100,30 160,100" fill="#8B4513" stroke="#000000" strokeWidth="2" />
            {/* Door */}
            <Rect x="85" y="150" width="30" height="50" fill="#8B4513" stroke="#000000" strokeWidth="2" />
            {/* Door handle */}
            <Circle cx="112" cy="175" r="3" fill="#FFD700" />
            {/* Left window */}
            <Rect x="55" y="115" width="25" height="25" fill="#87CEEB" stroke="#000000" strokeWidth="2" />
            {/* Right window */}
            <Rect x="120" y="115" width="25" height="25" fill="#87CEEB" stroke="#000000" strokeWidth="2" />
          </Svg>
        );

      case 'level-02-02-apple.svg':
        return (
          <Svg width={svgSize} height={svgSize} viewBox="0 0 200 200">
            {/* Apple body */}
            <Circle cx="100" cy="110" r="50" fill="#E74C3C" stroke="#000000" strokeWidth="2" />
            {/* Apple top indent */}
            <Ellipse cx="100" cy="65" rx="15" ry="10" fill="#E74C3C" stroke="#000000" strokeWidth="2" />
            {/* Stem */}
            <Rect x="96" y="50" width="8" height="20" fill="#8B4513" stroke="#000000" strokeWidth="1.5" />
            {/* Leaf */}
            <Ellipse cx="85" cy="55" rx="20" ry="12" fill="#27AE60" stroke="#000000" strokeWidth="1.5" />
            {/* Highlight */}
            <Ellipse cx="80" cy="100" rx="15" ry="20" fill="#FFFFFF" opacity="0.4" />
          </Svg>
        );

      case 'level-02-03-rocket.svg':
        return (
          <Svg width={svgSize} height={svgSize} viewBox="0 0 200 280">
            {/* Rocket body */}
            <Rect x="70" y="40" width="60" height="140" fill="#FF6B6B" stroke="#000000" strokeWidth="2" />
            {/* Rocket nose */}
            <Polygon points="100,20 85,40 115,40" fill="#FFD700" stroke="#000000" strokeWidth="2" />
            {/* Window */}
            <Circle cx="100" cy="70" r="12" fill="#3498DB" stroke="#000000" strokeWidth="1.5" />
            {/* Left fin */}
            <Polygon points="70,160 45,200 65,165" fill="#3498DB" stroke="#000000" strokeWidth="2" />
            {/* Right fin */}
            <Polygon points="130,160 155,200 135,165" fill="#3498DB" stroke="#000000" strokeWidth="2" />
            {/* Flame 1 */}
            <Polygon points="80,180 75,240 85,200" fill="#FF8C00" stroke="#000000" strokeWidth="1.5" />
            {/* Flame 2 */}
            <Polygon points="100,180 100,250 105,200" fill="#FFD700" stroke="#000000" strokeWidth="1.5" />
            {/* Flame 3 */}
            <Polygon points="120,180 125,240 115,200" fill="#FF8C00" stroke="#000000" strokeWidth="1.5" />
          </Svg>
        );

      case 'level-02-04-balloon.svg':
        return (
          <Svg width={svgSize} height={svgSize} viewBox="0 0 200 260">
            {/* Balloon */}
            <Circle cx="100" cy="70" r="40" fill="#FF1493" stroke="#000000" strokeWidth="2" />
            {/* String line */}
            <Line x1="100" y1="110" x2="100" y2="220" stroke="#000000" strokeWidth="2" />
            {/* Basket */}
            <Rect x="75" y="220" width="50" height="35" fill="#CD853F" stroke="#000000" strokeWidth="2" />
            {/* Basket weave pattern */}
            <Line x1="85" y1="220" x2="85" y2="255" stroke="#000000" strokeWidth="1" />
            <Line x1="95" y1="220" x2="95" y2="255" stroke="#000000" strokeWidth="1" />
            <Line x1="105" y1="220" x2="105" y2="255" stroke="#000000" strokeWidth="1" />
            <Line x1="115" y1="220" x2="115" y2="255" stroke="#000000" strokeWidth="1" />
            {/* Highlight on balloon */}
            <Ellipse cx="85" cy="50" rx="12" ry="15" fill="#FFFFFF" opacity="0.3" />
          </Svg>
        );

      case 'level-05-01-lion.svg':
        return (
          <Svg width={svgSize} height={svgSize} viewBox="0 0 240 220">
            {/* Mane outer */}
            <Circle cx="120" cy="90" r="50" fill="#FFA500" stroke="#000000" strokeWidth="2" />
            {/* Mane details */}
            <Circle cx="85" cy="70" r="22" fill="#FFA500" stroke="#000000" strokeWidth="1.5" />
            <Circle cx="155" cy="70" r="22" fill="#FFA500" stroke="#000000" strokeWidth="1.5" />
            {/* Head */}
            <Circle cx="120" cy="100" r="35" fill="#CD853F" stroke="#000000" strokeWidth="2" />
            {/* Ears */}
            <Polygon points="95,70 85,40 100,65" fill="#CD853F" stroke="#000000" strokeWidth="1.5" />
            <Polygon points="145,70 155,40 140,65" fill="#CD853F" stroke="#000000" strokeWidth="1.5" />
            {/* Eyes */}
            <Circle cx="110" cy="90" r="4" fill="#000000" />
            <Circle cx="130" cy="90" r="4" fill="#000000" />
            {/* Nose */}
            <Polygon points="120,105 115,115 125,115" fill="#000000" />
            {/* Snout */}
            <Ellipse cx="120" cy="108" rx="12" ry="10" fill="#F4A460" />
            {/* Body */}
            <Ellipse cx="120" cy="160" rx="30" ry="40" fill="#CD853F" stroke="#000000" strokeWidth="2" />
            {/* Front left leg */}
            <Rect x="105" y="185" width="10" height="30" fill="#8B6914" stroke="#000000" strokeWidth="2" />
            {/* Front right leg */}
            <Rect x="125" y="185" width="10" height="30" fill="#8B6914" stroke="#000000" strokeWidth="2" />
            {/* Tail */}
            <Path d="M 85 165 Q 40 160 45 110" stroke="#CD853F" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M 45 110 Q 35 100 30 105" stroke="#FFA500" strokeWidth="8" fill="none" strokeLinecap="round" />
          </Svg>
        );

      case 'level-05-02-landscape.svg':
        return (
          <Svg width={svgSize} height={svgSize} viewBox="0 0 300 200">
            {/* Sky */}
            <Rect width="300" height="100" fill="#87CEEB" />
            {/* Ground */}
            <Rect y="100" width="300" height="100" fill="#90EE90" />
            {/* Mountains */}
            <Polygon points="0,100 80,40 160,100" fill="#8B7355" stroke="#000000" strokeWidth="2" />
            <Polygon points="140,100 200,50 260,100" fill="#A0826D" stroke="#000000" strokeWidth="2" />
            {/* Sun */}
            <Circle cx="270" cy="30" r="25" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
            {/* Tree 1 */}
            <Rect x="30" y="130" width="12" height="30" fill="#8B4513" stroke="#000000" strokeWidth="1.5" />
            <Circle cx="36" cy="115" r="20" fill="#27AE60" stroke="#000000" strokeWidth="2" />
            {/* Cloud */}
            <Circle cx="50" cy="35" r="15" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
            <Circle cx="70" cy="35" r="18" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
          </Svg>
        );

      case 'level-05-03-castle.svg':
        return (
          <Svg width={svgSize} height={svgSize} viewBox="0 0 280 260">
            {/* Central tower body */}
            <Rect x="100" y="100" width="80" height="120" fill="#D3D3D3" stroke="#000000" strokeWidth="2" />
            {/* Left tower */}
            <Rect x="30" y="130" width="40" height="90" fill="#A9A9A9" stroke="#000000" strokeWidth="2" />
            {/* Right tower */}
            <Rect x="210" y="130" width="40" height="90" fill="#A9A9A9" stroke="#000000" strokeWidth="2" />
            {/* Central tower roof */}
            <Polygon points="100,100 140,40 180,100" fill="#8B4513" stroke="#000000" strokeWidth="2" />
            {/* Left tower roof */}
            <Polygon points="30,130 50,80 70,130" fill="#8B4513" stroke="#000000" strokeWidth="2" />
            {/* Right tower roof */}
            <Polygon points="210,130 230,80 250,130" fill="#8B4513" stroke="#000000" strokeWidth="2" />
            {/* Central tower door */}
            <Rect x="125" y="160" width="30" height="50" fill="#654321" stroke="#000000" strokeWidth="2" />
            {/* Door handle */}
            <Circle cx="150" cy="185" r="3" fill="#FFD700" />
            {/* Left tower window */}
            <Rect x="40" y="150" width="20" height="20" fill="#87CEEB" stroke="#000000" strokeWidth="2" />
            {/* Right tower window */}
            <Rect x="220" y="150" width="20" height="20" fill="#87CEEB" stroke="#000000" strokeWidth="2" />
            {/* Central tower windows */}
            <Rect x="115" y="130" width="18" height="18" fill="#87CEEB" stroke="#000000" strokeWidth="1.5" />
            <Rect x="147" y="130" width="18" height="18" fill="#87CEEB" stroke="#000000" strokeWidth="1.5" />
            {/* Flag */}
            <Rect x="138" y="35" width="4" height="15" fill="#FFD700" stroke="#000000" strokeWidth="1" />
            <Polygon points="142,40 142,50 158,45" fill="#FF1493" stroke="#000000" strokeWidth="1.5" />
            {/* Ground */}
            <Line x1="20" y1="220" x2="260" y2="220" stroke="#000000" strokeWidth="3" />
          </Svg>
        );

      case 'level-06-dog.svg':
        return (
          <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
            {/* Dog Body */}
            <Ellipse cx="110" cy="120" rx="45" ry="30" fill="#D2691E" stroke="#8B4513" strokeWidth="3" />
            {/* Dog Head */}
            <Circle cx="65" cy="100" r="28" fill="#D2691E" stroke="#8B4513" strokeWidth="3" />
            {/* Ear (floppy) */}
            <Ellipse cx="55" cy="85" rx="12" ry="25" fill="#A0522D" stroke="#8B4513" strokeWidth="2" rotation="-20" origin="55, 85" />
            {/* Snout */}
            <Ellipse cx="45" cy="105" rx="15" ry="12" fill="#CD853F" stroke="#8B4513" strokeWidth="2" />
            {/* Nose */}
            <Circle cx="42" cy="105" r="5" fill="#000000" />
            {/* Eye */}
            <Circle cx="68" cy="95" r="4" fill="#000000" />
            <Circle cx="70" cy="93" r="2" fill="#FFFFFF" />
            {/* Mouth */}
            <Line x1="42" y1="110" x2="42" y2="115" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
            <Path d="M 42 115 Q 38 117 35 115" stroke="#000000" strokeWidth="2" fill="none" />
            <Path d="M 42 115 Q 46 117 49 115" stroke="#000000" strokeWidth="2" fill="none" />
            {/* Front Legs */}
            <Rect x="90" y="140" width="10" height="30" fill="#D2691E" stroke="#8B4513" strokeWidth="2" rx="3" />
            <Rect x="115" y="140" width="10" height="30" fill="#D2691E" stroke="#8B4513" strokeWidth="2" rx="3" />
            {/* Back Legs (shorter) */}
            <Rect x="140" y="145" width="10" height="25" fill="#D2691E" stroke="#8B4513" strokeWidth="2" rx="3" />
            {/* Tail (curved) */}
            <Path d="M 155 115 Q 175 105 170 85" stroke="#8B4513" strokeWidth="8" fill="none" strokeLinecap="round" />
            {/* Paws (white spots) */}
            <Ellipse cx="95" cy="167" rx="6" ry="4" fill="#FFFFFF" />
            <Ellipse cx="120" cy="167" rx="6" ry="4" fill="#FFFFFF" />
            <Ellipse cx="145" cy="167" rx="6" ry="4" fill="#FFFFFF" />
            {/* Collar */}
            <Ellipse cx="80" cy="115" rx="18" ry="8" fill="none" stroke="#FF0000" strokeWidth="3" />
            <Circle cx="85" cy="115" r="3" fill="#FFD700" />
          </Svg>
        );

      case 'level-07-cat.svg':
        return (
          <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
            {/* Cat Body */}
            <Ellipse cx="100" cy="120" rx="40" ry="30" fill="#FFA500" stroke="#FF8C00" strokeWidth="3" />
            {/* Cat Head */}
            <Circle cx="100" cy="70" r="30" fill="#FFA500" stroke="#FF8C00" strokeWidth="3" />
            {/* Ears Left */}
            <Polygon points="75,45 70,20 85,50" fill="#FFA500" stroke="#FF8C00" strokeWidth="3" />
            {/* Ears Right */}
            <Polygon points="125,45 130,20 115,50" fill="#FFA500" stroke="#FF8C00" strokeWidth="3" />
            {/* Eyes */}
            <Circle cx="90" cy="65" r="5" fill="#000000" />
            <Circle cx="110" cy="65" r="5" fill="#000000" />
            {/* Nose */}
            <Polygon points="100,75 95,82 105,82" fill="#FFB6C1" />
            {/* Mouth */}
            <Path d="M 95 82 Q 100 85 105 82" stroke="#000000" strokeWidth="2" fill="none" />
            {/* Whiskers Left */}
            <Line x1="60" y1="70" x2="85" y2="68" stroke="#000000" strokeWidth="1" />
            <Line x1="60" y1="75" x2="85" y2="75" stroke="#000000" strokeWidth="1" />
            {/* Whiskers Right */}
            <Line x1="140" y1="70" x2="115" y2="68" stroke="#000000" strokeWidth="1" />
            <Line x1="140" y1="75" x2="115" y2="75" stroke="#000000" strokeWidth="1" />
            {/* Tail */}
            <Path d="M 130 130 Q 160 120 170 150" stroke="#FFA500" strokeWidth="8" fill="none" strokeLinecap="round" />
            {/* Legs */}
            <Rect x="75" y="140" width="10" height="25" fill="#FFA500" stroke="#FF8C00" strokeWidth="2" rx="3" />
            <Rect x="115" y="140" width="10" height="25" fill="#FFA500" stroke="#FF8C00" strokeWidth="2" rx="3" />
          </Svg>
        );

      case 'level-08-sheep.svg':
        return (
          <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
            {/* Sheep Body (fluffy wool - multiple circles) */}
            <Circle cx="90" cy="110" r="22" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
            <Circle cx="115" cy="110" r="22" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
            <Circle cx="102" cy="95" r="20" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
            <Circle cx="102" cy="125" r="20" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
            <Circle cx="125" cy="100" r="18" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
            <Circle cx="80" cy="100" r="18" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
            {/* Sheep Head (black face) */}
            <Ellipse cx="60" cy="105" rx="20" ry="22" fill="#2F4F4F" stroke="#1C1C1C" strokeWidth="2" />
            {/* Ears */}
            <Ellipse cx="52" cy="90" rx="8" ry="12" fill="#2F4F4F" stroke="#1C1C1C" strokeWidth="2" rotation="-15" origin="52, 90" />
            <Ellipse cx="68" cy="90" rx="8" ry="12" fill="#2F4F4F" stroke="#1C1C1C" strokeWidth="2" rotation="15" origin="68, 90" />
            {/* Eyes (white dots on black face) */}
            <Circle cx="56" cy="102" r="3" fill="#FFFFFF" />
            <Circle cx="64" cy="102" r="3" fill="#FFFFFF" />
            {/* Nose */}
            <Ellipse cx="60" cy="110" rx="4" ry="3" fill="#1C1C1C" />
            {/* Wool on head (fluffy top) */}
            <Circle cx="60" cy="85" r="12" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
            {/* Legs (black, thin) */}
            <Rect x="85" y="135" width="6" height="25" fill="#2F4F4F" stroke="#1C1C1C" strokeWidth="1" rx="2" />
            <Rect x="105" y="135" width="6" height="25" fill="#2F4F4F" stroke="#1C1C1C" strokeWidth="1" rx="2" />
            <Rect x="95" y="135" width="6" height="25" fill="#2F4F4F" stroke="#1C1C1C" strokeWidth="1" rx="2" />
            <Rect x="115" y="135" width="6" height="25" fill="#2F4F4F" stroke="#1C1C1C" strokeWidth="1" rx="2" />
            {/* Tail (small fluffy) */}
            <Circle cx="130" cy="120" r="8" fill="#F5F5F5" stroke="#D3D3D3" strokeWidth="2" />
          </Svg>
        );

      case 'extra-03-flower.svg':
        return (
          <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
            {/* Stem */}
            <Line x1="100" y1="180" x2="100" y2="80" stroke="#228B22" strokeWidth="4" strokeLinecap="round" />
            {/* Leaves */}
            <Ellipse cx="85" cy="130" rx="15" ry="25" fill="#32CD32" stroke="#228B22" strokeWidth="2" rotation="-30" origin="85, 130" />
            <Ellipse cx="115" cy="150" rx="15" ry="25" fill="#32CD32" stroke="#228B22" strokeWidth="2" rotation="30" origin="115, 150" />
            {/* Flower Center */}
            <Circle cx="100" cy="60" r="15" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
            {/* Petals */}
            <Ellipse cx="100" cy="30" rx="12" ry="20" fill="#FF69B4" stroke="#FF1493" strokeWidth="2" />
            <Ellipse cx="130" cy="60" rx="20" ry="12" fill="#FF69B4" stroke="#FF1493" strokeWidth="2" />
            <Ellipse cx="100" cy="90" rx="12" ry="20" fill="#FF69B4" stroke="#FF1493" strokeWidth="2" />
            <Ellipse cx="70" cy="60" rx="20" ry="12" fill="#FF69B4" stroke="#FF1493" strokeWidth="2" />
            {/* Diagonal Petals */}
            <Ellipse cx="120" cy="40" rx="15" ry="18" fill="#FF69B4" stroke="#FF1493" strokeWidth="2" rotation="45" origin="120, 40" />
            <Ellipse cx="120" cy="80" rx="15" ry="18" fill="#FF69B4" stroke="#FF1493" strokeWidth="2" rotation="-45" origin="120, 80" />
            <Ellipse cx="80" cy="40" rx="15" ry="18" fill="#FF69B4" stroke="#FF1493" strokeWidth="2" rotation="-45" origin="80, 40" />
            <Ellipse cx="80" cy="80" rx="15" ry="18" fill="#FF69B4" stroke="#FF1493" strokeWidth="2" rotation="45" origin="80, 80" />
          </Svg>
        );

      case 'extra-04-bird.svg':
        return (
          <Svg width={svgSize} height={svgSize} viewBox={viewBox}>
            {/* Bird Body */}
            <Ellipse cx="100" cy="100" rx="35" ry="25" fill="#1E90FF" stroke="#0000CD" strokeWidth="3" />
            {/* Bird Head */}
            <Circle cx="130" cy="85" r="20" fill="#1E90FF" stroke="#0000CD" strokeWidth="3" />
            {/* Eye */}
            <Circle cx="135" cy="82" r="4" fill="#000000" />
            <Circle cx="137" cy="80" r="2" fill="#FFFFFF" />
            {/* Beak */}
            <Polygon points="150,85 165,82 150,90" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
            {/* Wing */}
            <Ellipse cx="90" cy="100" rx="30" ry="20" fill="#4169E1" stroke="#0000CD" strokeWidth="3" rotation="-20" origin="90, 100" />
            {/* Wing Detail Lines */}
            <Line x1="70" y1="95" x2="85" y2="105" stroke="#0000CD" strokeWidth="2" />
            <Line x1="75" y1="90" x2="90" y2="100" stroke="#0000CD" strokeWidth="2" />
            {/* Tail Feathers */}
            <Ellipse cx="60" cy="105" rx="20" ry="12" fill="#4169E1" stroke="#0000CD" strokeWidth="2" rotation="-30" origin="60, 105" />
            <Ellipse cx="65" cy="110" rx="18" ry="10" fill="#4169E1" stroke="#0000CD" strokeWidth="2" rotation="-20" origin="65, 110" />
            {/* Legs */}
            <Line x1="100" y1="120" x2="95" y2="135" stroke="#FFA500" strokeWidth="3" strokeLinecap="round" />
            <Line x1="110" y1="120" x2="115" y2="135" stroke="#FFA500" strokeWidth="3" strokeLinecap="round" />
            {/* Feet */}
            <Line x1="90" y1="135" x2="95" y2="135" stroke="#FFA500" strokeWidth="2" />
            <Line x1="95" y1="135" x2="100" y2="135" stroke="#FFA500" strokeWidth="2" />
            <Line x1="110" y1="135" x2="115" y2="135" stroke="#FFA500" strokeWidth="2" />
            <Line x1="115" y1="135" x2="120" y2="135" stroke="#FFA500" strokeWidth="2" />
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
