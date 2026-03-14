import React, { useEffect } from 'react';
import { AccessibilityInfo, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

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
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (cancelled) return;
      if (reduceMotion) {
        opacity.value = 1;
        translateY.value = 0;
      } else {
        opacity.value = withDelay(
          index * 50,
          withTiming(1, { duration: 350, easing: Easing.out(Easing.ease) })
        );
        translateY.value = withDelay(
          index * 50,
          withTiming(0, { duration: 350, easing: Easing.out(Easing.ease) })
        );
      }
    });
    return () => { cancelled = true; };
  }, [opacity, translateY, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
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
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
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
  const opacity = useSharedValue(0);
  const scaleVal = useSharedValue(0.8);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (cancelled) return;
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
    });
    return () => { cancelled = true; };
  }, [visible, opacity, scaleVal]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scaleVal.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}
