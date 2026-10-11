import React, { useState, useCallback } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '@services/ThemeContext';
import { useTranslation } from '@services/i18n';
import storageManager from '@services/StorageManager';
import { getTotalLevels } from '@services/LevelManager';
import { FontSize, FontFamily } from '../constants/Layout';

interface Stats {
  totalStars: number;
  levelsCompleted: number;
}

/**
 * Dezente Fortschrittszeile auf der Startseite ("7 Sterne · 2 von 20 Level").
 * Bewusst nur Text — keine Karten, Emoji oder Zähler-Animation, damit
 * "Spiel starten" die einzige auffällige Aktion bleibt. Die Serie (Streak)
 * erscheint nur noch in Malis Begrüßung.
 */
export default function QuickStatsCards() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [stats, setStats] = useState<Stats | null>(null);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      storageManager.getProgress().then(progress => {
        if (!mounted) return;
        const totalStars = Object.values(progress.levels).reduce((sum, l) => sum + l.bestRating, 0);
        setStats({ totalStars, levelsCompleted: progress.totalLevelsCompleted });
      });
      return () => {
        mounted = false;
      };
    }, []),
  );

  if (!stats) return null;

  const text =
    `${stats.totalStars} ${t('home.stats.stars')} · ` +
    `${stats.levelsCompleted} ${t('home.stats.levelOf', { total: String(getTotalLevels()) })} ${t('home.stats.levels')}`;

  return (
    <Text style={[styles.line, { color: colors.text.secondary }]} numberOfLines={1}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  line: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semibold,
    textAlign: 'center',
  },
});
