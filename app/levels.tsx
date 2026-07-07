import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';
import { getAllLevels } from '@services/LevelManager';
import { getAvailablePacks } from '@services/ImagePoolManager';
import storageManager from '@services/StorageManager';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, FontFamily, BorderRadius } from '../constants/Layout';
import { GlassCard } from '@components/AnimatedPrimitives';
import { Badge } from '@components/Badge';
import { FloatingStars } from '@components/FloatingStars';
import { ChipGroup } from '@components/Chip';
import type { GameVariant } from '../types';

// Default card width for SSR (will be recalculated on client)
const DEFAULT_CARD_WIDTH = 100;
const NUM_COLUMNS = 3;

const VARIANT_KEYS: GameVariant[] = ['normal', 'outline', 'mirror'];

// Themen-Pack-ID (z.B. 'tiere-v1') → kurzer i18n-Key (ohne Versionssuffix)
const PACK_LABEL_KEYS: Record<string, string> = {
  'tiere-v1': 'tiere',
  'fahrzeuge-v1': 'fahrzeuge',
};

/**
 * Levels Screen - Level-Auswahl
 * Zeigt alle verfügbaren Level in einem Grid
 */
export default function LevelsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, theme } = useTheme();
  const levels = useMemo(() => getAllLevels(), []);
  const packs = useMemo(() => ['all', ...getAvailablePacks()], []);
  const [ratings, setRatings] = useState<Record<number, number | null>>({});
  const [variant, setVariant] = useState<GameVariant>('normal');
  const [pack, setPack] = useState<string>('all');
  // Use hook for responsive dimensions (SSR-safe)
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth =
    screenWidth > 0
      ? (screenWidth - Spacing.lg * (NUM_COLUMNS + 1)) / NUM_COLUMNS
      : DEFAULT_CARD_WIDTH;

  const glassSurface = theme === 'dark' ? Colors.glass.darkSurface : Colors.glass.lightSurface;
  const glassBorder = theme === 'dark' ? Colors.glass.darkBorder : Colors.glass.lightBorder;
  const glassShadow = theme === 'dark' ? Colors.glass.darkShadow : Colors.glass.lightShadow;

  useEffect(() => {
    let mounted = true;
    Promise.all(
      levels.map(level =>
        storageManager
          .getLevelRating(level.number)
          .then(r => [level.number, r] as [number, number | null]),
      ),
    ).then(entries => {
      if (mounted) setRatings(Object.fromEntries(entries));
    });
    return () => {
      mounted = false;
    };
  }, [levels]);

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

  const renderLevelCard = ({ item, index }: { item: (typeof levels)[0]; index: number }) => {
    const difficultyText = t(`difficulty.${item.difficulty}`);

    return (
      <GlassCard
        index={index}
        onPress={() => router.push(`/game?level=${item.number}&variant=${variant}&pack=${pack}`)}
        accessibilityLabel={`${t('levels.level', { number: item.number })} — ${difficultyText}`}
        style={[
          styles.levelCard,
          { width: cardWidth, backgroundColor: glassSurface, borderColor: glassBorder },
          glassShadow,
        ]}
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
      </GlassCard>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FloatingStars />
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.surface }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>← {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text.primary }]}>{t('levels.title')}</Text>
      </View>

      {/* Spielvariante */}
      <View style={styles.variantSection}>
        <Text style={[styles.variantLabel, { color: colors.text.secondary }]}>
          {t('levels.variant.title')}
        </Text>
        <ChipGroup
          options={VARIANT_KEYS.map(v => t(`levels.variant.${v}`))}
          selected={t(`levels.variant.${variant}`)}
          onSelect={label => {
            const match = VARIANT_KEYS.find(v => t(`levels.variant.${v}`) === label);
            if (match) setVariant(match);
          }}
        />
      </View>

      {/* Themen-Pack */}
      {packs.length > 1 && (
        <View style={styles.variantSection}>
          <Text style={[styles.variantLabel, { color: colors.text.secondary }]}>
            {t('levels.pack.title')}
          </Text>
          <ChipGroup
            options={packs.map(p => t(`levels.pack.${PACK_LABEL_KEYS[p] ?? p}`))}
            selected={t(`levels.pack.${PACK_LABEL_KEYS[pack] ?? pack}`)}
            onSelect={label => {
              const match = packs.find(p => t(`levels.pack.${PACK_LABEL_KEYS[p] ?? p}`) === label);
              if (match) setPack(match);
            }}
          />
        </View>
      )}

      {/* Level-Grid */}
      <FlatList
        data={levels}
        renderItem={renderLevelCard}
        keyExtractor={item => `level-${item.number}`}
        numColumns={NUM_COLUMNS}
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
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
  },
  backButton: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semibold,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.extraBold,
  },
  variantSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.xs,
  },
  variantLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  levelCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    borderWidth: 1.5,
  },
  levelHeader: {
    marginBottom: Spacing.xs,
  },
  levelNumber: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  difficultyBadge: {
    marginBottom: Spacing.xs,
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: Spacing.xs,
  },
  star: {
    fontSize: FontSize.sm,
  },
});
