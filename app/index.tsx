import React, { useEffect, useState, useCallback } from 'react';
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
import { getStreakData } from '@services/StreakManager';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, FontFamily, BorderRadius } from '../constants/Layout';
import SettingsModal from '@components/SettingsModal';
import QuickStatsCards from '@components/QuickStatsCards';
import { FloatingStars } from '@components/FloatingStars';
import OnboardingModal from '@components/OnboardingModal';
import { isOnboardingDone } from '@services/OnboardingManager';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [dailyCompleted, setDailyCompleted] = useState(false);

  useEffect(() => {
    isOnboardingDone().then((done) => {
      if (!done) setShowOnboarding(true);
    });
  }, []);
  const [secondsLeft, setSecondsLeft] = useState(() => getSecondsUntilMidnight());
  const [dailyLevel, setDailyLevel] = useState(() => getDailyChallengeLevel());
  const [currentStreak, setCurrentStreak] = useState(0);

  // On focus: refresh all daily state and start countdown interval.
  // Interval also re-checks state every minute to handle midnight rollover
  // without requiring the user to navigate away and back.
  useFocusEffect(
    useCallback(() => {
      const refresh = async () => {
        setSecondsLeft(getSecondsUntilMidnight());
        setDailyLevel(getDailyChallengeLevel());
        const [completed, streakData] = await Promise.all([
          isTodayCompleted(),
          getStreakData(),
        ]);
        setDailyCompleted(completed);
        setCurrentStreak(streakData.currentStreak);
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
      <FloatingStars />

      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={[styles.appTitle, { color: colors.text.primary }]}>{t('app.name')}</Text>
          <Text style={[styles.appTagline, { color: colors.text.secondary }]}>{t('home.subtitle')}</Text>
        </View>
        <View style={styles.topBarRight}>
          {currentStreak >= 2 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakBadgeText}>{t('home.streakBadge', { count: String(currentStreak) })}</Text>
            </View>
          )}
          <Pressable
            onPress={() => setShowSettings(true)}
            style={styles.settingsButton}
            aria-label="Settings"
          >
            <Text style={[styles.settingsIcon, { color: colors.text.primary }]}>⋮</Text>
          </Pressable>
        </View>
      </View>

      {/* Hero CTA — "Spiel starten" als dominanter zentraler Button */}
      <View style={styles.heroSlot}>
        <TouchableOpacity
          onPress={() => router.push('/game')}
          accessibilityRole="button"
          accessibilityLabel={t('home.startButton')}
          style={styles.heroCtaWrapper}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={Colors.gradient.cta as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCtaPill}
          >
            <Text style={styles.heroCtaIcon}>▶</Text>
            <Text style={styles.heroCtaText}>{t('home.startButton')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Bottom section: sekundär-Aktionen + Stats — versetzt, nicht statisch gestapelt */}
      <View style={styles.bottomSection}>
        {/* Daily Challenge — breite Karte, abgesetzt von den anderen */}
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
          <Text style={styles.dailyChallengeEmoji}>⚡</Text>
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

        {/* Levels + Galerie + Kreativ — Side-by-Side */}
        <View style={styles.secondaryRow}>
          <TouchableOpacity
            style={[styles.secondaryTile, { backgroundColor: colors.surface, borderColor: colors.primary }]}
            onPress={() => router.push('/levels')}
            accessibilityRole="button"
          >
            <Text style={[styles.secondaryTileText, { color: colors.primary }]}>{t('home.levelsButton')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryTile, { backgroundColor: colors.surface, borderColor: colors.primary }]}
            onPress={() => router.push('/gallery')}
            accessibilityRole="button"
          >
            <Text style={[styles.secondaryTileText, { color: colors.primary }]}>{t('home.galleryButton')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryTile, { backgroundColor: colors.surface, borderColor: colors.primary }]}
            onPress={() => router.push('/creative')}
            accessibilityRole="button"
          >
            <Text style={[styles.secondaryTileText, { color: colors.primary }]}>🎨 {t('home.creativeButton')}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats — dezent am unteren Rand */}
        <QuickStatsCards />
      </View>

      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
      <OnboardingModal
        visible={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onStartTutorial={() => {
          setShowOnboarding(false);
          router.push('/game?tutorial=1&level=1');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  streakBadge: {
    backgroundColor: '#FF6B35',
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  streakBadgeText: {
    color: '#fff',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
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
  heroSlot: {
    flex: 1,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroCtaWrapper: {
    borderRadius: BorderRadius.round,
    overflow: 'hidden',
    ...Colors.shadow.large,
  },
  heroCtaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    minHeight: 80,
    minWidth: 240,
  },
  heroCtaIcon: {
    fontSize: 22,
    color: '#fff',
  },
  heroCtaText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.extraBold,
    color: '#fff',
    letterSpacing: 0.5,
  },
  bottomSection: {
    marginTop: 'auto',
    gap: Spacing.md,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  secondaryTile: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    ...Colors.shadow.small,
  },
  secondaryTileText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
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
