import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Circle, Ellipse, Path, Polygon } from 'react-native-svg';
import Colors from '../constants/Colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../constants/Layout';
import type { MascotMood } from '@services/MascotManager';

export type MascotAccessory = 'hat' | 'glasses' | 'bowtie' | 'crown';

interface MascotProps {
  message?: string;
  mood?: MascotMood;
  size?: number;
  accessory?: MascotAccessory | null;
  onPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
}

const MOOD_COLORS: Record<MascotMood, { body: string; blush: boolean }> = {
  neutral: { body: '#4ECDC4', blush: false },
  happy: { body: '#44CF6C', blush: true },
  excited: { body: '#2ECC71', blush: true },
  encouraging: { body: '#7FD8CE', blush: false },
};

/**
 * Chamäleon-Begleitfigur ("Mali") — begrüßt, kommentiert Fortschritt und
 * trägt kosmetische Unlocks (Issue #279, 1.1). Reine SVG-Zeichnung (kein
 * Lottie-Asset — siehe docs/ILLUSTRATION_STYLEGUIDE.md), damit sie ohne
 * externe Design-Assets in beide Plattformen (Native/Web) rendert.
 */
export default function Mascot({
  message,
  mood = 'neutral',
  size = 72,
  accessory = null,
  onPress,
  testID = 'mascot',
  accessibilityLabel,
}: MascotProps) {
  const { body } = MOOD_COLORS[mood];
  const eyeOffsetY = mood === 'excited' ? -2 : 0;

  const svg = (
    <Svg width={size} height={size} viewBox="0 0 100 100" testID={`${testID}-svg`}>
      {/* Schwanz */}
      <Path
        d="M28 70 C 10 70, 8 50, 22 46 C 12 44, 12 30, 24 32"
        stroke={body}
        strokeWidth={7}
        strokeLinecap="round"
        fill="none"
      />
      {/* Füße */}
      <Ellipse cx={38} cy={88} rx={8} ry={5} fill={body} />
      <Ellipse cx={62} cy={88} rx={8} ry={5} fill={body} />
      {/* Körper */}
      <Ellipse cx={50} cy={64} rx={26} ry={22} fill={body} />
      {/* Kopf */}
      <Circle cx={50} cy={36} r={19} fill={body} />
      {/* Augenhöcker */}
      <Circle cx={39} cy={22} r={9} fill={body} />
      <Circle cx={61} cy={22} r={9} fill={body} />
      {/* Augen (weiß + Pupille) */}
      <Circle cx={39} cy={22 + eyeOffsetY} r={5.5} fill={Colors.drawing.white} />
      <Circle cx={61} cy={22 + eyeOffsetY} r={5.5} fill={Colors.drawing.white} />
      <Circle cx={40} cy={21 + eyeOffsetY} r={2.6} fill={Colors.drawing.black} />
      <Circle cx={62} cy={21 + eyeOffsetY} r={2.6} fill={Colors.drawing.black} />
      {/* Wangen-Blush bei fröhlicher Stimmung */}
      {MOOD_COLORS[mood].blush && (
        <>
          <Circle cx={37} cy={40} r={4} fill={Colors.drawing.pink} opacity={0.55} />
          <Circle cx={63} cy={40} r={4} fill={Colors.drawing.pink} opacity={0.55} />
        </>
      )}
      {/* Mund */}
      {mood === 'encouraging' ? (
        <Path
          d="M42 45 Q50 42 58 45"
          stroke={Colors.drawing.black}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <Path
          d="M40 44 Q50 52 60 44"
          stroke={Colors.drawing.black}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* Accessoires (kosmetische Unlocks) */}
      {accessory === 'hat' && (
        <>
          <Polygon points="38,15 62,15 50,-4" fill={Colors.accentWarm} />
          <Ellipse cx={50} cy={15} rx={16} ry={3} fill={Colors.accentWarm} />
        </>
      )}
      {accessory === 'glasses' && (
        <>
          <Circle
            cx={39}
            cy={22 + eyeOffsetY}
            r={8}
            fill="none"
            stroke={Colors.text.primary}
            strokeWidth={2.5}
          />
          <Circle
            cx={61}
            cy={22 + eyeOffsetY}
            r={8}
            fill="none"
            stroke={Colors.text.primary}
            strokeWidth={2.5}
          />
          <Path
            d={`M47 ${22 + eyeOffsetY} L53 ${22 + eyeOffsetY}`}
            stroke={Colors.text.primary}
            strokeWidth={2.5}
          />
        </>
      )}
      {accessory === 'bowtie' && (
        <Polygon
          points="42,55 50,60 42,65 42,60 58,60 58,65 50,60 58,55 58,60"
          fill={Colors.secondary}
        />
      )}
      {accessory === 'crown' && (
        <Polygon
          points="36,16 40,2 46,14 50,0 54,14 60,2 64,16"
          fill={Colors.stars.filled}
          stroke={Colors.accentWarm}
          strokeWidth={1}
        />
      )}
    </Svg>
  );

  const content = (
    <View style={styles.row}>
      <View style={{ width: size, height: size }}>{svg}</View>
      {message ? (
        <View style={[styles.bubble, { backgroundColor: Colors.surface }]}>
          <Text style={[styles.bubbleText, { color: Colors.text.primary }]}>{message}</Text>
        </View>
      ) : null}
    </View>
  );

  if (!onPress) {
    return (
      <View testID={testID} accessibilityLabel={accessibilityLabel}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  bubble: {
    flexShrink: 1,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    ...Colors.shadow.small,
  },
  bubbleText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
});
