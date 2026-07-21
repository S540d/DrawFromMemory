import React, { useEffect, useRef } from 'react';
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from 'react-native';
import { useReduceMotion } from '../utils/useReduceMotion';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withRepeat,
  withSequence,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import Colors from '../constants/Colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Card that fades in + slides up on mount.
 * Stagger via `index` prop (50ms per item).
 */
export function AnimatedCard({
  index = 0,
  style,
  children,
}: {
  index?: number;
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
}) {
  const reduceMotion = useReduceMotion();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      translateY.value = 0;
    } else {
      opacity.value = withDelay(
        index * 50,
        withTiming(1, { duration: 350, easing: Easing.out(Easing.ease) }),
      );
      translateY.value = withDelay(
        index * 50,
        withTiming(0, { duration: 350, easing: Easing.out(Easing.ease) }),
      );
    }
  }, [reduceMotion, opacity, translateY, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}

/**
 * Glassmorphism card with entrance animation and optional press-lift.
 * Stagger via `index` prop (50ms per item).
 * Pass `onPress` to enable the spring-lift interaction.
 * Respects prefers-reduced-motion for both entrance and press animations.
 */
export function GlassCard({
  index = 0,
  onPress,
  style,
  children,
  accessibilityLabel,
}: {
  index?: number;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
  accessibilityLabel?: string;
}) {
  const reduceMotion = useReduceMotion();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      translateY.value = 0;
    } else {
      opacity.value = withDelay(
        index * 50,
        withTiming(1, { duration: 350, easing: Easing.out(Easing.ease) }),
      );
      translateY.value = withDelay(
        index * 50,
        withTiming(0, { duration: 350, easing: Easing.out(Easing.ease) }),
      );
    }
  }, [reduceMotion, opacity, translateY, index]);

  const handlePressIn = () => {
    if (reduceMotion) return;
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    if (reduceMotion) return;
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[animatedStyle, style]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}

/**
 * Button with scale-spring on press.
 */
export function AnimatedButton({
  onPress,
  style,
  disabled,
  children,
  accessibilityLabel,
  accessibilityRole,
  ...rest
}: {
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
  children: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link';
  [key: string]: any;
}) {
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (reduceMotion) return;
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    if (reduceMotion) return;
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[animatedStyle, style]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole || 'button'}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}

/**
 * Element that scales + fades in when it appears (e.g. feedback text, tooltips).
 */
export function AnimatedFeedback({
  visible,
  style,
  children,
}: {
  visible: boolean;
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
}) {
  const reduceMotion = useReduceMotion();
  const opacity = useSharedValue(0);
  const scaleVal = useSharedValue(0.8);

  useEffect(() => {
    if (visible) {
      if (reduceMotion) {
        opacity.value = 1;
        scaleVal.value = 1;
      } else {
        opacity.value = withTiming(1, { duration: 150 });
        scaleVal.value = withTiming(1, { duration: 150 });
      }
    } else {
      opacity.value = 0;
      scaleVal.value = 0.8;
    }
  }, [visible, reduceMotion, opacity, scaleVal]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scaleVal.value }],
  }));

  if (!visible) return null;

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}

/**
 * Animated star for rating UI.
 * Spring-bounce pop on fill, stagger via `index`, golden glow when filled.
 * Respects prefers-reduced-motion.
 */
export function AnimatedStar({
  filled,
  index = 0,
  onPress,
  accessibilityLabel,
}: {
  filled: boolean;
  index?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(filled ? 1 : 0.7);
  const prevFilledRef = useRef(filled);

  useEffect(() => {
    const wasEmpty = !prevFilledRef.current;
    prevFilledRef.current = filled;

    if (filled && wasEmpty) {
      if (reduceMotion) {
        scale.value = 1;
      } else {
        scale.value = withDelay(
          index * 80,
          withSpring(1, { damping: 5, stiffness: 200, mass: 0.8 }),
        );
      }
    } else if (filled) {
      scale.value = withSpring(1, { damping: 10, stiffness: 200 });
    } else {
      scale.value = withTiming(0.7, { duration: 200 });
    }
  }, [filled, reduceMotion, index, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const textStyle: TextStyle = {
    fontSize: 38,
    color: filled ? Colors.stars.filled : Colors.stars.empty,
    textShadowColor: filled ? 'rgba(255, 200, 0, 0.65)' : 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: filled ? 10 : 0,
  };

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        style={animatedStyle}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
      >
        <Text style={textStyle}>★</Text>
      </AnimatedPressable>
    );
  }

  return (
    <Animated.View style={animatedStyle}>
      <Text style={textStyle}>★</Text>
    </Animated.View>
  );
}

/**
 * Generic pressable with a spring scale-down on press for tactile feedback.
 * Gives bare tiles/cards the same responsiveness as `Button` without adopting
 * its full visual style. Respects prefers-reduced-motion.
 */
export function PressableScale({
  onPress,
  style,
  disabled,
  children,
  activeScale = 0.96,
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityState,
  testID,
  ...rest
}: {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  children: React.ReactNode;
  activeScale?: number;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link';
  accessibilityState?: { disabled?: boolean; selected?: boolean };
  testID?: string;
  [key: string]: any;
}) {
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (reduceMotion || disabled) return;
    scale.value = withSpring(activeScale, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    if (reduceMotion) return;
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[animatedStyle, style]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      testID={testID}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}

/**
 * Looping "breathing" pulse that draws the eye to a primary action.
 * Subtle scale oscillation, meant to wrap a CTA. Static (no loop) when
 * prefers-reduced-motion is on or `enabled` is false.
 */
export function PulseView({
  children,
  style,
  enabled = true,
  maxScale = 1.04,
  testID,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  enabled?: boolean;
  maxScale?: number;
  testID?: string;
}) {
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion || !enabled) {
      cancelAnimation(scale);
      scale.value = 1;
      return;
    }
    scale.value = withRepeat(
      withSequence(
        withTiming(maxScale, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    return () => cancelAnimation(scale);
  }, [reduceMotion, enabled, maxScale, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]} testID={testID} pointerEvents="box-none">
      {children}
    </Animated.View>
  );
}
