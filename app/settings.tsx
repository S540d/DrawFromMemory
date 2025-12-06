import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { t } from '../services/i18n';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight } from '../constants/Layout';

/**
 * Settings Screen - Einstellungen
 * TODO: Implementierung von Sprache, Sound, Musik, etc.
 */
export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('settings.title')}</Text>
      <Text style={styles.placeholder}>Einstellungen werden implementiert...</Text>
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
