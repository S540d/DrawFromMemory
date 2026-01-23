import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { t } from '../services/i18n';
import { useTheme } from '../services/ThemeContext';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/Layout';

/**
 * Home Screen - Startseite der App
 */
export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary }]}>{t('home.title')}</Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>{t('home.subtitle')}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.primaryButton, { backgroundColor: colors.primaryDark }]}
          onPress={() => router.push('/game')}
        >
          <Text style={[styles.buttonText, styles.primaryButtonText]}>{t('home.startButton')}</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.primary, ...Colors.shadow.small }]}
          onPress={() => router.push('/levels')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText, { color: colors.primary }]}>
            {t('home.levelsButton')}
          </Text>
        </Pressable>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.text.light }]}>Version 1.1.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.xxl,
  },
  title: {
    fontSize: FontSize.huge,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  button: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  primaryButton: {
    ...Colors.shadow.large, // Soft & Modern: Prominenter Schatten für Primary Button
    // backgroundColor wird dynamisch in JSX gesetzt
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
    ...Colors.shadow.small, // Sekundäre Buttons: Subtiler Schatten
  },
  buttonText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  primaryButtonText: {
    color: Colors.drawing.white,  // Weiß für besseren Kontrast auf Lila-Hintergrund
  },
  secondaryButtonText: {
    color: Colors.primary,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Spacing.md,
  },
  footerText: {
    fontSize: FontSize.sm,
    color: Colors.text.light,
  },
});
