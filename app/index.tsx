import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/Layout';
import SettingsModal from '@components/SettingsModal';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + Spacing.sm, paddingBottom: insets.bottom + Spacing.lg }]}>

      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={[styles.appTitle, { color: colors.text.primary }]}>Merke & Male</Text>
          <Text style={[styles.appTagline, { color: colors.text.secondary }]}>{t('home.subtitle')}</Text>
        </View>
        <Pressable
          onPress={() => setShowSettings(true)}
          style={styles.settingsButton}
          aria-label="Settings"
        >
          <Text style={[styles.settingsIcon, { color: colors.text.primary }]}>⋮</Text>
        </Pressable>
      </View>

      {/* Center hero */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🧠✏️</Text>
        <Text style={[styles.heroTitle, { color: colors.text.primary }]}>{t('home.title')}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => router.push('/game')}
          accessibilityRole="button"
          accessibilityLabel={t('home.startButton')}
          style={styles.gradientWrapper}
        >
          <LinearGradient
            colors={Colors.gradient.cta as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.gradientButtonText}>{t('home.startButton')}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.primary }]}
          onPress={() => router.push('/levels')}
          accessibilityRole="button"
        >
          <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>{t('home.levelsButton')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.primary }]}
          onPress={() => router.push('/gallery')}
          accessibilityRole="button"
        >
          <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>{t('home.galleryButton')}</Text>
        </TouchableOpacity>
      </View>

      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  appTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    lineHeight: 28,
  },
  appTagline: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    marginTop: 2,
  },
  settingsButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  settingsIcon: {
    fontSize: 24,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  heroEmoji: {
    fontSize: 64,
  },
  heroTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  gradientWrapper: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Colors.shadow.large,
  },
  gradientButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  gradientButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: '#fff',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    ...Colors.shadow.small,
  },
  secondaryButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
});
