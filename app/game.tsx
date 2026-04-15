import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScreenLayout } from '@utils/useScreenLayout';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getTotalLevels } from '@services/LevelManager';
import { t, getCurrentLanguage } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';
import { DrawingColors } from '../constants/Colors';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/Layout';
import LevelImageDisplay from '@components/LevelImageDisplay';
import DrawingCanvas, { useDrawingCanvas } from '@components/DrawingCanvas';
import SettingsModal from '@components/SettingsModal';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { AnimatedFeedback } from '@components/AnimatedPrimitives';
import SoundManager from '@services/SoundManager';
import { useGamePhase } from '@services/useGamePhase';
import type { DrawingPath } from '@components/DrawingCanvas';

/**
 * Game Screen - Hauptspiel mit 3 Phasen
 * Phase 1: Memorize (Bild anzeigen mit Timer)
 * Phase 2: Draw (Zeichnen - noch nicht implementiert)
 * Phase 3: Result (Bewertung - noch nicht implementiert)
 */
export default function GameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const layout = useScreenLayout();
  const { screenWidth, isSmall } = layout;
  const [showSettings, setShowSettings] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showToolPicker, setShowToolPicker] = useState(false);
  const [showStrokeWidthPicker, setShowStrokeWidthPicker] = useState(false);

  // Drawing Canvas Hook
  const drawing = useDrawingCanvas();

  // Get current language for accessibility
  const currentLang = getCurrentLanguage();

  // Level aus URL-Parameter auslesen, falls vorhanden, und validieren
  const parsedLevel = params.level ? parseInt(params.level as string, 10) : 1;
  const totalLevels = getTotalLevels();
  const initialLevel =
    !isNaN(parsedLevel) && parsedLevel >= 1 && parsedLevel <= totalLevels
      ? parsedLevel
      : 1;

  const {
    phase,
    setPhase,
    levelNumber,
    currentImage,
    timeRemaining,
    userRating,
    revealStep,
    savedToGallery,
    isReplaying,
    setIsReplaying,
    replayPaths,
    handleRatingSubmit,
    saveToGallery,
    startReplay,
    restartCurrentLevel,
    startNextLevel,
    restartFromLevel1,
  } = useGamePhase({
    initialLevel,
    drawingPaths: drawing.paths,
    clearCanvas: drawing.clearCanvas,
  });

  // Initialize sound manager
  useEffect(() => {
    SoundManager.init();
  }, []);

  // Memoized dynamic styles – stable across re-renders unless layout changes
  const dynCanvasContainer = useMemo(() => ({
    maxHeight: layout.canvasMaxHeight,
    minHeight: layout.canvasMinHeight,
    marginVertical: layout.canvasMarginVertical,
  }), [layout.canvasMaxHeight, layout.canvasMinHeight, layout.canvasMarginVertical]);

  const dynToolbar = useMemo(() => ({
    marginVertical: layout.toolbarMarginVertical,
  }), [layout.toolbarMarginVertical]);

  const dynToolbarButton = useMemo(() => ({
    minHeight: layout.toolbarButtonMinHeight,
    paddingVertical: layout.toolbarButtonPaddingVertical,
  }), [layout.toolbarButtonMinHeight, layout.toolbarButtonPaddingVertical]);

  const dynButton = useMemo(() => ({
    minHeight: layout.buttonMinHeight,
    paddingVertical: layout.buttonPaddingVertical,
  }), [layout.buttonMinHeight, layout.buttonPaddingVertical]);

  // Render Memorize Phase
  const renderMemorizePhase = () => (
    <View style={styles.phaseContainer}>
      <Text style={styles.phaseTitle}>{t('game.memorize.title')}</Text>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{timeRemaining}s</Text>
      </View>

      {/* Bild-Container */}
      <View style={styles.imageContainer}>
        {currentImage && (
          <View style={[styles.imagePlaceholder, { minWidth: layout.imagePlaceholderMinSize, minHeight: layout.imagePlaceholderMinSize }]}>
            <ErrorBoundary>
              <LevelImageDisplay image={currentImage} size={layout.memorizeImageSize} revealStep={revealStep} />
            </ErrorBoundary>
            <Text style={styles.imageName}>{currentImage.displayName}</Text>
            <Text style={styles.imageInfo}>
              Level {levelNumber} • {currentImage.strokeCount} Striche
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  // Render Draw Phase
  const renderDrawPhase = () => {
    return (
    <View style={styles.phaseContainer}>
      {/* Zeichenfläche mit react-native-skia */}
      <View style={[styles.canvasContainer, dynCanvasContainer]}>
        <ErrorBoundary>
          <DrawingCanvas
            strokeColor={drawing.color}
            strokeWidth={drawing.strokeWidth}
            tool={drawing.tool}
            paths={drawing.paths}
            onDrawingChange={drawing.setPaths}
          />
        </ErrorBoundary>
      </View>

      {/* Kompakte Toolbar */}
      <View style={[styles.compactToolbar, dynToolbar]}>
        {/* Farbe */}
        <TouchableOpacity
          style={[styles.toolbarButton, dynToolbarButton]}
          onPress={() => setShowColorPicker(true)}
          accessibilityLabel={t('game.draw.selectColor')}
          accessibilityRole="button"
        >
          <View style={[styles.toolbarColorPreview, { backgroundColor: drawing.color }]} />
          <Text style={styles.toolbarButtonText}>{t('game.draw.color')}</Text>
        </TouchableOpacity>

        {/* Werkzeug */}
        <TouchableOpacity
          style={[styles.toolbarButton, dynToolbarButton]}
          onPress={() => setShowToolPicker(true)}
          accessibilityLabel={t('game.draw.tool')}
          accessibilityRole="button"
        >
          <Text style={styles.toolbarIcon}>{drawing.tool === 'brush' ? '🖌️' : '🪣'}</Text>
          <Text style={styles.toolbarButtonText}>{t('game.draw.tool')}</Text>
        </TouchableOpacity>

        {/* Strichstärke (nur bei Brush) */}
        {drawing.tool === 'brush' && (
          <TouchableOpacity
            style={[styles.toolbarButton, dynToolbarButton]}
            onPress={() => setShowStrokeWidthPicker(true)}
            accessibilityLabel={t('game.draw.strokeWidth')}
            accessibilityRole="button"
          >
            <View style={[styles.toolbarStrokePreview, { height: drawing.strokeWidth }]} />
            <Text style={styles.toolbarButtonText}>{t('game.draw.strokeWidth')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, dynButton]}
          onPress={drawing.undo}
          disabled={drawing.paths.length === 0}
          accessibilityLabel={t('game.draw.undo')}
          accessibilityRole="button"
        >
          <Text style={[styles.secondaryButtonText, isSmall && styles.buttonTextSmall]}>{t('game.draw.undo')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryButton, dynButton, drawing.paths.length === 0 && styles.buttonDisabled]}
          accessibilityLabel={t('game.draw.clear')}
          accessibilityRole="button"
          onPress={() => {
            if (Platform.OS === 'web') {
              // Auf Web: Direktes Löschen ohne Alert (Alert funktioniert nicht zuverlässig)
              if (drawing.paths.length > 0 && window.confirm('Möchtest du wirklich die gesamte Zeichnung löschen?')) { // platform-safe
                drawing.setPaths([]);
              }
            } else {
              // Native: Alert Dialog
              if (drawing.paths.length === 0) return;
              Alert.alert(
                'Alles löschen?',
                'Möchtest du wirklich die gesamte Zeichnung löschen?',
                [
                  { text: 'Abbrechen', style: 'cancel' },
                  {
                    text: 'Löschen',
                    style: 'destructive',
                    onPress: () => {
                      drawing.setPaths([]);
                    }
                  },
                ]
              );
            }
          }}
          disabled={drawing.paths.length === 0}
        >
          <Text style={[styles.secondaryButtonText, isSmall && styles.buttonTextSmall]}>{t('game.draw.clear')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, dynButton]}
          onPress={() => {
            SoundManager.playPhaseTransition();
            setPhase('result');
          }}
        >
          <Text style={[styles.primaryButtonText, isSmall && styles.buttonTextSmall]}>{t('game.draw.done')}</Text>
        </TouchableOpacity>
      </View>
    </View>
    );
  };

  // Render Star Rating (Interactive)
  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => {
          const StarComponent = interactive ? TouchableOpacity : View;
          return (
            <StarComponent
              key={star}
              style={[
                styles.starBox,
                star <= rating && styles.starBoxFilled,
              ]}
              onPress={interactive ? () => handleRatingSubmit(star) : undefined}
            >
              <Text style={[
                styles.starText,
                star <= rating && styles.starTextFilled,
              ]}>
                ★
              </Text>
            </StarComponent>
          );
        })}
      </View>
    );
  };

  // Render Result Phase
  const renderResultPhase = () => {
    const getFeedbackText = (rating: number) => {
      if (rating === 5) return 'Perfekt! Du bist ein Gedächtnis-Meister!';
      if (rating === 4) return 'Sehr gut! Fast perfekt!';
      if (rating === 3) return 'Gut gemacht! Weiter so!';
      if (rating >= 1) return 'Das war schon besser als vorhin, willst du es trotzdem nochmal versuchen?';
      return 'Wie viele Sterne gibst du dir?';
    };

    // Berechne responsive Bildgröße: 40% der Bildschirmbreite, min 150px, max 250px
    const imageSize = Math.min(Math.max(screenWidth * 0.4, 150), 250);

    return (
      <ScrollView
        style={[styles.phaseContainer, { padding: 0 }]}
        contentContainerStyle={styles.resultContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.phaseTitle}>{t('game.result.title')}</Text>

        {/* Sterne-Bewertung Interaktiv */}
        <View style={[styles.starsContainer, isSmall && styles.starsContainerSmall]}>
          {renderStars(userRating, true)}
          <AnimatedFeedback visible={userRating > 0}>
            <Text style={styles.ratingText}>{userRating} Stern{userRating !== 1 ? 'e' : ''}!</Text>
            <Text style={styles.feedbackText}>{getFeedbackText(userRating)}</Text>
          </AnimatedFeedback>
          {userRating === 0 && (
            <Text style={styles.feedbackText}>Tippe auf die Sterne, um dich zu bewerten!</Text>
          )}
        </View>

        {/* Vergleich */}
        <View style={styles.comparisonContainer}>
          <View style={styles.comparisonBox}>
            <View style={[styles.comparisonImage, { width: imageSize, height: imageSize }]}>
              {currentImage && (
                <LevelImageDisplay image={currentImage} size={imageSize} />
              )}
            </View>
          </View>
          <View style={styles.comparisonBox}>
            <View style={[styles.comparisonImage, { width: imageSize, height: imageSize }]}>
              <DrawingCanvas
                width={imageSize}
                height={imageSize}
                paths={isReplaying ? replayPaths : drawing.paths}
                strokeColor={Colors.drawing.black}
                strokeWidth={2}
              />
              {drawing.paths.length > 0 && (
                <View style={styles.canvasIconRow}>
                  <TouchableOpacity
                    style={[styles.canvasIconButton, isReplaying && styles.canvasIconButtonActive]}
                    onPress={isReplaying ? () => setIsReplaying(false) : startReplay}
                    accessibilityRole="button"
                    accessibilityLabel={isReplaying ? t('game.result.replayStop') : t('game.result.replay')}
                  >
                    <Text style={[styles.canvasIconText, isReplaying && styles.canvasIconTextActive]}>
                      {isReplaying ? '⏹' : '▶'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.canvasIconButton, savedToGallery && styles.canvasIconButtonSaved]}
                    onPress={saveToGallery}
                    disabled={savedToGallery}
                    accessibilityRole="button"
                    accessibilityLabel={savedToGallery ? t('gallery.saved') : t('gallery.save')}
                    accessibilityState={{ disabled: savedToGallery }}
                  >
                    <Text style={[styles.canvasIconText, savedToGallery && styles.canvasIconTextSaved]}>
                      {savedToGallery ? '✓' : '💾'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Completion banner for Level 10 */}
        {levelNumber >= getTotalLevels() && userRating > 0 && (
          <View style={styles.completionBanner}>
            <Text style={styles.completionTitle}>{t('game.result.allLevelsComplete')}</Text>
            <Text style={styles.completionMessage}>{t('game.result.allLevelsCompleteMessage')}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={restartCurrentLevel}>
            <Text style={styles.actionButtonText}>{t('game.result.retry')}</Text>
          </TouchableOpacity>
          {levelNumber < getTotalLevels() ? (
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonPrimary]} onPress={startNextLevel}>
              <Text style={[styles.actionButtonText, styles.actionButtonPrimaryText]}>{t('game.result.nextLevel')} →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonPrimary]} onPress={restartFromLevel1}>
              <Text style={[styles.actionButtonText, styles.actionButtonPrimaryText]}>{t('game.result.playAgain')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={() => router.back()}>
            <Text style={styles.actionButtonText}>{t('game.result.backToMenu')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { paddingVertical: layout.headerPaddingVertical, paddingHorizontal: layout.headerPaddingHorizontal }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel={t('common.back')}
          accessibilityRole="button"
        >
          <Text style={styles.backButton}>← Zurück</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.levelBadge}>Level {levelNumber}</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowSettings(true)}
          style={styles.settingsButton}
          accessibilityLabel={t('common.settings')}
          accessibilityRole="button"
        >
          <Text style={styles.settingsIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Modal */}
      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />

      {/* Color Picker Modal */}
      <Modal
        visible={showColorPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowColorPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.colorPickerModal}>
            {/* Header */}
            <View style={styles.colorPickerHeader}>
              <Text style={styles.colorPickerTitle}>{t('game.draw.selectColor')}</Text>
              <TouchableOpacity onPress={() => setShowColorPicker(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Color Grid - Fixed 3x4 Layout */}
            <View style={styles.colorGrid}>
              {DrawingColors.map((colorItem) => (
                <TouchableOpacity
                  key={colorItem.hex}
                  style={[
                    styles.colorBoxLarge,
                    { backgroundColor: colorItem.hex },
                    colorItem.border && { borderColor: colorItem.border },
                    drawing.color === colorItem.hex && styles.colorBoxLargeSelected,
                  ]}
                  onPress={() => {
                    drawing.setColor(colorItem.hex);
                    setShowColorPicker(false);
                  }}
                  accessibilityLabel={currentLang === 'de' ? colorItem.name : colorItem.nameEn}
                  accessibilityRole="button"
                >
                  {drawing.color === colorItem.hex && (
                    <Text style={styles.colorBoxCheckmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Tool Picker Modal */}
      <Modal
        visible={showToolPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowToolPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModal}>
            <Text style={styles.pickerTitle}>{t('game.draw.tool')}</Text>
            <View style={styles.pickerOptions}>
              <TouchableOpacity
                style={[styles.pickerOption, drawing.tool === 'brush' && styles.pickerOptionActive]}
                onPress={() => {
                  drawing.setTool('brush');
                  setShowToolPicker(false);
                }}
              >
                <Text style={styles.pickerOptionIcon}>🖌️</Text>
                <Text style={styles.pickerOptionText}>{t('game.draw.toolBrush')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pickerOption, drawing.tool === 'fill' && styles.pickerOptionActive]}
                onPress={() => {
                  drawing.setTool('fill');
                  setShowToolPicker(false);
                }}
              >
                <Text style={styles.pickerOptionIcon}>🪣</Text>
                <Text style={styles.pickerOptionText}>{t('game.draw.toolFill')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Stroke Width Picker Modal */}
      <Modal
        visible={showStrokeWidthPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStrokeWidthPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModal}>
            <Text style={styles.pickerTitle}>{t('game.draw.strokeWidth')}</Text>
            <View style={styles.pickerOptions}>
              <TouchableOpacity
                style={[styles.pickerOption, drawing.strokeWidth === 2 && styles.pickerOptionActive]}
                onPress={() => {
                  drawing.setStrokeWidth(2);
                  setShowStrokeWidthPicker(false);
                }}
              >
                <View style={[styles.strokePreviewLine, { height: 2 }]} />
                <Text style={styles.pickerOptionText}>{t('game.draw.strokeWidthThin')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pickerOption, drawing.strokeWidth === 3 && styles.pickerOptionActive]}
                onPress={() => {
                  drawing.setStrokeWidth(3);
                  setShowStrokeWidthPicker(false);
                }}
              >
                <View style={[styles.strokePreviewLine, { height: 3 }]} />
                <Text style={styles.pickerOptionText}>{t('game.draw.strokeWidthNormal')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pickerOption, drawing.strokeWidth === 5 && styles.pickerOptionActive]}
                onPress={() => {
                  drawing.setStrokeWidth(5);
                  setShowStrokeWidthPicker(false);
                }}
              >
                <View style={[styles.strokePreviewLine, { height: 5 }]} />
                <Text style={styles.pickerOptionText}>{t('game.draw.strokeWidthThick')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Phase Content */}
      {phase === 'memorize' && renderMemorizePhase()}
      {phase === 'draw' && renderDrawPhase()}
      {phase === 'result' && renderResultPhase()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  backButton: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
    minWidth: 80,
  },
  levelBadge: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    ...Colors.shadow.small, // Soft & Modern: Subtiler Schatten für Badge
  },
  phaseContainer: {
    flex: 1,
    padding: Spacing.md, // Reduced from lg
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
    ...Colors.shadow.large, // Soft & Modern: Timer mit prominentem Schatten
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
    borderRadius: BorderRadius.xxl, // xl → xxl (20px → 24px für große Cards)
    alignItems: 'center',
    justifyContent: 'center',
    ...Colors.shadow.large, // Soft & Modern: Cards mit prominentem Schatten
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
  canvasContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPickerContainer: {
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  colorPickerLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  colorPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    gap: Spacing.md,
    minWidth: 200,
    ...Colors.shadow.small,
  },
  selectedColorPreview: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  colorPickerButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  colorPickerModal: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xxl,
    width: '100%',
    maxWidth: 400,
    padding: Spacing.lg,
    ...Colors.shadow.large,
  },
  colorPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  colorPickerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
    maxWidth: 280, // 3 Spalten: 3 * 70 + 2 * 12 (gaps)
  },
  colorBoxLarge: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.lg,
    borderWidth: 3,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...Colors.shadow.small,
  },
  colorBoxLargeSelected: {
    borderWidth: 4,
    borderColor: Colors.primary,
    transform: [{ scale: 1.05 }],
    ...Colors.shadow.medium,
  },
  colorBoxCheckmark: {
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    textShadowColor: Colors.background,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  // Kompakte Toolbar Styles
  compactToolbar: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginVertical: Spacing.sm,
  },
  toolbarButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    minHeight: 60,
  },
  toolbarColorPreview: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: 4,
  },
  toolbarIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  toolbarStrokePreview: {
    width: 30,
    backgroundColor: Colors.text.primary,
    borderRadius: 2,
    marginBottom: 4,
  },
  toolbarButtonText: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  // Picker Modal Styles
  pickerModal: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    width: '80%',
    maxWidth: 300,
  },
  pickerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  pickerOptions: {
    gap: Spacing.sm,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  pickerOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '20',
  },
  pickerOptionIcon: {
    fontSize: 32,
  },
  pickerOptionText: {
    fontSize: FontSize.md,
    color: Colors.text.primary,
    flex: 1,
  },
  strokePreviewLine: {
    width: 40,
    backgroundColor: Colors.text.primary,
    borderRadius: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    minHeight: 48,
    justifyContent: 'center',
    ...Colors.shadow.small,
  },
  actionButtonPrimary: {
    backgroundColor: Colors.primary,
  },
  actionButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
    textAlign: 'center',
  },
  actionButtonPrimaryText: {
    color: Colors.background,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    ...Colors.shadow.medium, // Soft & Modern: Weiche Schatten
  },
  primaryButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.background,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    minHeight: 48,
    justifyContent: 'center',
    ...Colors.shadow.small, // Soft & Modern: Subtile Schatten für sekundäre Buttons
  },
  buttonDisabled: {
    opacity: 0.4,
    borderColor: Colors.text.light,
  },
  secondaryButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  resultContent: {
    padding: Spacing.md,
  },
  starsContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  starsContainerSmall: {
    marginBottom: Spacing.sm,
  },
  starsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  starBox: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.stars.empty,
    ...Colors.shadow.small, // Soft & Modern: Subtile Schatten für Sterne
  },
  starBoxFilled: {
    backgroundColor: Colors.stars.filled,
    borderColor: Colors.stars.filled,
    ...Colors.shadow.medium, // Gefüllte Sterne mit stärkerem Schatten
  },
  starText: {
    fontSize: 28,
    color: Colors.stars.empty,
  },
  starTextFilled: {
    color: Colors.drawing.white,
  },
  ratingText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.success,
    marginBottom: Spacing.sm,
  },
  feedbackText: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  comparisonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    justifyContent: 'center',
  },
  comparisonBox: {
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  comparisonImage: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl, // lg → xl (16px → 20px für Cards)
    justifyContent: 'center',
    alignItems: 'center',
    ...Colors.shadow.medium, // Soft & Modern: Weiche Schatten für Vergleichs-Container
  },
  placeholderText: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
  },
  settingsButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
  },
  settingsIcon: {
    fontSize: 24,
    color: Colors.text.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
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
  canvasIconRow: {
    position: 'absolute',
    bottom: Spacing.xs,
    right: Spacing.xs,
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  canvasIconButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Colors.shadow.small,
  },
  canvasIconButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  canvasIconButtonSaved: {
    backgroundColor: Colors.success + '20',
    borderColor: Colors.success,
  },
  canvasIconText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
  canvasIconTextActive: {
    color: Colors.background,
  },
  canvasIconTextSaved: {
    color: Colors.success,
  },
  toolContainer: {
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  toolLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  toolButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  toolButton: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
    minWidth: 80,
  },
  toolButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toolButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  },
  toolButtonTextActive: {
    color: Colors.background,
  },
  strokeWidthContainer: {
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  strokeWidthLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  strokeWidthButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  strokeWidthButton: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
    minWidth: 70,
  },
  strokeWidthButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  strokeWidthPreview: {
    width: 40,
    backgroundColor: Colors.text.primary,
    borderRadius: 2,
    marginBottom: Spacing.xs,
  },
  strokeWidthButtonText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.text.primary,
  },
  strokeWidthButtonTextActive: {
    color: Colors.background,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 24,
    color: Colors.text.secondary,
  },
  buttonTextSmall: {
    fontSize: FontSize.md,
  },
});
