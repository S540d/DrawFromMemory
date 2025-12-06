import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { getRandomImageForLevel } from '../services/ImagePoolManager';
import { getLevel } from '../services/LevelManager';
import { t } from '../services/i18n';
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
  const [phase, setPhase] = useState<GamePhase>('memorize');
  const [levelNumber] = useState(1); // Start mit Level 1
  const [currentImage, setCurrentImage] = useState<LevelImage | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // Drawing Canvas Hook
  const drawing = useDrawingCanvas();

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

      <Text style={styles.hint}>Merke dir das Bild gut!</Text>
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
          paths={drawing.paths}
          onDrawingChange={drawing.setPaths}
        />
      </View>

      {/* Farb-Palette (funktional) */}
      <View style={styles.colorPalette}>
        {DrawingColors.map((colorItem) => (
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
        ))}
      </View>

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
          style={styles.secondaryButton}
          onPress={() => {
            Alert.alert(
              'Alles löschen?',
              'Möchtest du wirklich die gesamte Zeichnung löschen?',
              [
                { text: 'Abbrechen', style: 'cancel' },
                { text: 'Löschen', style: 'destructive', onPress: drawing.clearCanvas },
              ]
            );
          }}
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

  // Render Star Rating
  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <View
            key={star}
            style={[
              styles.starBox,
              star <= rating && styles.starBoxFilled,
            ]}
          >
            <Text style={[
              styles.starText,
              star <= rating && styles.starTextFilled,
            ]}>
              ★
            </Text>
          </View>
        ))}
      </View>
    );
  };

  // Render Result Phase
  const renderResultPhase = () => (
    <View style={styles.phaseContainer}>
      <Text style={styles.phaseTitle}>Ergebnis</Text>

      {/* Sterne-Bewertung Mockup */}
      <View style={styles.starsContainer}>
        {renderStars(5)}
        <Text style={styles.ratingText}>5 Sterne!</Text>
        <Text style={styles.feedbackText}>Perfekt! Du bist ein Gedächtnis-Meister!</Text>
      </View>

      {/* Vergleich Mockup */}
      <View style={styles.comparisonContainer}>
        <View style={styles.comparisonBox}>
          <Text style={styles.comparisonLabel}>Original</Text>
          <View style={styles.comparisonImage}>
            {currentImage && (
              <LevelImageDisplay image={currentImage} size={120} />
            )}
          </View>
        </View>
        <View style={styles.comparisonBox}>
          <Text style={styles.comparisonLabel}>Deine Zeichnung</Text>
          <View style={styles.comparisonImage}>
            <Text style={styles.placeholderText}>Zeichnung</Text>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonColumn}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            // Reset für nächstes Level
            setPhase('memorize');
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Zurück</Text>
        </TouchableOpacity>
        <Text style={styles.levelBadge}>Level {levelNumber}</Text>
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
    position: 'relative',
  },
  backButton: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  levelBadge: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
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
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    minWidth: 300,
    minHeight: 300,
    justifyContent: 'center',
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
  hint: {
    fontSize: FontSize.lg,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.lg,
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
    borderColor: '#DDD',
  },
  colorBoxSelected: {
    borderWidth: 4,
    borderColor: Colors.primary,
    transform: [{ scale: 1.1 }],
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
  },
  starBoxFilled: {
    backgroundColor: Colors.stars.filled,
    borderColor: Colors.stars.filled,
  },
  starText: {
    fontSize: 28,
    color: Colors.stars.empty,
  },
  starTextFilled: {
    color: '#FFF',
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
  },
  comparisonBox: {
    flex: 1,
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
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
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
    position: 'absolute',
    right: Spacing.lg,
  },
  settingsIcon: {
    fontSize: 24,
    color: Colors.text.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  settingsModal: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    width: '100%',
    maxWidth: 400,
    padding: Spacing.lg,
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
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
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
});
