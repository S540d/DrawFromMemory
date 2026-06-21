import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { GlassCard } from '@components/AnimatedPrimitives';
import { useTheme } from '@services/ThemeContext';
import { useTranslation } from '@services/i18n';
import { useReduceMotion } from '../utils/useReduceMotion';
import storageManager from '@services/StorageManager';
import { getStreakData } from '@services/StreakManager';
import { getTotalLevels } from '@services/LevelManager';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, FontFamily, BorderRadius } from '../constants/Layout';

interface Stats {
  totalStars: number;
  currentStreak: number;
  levelsCompleted: number;
}

const ZERO_STATS: Stats = { totalStars: 0, currentStreak: 0, levelsCompleted: 0 };
const COUNTER_DURATION_MS = 600;
const COUNTER_STEPS = 20;

export default function QuickStatsCards() {
  const { t } = useTranslation();
  const { theme, colors } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const reduceMotion = useReduceMotion();
  const [stats, setStats] = useState<Stats>(ZERO_STATS);
  const [displayStats, setDisplayStats] = useState<Stats>(ZERO_STATS);

  const glassSurface = theme === 'dark' ? Colors.glass.darkSurface : Colors.glass.lightSurface;
  const glassBorder  = theme === 'dark' ? Colors.glass.darkBorder  : Colors.glass.lightBorder;
  const glassShadow  = theme === 'dark' ? Colors.glass.darkShadow  : Colors.glass.lightShadow;

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      const load = async () => {
        const [progress, streakData] = await Promise.all([
          storageManager.getProgress(),
          getStreakData(),
        ]);
        if (!mounted) return;
        const totalStars = Object.values(progress.levels).reduce(
          (sum, l) => sum + l.bestRating,
          0
        );
        setStats({
          totalStars,
          currentStreak: streakData.currentStreak,
          levelsCompleted: progress.totalLevelsCompleted,
        });
      };
      load();
      return () => { mounted = false; };
    }, [])
  );

  // Animate displayed values from 0 to the loaded targets
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (reduceMotion || (stats.totalStars === 0 && stats.currentStreak === 0 && stats.levelsCompleted === 0)) {
      setDisplayStats(stats);
      return;
    }

    setDisplayStats(ZERO_STATS);
    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      const t = Math.min(1, step / COUNTER_STEPS);
      setDisplayStats({
        totalStars: Math.round(t * stats.totalStars),
        currentStreak: Math.round(t * stats.currentStreak),
        levelsCompleted: Math.round(t * stats.levelsCompleted),
      });
      if (step >= COUNTER_STEPS) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayStats(stats);
      }
    }, COUNTER_DURATION_MS / COUNTER_STEPS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [stats.totalStars, stats.currentStreak, stats.levelsCompleted, reduceMotion]); // eslint-disable-line react-hooks/exhaustive-deps

  // Below 340px: wrap into 2 rows; otherwise all 3 in one row
  const narrow = width < 340;
  const totalLevels = getTotalLevels();

  const cardStyle = [
    styles.card,
    { backgroundColor: glassSurface, borderColor: glassBorder, borderWidth: 1.5 },
    glassShadow,
    narrow ? styles.cardNarrow : styles.cardWide,
  ];

  const cards = [
    {
      emoji: '⭐',
      label: t('home.stats.stars'),
      value: String(displayStats.totalStars),
      sub: null,
      onPress: () => router.push('/gallery'),
      index: 0,
    },
    {
      emoji: '🔥',
      label: t('home.stats.streak'),
      value: String(displayStats.currentStreak),
      sub: stats.currentStreak > 0
        ? t(stats.currentStreak === 1 ? 'home.stats.streakDay' : 'home.stats.streakDays')
        : null,
      onPress: () => router.push('/levels'),
      index: 1,
    },
    {
      emoji: '🏆',
      label: t('home.stats.levels'),
      value: String(displayStats.levelsCompleted),
      sub: t('home.stats.levelOf', { total: String(totalLevels) }),
      onPress: () => router.push('/levels'),
      index: 2,
    },
  ];

  return (
    <View style={[styles.row, narrow && styles.rowWrap]}>
      {cards.map((card) => (
        <GlassCard
          key={card.label}
          index={card.index}
          onPress={card.onPress}
          style={cardStyle}
          accessibilityLabel={`${card.label}: ${card.value}${card.sub ? ' ' + card.sub : ''}`}
        >
          <Text style={styles.emoji}>{card.emoji}</Text>
          <Text style={[styles.value, { color: colors.text.primary }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{card.value}</Text>
          <Text style={[styles.label, { color: colors.text.secondary }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{card.label}</Text>
          {card.sub !== null && (
            <Text style={[styles.sub, { color: colors.text.secondary }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{card.sub}</Text>
          )}
        </GlassCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  rowWrap: {
    flexWrap: 'wrap',
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.xl,
    minWidth: 80,
    gap: 1,
  },
  cardWide: {
    minWidth: 0,
  },
  cardNarrow: {
    minWidth: '45%',
    flexGrow: 1,
  },
  emoji: {
    fontSize: 20,
  },
  value: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    lineHeight: 22,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    textAlign: 'center',
  },
  sub: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 1,
  },
});
