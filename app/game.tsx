import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, useWindowDimensions, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getRandomImageForLevel } from '../services/ImagePoolManager';
import { getLevel, getTotalLevels } from '../services/LevelManager';
import { t, getCurrentLanguage } from '../services/i18n';
import { useTheme } from '../services/ThemeContext';
import storageManager from '../services/StorageManager';
import { DrawingColors } from '../constants/Colors';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/Layout';
import LevelImageDisplay from '../components/LevelImageDisplay';
import DrawingCanvas, { useDrawingCanvas } from '../components/DrawingCanvas';
import SettingsModal from '../components/SettingsModal';
import { ErrorBoundary } from '../components/ErrorBoundary';
import type { GamePhase, LevelImage } from '../types';

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
  // Use hook for responsive dimensions (SSR-safe)
  const { width: screenWidth } = useWindowDimensions();
  const [phase, setPhase] = useState<GamePhase>('memorize');
  // Level aus URL-Parameter auslesen, falls vorhanden, und validieren
  const parsedLevel = params.level ? parseInt(params.level as string, 10) : 1;
  const totalLevels = getTotalLevels();
  const initialLevel =
    !isNaN(parsedLevel) && parsedLevel >= 1 && parsedLevel <= totalLevels
      ? parsedLevel
      : 1;
  const [levelNumber, setLevelNumber] = useState(initialLevel);
  const [currentImage, setCurrentImage] = useState<LevelImage | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showToolPicker, setShowToolPicker] = useState(false);
  const [showStrokeWidthPicker, setShowStrokeWidthPicker] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);

  // Drawing Canvas Hook
  const drawing = useDrawingCanvas();

  // Get current language for accessibility
  const currentLang = getCurrentLanguage();

  // Speichere Fortschritt wenn Bewertung abgegeben wird
  const handleRatingSubmit = async (rating: number) => {
    try {
      setUserRating(rating);
      await storageManager.saveLevelProgress(levelNumber, rating);
    } catch (error) {
      console.error('Error saving rating:', error);
    }
  };

  // Funktion zum Starten des nächsten Levels
  const startNextLevel = () => {
    try {
      const nextLevel = levelNumber + 1;
      if (nextLevel <= getTotalLevels()) {
        setLevelNumber(nextLevel);
        setPhase('memorize');
        setUserRating(0);
        drawing.clearCanvas();
        const image = getRandomImageForLevel(nextLevel);
        const level = getLevel(nextLevel);
        setCurrentImage(image);
        setTimeRemaining(level.displayDuration);
      }
    } catch (error) {
      console.error('Error starting next level:', error);
    }
  };

  // Funktion zum Starten des vorherigen Levels
  const startPreviousLevel = () => {
    try {
      const prevLevel = levelNumber - 1;
      if (prevLevel >= 1) {
        setLevelNumber(prevLevel);
        setPhase('memorize');
        setUserRating(0);
        drawing.clearCanvas();
        const image = getRandomImageForLevel(prevLevel);
        const level = getLevel(prevLevel);
        setCurrentImage(image);
        setTimeRemaining(level.displayDuration);
      }
    } catch (error) {
      console.error('Error starting previous level:', error);
    }
  };

  // Initialisiere Level und Bild beim Start
  useEffect(() => {
    try {
      const level = getLevel(levelNumber);
      const image = getRandomImageForLevel(levelNumber);
      setCurrentImage(image);
      setTimeRemaining(level.displayDuration);
    } catch (error) {
      console.error('Error initializing level:', error);
      // Fallback: Zurück zum Menü bei kritischem Fehler
      router.back();
    }
  }, [levelNumber]);

  // Timer für Memorize-Phase
  useEffect(() => {
    if (phase === 'memorize' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'memorize' && timeRemaining === 0 && currentImage) {
      // Timer abgelaufen -> zur Draw-Phase
      const transitionTimer = setTimeout(() => setPhase('draw'), 500);
      return () => clearTimeout(transitionTimer);
    }
  }, [phase, timeRemaining, currentImage]);

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
          <View style={styles.imagePlaceholder}>
            <LevelImageDisplay image={currentImage} size={280} />
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
  const renderDrawPhase = () => (
    <View style={styles.phaseContainer}>
      <Text style={styles.phaseTitle}>{t('game.draw.title')}</Text>

      {/* Zeichenfläche mit react-native-skia */}
      <View style={styles.canvasContainer}>
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
      <View style={styles.compactToolbar}>
        {/* Farbe */}
        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={() => setShowColorPicker(true)}
          accessibilityLabel={t('game.draw.selectColor')}
          accessibilityRole="button"
        >
          <View style={[styles.toolbarColorPreview, { backgroundColor: drawing.color }]} />
          <Text style={styles.toolbarButtonText}>{t('game.draw.color')}</Text>
        </TouchableOpacity>

        {/* Werkzeug */}
        <TouchableOpacity
          style={styles.toolbarButton}
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
            style={styles.toolbarButton}
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
          style={styles.secondaryButton}
          onPress={drawing.undo}
          disabled={drawing.paths.length === 0}
          accessibilityLabel={t('game.draw.undo')}
          accessibilityRole="button"
        >
          <Text style={styles.secondaryButtonText}>Rückgängig</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryButton, drawing.paths.length === 0 && styles.buttonDisabled]}
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
          <Text style={styles.secondaryButtonText}>Löschen</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setPhase('result')}
        >
          <Text style={styles.primaryButtonText}>Fertig</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
      <View style={styles.phaseContainer}>
        <Text style={styles.phaseTitle}>Ergebnis</Text>

        {/* Sterne-Bewertung Interaktiv */}
        <View style={styles.starsContainer}>
          {renderStars(userRating, true)}
          {userRating > 0 && (
            <>
              <Text style={styles.ratingText}>{userRating} Stern{userRating !== 1 ? 'e' : ''}!</Text>
              <Text style={styles.feedbackText}>{getFeedbackText(userRating)}</Text>
            </>
          )}
          {userRating === 0 && (
            <Text style={styles.feedbackText}>Tippe auf die Sterne, um dich zu bewerten!</Text>
          )}
        </View>

        {/* Vergleich */}
        <View style={styles.comparisonContainer}>
          <View style={styles.comparisonBox}>
            <Text style={styles.comparisonLabel}>Original</Text>
            <View style={[styles.comparisonImage, { width: imageSize, height: imageSize }]}>
              {currentImage && (
                <LevelImageDisplay image={currentImage} size={imageSize} />
              )}
            </View>
          </View>
          <View style={styles.comparisonBox}>
            <Text style={styles.comparisonLabel}>Deine Zeichnung</Text>
            <View style={[styles.comparisonImage, { width: imageSize, height: imageSize }]}>
              <DrawingCanvas
                width={imageSize}
                height={imageSize}
                paths={drawing.paths}
                strokeColor={Colors.drawing.black}
                strokeWidth={2}
              />
            </View>
          </View>
        </View>

        {/* Level Navigation */}
        <View style={styles.levelNavigation}>
          <TouchableOpacity
            style={[styles.navButton, levelNumber <= 1 && styles.navButtonDisabled]}
            onPress={startPreviousLevel}
            disabled={levelNumber <= 1}
          >
            <Text style={[styles.navButtonText, levelNumber <= 1 && styles.navButtonTextDisabled]}>← Zurück</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, levelNumber >= getTotalLevels() && styles.navButtonDisabled]}
            onPress={startNextLevel}
            disabled={levelNumber >= getTotalLevels()}
          >
            <Text style={[styles.navButtonText, levelNumber >= getTotalLevels() && styles.navButtonTextDisabled]}>Weiter →</Text>
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <View style={styles.buttonColumn}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              try {
                // Reset für aktuelles Level
                setPhase('memorize');
                setUserRating(0);
                drawing.clearCanvas();
                const image = getRandomImageForLevel(levelNumber);
                const level = getLevel(levelNumber);
                setCurrentImage(image);
                setTimeRemaining(level.displayDuration);
              } catch (error) {
                console.error('Error restarting level:', error);
              }
            }}
          >
            <Text style={styles.primaryButtonText}>Nochmal versuchen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>Zum Menü</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
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
    padding: Spacing.lg,
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
    fontSize: FontSize.xl, // Reduced from xxl
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md, // Reduced spacing
    textAlign: 'center',
  },
  timerContainer: {
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
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
    padding: Spacing.xxl,
    borderRadius: BorderRadius.xxl, // xl → xxl (20px → 24px für große Cards)
    alignItems: 'center',
    minWidth: 300,
    minHeight: 300,
    justifyContent: 'center',
    ...Colors.shadow.large, // Soft & Modern: Cards mit prominentem Schatten
  },
  imageName: {
    fontSize: FontSize.xl,
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
    minHeight: 250, // Mindesthöhe für Canvas
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.lg,
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
  buttonColumn: {
    gap: Spacing.md,
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
    fontSize: FontSize.lg,
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
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  starsContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
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
    fontSize: FontSize.xxl,
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
    marginBottom: Spacing.xxl,
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
  levelNavigation: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    justifyContent: 'center',
  },
  navButton: {
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
    ...Colors.shadow.small, // Soft & Modern: Subtile Schatten für Navigation
  },
  navButtonDisabled: {
    backgroundColor: Colors.surface,
    borderColor: Colors.text.light,
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  navButtonTextDisabled: {
    color: Colors.text.light,
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
});
