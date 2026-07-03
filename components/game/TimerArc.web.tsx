import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Colors from '../../constants/Colors';
import { FontSize, FontWeight } from '../../constants/Layout';

const SIZE = 80;
const STROKE_WIDTH = 6;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = SIZE / 2;

export interface TimerArcProps {
  timeRemaining: number;
  totalTime: number;
}

export function TimerArc({ timeRemaining, totalTime }: TimerArcProps) {
  const progress = totalTime > 0 ? Math.max(0, timeRemaining) / totalTime : 0;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const isUrgent = timeRemaining <= 3;
  const arcColor = timeRemaining <= 1 ? '#FF6B6B' : timeRemaining <= 3 ? '#FFD700' : '#FFFFFF';

  return (
    <View style={styles.container}>
      <Svg
        width={SIZE}
        height={SIZE}
        style={StyleSheet.absoluteFill}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
      >
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.20)"
          strokeWidth={STROKE_WIDTH}
        />
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke={arcColor}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${CENTER}, ${CENTER}`}
          // @ts-ignore — web-only CSS transition
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
        />
      </Svg>
      <Text style={[styles.timerText, isUrgent && styles.timerTextUrgent]}>
        {Math.max(0, Math.ceil(timeRemaining))}
      </Text>
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
  timerText: {
    fontSize: FontSize.huge,
    fontWeight: FontWeight.bold,
    color: '#ffffff',
    textAlign: 'center',
  },
  timerTextUrgent: {
    color: '#FFD700',
  },
});
