import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { useTheme } from '@services/ThemeContext';
import { useReduceMotion } from '@utils/useReduceMotion';
import { BorderRadius } from '../../constants/Layout';

export interface TimerBarProps {
  timeRemaining: number;
  totalTime: number;
}

/**
 * Dezente Restzeit-Anzeige der Merke-Phase: ein dünner Balken in einer Farbe,
 * der leise abläuft. Ersetzt den früheren 80px-Countdown-Kreis mit großer Zahl
 * und Gelb/Rot-Warnfarben — bei 3 s Anzeigezeit war der immer im "Alarm"-Modus.
 */
export default function TimerBar({ timeRemaining, totalTime }: TimerBarProps) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const target = totalTime > 0 ? Math.min(1, Math.max(0, timeRemaining) / totalTime) : 0;
  const progress = useRef(new Animated.Value(target)).current;

  useEffect(() => {
    if (reduceMotion) {
      progress.setValue(target);
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: target,
      duration: 900,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [target, reduceMotion, progress]);

  const width = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View
      testID="timer-bar"
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: totalTime, now: Math.max(0, Math.ceil(timeRemaining)) }}
      style={[styles.track, { backgroundColor: colors.border }]}
    >
      <Animated.View style={[styles.fill, { width, backgroundColor: colors.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    alignSelf: 'center',
    width: '60%',
    maxWidth: 280,
    height: 4,
    borderRadius: BorderRadius.round,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: BorderRadius.round,
  },
});
