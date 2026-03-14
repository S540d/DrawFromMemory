import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { t } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight } from '../constants/Layout';
import SettingsModal from '@components/SettingsModal';
import { Button } from '@components/Button';

/**
 * Home Screen - Startseite der App
 */
export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Settings Button */}
      <View style={styles.settingsButtonContainer}>
        <Pressable
          onPress={() => setShowSettings(true)}
          style={styles.settingsButton}
          aria-label="Settings"
        >
          <Text style={[styles.settingsIcon, { color: colors.text.primary }]}>⋮</Text>
        </Pressable>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary }]}>{t('home.title')}</Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>{t('home.subtitle')}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          label={t('home.startButton')}
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => router.push('/game')}
        />

        <Button
          label={t('home.levelsButton')}
          variant="secondary"
          size="lg"
          fullWidth
          onPress={() => router.push('/levels')}
        />

        <Button
          label={t('home.galleryButton')}
          variant="secondary"
          size="lg"
          fullWidth
          onPress={() => router.push('/gallery')}
        />
      </View>

      {/* Settings Modal */}
      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
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
  settingsButtonContainer: {
    alignItems: 'flex-end',
  },
  settingsButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 24,
    color: Colors.text.primary,
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
});
