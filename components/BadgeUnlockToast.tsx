import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useReduceMotion } from '../utils/useReduceMotion';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from '@services/i18n';
import Colors from '../constants/Colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../constants/Layout';
import type { AchievementDef } from '@services/AchievementManager';

interface Props {
  achievement: AchievementDef | null;
  onHide: () => void;
}

const VISIBLE_MS = 2800;
const FADE_MS = 280;

/**
 * Slide-in toast shown when a badge is unlocked.
 * Auto-hides after VISIBLE_MS; respects prefers-reduced-motion (fade only, no slide).
 */
export default function BadgeUnlockToast({ achievement, onHide }: Props) {
  const { t } = useTranslation();
  const reduceMotion = useReduceMotion();
  const translateY = useSharedValue(-80);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!achievement) return;

    if (reduceMotion) {
      translateY.value = 0;
    } else {
      translateY.value = withSequence(
        withTiming(0, { duration: FADE_MS, easing: Easing.out(Easing.ease) }),
        withDelay(
          VISIBLE_MS,
          withTiming(-80, { duration: FADE_MS, easing: Easing.in(Easing.ease) }),
        ),
      );
    }
    opacity.value = withSequence(
      withTiming(1, { duration: FADE_MS }),
      withDelay(VISIBLE_MS, withTiming(0, { duration: FADE_MS })),
    );

    const timer = setTimeout(onHide, VISIBLE_MS + FADE_MS * 2 + 50);
    return () => clearTimeout(timer);
  }, [achievement, reduceMotion, translateY, opacity, onHide]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!achievement) return null;

  return (
    <Animated.View
      style={[styles.toast, animStyle]}
      pointerEvents="none"
      testID="badge-unlock-toast"
    >
      <Text style={styles.emoji}>{achievement.emoji}</Text>
      <View style={styles.textCol}>
        <Text style={styles.title} numberOfLines={1}>
          {t('achievements.unlocked')}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {t(achievement.titleKey)}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    zIndex: 1000,
  },
  emoji: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  subtitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    marginTop: 2,
  },
});
