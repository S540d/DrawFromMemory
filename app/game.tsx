import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight } from '../constants/Layout';

/**
 * Game Screen - Hauptspiel mit 3 Phasen
 * TODO: Implementierung von Memorize, Draw, Result Phasen
 */
export default function GameScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spiel-Screen</Text>
      <Text style={styles.placeholder}>Game-Logik wird implementiert...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  placeholder: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
