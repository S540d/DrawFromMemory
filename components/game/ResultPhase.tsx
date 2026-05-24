import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import DrawingCanvas from '@components/DrawingCanvas';
import LevelImageDisplay from '@components/LevelImageDisplay';
import { AnimatedFeedback, AnimatedStar } from '@components/AnimatedPrimitives';
import Colors from '../../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Layout';
import { getTotalLevels } from '@services/LevelManager';
import type { ResultPhaseProps } from './game.shared';
import { useTranslation } from '@services/i18n';

export default function ResultPhase({
  currentImage,
  currentLang,
  levelNumber,
  userRating,
  savedToGallery,
  isReplaying,
  replayPaths,
  drawingPaths,
  screenWidth,
  isSmall,
  onRatingSubmit,
  onSaveToGallery,
  onStartReplay,
  onStopReplay,
  onNextLevel,
  onRestartFromLevel1,
}: ResultPhaseProps) {
  const { t } = useTranslation();

  const getFeedbackText = (rating: number) => {
    if (rating === 5) return t('game.result.feedback5');
    if (rating === 4) return t('game.result.feedback4');
    if (rating === 3) return t('game.result.feedback3');
    if (rating >= 1) return t('game.result.feedback1');
    return t('game.result.tapStars');
  };

  const imageSize = Math.min(Math.max(screenWidth * 0.44, 140), 220);

  return (
    <ScrollView
      style={styles.resultScrollView}
      contentContainerStyle={styles.resultContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Side-by-side Vergleich */}
      <View style={styles.comparisonContainer}>
        {/* Vorlage */}
        <View style={[styles.comparisonCard, { width: imageSize }]}>
          <View style={[styles.comparisonCardHeader, styles.comparisonCardHeaderTemplate]}>
            <Text style={[styles.comparisonCardLabel, { color: Colors.primary }]}>
              {t('game.result.template').toUpperCase()}
            </Text>
          </View>
          <View style={[styles.comparisonImage, { width: imageSize, height: imageSize }]}>
            {currentImage && (
              <LevelImageDisplay image={currentImage} size={imageSize} />
            )}
          </View>
        </View>

        {/* Deine Zeichnung */}
        <View style={[styles.comparisonCard, { width: imageSize }]}>
          <View style={[styles.comparisonCardHeader, styles.comparisonCardHeaderDrawing]}>
            <Text style={[styles.comparisonCardLabel, { color: Colors.secondary }]}>
              {t('game.result.yourDrawing').toUpperCase()}
            </Text>
          </View>
          <View style={[styles.comparisonImage, { width: imageSize, height: imageSize }]}>
            <DrawingCanvas
              width={imageSize}
              height={imageSize}
              paths={isReplaying ? replayPaths : drawingPaths}
              strokeColor={Colors.drawing.black}
              strokeWidth={2}
            />
          </View>
        </View>
      </View>

      {/* 2. Sterne-Bewertung */}
      <View style={[styles.starsContainer, isSmall && styles.starsContainerSmall]}>
        <Text style={styles.starsTitle}>{t('game.result.howWell')}</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <AnimatedStar
              key={star}
              filled={star <= userRating}
              index={star - 1}
              onPress={() => onRatingSubmit(star)}
              accessibilityLabel={`${star} Stern${star !== 1 ? 'e' : ''}`}
            />
          ))}
        </View>
        <AnimatedFeedback visible={userRating > 0}>
          <Text style={styles.feedbackText}>{getFeedbackText(userRating)}</Text>
        </AnimatedFeedback>
      </View>

      {/* Completion banner for Level 10 */}
      {levelNumber >= getTotalLevels() && userRating > 0 && (
        <View style={styles.completionBanner}>
          <Text style={styles.completionTitle}>{t('game.result.allLevelsComplete')}</Text>
          <Text style={styles.completionMessage}>{t('game.result.allLevelsCompleteMessage')}</Text>
        </View>
      )}

      {/* 3. Aktions-Zeile: Zeitraffer | Galerie | Weiter */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={isReplaying ? onStopReplay : onStartReplay}
          accessibilityRole="button"
        >
          <Text style={styles.actionButtonText}>
            {isReplaying ? '⏹' : '🎬'}
          </Text>
          <Text style={styles.actionButtonLabel}>
            {isReplaying ? t('game.result.replayStop') : t('game.result.replay')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, savedToGallery && styles.actionButtonSaved]}
          onPress={onSaveToGallery}
          disabled={savedToGallery}
          accessibilityRole="button"
          accessibilityLabel={savedToGallery ? t('gallery.saved') : t('gallery.save')}
          accessibilityState={{ disabled: savedToGallery }}
        >
          <Text style={styles.actionButtonText}>{savedToGallery ? '✓' : '🖼'}</Text>
          <Text style={[styles.actionButtonLabel, savedToGallery && styles.actionButtonLabelSaved]}>
            {savedToGallery ? t('gallery.saved') : t('gallery.save')}
          </Text>
        </TouchableOpacity>

        {levelNumber < getTotalLevels() ? (
          <TouchableOpacity style={[styles.actionButton, styles.actionButtonPrimary]} onPress={onNextLevel}>
            <Text style={[styles.actionButtonText, styles.actionButtonPrimaryText]}>→</Text>
            <Text style={[styles.actionButtonLabel, styles.actionButtonPrimaryText]}>{t('game.result.nextLevel')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.actionButton, styles.actionButtonPrimary]} onPress={onRestartFromLevel1}>
            <Text style={[styles.actionButtonText, styles.actionButtonPrimaryText]}>🔄</Text>
            <Text style={[styles.actionButtonLabel, styles.actionButtonPrimaryText]}>{t('game.result.playAgain')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  resultScrollView: {
    flex: 1,
  },
  resultContent: {
    padding: Spacing.md,
    flexGrow: 1,
  },
  comparisonContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    justifyContent: 'center',
  },
  comparisonCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Colors.shadow.medium,
  },
  comparisonCardHeader: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  comparisonCardHeaderTemplate: {
    backgroundColor: Colors.primary + '18',
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary + '22',
  },
  comparisonCardHeaderDrawing: {
    backgroundColor: Colors.secondary + '18',
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary + '22',
  },
  comparisonCardLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.6,
  },
  comparisonImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  starsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Colors.shadow.medium,
  },
  starsContainerSmall: {
    marginBottom: Spacing.sm,
  },
  starsTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  feedbackText: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  completionBanner: {
    backgroundColor: Colors.success + '15',
    borderWidth: 2,
    borderColor: Colors.success,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  completionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.success,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  completionMessage: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    minHeight: 60,
    justifyContent: 'center',
    gap: 2,
    ...Colors.shadow.small,
  },
  actionButtonPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  actionButtonSaved: {
    borderColor: Colors.success,
    backgroundColor: Colors.success + '10',
  },
  actionButtonText: {
    fontSize: 20,
    textAlign: 'center',
  },
  actionButtonLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  actionButtonLabelSaved: {
    color: Colors.success,
  },
  actionButtonPrimaryText: {
    color: Colors.background,
  },
});
