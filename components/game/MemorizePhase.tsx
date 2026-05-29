import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LevelImageDisplay from '@components/LevelImageDisplay';
import { ErrorBoundary } from '@components/ErrorBoundary';
import Colors from '../../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Layout';
import type { MemorizePhaseProps } from './game.shared';
import { useTranslation } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';

export default function MemorizePhase({
  timeRemaining,
  currentImage,
  levelNumber,
  currentLang,
  memorizeImageSize,
  imagePlaceholderMinSize,
  revealStep,
}: MemorizePhaseProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={styles.phaseContainer}>
      <Text style={[styles.phaseTitle, { color: colors.text.primary }]}>{t('game.memorize.title')}</Text>

      <View style={styles.timerContainer}>
        <Text style={[styles.timerText, { color: colors.background }]}>{t('game.memorize.timeLeft', { seconds: Math.max(0, Math.ceil(timeRemaining)) })}</Text>
      </View>

      <View style={styles.imageContainer}>
        {currentImage && (
          <View style={[styles.imagePlaceholder, { minWidth: imagePlaceholderMinSize, minHeight: imagePlaceholderMinSize, backgroundColor: colors.surface }]}>
            <ErrorBoundary>
              <LevelImageDisplay image={currentImage} size={memorizeImageSize} revealStep={revealStep} />
            </ErrorBoundary>
            <Text style={[styles.imageName, { color: colors.text.primary }]}>
              {currentLang === 'en' ? currentImage.displayNameEn : currentImage.displayName}
            </Text>
            <Text style={[styles.imageInfo, { color: colors.text.secondary }]}>
              {t('game.memorize.imageInfo', { level: levelNumber, strokeCount: currentImage.strokeCount })}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  phaseContainer: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  phaseTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginTop: 0,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  timerContainer: {
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Colors.shadow.large,
  },
  timerText: {
    fontSize: FontSize.huge,
    fontWeight: FontWeight.bold,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Colors.shadow.large,
  },
  imageName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
  },
  imageInfo: {
    fontSize: FontSize.sm,
  },
});
