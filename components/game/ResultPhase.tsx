import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import DrawingCanvas from '@components/DrawingCanvas';
import LevelImageDisplay from '@components/LevelImageDisplay';
import Mascot from '@components/Mascot';
import { AnimatedFeedback, AnimatedStar } from '@components/AnimatedPrimitives';
import Colors from '../../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Layout';
import { getTotalLevels } from '@services/LevelManager';
import type { ResultPhaseProps } from './game.shared';
import { useTranslation } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';
import { getRatingFeedback } from '@services/RatingManager';
import { getResultMoodForStars } from '@services/MascotManager';
import type { StarRating } from '../../types';

export default function ResultPhase({
  currentImage,
  levelNumber,
  currentLang,
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
  const { colors } = useTheme();
  const isLastLevel = levelNumber >= getTotalLevels();
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    if (isLastLevel && userRating > 0) {
      const timeout = setTimeout(() => setShowCompletionModal(true), 800);
      return () => clearTimeout(timeout);
    }
  }, [isLastLevel, userRating]);

  const getFeedbackText = (rating: number) => {
    if (rating >= 1 && rating <= 5) {
      const feedback = getRatingFeedback(rating as StarRating);
      return currentLang === 'en' ? feedback.messageEn : feedback.message;
    }
    return t('game.result.tapStars');
  };

  const imageSize = Math.min(Math.max(screenWidth * 0.44, 140), 220);

  return (
    <>
      {/* Spielende-Modal bei Level 20 */}
      <Modal
        visible={showCompletionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCompletionModal(false)}
      >
        <View style={styles.completionOverlay}>
          <View style={[styles.completionModalBox, { backgroundColor: colors.surface }]}>
            <Text style={styles.completionEmoji}>🏆</Text>
            <Text style={[styles.completionTitle, { color: colors.text.primary }]}>
              {t('game.result.allLevelsComplete')}
            </Text>
            <Text style={[styles.completionMessage, { color: colors.text.secondary }]}>
              {t('game.result.allLevelsCompleteMessage')}
            </Text>
            <TouchableOpacity
              style={styles.completionButton}
              onPress={() => {
                setShowCompletionModal(false);
                onRestartFromLevel1();
              }}
              accessibilityRole="button"
            >
              <Text style={styles.completionButtonText}>🔄 {t('game.result.playAgain')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.completionClose}
              onPress={() => setShowCompletionModal(false)}
              accessibilityRole="button"
            >
              <Text style={[styles.completionCloseText, { color: colors.text.secondary }]}>
                {t('common.close')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView
        style={styles.resultScrollView}
        contentContainerStyle={styles.resultContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Side-by-side Vergleich */}
        <View style={styles.comparisonContainer}>
          {/* Vorlage */}
          <View
            style={[
              styles.comparisonCard,
              { width: imageSize, backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={[styles.comparisonCardHeader, styles.comparisonCardHeaderTemplate]}>
              <Text style={[styles.comparisonCardLabel, { color: Colors.primary }]}>
                {t('game.result.template').toUpperCase()}
              </Text>
            </View>
            <View style={[styles.comparisonImage, { width: imageSize, height: imageSize }]}>
              {currentImage && <LevelImageDisplay image={currentImage} size={imageSize} />}
            </View>
          </View>

          {/* Deine Zeichnung + kontextuelle Aktionen */}
          <View style={{ width: imageSize, gap: Spacing.xs }}>
            <View
              style={[
                styles.comparisonCard,
                { width: imageSize, backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
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

            {/* Replay + Speichern direkt unter der eigenen Zeichnung */}
            <View style={styles.drawingActionRow}>
              <TouchableOpacity
                style={[
                  styles.drawingActionButton,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
                onPress={isReplaying ? onStopReplay : onStartReplay}
                accessibilityRole="button"
              >
                <Text style={styles.drawingActionIcon}>{isReplaying ? '⏹' : '🎬'}</Text>
                <Text style={[styles.drawingActionLabel, { color: colors.text.secondary }]}>
                  {isReplaying ? t('game.result.replayStop') : t('game.result.replay')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.drawingActionButton,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  savedToGallery && styles.drawingActionSaved,
                ]}
                onPress={onSaveToGallery}
                disabled={savedToGallery}
                accessibilityRole="button"
                accessibilityLabel={savedToGallery ? t('gallery.saved') : t('gallery.save')}
                accessibilityState={{ disabled: savedToGallery }}
              >
                <Text style={styles.drawingActionIcon}>{savedToGallery ? '✓' : '🖼'}</Text>
                <Text
                  style={[
                    styles.drawingActionLabel,
                    { color: colors.text.secondary },
                    savedToGallery && styles.drawingActionLabelSaved,
                  ]}
                >
                  {savedToGallery ? t('gallery.saved') : t('gallery.save')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 2. Sterne-Bewertung */}
        <View
          style={[
            styles.starsContainer,
            { backgroundColor: colors.surface },
            isSmall && styles.starsContainerSmall,
          ]}
        >
          <Text style={[styles.starsTitle, { color: colors.text.primary }]}>
            {t('game.result.howWell')}
          </Text>
          <View style={styles.starsRow} testID="stars-container">
            {[1, 2, 3, 4, 5].map(star => (
              <AnimatedStar
                key={star}
                filled={star <= userRating}
                index={star - 1}
                onPress={() => onRatingSubmit(star)}
                accessibilityLabel={t('game.result.starAccessibilityLabel', {
                  rating: star,
                  plural: star !== 1 ? 's' : '',
                })}
              />
            ))}
          </View>
          <AnimatedFeedback visible={userRating > 0}>
            <View style={styles.mascotFeedbackRow}>
              <Mascot
                size={48}
                mood={getResultMoodForStars(userRating)}
                testID="result-mascot"
              />
              <Text style={[styles.feedbackText, { color: colors.text.secondary }]}>
                {getFeedbackText(userRating)}
              </Text>
            </View>
          </AnimatedFeedback>
        </View>

        {/* 3. Weiter — prominenter primärer CTA */}
        {levelNumber < getTotalLevels() ? (
          <TouchableOpacity
            style={styles.nextLevelButton}
            onPress={onNextLevel}
            accessibilityRole="button"
          >
            <Text style={styles.nextLevelButtonText}>{t('game.result.nextLevel')} →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.nextLevelButton}
            onPress={onRestartFromLevel1}
            accessibilityRole="button"
          >
            <Text style={styles.nextLevelButtonText}>🔄 {t('game.result.playAgain')}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </>
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
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
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
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  mascotFeedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  feedbackText: {
    flexShrink: 1,
    fontSize: FontSize.md,
    textAlign: 'left',
  },
  completionOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  completionModalBox: {
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    gap: Spacing.md,
    ...Colors.shadow.large,
  },
  completionEmoji: {
    fontSize: 56,
  },
  completionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },
  completionMessage: {
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  completionButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    width: '100%',
  },
  completionButtonText: {
    color: '#ffffff',
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  completionClose: {
    paddingVertical: Spacing.xs,
  },
  completionCloseText: {
    fontSize: FontSize.sm,
  },
  drawingActionRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  drawingActionButton: {
    flex: 1,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1.5,
    minHeight: 44,
    justifyContent: 'center',
    gap: 2,
    ...Colors.shadow.small,
  },
  drawingActionSaved: {
    borderColor: Colors.success,
    backgroundColor: Colors.success + '10',
  },
  drawingActionIcon: {
    fontSize: 16,
    textAlign: 'center',
  },
  drawingActionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
  drawingActionLabelSaved: {
    color: Colors.success,
  },
  nextLevelButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    marginTop: Spacing.sm,
    minHeight: 52,
    ...Colors.shadow.medium,
  },
  nextLevelButtonText: {
    color: '#ffffff',
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});
