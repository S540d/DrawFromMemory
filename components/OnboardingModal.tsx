import React, { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
import { BorderRadius, FontSize, FontWeight, Spacing } from '../constants/Layout';

interface Props {
  visible: boolean;
  onClose: () => void;
}

interface Step {
  emoji: string;
  titleKey: string;
  descKey: string;
}

const STEPS: Step[] = [
  { emoji: '👀', titleKey: 'onboarding.step1.title', descKey: 'onboarding.step1.desc' },
  { emoji: '✏️', titleKey: 'onboarding.step2.title', descKey: 'onboarding.step2.desc' },
  { emoji: '⭐', titleKey: 'onboarding.step3.title', descKey: 'onboarding.step3.desc' },
];

function PulsingEmoji({ char, animate }: { char: string; animate: boolean }) {
  const scale = useSharedValue(1);
  useEffect(() => {
    if (!animate) {
      cancelAnimation(scale);
      scale.value = 1;
      return;
    }
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0,  { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    return () => {
      cancelAnimation(scale);
      scale.value = 1;
    };
  }, [animate, scale]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={style}>
      <Text style={styles.emoji}>{char}</Text>
    </Animated.View>
  );
}

export default function OnboardingModal({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [stepIndex, setStepIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const { width } = Dimensions.get('window');
  const scrollRef = React.useRef<ScrollView>(null);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    setStepIndex(0);
    AccessibilityInfo.isReduceMotionEnabled().then((rm) => {
      if (!cancelled) setAnimate(!rm);
    });
    return () => { cancelled = true; };
  }, [visible]);

  const handleNext = async () => {
    if (stepIndex < STEPS.length - 1) {
      const next = stepIndex + 1;
      setStepIndex(next);
      scrollRef.current?.scrollTo({ x: next * width, animated: animate });
    } else {
      await markOnboardingDone();
      onClose();
    }
  };

  const handleSkip = async () => {
    await markOnboardingDone();
    onClose();
  };

  const handleScroll = (e: { nativeEvent: { contentOffset: { x: number } } }) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    if (newIndex !== stepIndex && newIndex >= 0 && newIndex < STEPS.length) {
      setStepIndex(newIndex);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={handleSkip} testID="onboarding-modal">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
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

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          style={styles.pager}
          testID="onboarding-pager"
        >
          {STEPS.map((step, i) => (
            <View key={step.titleKey} style={[styles.page, { width }]}>
              <View style={styles.iconCircle}>
                <PulsingEmoji char={step.emoji} animate={animate && i === stepIndex} />
              </View>
              <Text style={[styles.title, { color: colors.text.primary }]}>
                {t(step.titleKey)}
              </Text>
              <Text style={[styles.desc, { color: colors.text.secondary }]}>
                {t(step.descKey)}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.dotsRow} testID="onboarding-dots">
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === stepIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <Pressable
          onPress={handleNext}
          style={styles.nextButton}
          accessibilityRole="button"
          testID="onboarding-next"
        >
          <Text style={styles.nextButtonText}>
            {stepIndex < STEPS.length - 1 ? t('onboarding.next') : t('onboarding.start')}
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg,
  },
  skipButton: {
    padding: Spacing.sm,
  },
  skipText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  pager: {
    flexGrow: 0,
  },
  page: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  emoji: {
    fontSize: 96,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  desc: {
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: FontSize.md * 1.4,
    maxWidth: 320,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginVertical: Spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.text.light,
    opacity: 0.4,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    opacity: 1,
    width: 24,
  },
  nextButton: {
    marginHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});
