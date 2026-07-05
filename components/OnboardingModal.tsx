import React, { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
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
import { markOnboardingDone } from '@services/OnboardingManager';
import Colors from '../constants/Colors';
import { BorderRadius, FontFamily, FontSize, FontWeight, Spacing } from '../constants/Layout';
import { useReduceMotion } from '../utils/useReduceMotion';

interface Props {
  visible: boolean;
  onClose: () => void;
  onStartTutorial: () => void;
}

const PREVIEW_STEPS = [
  { emoji: '👀', labelKey: 'onboarding.step1.title' },
  { emoji: '✏️', labelKey: 'onboarding.step2.title' },
  { emoji: '⭐', labelKey: 'onboarding.step3.title' },
];

function PaintEmoji({ animate }: { animate: boolean }) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  useEffect(() => {
    if (!animate) {
      cancelAnimation(scale);
      cancelAnimation(rotate);
      scale.value = 1;
      rotate.value = 0;
      return;
    }
    scale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 950, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 950, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    rotate.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(6, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 400, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    return () => {
      cancelAnimation(scale);
      cancelAnimation(rotate);
    };
  }, [animate, scale, rotate]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View style={style}>
      <Text style={styles.heroEmoji}>🎨</Text>
    </Animated.View>
  );
}

export default function OnboardingModal({ visible, onClose, onStartTutorial }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const animate = !useReduceMotion();

  const handleSkip = async () => {
    await markOnboardingDone();
    onClose();
  };

  const handleStart = () => {
    onStartTutorial();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={handleSkip}
      testID="onboarding-modal"
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Skip */}
        <View style={styles.topBar}>
          <Pressable
            onPress={handleSkip}
            style={styles.skipButton}
            accessibilityRole="button"
            accessibilityLabel={t('onboarding.skip')}
            testID="onboarding-skip"
          >
            <Text style={[styles.skipText, { color: colors.text.secondary }]}>
              {t('onboarding.skip')}
            </Text>
          </Pressable>
        </View>

        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.primary + '18' }]}>
            <PaintEmoji animate={animate} />
          </View>
          <Text style={[styles.welcomeTitle, { color: colors.text.primary }]}>
            {t('onboarding.welcomeTitle')}
          </Text>
          <Text style={[styles.welcomeDesc, { color: colors.text.secondary }]}>
            {t('onboarding.welcomeDesc')}
          </Text>
        </View>

        {/* Step preview chips */}
        <View style={styles.stepsRow}>
          {PREVIEW_STEPS.map((step, i) => (
            <View key={i} style={[styles.stepChip, { backgroundColor: colors.surfaceAlt }]}>
              <Text style={styles.stepChipEmoji}>{step.emoji}</Text>
              <Text style={[styles.stepChipLabel, { color: colors.text.secondary }]}>
                {t(step.labelKey)}
              </Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <Pressable
          onPress={handleStart}
          style={styles.startButton}
          accessibilityRole="button"
          testID="onboarding-start"
        >
          <Text style={styles.startButtonText}>{t('onboarding.startButton')} 🎮</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  skipButton: {
    padding: Spacing.sm,
  },
  skipText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  heroEmoji: {
    fontSize: 88,
  },
  welcomeTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    textAlign: 'center',
  },
  welcomeDesc: {
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: FontSize.md * 1.5,
    maxWidth: 300,
  },
  stepsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  stepChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
    maxWidth: 100,
  },
  stepChipEmoji: {
    fontSize: 28,
  },
  stepChipLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    ...Colors.shadow.large,
  },
  startButtonText: {
    color: '#fff',
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    letterSpacing: 0.4,
  },
});
