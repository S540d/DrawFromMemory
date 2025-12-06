import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { t } from '../services/i18n';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight } from '../constants/Layout';

/**
 * Levels Screen - Level-Auswahl
 * TODO: Implementierung der Level-Auswahl mit Grid
 */
export default function LevelsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('levels.title')}</Text>
      <Text style={styles.placeholder}>Level-Auswahl wird implementiert...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
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
    marginTop: Spacing.xxl,
  },
});
