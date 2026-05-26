import React, { useEffect } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useReduceMotion } from '../utils/useReduceMotion';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

/**
 * Animated hero element for the Home Screen.
 * Shows brain + pencil emojis with looping animations.
 * Respects prefers-reduced-motion: static emoji fallback when enabled.
 */
export function AnimatedHero() {
  const { height } = useWindowDimensions();
  const emojiSize = height < 600 ? 44 : height < 750 ? 54 : 64;

  const brainScale       = useSharedValue(1);
  const pencilRotate     = useSharedValue(0);
  const pencilTranslateX = useSharedValue(0);
  const sparkleOpacity   = useSharedValue(0.2);

  const reduceMotion = useReduceMotion();

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(brainScale);
      cancelAnimation(pencilRotate);
      cancelAnimation(pencilTranslateX);
      cancelAnimation(sparkleOpacity);
      brainScale.value = 1;
      pencilRotate.value = 0;
      pencilTranslateX.value = 0;
      sparkleOpacity.value = 0.2;
      return;
    }

    brainScale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 900, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0,  { duration: 900, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false
      );

      pencilRotate.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming( 10, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false
      );

      pencilTranslateX.value = withRepeat(
        withSequence(
          withTiming(-6, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming( 6, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false
      );

    sparkleOpacity.value = withRepeat(
      withSequence(
        withTiming(1,   { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.2, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false
    );
  }, [reduceMotion, brainScale, pencilRotate, pencilTranslateX, sparkleOpacity]);

  const brainAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: brainScale.value }],
  }));

  const pencilAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: pencilTranslateX.value },
      { rotate: `${pencilRotate.value}deg` },
    ],
  }));

  const sparkleAnimStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
  }));

  return (
    <View
      style={styles.container}
      testID="animated-hero"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.row}>
        <Animated.View style={brainAnimStyle}>
          <Text style={[styles.emoji, { fontSize: emojiSize }]}>🧠</Text>
        </Animated.View>
        <Animated.View style={pencilAnimStyle}>
          <Text style={[styles.emoji, { fontSize: emojiSize }]}>✏️</Text>
        </Animated.View>
      </View>
      <Animated.View style={[styles.sparkleRow, sparkleAnimStyle]} pointerEvents="none">
        <Text style={styles.sparkle}>✨</Text>
        <Text style={styles.sparkle}>  </Text>
        <Text style={styles.sparkle}>✨</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 68,
  },
  sparkleRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  sparkle: {
    fontSize: 20,
  },
});

export default AnimatedHero;
