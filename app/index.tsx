import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';
import {
  getDailyChallengeLevel,
  getSecondsUntilMidnight,
  isTodayCompleted,
} from '@services/DailyChallengeManager';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, FontFamily, BorderRadius } from '../constants/Layout';
import SettingsModal from '@components/SettingsModal';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showSettings, setShowSettings] = useState(false);
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(() => getSecondsUntilMidnight());
  const [dailyLevel, setDailyLevel] = useState(() => getDailyChallengeLevel());

  // On focus: refresh all daily state and start countdown interval.
  // Interval also re-checks state every minute to handle midnight rollover
  // without requiring the user to navigate away and back.
  useFocusEffect(
    useCallback(() => {
      const refresh = async () => {
        setSecondsLeft(getSecondsUntilMidnight());
        setDailyLevel(getDailyChallengeLevel());
        setDailyCompleted(await isTodayCompleted());
      };
      refresh();

      const id = setInterval(refresh, 60_000);
      return () => clearInterval(id);
    }, [])
  );

  const countdownHours = Math.floor(secondsLeft / 3600);
  const countdownMinutes = Math.floor((secondsLeft % 3600) / 60);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + Spacing.sm, paddingBottom: insets.bottom + Spacing.lg }]}>

      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={[styles.appTitle, { color: colors.text.primary }]}>{t('app.name')}</Text>
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

        {/* Daily Challenge */}
        <TouchableOpacity
          style={[
            styles.dailyChallengeButton,
            { backgroundColor: colors.surface, borderColor: dailyCompleted ? colors.text.light : '#F59E0B' },
            dailyCompleted && styles.dailyChallengeCompleted,
          ]}
          onPress={() => !dailyCompleted && router.push(`/game?level=${dailyLevel}&daily=1`)}
          accessibilityRole="button"
          disabled={dailyCompleted}
        >
          <Text style={styles.dailyChallengeEmoji}>📅</Text>
          <View style={styles.dailyChallengeInfo}>
            <Text style={[styles.dailyChallengeTitle, { color: dailyCompleted ? colors.text.secondary : '#D97706' }]}>
              {t('dailyChallenge.title')}
            </Text>
            <Text style={[styles.dailyChallengeMeta, { color: colors.text.secondary }]}>
              {dailyCompleted
                ? t('dailyChallenge.completed')
                : `${t('dailyChallenge.level', { number: String(dailyLevel) })} · ${t('dailyChallenge.countdown', { hours: String(countdownHours), minutes: String(countdownMinutes) })}`}
            </Text>
          </View>
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
    fontFamily: FontFamily.bold,
    lineHeight: 28,
  },
  appTagline: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
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
    gap: Spacing.lg,
  },
  heroEmoji: {
    fontSize: 72,
  },
  heroTitle: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.extraBold,
    textAlign: 'center',
    lineHeight: 48,
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
  dailyChallengeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    minHeight: 52,
    gap: Spacing.sm,
    ...Colors.shadow.small,
  },
  dailyChallengeCompleted: {
    opacity: 0.6,
  },
  dailyChallengeEmoji: {
    fontSize: 24,
  },
  dailyChallengeInfo: {
    flex: 1,
  },
  dailyChallengeTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  dailyChallengeMeta: {
    fontSize: FontSize.xs,
    marginTop: 1,
  },
});
