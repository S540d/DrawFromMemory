import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, Platform, ScrollView, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScreenLayout } from '@utils/useScreenLayout';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getTotalLevels } from '@services/LevelManager';
import { useTranslation, getCurrentLanguage } from '@services/i18n';
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
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const layout = useScreenLayout();
  const { screenWidth, isSmall } = layout;
  const [showSettings, setShowSettings] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [hasUsedHint, setHasUsedHint] = useState(false);

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

  // Reset hint joker when level changes
  const handleRestartCurrentLevel = () => {
    setHasUsedHint(false);
    restartCurrentLevel();
  };

  const handleStartNextLevel = () => {
    setHasUsedHint(false);
    startNextLevel();
  };

  const handleRestartFromLevel1 = () => {
    setHasUsedHint(false);
    restartFromLevel1();
  };

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
            <Text style={styles.imageName}>{currentLang === 'en' ? currentImage.displayNameEn : currentImage.displayName}</Text>
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
    const levelName = currentLang === 'en' ? currentImage?.displayNameEn : currentImage?.displayName;
    return (
    <View style={styles.phaseContainer}>
      {/* Info-Streifen: Aufgabe + Hint-Joker */}
      <View style={styles.infoStrip}>
        <View style={styles.infoStripCenter}>
          <Text style={styles.infoStripLabel}>{t('game.draw.referenceLabel')}</Text>
          <Text style={styles.infoStripText} numberOfLines={2}>
            {t('game.draw.drawFromMemory')}{levelName ? ` — ${levelName}` : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.hintButton, hasUsedHint && styles.hintButtonUsed]}
          onPress={() => {
            if (!hasUsedHint) {
              setHasUsedHint(true);
              setShowHintModal(true);
            }
          }}
          disabled={hasUsedHint}
          accessibilityLabel={hasUsedHint ? t('game.draw.hintUsed') : t('game.draw.hintButton')}
          accessibilityRole="button"
        >
          <Text style={styles.hintButtonIcon}>👁</Text>
        </TouchableOpacity>
      </View>

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

      {/* Toolbar-Gruppe */}
      <View style={[styles.toolbarGroup, dynToolbar]}>
        {/* Reihe 1: Inline-Farbreihe */}
        <FlatList
          data={DrawingColors}
          keyExtractor={(item) => item.hex}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.colorRowContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.inlineColorSwatch,
                item.border && { borderColor: item.border },
                drawing.color === item.hex && styles.inlineColorSwatchActive,
              ]}
              onPress={() => drawing.setColor(item.hex)}
              accessibilityLabel={currentLang === 'de' ? item.name : item.nameEn}
              accessibilityRole="button"
            >
              <View style={[styles.inlineColorSwatchInner, { backgroundColor: item.hex }]} />
              {drawing.color === item.hex && (
                <Text style={styles.inlineColorCheckmark}>✓</Text>
              )}
            </TouchableOpacity>
          )}
        />

        {/* Trennlinie */}
        <View style={styles.toolbarDivider} />

        {/* Reihe 2: Pen/Fill + Strichstärken in einer Zeile */}
        <View style={styles.toolRow}>
          {/* Pen/Fill Toggle */}
          <TouchableOpacity
            style={[styles.toolToggleButton, drawing.tool === 'brush' && styles.toolToggleButtonActive]}
            onPress={() => drawing.setTool('brush')}
            accessibilityLabel={t('game.draw.toolBrush')}
            accessibilityRole="button"
          >
            <Text style={styles.toolToggleIcon}>🖌️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toolToggleButton, drawing.tool === 'fill' && styles.toolToggleButtonActive]}
            onPress={() => drawing.setTool('fill')}
            accessibilityLabel={t('game.draw.toolFill')}
            accessibilityRole="button"
          >
            <Text style={styles.toolToggleIcon}>🪣</Text>
          </TouchableOpacity>

          {/* Vertikaler Trenner */}
          <View style={styles.toolRowSeparator} />

          {/* Strichstärken-Circles */}
          {([2, 3, 5] as const).map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.strokeCircleButton,
                drawing.tool === 'fill' && styles.strokeCircleDisabled,
              ]}
              onPress={() => { if (drawing.tool !== 'fill') drawing.setStrokeWidth(size); }}
              disabled={drawing.tool === 'fill'}
              accessibilityLabel={`${t('game.draw.strokeWidth')} ${size}`}
              accessibilityRole="button"
            >
              <View style={[
                styles.strokeCircle,
                {
                  width: size === 2 ? 10 : size === 3 ? 16 : 22,
                  height: size === 2 ? 10 : size === 3 ? 16 : 22,
                  backgroundColor: drawing.strokeWidth === size && drawing.tool !== 'fill'
                    ? drawing.color
                    : Colors.text.secondary,
                },
              ]} />
            </TouchableOpacity>
          ))}
        </View>
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
              if (drawing.paths.length > 0 && window.confirm('Möchtest du wirklich die gesamte Zeichnung löschen?')) { // platform-safe
                drawing.setPaths([]);
              }
            } else {
              if (drawing.paths.length === 0) return;
              Alert.alert(
                'Alles löschen?',
                'Möchtest du wirklich die gesamte Zeichnung löschen?',
                [
                  { text: 'Abbrechen', style: 'cancel' },
                  {
                    text: 'Löschen',
                    style: 'destructive',
                    onPress: () => { drawing.setPaths([]); },
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

  // Render Result Phase
  const renderResultPhase = () => {
    const getFeedbackText = (rating: number) => {
      if (rating === 5) return t('game.result.feedback5');
      if (rating === 4) return t('game.result.feedback4');
      if (rating === 3) return t('game.result.feedback3');
      if (rating >= 1) return t('game.result.feedback1');
      return t('game.result.tapStars');
    };

    // Bildgröße: 44% der Bildschirmbreite, min 140px, max 220px
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
                paths={isReplaying ? replayPaths : drawing.paths}
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
              <TouchableOpacity
                key={star}
                onPress={() => handleRatingSubmit(star)}
                accessibilityRole="button"
                accessibilityLabel={`${star} Stern${star !== 1 ? 'e' : ''}`}
              >
                <Text style={[styles.starEmoji, star <= userRating && styles.starEmojiActive]}>
                  ⭐
                </Text>
              </TouchableOpacity>
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
            onPress={isReplaying ? () => setIsReplaying(false) : startReplay}
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
            onPress={saveToGallery}
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
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonPrimary]} onPress={handleStartNextLevel}>
              <Text style={[styles.actionButtonText, styles.actionButtonPrimaryText]}>→</Text>
              <Text style={[styles.actionButtonLabel, styles.actionButtonPrimaryText]}>{t('game.result.nextLevel')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonPrimary]} onPress={handleRestartFromLevel1}>
              <Text style={[styles.actionButtonText, styles.actionButtonPrimaryText]}>🔄</Text>
              <Text style={[styles.actionButtonLabel, styles.actionButtonPrimaryText]}>{t('game.result.playAgain')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  };

  const levelName = currentLang === 'en' ? currentImage?.displayNameEn : currentImage?.displayName;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Header — Referenz-Design: Titel + Level-Info links, Progress-Dots + Settings rechts */}
      <View style={[styles.header, { paddingTop: insets.top + 8, paddingHorizontal: layout.headerPaddingHorizontal, paddingBottom: Spacing.sm }]}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Text style={styles.headerTitle}>Merke & Male</Text>
          <Text style={styles.headerSub}>Level {levelNumber}{levelName ? ` · ${levelName}` : ''}</Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <View style={styles.progressDots}>
            {Array.from({ length: Math.min(getTotalLevels(), 5) }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  i < levelNumber - 1 && styles.progressDotDone,
                  i === levelNumber - 1 && styles.progressDotCurrent,
                ]}
              />
            ))}
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
      </View>

      {/* Pill-Tabs: ✏️ Zeichnen / 🎨 Ergebnis */}
      {(phase === 'draw' || phase === 'result') && (
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, phase === 'draw' && styles.tabActive]}
            onPress={() => phase === 'result' && setPhase('draw')}
            accessibilityRole="tab"
          >
            <Text style={[styles.tabText, phase === 'draw' && styles.tabTextActive]}>✏️ {t('game.tabs.draw')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, phase === 'result' && styles.tabActive]}
            onPress={() => phase === 'draw' && setPhase('result')}
            accessibilityRole="tab"
          >
            <Text style={[styles.tabText, phase === 'result' && styles.tabTextActive]}>🎨 {t('game.tabs.result')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Settings Modal */}
      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />

      {/* Hint Modal — Vorlage einmal ansehen */}
      <Modal
        visible={showHintModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHintModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowHintModal(false)}
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
        >
          <View style={styles.hintModal}>
            <View style={styles.hintModalHeader}>
              <Text style={styles.hintModalTitle}>{t('game.draw.hintModalTitle')}</Text>
              <TouchableOpacity onPress={() => setShowHintModal(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
            {currentImage && (
              <ErrorBoundary>
                <LevelImageDisplay image={currentImage} size={Math.min(screenWidth - 80, 300)} />
              </ErrorBoundary>
            )}
          </View>
        </TouchableOpacity>
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
    paddingHorizontal: Spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    lineHeight: 26,
  },
  headerSub: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd5c8',
  },
  progressDotDone: {
    backgroundColor: Colors.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  progressDotCurrent: {
    backgroundColor: Colors.secondary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    padding: 4,
    gap: 0,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: Colors.surface,
    ...Colors.shadow.small,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text.secondary,
  },
  tabTextActive: {
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
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
  // Toolbar-Gruppe Styles
  toolbarGroup: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.xl,
    padding: Spacing.sm,
    marginVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  colorRowContent: {
    gap: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
  },
  inlineColorSwatch: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  inlineColorSwatchActive: {
    borderColor: Colors.primary,
    borderWidth: 3,
    transform: [{ scale: 1.15 }],
  },
  inlineColorSwatchInner: {
    ...StyleSheet.absoluteFillObject,
  },
  inlineColorCheckmark: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    textShadowColor: Colors.background,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  toolbarDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xs,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  toolToggleButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  toolToggleButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toolToggleIcon: {
    fontSize: 20,
  },
  toolRowSeparator: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xs,
  },
  strokeCircleButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strokeCircle: {
    borderRadius: 999,
  },
  strokeCircleDisabled: {
    opacity: 0.35,
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
  resultScrollView: {
    flex: 1,
  },
  resultContent: {
    padding: Spacing.md,
    flexGrow: 1,
  },
  starsTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  starsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Colors.shadow.small,
  },
  starsContainerSmall: {
    marginBottom: Spacing.sm,
  },
  starsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  starEmoji: {
    fontSize: 36,
    opacity: 0.3,
  },
  starEmojiActive: {
    opacity: 1,
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
  // Info-Streifen (Draw Phase)
  infoStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.sm,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Colors.shadow.small,
  },
  infoStripCenter: {
    flex: 1,
  },
  infoStripLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  infoStripText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  hintButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    ...Colors.shadow.small,
  },
  hintButtonUsed: {
    backgroundColor: Colors.border,
    opacity: 0.5,
  },
  hintButtonIcon: {
    fontSize: 20,
  },
  // Hint Modal
  hintModal: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
    width: '90%',
    maxWidth: 380,
    alignItems: 'center',
    ...Colors.shadow.large,
  },
  hintModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.md,
  },
  hintModalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
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
