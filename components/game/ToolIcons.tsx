import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface IconProps {
  size?: number;
  color: string;
}

/**
 * Abstrakte, einfarbige Werkzeug-Piktogramme für die Zeichen-Toolbar.
 * Ersetzen die bisherigen Emoji (✏️ 🪣 👁) durch klare Linien-Icons,
 * deren Farbe komplett vom `color`-Prop (aktiv/inaktiv) gesteuert wird.
 */

export function PenIcon({ size = 20, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function FillIcon({ size = 20, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3.5 10.5L10.5 3.5a1 1 0 0 1 1.4 0l5.6 5.6a1 1 0 0 1 0 1.4l-7 7a1 1 0 0 1-1.4 0l-5.6-5.6a1 1 0 0 1 0-1.4z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path d="M3.5 10.5h13" stroke={color} strokeWidth={1.8} />
      <Path d="M18.5 13c0 1.1-.9 2-2 2s-2-.9-2-2c0-1.1 2-3.5 2-3.5s2 2.4 2 3.5z" fill={color} />
    </Svg>
  );
}

export function EyeIcon({ size = 16, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}
