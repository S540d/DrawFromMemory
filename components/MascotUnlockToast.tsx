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
import type { MascotUnlock } from '@services/MascotManager';
import MascotSparkle from './MascotSparkle';

interface Props {
  unlock: MascotUnlock | null;
  onHide: () => void;
}

const VISIBLE_MS = 2800;
const FADE_MS = 280;

/**
 * Slide-in Toast für neu freigeschaltete Mascot-Accessoires (Issue #279, 1.1).
 * Spiegelt BadgeUnlockToast, aber für das einheitliche Fortschrittssystem
 * (Gesamt-Sterne → kosmetische Mascot-Unlocks) statt Achievements.
 */
export default function MascotUnlockToast({ unlock, onHide }: Props) {
  const { t } = useTranslation();
  const reduceMotion = useReduceMotion();
  const translateY = useSharedValue(-80);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!unlock) return;

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
  }, [unlock, reduceMotion, translateY, opacity, onHide]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!unlock) return null;

  return (
    <Animated.View
      style={[styles.toast, animStyle]}
      pointerEvents="none"
      testID="mascot-unlock-toast"
    >
      <View style={styles.sparkleWrap}>
        <MascotSparkle size={40} testID="mascot-unlock-sparkle" />
        <Text style={styles.emoji}>🦎</Text>
      </View>
      <View style={styles.textCol}>
        <Text style={styles.title} numberOfLines={1}>
          {t('mascot.unlockToast.title')}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {t('mascot.unlockToast.subtitle', { item: t(unlock.labelKey) })}
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
    borderColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    zIndex: 1000,
  },
  sparkleWrap: {
    width: 40,
    height: 40,
    marginRight: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    position: 'absolute',
    fontSize: 22,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.accent,
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
