import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useReduceMotion } from '../utils/useReduceMotion';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  buildParticles,
  CONFETTI_DURATION_MS,
  type ConfettiBurstProps,
  type ConfettiParticle,
} from './ConfettiBurst.shared';

function Particle({ p, progress }: { p: ConfettiParticle; progress: { value: number } }) {
  const style = useAnimatedStyle(() => {
    const t = progress.value;
    return {
      position: 'absolute',
      left: p.x + p.drift * t,
      top: p.startY + (p.endY - p.startY) * t,
      width: p.size,
      height: p.size,
      borderRadius: p.size / 2,
      backgroundColor: p.color,
      opacity: t < 0.85 ? 1 : 1 - (t - 0.85) / 0.15,
      transform: [{ rotate: `${p.rotation + t * 360}deg` }],
    };
  });
  return <Animated.View style={style} />;
}

export function ConfettiBurst({ width, height, active }: ConfettiBurstProps) {
  const reduceMotion = useReduceMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!active || reduceMotion) {
      progress.value = 0;
      return;
    }
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: CONFETTI_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [active, reduceMotion, progress]);

  const particles = useMemo(() => buildParticles(width, height, Math.floor(width + height)), [width, height]);

  if (!active || reduceMotion) return null;

  return (
    <View
      style={[StyleSheet.absoluteFill, { width, height, overflow: 'hidden' }]}
      pointerEvents="none"
      testID="confetti-burst"
    >
      {particles.map((p, i) => (
        <Particle key={i} p={p} progress={progress} />
      ))}
    </View>
  );
}

export default ConfettiBurst;
