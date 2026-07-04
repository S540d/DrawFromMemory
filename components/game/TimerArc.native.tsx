import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { Easing, useSharedValue, useDerivedValue, withTiming } from 'react-native-reanimated';
import { useReduceMotion } from '../../utils/useReduceMotion';
import Colors from '../../constants/Colors';
import { FontSize, FontWeight } from '../../constants/Layout';

const SIZE = 80;
const STROKE_WIDTH = 6;
const PADDING = STROKE_WIDTH / 2;
const OVAL = { x: PADDING, y: PADDING, width: SIZE - STROKE_WIDTH, height: SIZE - STROKE_WIDTH };

export interface TimerArcProps {
  timeRemaining: number;
  totalTime: number;
}

export function TimerArc({ timeRemaining, totalTime }: TimerArcProps) {
  const reduceMotion = useReduceMotion();
  const progress = useSharedValue(totalTime > 0 ? timeRemaining / totalTime : 1);

  useEffect(() => {
    const target = totalTime > 0 ? Math.max(0, timeRemaining) / totalTime : 0;
    if (reduceMotion) {
      progress.value = target;
    } else {
      progress.value = withTiming(target, { duration: 900, easing: Easing.linear });
    }
  }, [timeRemaining, totalTime, reduceMotion, progress]);

  const trackPath = useMemo(() => {
    const p = Skia.Path.Make();
    p.addArc(OVAL, -90, 360);
    return p;
  }, []);

  const arcPath = useDerivedValue(() => {
    const p = Skia.Path.Make();
    const sweep = progress.value * 360;
    if (sweep > 0.5) {
      p.addArc(OVAL, -90, sweep);
    }
    return p;
  });

  const isUrgent = timeRemaining <= 3;
  const arcColor = timeRemaining <= 1 ? '#FF6B6B' : timeRemaining <= 3 ? '#FFD700' : '#FFFFFF';

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <Path
          path={trackPath}
          color="rgba(255,255,255,0.20)"
          style="stroke"
          strokeWidth={STROKE_WIDTH}
          strokeCap="round"
        />
        <Path
          path={arcPath}
          color={arcColor}
          style="stroke"
          strokeWidth={STROKE_WIDTH}
          strokeCap="round"
        />
      </Canvas>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Text style={[styles.timerText, isUrgent && styles.timerTextUrgent]}>
          {Math.max(0, Math.ceil(timeRemaining))}
        </Text>
      </View>
    </View>
  );
}

export default TimerArc;

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    borderRadius: SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    ...Colors.shadow.large,
  },
  canvas: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
  },
  timerText: {
    fontSize: FontSize.huge,
    fontWeight: FontWeight.bold,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: SIZE,
  },
  timerTextUrgent: {
    color: '#FFD700',
  },
});
