import React, { useEffect } from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle, AccessibilityInfo } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/Layout';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'difficulty';
type BadgeSize = 'sm' | 'md';

const VARIANT_COLORS: Record<BadgeVariant, string> = {
  primary: Colors.primary,
  success: Colors.success,
  warning: Colors.warning,
  error: Colors.error,
  info: Colors.info,
  difficulty: Colors.primary,
};

const DIFFICULTY_COLORS: Record<number, string> = {
  1: Colors.difficulty[1],
  2: Colors.difficulty[2],
  3: Colors.difficulty[3],
  4: Colors.difficulty[4],
  5: Colors.difficulty[5],
};

/**
 * Badge – kleines Label für Status, Schwierigkeit oder Kategorien.
 *
 * Beispiele:
 *   <Badge label="Einfach" variant="success" />
 *   <Badge label={difficultyText} variant="difficulty" difficulty={3} />
 */
export function Badge({
  label,
  variant = 'primary',
  difficulty,
  size = 'md',
  style,
}: {
  label: string;
  variant?: BadgeVariant;
  /** Nur relevant bei variant="difficulty" (1–5) */
  difficulty?: number;
  size?: BadgeSize;
  style?: ViewStyle;
}) {
  const backgroundColor =
    variant === 'difficulty' && difficulty !== undefined
      ? (DIFFICULTY_COLORS[difficulty] ?? Colors.primary)
      : VARIANT_COLORS[variant];

  const containerStyle: ViewStyle[] = [
    styles.base,
    size === 'sm' ? styles.sm : styles.md,
    { backgroundColor },
    style ?? {},
  ];

  const textStyle: TextStyle = size === 'sm' ? styles.textSm : styles.textMd;

  return (
    <Animated.View style={containerStyle}>
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </Animated.View>
  );
}

/**
 * CountBadge – runder Zähler (z. B. für ungelesene Meldungen).
 */
export function CountBadge({
  count,
  style,
}: {
  count: number;
  style?: ViewStyle;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (reduceMotion) return;
      scale.value = withSpring(1.3, { damping: 6, stiffness: 300 }, () => {
        scale.value = withSpring(1, { damping: 10, stiffness: 200 });
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.countBadge, animatedStyle, style ?? {}]}>
      <Text style={styles.countText}>{count > 99 ? '99+' : count}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.md,
    ...Colors.shadow.small,
  },
  md: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  sm: {
    paddingVertical: 2,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  text: {
    color: Colors.drawing.white,
    fontWeight: FontWeight.medium,
  },
  textMd: {
    fontSize: FontSize.sm,
  },
  textSm: {
    fontSize: FontSize.xs,
  },
  countBadge: {
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.round,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    ...Colors.shadow.small,
  },
  countText: {
    color: Colors.drawing.white,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
});

export default Badge;
