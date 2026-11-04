import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PressableScale } from '@components/AnimatedPrimitives';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';
import { getDailyChallengeLevel, isTodayCompleted } from '@services/DailyChallengeManager';
import { getStreakData } from '@services/StreakManager';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, FontFamily, BorderRadius } from '../constants/Layout';
import SettingsModal from '@components/SettingsModal';
import QuickStatsCards from '@components/QuickStatsCards';
import OnboardingModal from '@components/OnboardingModal';
import { isOnboardingDone } from '@services/OnboardingManager';
import WebTrustFooter from '@components/WebTrustFooter';
import WebInstallBanner from '@components/WebInstallBanner';
import Mascot from '@components/Mascot';
import AgeGroupModal from '@components/AgeGroupModal';
import { isAgeGroupSelected, setAgeGroup } from '@services/AgeGroupManager';
import { getHomeGreetingKey } from '@services/MascotManager';
import type { AgeGroup } from '../types';

const FOOTER_LINKS = [
  { route: '/levels', labelKey: 'home.levelsButton' },
  { route: '/gallery', labelKey: 'home.galleryButton' },
  { route: '/creative', labelKey: 'home.creativeButton' },
] as const;

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAgeGroup, setShowAgeGroup] = useState(false);

  const maybeShowOnboarding = useCallback(async () => {
    const done = await isOnboardingDone();
    if (!done) setShowOnboarding(true);
  }, []);

  useEffect(() => {
    isAgeGroupSelected().then(async selected => {
      if (!selected) {
        setShowAgeGroup(true);
        return;
      }
      await maybeShowOnboarding();
    });
  }, [maybeShowOnboarding]);

  const handleAgeGroupConfirm = async (ageGroup: AgeGroup) => {
    await setAgeGroup(ageGroup);
    setShowAgeGroup(false);
    await maybeShowOnboarding();
  };

  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [dailyLevel, setDailyLevel] = useState(() => getDailyChallengeLevel());
  const [currentStreak, setCurrentStreak] = useState(0);

  // On focus: refresh daily state. The interval re-checks every minute to
  // handle midnight rollover without navigating away and back.
  useFocusEffect(
    useCallback(() => {
      const refresh = async () => {
        setDailyLevel(getDailyChallengeLevel());
        const [completed, streakData] = await Promise.all([isTodayCompleted(), getStreakData()]);
        setDailyCompleted(completed);
        setCurrentStreak(streakData.currentStreak);
      };
      refresh();

      const id = setInterval(refresh, 60_000);
      return () => clearInterval(id);
    }, []),
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + Spacing.sm,
          paddingBottom: insets.bottom + Spacing.lg,
        },
      ]}
    >
      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={[styles.appTitle, { color: colors.text.primary }]}>{t('app.name')}</Text>
          <Text style={[styles.appTagline, { color: colors.text.secondary }]}>
            {t('home.subtitle')}
          </Text>
        </View>
        <Pressable
          onPress={() => setShowSettings(true)}
          style={styles.settingsButton}
          aria-label="Settings"
        >
          <Text style={[styles.settingsIcon, { color: colors.text.primary }]}>⋮</Text>
        </Pressable>
      </View>

      {/* Mascot-Begrüßung — einziger Ort für die Serie (Streak) auf der Startseite */}
      <View style={styles.mascotRow}>
        <Mascot
          size={44}
          mood={currentStreak >= 2 ? 'happy' : 'neutral'}
          message={t(getHomeGreetingKey(currentStreak), { count: String(currentStreak) })}
          testID="home-mascot"
        />
      </View>

      {/* Nur Web: Play-Store-Angebot im sichtbaren Bereich, nicht erst im Footer */}
      <WebInstallBanner />

      {/* Hero: "Spiel starten" ist die einzige auffällige Aktion. Darunter dezent
          die Tägliche Challenge als Textlink — ohne Emoji, Farbrahmen und Countdown. */}
      <View style={styles.heroSlot}>
        <PressableScale
          onPress={() => router.push('/game')}
          accessibilityRole="button"
          accessibilityLabel={t('home.startButton')}
          style={styles.heroCtaWrapper}
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
        </PressableScale>

        <Pressable
          onPress={() => !dailyCompleted && router.push(`/game?level=${dailyLevel}&daily=1`)}
          disabled={dailyCompleted}
          accessibilityRole="button"
          accessibilityState={{ disabled: dailyCompleted }}
          style={styles.dailyLink}
        >
          <Text
            style={[
              styles.dailyLinkText,
              { color: dailyCompleted ? colors.text.secondary : colors.primary },
            ]}
          >
            {dailyCompleted
              ? `${t('dailyChallenge.title')} · ${t('dailyChallenge.completed')}`
              : `${t('dailyChallenge.title')} · ${t('dailyChallenge.level', { number: String(dailyLevel) })}`}
          </Text>
        </Pressable>
      </View>

      {/* Footer: Sekundär-Navigation als schlichte Textlinks in einer Farbe */}
      <View style={styles.footer}>
        <View style={styles.footerLinks}>
          {FOOTER_LINKS.map((link, i) => (
            <React.Fragment key={link.route}>
              {i > 0 && (
                <Text style={[styles.footerSeparator, { color: colors.text.secondary }]}>·</Text>
              )}
              <Pressable
                onPress={() => router.push(link.route)}
                accessibilityRole="button"
                accessibilityLabel={t(link.labelKey)}
                style={styles.footerLink}
              >
                <Text style={[styles.footerLinkText, { color: colors.text.primary }]}>
                  {t(link.labelKey)}
                </Text>
              </Pressable>
            </React.Fragment>
          ))}
        </View>

        <QuickStatsCards />

        <WebTrustFooter />
      </View>

      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
      <AgeGroupModal visible={showAgeGroup} onConfirm={handleAgeGroupConfirm} />
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
  mascotRow: {
    marginTop: Spacing.sm,
  },
  heroSlot: {
    flex: 1,
    minHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  heroCtaWrapper: {
    borderRadius: BorderRadius.round,
    overflow: 'hidden',
    ...Colors.shadow.medium,
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
  dailyLink: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  dailyLinkText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    textAlign: 'center',
  },
  footer: {
    marginTop: 'auto',
    gap: Spacing.xs,
    alignItems: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLink: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
  },
  footerLinkText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
  },
  footerSeparator: {
    fontSize: FontSize.sm,
  },
});
