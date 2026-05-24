import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useReduceMotion } from '../utils/useReduceMotion';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Colors from '../constants/Colors';

interface DecorItem {
  top: string;
  left: string;
  char: string;
  size: number;
  color: string;
  opacity: number;
  delay: number;
  duration: number;
  drift: number;
}

const DECOR_ITEMS: DecorItem[] = [
  { top: '7%',  left: '4%',  char: '★', size: 18, color: Colors.primary,  opacity: 0.18, delay: 0,    duration: 4200, drift: 12 },
  { top: '13%', left: '88%', char: '✦', size: 14, color: Colors.secondary, opacity: 0.15, delay: 700,  duration: 5100, drift: 8  },
  { top: '32%', left: '3%',  char: '★', size: 12, color: Colors.primary,  opacity: 0.13, delay: 1400, duration: 4500, drift: 15 },
  { top: '51%', left: '90%', char: '●', size: 10, color: Colors.secondary, opacity: 0.12, delay: 300,  duration: 5800, drift: 10 },
  { top: '67%', left: '5%',  char: '✦', size: 16, color: Colors.primary,  opacity: 0.16, delay: 1100, duration: 4800, drift: 12 },
  { top: '78%', left: '85%', char: '★', size: 14, color: Colors.secondary, opacity: 0.14, delay: 600,  duration: 5300, drift: 9  },
  { top: '23%', left: '87%', char: '●', size: 9,  color: Colors.primary,  opacity: 0.11, delay: 1800, duration: 4000, drift: 14 },
  { top: '61%', left: '77%', char: '★', size: 11, color: Colors.secondary, opacity: 0.13, delay: 900,  duration: 5600, drift: 11 },
];

function DecorElement({ item, animate }: { item: DecorItem; animate: boolean }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (!animate) {
      cancelAnimation(translateY);
      translateY.value = 0;
      return;
    }
    translateY.value = withDelay(
      item.delay,
      withRepeat(
        withSequence(
          withTiming(-item.drift, { duration: item.duration / 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(0,           { duration: item.duration / 2, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false
      )
    );
  }, [animate, item, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.item,
        { top: item.top, left: item.left, opacity: item.opacity },
        animStyle,
      ]}
      pointerEvents="none"
      testID="floating-decor-item"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Text style={{ fontSize: item.size, color: item.color }} accessible={false}>
        {item.char}
      </Text>
    </Animated.View>
  );
}

export function FloatingStars() {
  const animate = !useReduceMotion();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" testID="floating-stars">
      {DECOR_ITEMS.map((item, i) => (
        <DecorElement key={i} item={item} animate={animate} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    position: 'absolute',
  },
});

export default FloatingStars;
