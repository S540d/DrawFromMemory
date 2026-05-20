import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';
import { getAllLevels } from '@services/LevelManager';
import storageManager from '@services/StorageManager';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/Layout';
import { AnimatedCard } from '@components/AnimatedPrimitives';
import { Badge } from '@components/Badge';

// Default card width for SSR (will be recalculated on client)
const DEFAULT_CARD_WIDTH = 150;

/**
 * Levels Screen - Level-Auswahl
 * Zeigt alle verfügbaren Level in einem Grid
 */
export default function LevelsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const levels = getAllLevels();
  const [ratings, setRatings] = useState<Record<number, number | null>>({});
  // Use hook for responsive dimensions (SSR-safe)
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth > 0 ? (screenWidth - Spacing.lg * 3) / 2 : DEFAULT_CARD_WIDTH;

  useEffect(() => {
    let mounted = true;
    Promise.all(
      levels.map(level =>
        storageManager.getLevelRating(level.number).then(r => [level.number, r] as [number, number | null])
      )
    ).then(entries => {
      if (mounted) setRatings(Object.fromEntries(entries));
    });
    return () => { mounted = false; };
  }, []);

  const renderStars = (rating: number | null, levelNumber: number) => {
    const filled = rating === null ? 0 : Math.ceil(rating / 2);
    return (
      <View style={styles.starsRow} testID={`stars-level-${levelNumber}`}>
        {Array.from({ length: 3 }, (_, i) => (
          <Text
            key={i}
            testID={i < filled ? 'star-filled' : 'star-empty'}
            style={[styles.star, { color: i < filled ? colors.stars.filled : colors.stars.empty }]}
          >
            {i < filled ? '★' : '☆'}
          </Text>
        ))}
      </View>
    );
  };

  const renderLevelCard = ({ item, index }: { item: typeof levels[0]; index: number }) => {
    const difficultyText = t(`difficulty.${item.difficulty}`);

    return (
      <AnimatedCard index={index}>
        <TouchableOpacity
          style={[styles.levelCard, { width: cardWidth, backgroundColor: colors.surface, borderColor: colors.primary + '30' }]}
          onPress={() => router.push(`/game?level=${item.number}`)}
          activeOpacity={0.7}
        >
          {/* Level-Nummer */}
          <View style={styles.levelHeader}>
            <Text style={[styles.levelNumber, { color: colors.text.primary }]}>
              {t('levels.level', { number: item.number })}
            </Text>
          </View>

          {/* Schwierigkeit */}
          <Badge
            label={difficultyText}
            variant="difficulty"
            difficulty={item.difficulty}
            style={styles.difficultyBadge}
          />

          {/* Sterne-Bewertung */}
          {renderStars(ratings[item.number] ?? null, item.number)}

        </TouchableOpacity>
      </AnimatedCard>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.surface }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>← {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text.primary }]}>{t('levels.title')}</Text>
      </View>

      {/* Level-Grid */}
      <FlatList
        data={levels}
        renderItem={renderLevelCard}
        keyExtractor={(item) => `level-${item.number}`}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  backButton: {
    fontSize: FontSize.md,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  listContent: {
    padding: Spacing.lg,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  levelCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl, // lg → xl (16px → 20px für Cards)
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary + '30', // 30 = opacity
    ...Colors.shadow.medium, // Soft & Modern: Weiche Schatten für Level-Cards
  },
  levelHeader: {
    marginBottom: Spacing.sm,
  },
  levelNumber: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  difficultyBadge: {
    marginBottom: Spacing.sm,
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: Spacing.xs,
  },
  star: {
    fontSize: FontSize.lg,
  },
});
