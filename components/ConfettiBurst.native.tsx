import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useReduceMotion } from '../utils/useReduceMotion';
import { Canvas, Circle } from '@shopify/react-native-skia';
import {
  Easing,
  useSharedValue,
  useDerivedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {
  buildParticles,
  CONFETTI_DURATION_MS,
  CONFETTI_LIGHT_DURATION_MS,
  type ConfettiBurstProps,
  type ConfettiParticle,
} from './ConfettiBurst.shared';

function Particle({ p, progress }: { p: ConfettiParticle; progress: { value: number } }) {
  const cx = useDerivedValue(() => p.x + p.drift * progress.value);
  const cy = useDerivedValue(() => p.startY + (p.endY - p.startY) * progress.value);
  const opacity = useDerivedValue(() =>
    progress.value < 0.85 ? 1 : 1 - (progress.value - 0.85) / 0.15,
  );
  return <Circle cx={cx} cy={cy} r={p.size / 2} color={p.color} opacity={opacity} />;
}

export function ConfettiBurst({ width, height, active, intensity = 'full' }: ConfettiBurstProps) {
  const reduceMotion = useReduceMotion();
  const progress = useSharedValue(0);
  const duration = intensity === 'light' ? CONFETTI_LIGHT_DURATION_MS : CONFETTI_DURATION_MS;

  useEffect(() => {
    if (!active || reduceMotion) {
      progress.value = 0;
      return;
    }
    progress.value = 0;
    progress.value = withDelay(
      0,
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) }),
    );
  }, [active, reduceMotion, progress, duration]);

  const particles = useMemo(
    () => buildParticles(width, height, Math.floor(width + height), intensity),
    [width, height, intensity],
  );

  if (!active || reduceMotion) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" testID="confetti-burst">
      <Canvas style={{ width, height }}>
        {particles.map((p, i) => (
          <Particle key={i} p={p} progress={progress} />
        ))}
      </Canvas>
    </View>
  );
}

export default ConfettiBurst;
