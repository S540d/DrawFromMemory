import React from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { useReduceMotion } from '../utils/useReduceMotion';
import sparkleAnimation from '../assets/lottie/sparkle.json';

interface Props {
  size?: number;
  testID?: string;
}

/**
 * Sparkle-Akzent für besondere Mascot-Momente (5-Sterne-Ergebnis, neues
 * Accessoire-Unlock) — schließt Design-System Phase D ab (#176) und ist die
 * erste echte Nutzung von `lottie-react-native` im Projekt (Issue #279, 2.2).
 * Respektiert `prefers-reduced-motion` (rendert dann nichts).
 */
export default function MascotSparkle({ size = 72, testID = 'mascot-sparkle' }: Props) {
  const reduceMotion = useReduceMotion();
  if (reduceMotion) return null;

  return (
    <View testID={testID} style={{ width: size, height: size }} pointerEvents="none">
      <LottieView source={sparkleAnimation} autoPlay loop style={styles.lottie} />
    </View>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: '100%',
    height: '100%',
  },
});
