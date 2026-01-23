import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { getRandomImageForLevel } from '../services/ImagePoolManager';
import { getLevel, getTotalLevels } from '../services/LevelManager';
import { t } from '../services/i18n';
import { useTheme } from '../services/ThemeContext';
import storageManager from '../services/StorageManager';
import { DrawingColors } from '../constants/Colors';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/Layout';
import LevelImageDisplay from '../components/LevelImageDisplay';
import DrawingCanvas, { useDrawingCanvas } from '../components/DrawingCanvas';
import type { GamePhase, LevelImage } from '../types';

/**
 * Game Screen - Hauptspiel mit 3 Phasen
 * Phase 1: Memorize (Bild anzeigen mit Timer)
 * Phase 2: Draw (Zeichnen - noch nicht implementiert)
 * Phase 3: Result (Bewertung - noch nicht implementiert)
 */
export default function GameScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [phase, setPhase] = useState<GamePhase>('memorize');
  const [levelNumber, setLevelNumber] = useState(1); // Start mit Level 1
  const [currentImage, setCurrentImage] = useState<LevelImage | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);

  // Drawing Canvas Hook
  const drawing = useDrawingCanvas();

  // Speichere Fortschritt wenn Bewertung abgegeben wird
  const handleRatingSubmit = async (rating: number) => {
    setUserRating(rating);
    await storageManager.saveLevelProgress(levelNumber, rating);
  };

  // Funktion zum Starten des nächsten Levels
  const startNextLevel = () => {
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
  };

  // Funktion zum Starten des vorherigen Levels
  const startPreviousLevel = () => {
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
  };

  // Initialisiere Level und Bild beim Start
  useEffect(() => {
    const level = getLevel(levelNumber);
    const image = getRandomImageForLevel(levelNumber);
    setCurrentImage(image);
    setTimeRemaining(level.displayDuration);
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
      setTimeout(() => setPhase('draw'), 500);
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
        <DrawingCanvas
          strokeColor={drawing.color}
          strokeWidth={drawing.strokeWidth}
          tool={drawing.tool}
          paths={drawing.paths}
          onDrawingChange={drawing.setPaths}
        />
      </View>

      {/* Farb-Palette (gefiltert basierend auf Bilderfarben) */}
      <View style={styles.colorPalette}>
        {(() => {
          // Farben für dieses Bild bestimmen
          const availableColors = currentImage?.colors || DrawingColors.map(c => c.hex);
          // DrawingColors auf verfügbare Farben filtern
          const filteredColors = DrawingColors.filter(colorItem =>
            availableColors.includes(colorItem.hex)
          );
          return filteredColors.map((colorItem) => (
            <TouchableOpacity
              key={colorItem.hex}
              style={[
                styles.colorBox,
                { backgroundColor: colorItem.hex },
                colorItem.border && { borderColor: colorItem.border },
                drawing.color === colorItem.hex && styles.colorBoxSelected,
              ]}
              onPress={() => drawing.setColor(colorItem.hex)}
            />
          ));
        })()}
      </View>

      {/* Tool-Auswahl: Pinsel / Füllen */}
      <View style={styles.toolContainer}>
        <Text style={styles.toolLabel}>{t('game.draw.tool')}:</Text>
        <View style={styles.toolButtons}>
          <TouchableOpacity
            style={[styles.toolButton, drawing.tool === 'brush' && styles.toolButtonActive]}
            onPress={() => drawing.setTool('brush')}
          >
            <Text style={[styles.toolButtonText, drawing.tool === 'brush' && styles.toolButtonTextActive]}>{t('game.draw.toolBrush')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toolButton, drawing.tool === 'fill' && styles.toolButtonActive]}
            onPress={() => drawing.setTool('fill')}
          >
            <Text style={[styles.toolButtonText, drawing.tool === 'fill' && styles.toolButtonTextActive]}>{t('game.draw.toolFill')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Linienstärke-Auswahl (nur bei Pinsel-Werkzeug) */}
      {drawing.tool === 'brush' && (
        <View style={styles.strokeWidthContainer}>
          <Text style={styles.strokeWidthLabel}>{t('game.draw.strokeWidth')}:</Text>
          <View style={styles.strokeWidthButtons}>
            <TouchableOpacity
              style={[styles.strokeWidthButton, drawing.strokeWidth === 2 && styles.strokeWidthButtonActive]}
              onPress={() => drawing.setStrokeWidth(2)}
            >
              <View style={[styles.strokeWidthPreview, { height: 2 }]} />
              <Text style={[styles.strokeWidthButtonText, drawing.strokeWidth === 2 && styles.strokeWidthButtonTextActive]}>{t('game.draw.strokeWidthThin')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.strokeWidthButton, drawing.strokeWidth === 3 && styles.strokeWidthButtonActive]}
              onPress={() => drawing.setStrokeWidth(3)}
            >
              <View style={[styles.strokeWidthPreview, { height: 3 }]} />
              <Text style={[styles.strokeWidthButtonText, drawing.strokeWidth === 3 && styles.strokeWidthButtonTextActive]}>{t('game.draw.strokeWidthNormal')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.strokeWidthButton, drawing.strokeWidth === 5 && styles.strokeWidthButtonActive]}
              onPress={() => drawing.setStrokeWidth(5)}
            >
              <View style={[styles.strokeWidthPreview, { height: 5 }]} />
              <Text style={[styles.strokeWidthButtonText, drawing.strokeWidth === 5 && styles.strokeWidthButtonTextActive]}>{t('game.draw.strokeWidthThick')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={drawing.undo}
          disabled={drawing.paths.length === 0}
        >
          <Text style={styles.secondaryButtonText}>Rückgängig</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryButton, drawing.paths.length === 0 && styles.buttonDisabled]}
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
    const screenWidth = Dimensions.get('window').width;
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
              // Reset für aktuelles Level
              setPhase('memorize');
              setUserRating(0);
              drawing.clearCanvas();
              const image = getRandomImageForLevel(levelNumber);
              const level = getLevel(levelNumber);
              setCurrentImage(image);
              setTimeRemaining(level.displayDuration);
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
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Zurück</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.levelBadge}>Level {levelNumber}</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowSettings(true)}
          style={styles.settingsButton}
          aria-label="Settings"
        >
          <Text style={styles.settingsIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.settingsModal}>
            {/* Header */}
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsTitle}>Settings</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Appearance Section */}
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>APPEARANCE</Text>

              {/* Theme Toggle */}
              <Text style={styles.settingLabel}>Theme</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity style={[styles.toggleButton, styles.toggleButtonActive]}>
                  <Text style={[styles.toggleText, styles.toggleTextActive]}>Light</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toggleButton}>
                  <Text style={styles.toggleText}>Dark</Text>
                </TouchableOpacity>
              </View>

              {/* Language Toggle */}
              <Text style={styles.settingLabel}>Language</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity style={[styles.toggleButton, styles.toggleButtonActive]}>
                  <Text style={[styles.toggleText, styles.toggleTextActive]}>Deutsch</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toggleButton}>
                  <Text style={styles.toggleText}>English</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Support Section */}
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>SUPPORT</Text>
              <TouchableOpacity style={styles.linkButton}>
                <Text style={styles.linkText}>Fehler melden / Send Feedback</Text>
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
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  phaseTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  colorPalette: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    flexWrap: 'wrap',
  },
  colorBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    ...Colors.shadow.small, // Soft & Modern: Subtile Schatten für Farb-Boxen
  },
  colorBoxSelected: {
    borderWidth: 4,
    borderColor: Colors.primary,
    transform: [{ scale: 1.1 }],
    ...Colors.shadow.medium, // Ausgewählte Farbe mit stärkerem Schatten
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
  settingsModal: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xxl, // xl → xxl (20px → 24px für große Modals)
    width: '100%',
    maxWidth: 400,
    padding: Spacing.lg,
    ...Colors.shadow.large, // Soft & Modern: Prominenter Schatten für Modals
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  settingsTitle: {
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
  settingsSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  settingLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  toggleButton: {
    flex: 1,
    height: 40,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surface,
    ...Colors.shadow.small, // Soft & Modern: Subtile Schatten
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    ...Colors.shadow.medium, // Aktiver Toggle mit stärkerem Schatten
  },
  toggleText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text.secondary,
  },
  toggleTextActive: {
    color: Colors.background,
  },
  linkButton: {
    paddingVertical: Spacing.md,
  },
  linkText: {
    fontSize: FontSize.md,
    color: Colors.primary,
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
});
