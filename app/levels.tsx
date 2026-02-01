import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { t } from '../services/i18n';
import { useTheme } from '../services/ThemeContext';
import { getAllLevels } from '../services/LevelManager';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/Layout';

// Default card width for SSR (will be recalculated on client)
const DEFAULT_CARD_WIDTH = 150;

/**
 * Levels Screen - Level-Auswahl
 * Zeigt alle verfügbaren Level in einem Grid
 */
export default function LevelsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const levels = getAllLevels();
  // Use hook for responsive dimensions (SSR-safe)
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth > 0 ? (screenWidth - Spacing.lg * 3) / 2 : DEFAULT_CARD_WIDTH;

  const renderLevelCard = ({ item }: { item: typeof levels[0] }) => {
    const difficultyText = t(`difficulty.${item.difficulty}`);

    return (
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
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
          <Text style={styles.difficultyText}>{difficultyText}</Text>
        </View>

        {/* Platzhalter für Sterne (später mit Progress-System) */}
        <View style={styles.starsContainer}>
          <Text style={[styles.starsPlaceholder, { color: colors.text.light }]}>☆ ☆ ☆ ☆ ☆</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.surface }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>← Zurück</Text>
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

/**
 * Gibt die Farbe für eine Schwierigkeitsstufe zurück
 */
function getDifficultyColor(difficulty: number): string {
  switch (difficulty) {
    case 1:
      return Colors.difficulty[1];
    case 2:
      return Colors.difficulty[2];
    case 3:
      return Colors.difficulty[3];
    case 4:
      return Colors.difficulty[4];
    case 5:
      return Colors.difficulty[5];
    default:
      return Colors.primary;
  }
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
    fontSize: FontSize.lg,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xxl,
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
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md, // sm → md (weicher)
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
    ...Colors.shadow.small, // Soft & Modern: Subtile Schatten für Badges
  },
  difficultyText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.drawing.white,
  },
  starsContainer: {
    marginTop: Spacing.xs,
  },
  starsPlaceholder: {
    fontSize: FontSize.md,
    color: Colors.text.light,
  },
});
