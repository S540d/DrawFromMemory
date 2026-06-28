import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';
import Colors from '../constants/Colors';
import { BorderRadius, FontFamily, FontSize, FontWeight, Spacing } from '../constants/Layout';
import { useReduceMotion } from '../utils/useReduceMotion';
import type { GamePhase } from '../types';

interface Props {
  phase: GamePhase;
  onDismiss: () => void;
}

const TOTAL_STEPS = 3;
const PHASE_ORDER: GamePhase[] = ['memorize', 'draw', 'result'];

const PHASE_CONFIG: Record<GamePhase, { emoji: string; textKey: string; badgeKey: string }> = {
  memorize: { emoji: '👀', textKey: 'tutorial.memorize', badgeKey: 'tutorial.badgeMemorize' },
  draw:     { emoji: '✏️', textKey: 'tutorial.draw',     badgeKey: 'tutorial.badgeDraw' },
  result:   { emoji: '⭐', textKey: 'tutorial.result',   badgeKey: 'tutorial.badgeResult' },
};

const AUTO_DISMISS_MS = 6000;

export default function TutorialOverlay({ phase, onDismiss }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);
  const bounce = useSharedValue(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const config = PHASE_CONFIG[phase] ?? PHASE_CONFIG.memorize;
  const stepIndex = PHASE_ORDER.indexOf(phase);
  const currentStep = stepIndex >= 0 ? stepIndex + 1 : 1;

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 350 });
    translateY.value = withTiming(0, { duration: 350 });

    if (!reduceMotion) {
      bounce.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 700, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      );
    }

    timerRef.current = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(8, { duration: 300 });
      setTimeout(onDismiss, 320);
    }, AUTO_DISMISS_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      cancelAnimation(opacity);
      cancelAnimation(translateY);
      cancelAnimation(bounce);
    };
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value + bounce.value },
    ],
  }));

  const handleDismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    opacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(8, { duration: 200 });
    setTimeout(onDismiss, 220);
  };

  return (
    <Animated.View style={[styles.wrapper, containerStyle]} pointerEvents="box-none">
      <Pressable
        onPress={handleDismiss}
        style={[styles.bubble, { backgroundColor: colors.surface }]}
        accessibilityRole="button"
        accessibilityLabel={t('tutorial.tap')}
        testID="tutorial-overlay"
      >
        {/* Step indicator */}
        <View style={styles.stepRow}>
          {PHASE_ORDER.map((_, i) => (
            <View
              key={i}
              style={[
                styles.stepDot,
                i < currentStep ? styles.stepDotDone : styles.stepDotPending,
              ]}
            />
          ))}
        </View>

        {/* Emoji + text */}
        <Text style={styles.emoji}>{config.emoji}</Text>
        <Text style={[styles.text, { color: colors.text.primary }]}>
          {t(config.textKey)}
        </Text>

        {/* Phase badge */}
        <View style={styles.badgeRow}>
          {PHASE_ORDER.map((p, i) => (
            <View
              key={p}
              style={[
                styles.badge,
                p === phase
                  ? [styles.badgeActive, { backgroundColor: Colors.primary }]
                  : [styles.badgeInactive, { borderColor: colors.text.light }],
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  p === phase ? styles.badgeTextActive : { color: colors.text.secondary },
                ]}
              >
                {i + 1}. {t(PHASE_CONFIG[p].badgeKey)}
              </Text>
            </View>
          ))}
        </View>

        <Text style={[styles.tapHint, { color: colors.text.secondary }]}>
          {t('tutorial.tap')}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 100,
    pointerEvents: 'box-none',
  },
  bubble: {
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    ...Colors.shadow.large,
    borderWidth: 1.5,
    borderColor: Colors.primary + '30',
  },
  stepRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stepDotDone: {
    backgroundColor: Colors.primary,
  },
  stepDotPending: {
    backgroundColor: Colors.text.light,
    opacity: 0.4,
  },
  emoji: {
    fontSize: 42,
  },
  text: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    textAlign: 'center',
    lineHeight: FontSize.md * 1.45,
    maxWidth: 300,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
  },
  badgeActive: {
    borderColor: 'transparent',
  },
  badgeInactive: {
    backgroundColor: 'transparent',
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  badgeTextActive: {
    color: '#fff',
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
  },
  tapHint: {
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
  },
});
