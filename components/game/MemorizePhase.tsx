import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LevelImageDisplay from '@components/LevelImageDisplay';
import { ErrorBoundary } from '@components/ErrorBoundary';
import Colors from '../../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Layout';
import type { MemorizePhaseProps } from './game.shared';
import { useTranslation } from '@services/i18n';

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

  return (
    <View style={styles.phaseContainer}>
      <Text style={styles.phaseTitle}>{t('game.memorize.title')}</Text>

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{timeRemaining}s</Text>
      </View>

      <View style={styles.imageContainer}>
        {currentImage && (
          <View style={[styles.imagePlaceholder, { minWidth: imagePlaceholderMinSize, minHeight: imagePlaceholderMinSize }]}>
            <ErrorBoundary>
              <LevelImageDisplay image={currentImage} size={memorizeImageSize} revealStep={revealStep} />
            </ErrorBoundary>
            <Text style={styles.imageName}>
              {currentLang === 'en' ? currentImage.displayNameEn : currentImage.displayName}
            </Text>
            <Text style={styles.imageInfo}>
              Level {levelNumber} • {currentImage.strokeCount} Striche
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
    color: Colors.text.primary,
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
    color: Colors.background,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Colors.shadow.large,
  },
  imageName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  imageInfo: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
});
