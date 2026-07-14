import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScreenLayout } from '@utils/useScreenLayout';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getTotalLevels, getDifficultyForLevel } from '@services/LevelManager';
import { useTranslation, getLanguage } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/Layout';
import { FeatureFlags } from '../constants/featureFlags';
import LevelImageDisplay from '@components/LevelImageDisplay';
import DrawingCanvas, { useDrawingCanvas } from '@components/DrawingCanvas';
import SettingsModal from '@components/SettingsModal';
import { ErrorBoundary } from '@components/ErrorBoundary';
import ConfettiBurst from '@components/ConfettiBurst';
import BadgeUnlockToast from '@components/BadgeUnlockToast';
import MascotUnlockToast from '@components/MascotUnlockToast';
import TutorialOverlay from '@components/TutorialOverlay';
import { markOnboardingDone } from '@services/OnboardingManager';
import SoundManager from '@services/SoundManager';
import { useGamePhase } from '@services/useGamePhase';
import { checkAndUnlock, type AchievementDef } from '@services/AchievementManager';
import { getStreakData } from '@services/StreakManager';
import storageManager from '@services/StorageManager';
import { getAgeGroup, getDefaultStrokeWidthForAgeGroup } from '@services/AgeGroupManager';
import MemorizePhase from '@components/game/MemorizePhase';
import DrawPhase from '@components/game/DrawPhase';
import ResultPhase from '@components/game/ResultPhase';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useReduceMotion } from '../utils/useReduceMotion';
import type { GamePhase, GameVariant } from '../types';
import type { ConfettiIntensity } from '@components/ConfettiBurst';

export default function GameScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const layout = useScreenLayout();
  const { screenWidth, isSmall } = layout;
  const reduceMotion = useReduceMotion();
  const [showSettings, setShowSettings] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [hasUsedHint, setHasUsedHint] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationEnabled, setCelebrationEnabled] = useState(true);
  const [confettiIntensity, setConfettiIntensity] = useState<ConfettiIntensity>('full');
  const [unlockedBadge, setUnlockedBadge] = useState<AchievementDef | null>(null);
  const lastCheckedRatingRef = useRef<number>(0);
  const handleBadgeToastHide = useCallback(() => setUnlockedBadge(null), []);

  // Phase crossfade
  const [visiblePhase, setVisiblePhase] = useState<GamePhase>('memorize');
  const phaseOpacity = useSharedValue(1);
  const phaseAnimStyle = useAnimatedStyle(() => ({ opacity: phaseOpacity.value, flex: 1 }));

  const drawing = useDrawingCanvas();
  const currentLang = getLanguage();

  const parsedLevel = params.level ? parseInt(params.level as string, 10) : 1;
  const totalLevels = getTotalLevels();
  const initialLevel =
    !isNaN(parsedLevel) && parsedLevel >= 1 && parsedLevel <= totalLevels ? parsedLevel : 1;

  const isDailyChallenge = params.daily === '1';
  const variant: GameVariant =
    params.variant === 'outline' || params.variant === 'mirror' ? params.variant : 'normal';
  const pack = typeof params.pack === 'string' && params.pack !== 'all' ? params.pack : undefined;
  const [isTutorial, setIsTutorial] = useState(params.tutorial === '1');
  const [tutorialHintVisible, setTutorialHintVisible] = useState(true);

  const {
    phase,
    setPhase,
    levelNumber,
    currentImage,
    timeRemaining,
    displayDuration,
    userRating,
    revealStep,
    savedToGallery,
    isReplaying,
    setIsReplaying,
    replayPaths,
    newMascotUnlock,
    clearMascotUnlock,
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
    isDailyChallenge,
    pack,
  });

  useEffect(() => {
    if (phase === visiblePhase) return;

    if (reduceMotion) {
      setVisiblePhase(phase);
      return;
    }

    phaseOpacity.value = withTiming(0, { duration: 150 }, finished => {
      'worklet';
      if (finished) {
        runOnJS(setVisiblePhase)(phase);
        phaseOpacity.value = withTiming(1, { duration: 250 });
      }
    });
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

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

  useEffect(() => {
    async function init() {
      await SoundManager.init();
      const enabled = await storageManager.getSetting('celebrationEnabled');
      setCelebrationEnabled(enabled);
    }
    init();
  }, []);

  // Altersgerechte Standard-Strichstärke beim Rundenstart (Issue #279, 1.3)
  useEffect(() => {
    getAgeGroup().then(ageGroup => {
      drawing.setStrokeWidth(getDefaultStrokeWidthForAgeGroup(ageGroup));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset tutorial hint when phase changes so each phase shows its own hint
  useEffect(() => {
    if (isTutorial) setTutorialHintVisible(true);
  }, [phase, isTutorial]);

  // Complete tutorial after first rating is submitted
  useEffect(() => {
    if (isTutorial && userRating > 0) {
      markOnboardingDone();
      setIsTutorial(false);
    }
  }, [isTutorial, userRating]);

  useEffect(() => {
    if (userRating === 0 || userRating === lastCheckedRatingRef.current) return;
    lastCheckedRatingRef.current = userRating;

    if (userRating >= 4 && FeatureFlags.ENABLE_CONFETTI && celebrationEnabled) {
      const intensity: ConfettiIntensity = userRating === 5 ? 'full' : 'light';
      const clearAfter = userRating === 5 ? 2700 : 1700;
      setConfettiIntensity(intensity);
      setShowConfetti(true);
      SoundManager.playCelebration();
      const timer = setTimeout(() => setShowConfetti(false), clearAfter);
      checkAchievements(userRating);
      return () => clearTimeout(timer);
    }
    checkAchievements(userRating);
  }, [userRating, celebrationEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkAchievements = async (rating: number) => {
    try {
      const [gallery, progress, streak] = await Promise.all([
        storageManager.getGallery(),
        storageManager.getProgress(),
        getStreakData(),
      ]);
      const dailyChallengesCompleted = gallery.filter(g => g.isDailyChallenge).length;
      const difficultiesPlayed = Array.from(
        new Set(
          Object.keys(progress.levels ?? {})
            .map(n => parseInt(n, 10))
            .filter(n => !isNaN(n))
            .map(n => getDifficultyForLevel(n)),
        ),
      );
      const newly = await checkAndUnlock({
        stars: rating,
        galleryCount: gallery.length,
        currentStreak: streak.currentStreak,
        levelsCompleted: progress.totalLevelsCompleted ?? 0,
        dailyChallengesCompleted,
        difficultiesPlayed,
      });
      if (newly.length > 0) setUnlockedBadge(newly[0]);
    } catch {
      // best-effort
    }
  };

  const levelName = currentLang === 'en' ? currentImage?.displayNameEn : currentImage?.displayName;

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom, backgroundColor: colors.background },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            paddingHorizontal: layout.headerPaddingHorizontal,
            paddingBottom: Spacing.sm,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            Level {levelNumber}
            {levelName ? ` · ${levelName}` : ''}
          </Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <View
            style={styles.progressBarTrack}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 1, max: totalLevels, now: levelNumber }}
            accessibilityLabel={t('levels.level', { number: levelNumber })}
          >
            <View
              style={[styles.progressBarFill, { width: `${(levelNumber / totalLevels) * 100}%` }]}
            />
          </View>
          <TouchableOpacity
            onPress={() => setShowSettings(true)}
            style={styles.settingsButton}
            accessibilityLabel={t('common.settings')}
            accessibilityRole="button"
          >
            <Text style={[styles.settingsIcon, { color: colors.text.primary }]}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pill-Tabs: Zeichnen / Ergebnis */}
      {FeatureFlags.ENABLE_GAME_PHASE_TABS && (phase === 'draw' || phase === 'result') && (
        <View style={[styles.tabBar, { backgroundColor: colors.surfaceAlt }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              phase === 'draw' && [styles.tabActive, { backgroundColor: colors.surface }],
            ]}
            onPress={() => phase === 'result' && setPhase('draw')}
            accessibilityRole="tab"
          >
            <Text
              style={[
                styles.tabText,
                { color: colors.text.secondary },
                phase === 'draw' && [styles.tabTextActive, { color: colors.text.primary }],
              ]}
            >
              ✏️ {t('game.tabs.draw')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              phase === 'result' && [styles.tabActive, { backgroundColor: colors.surface }],
            ]}
            onPress={() => phase === 'draw' && setPhase('result')}
            accessibilityRole="tab"
          >
            <Text
              style={[
                styles.tabText,
                { color: colors.text.secondary },
                phase === 'result' && [styles.tabTextActive, { color: colors.text.primary }],
              ]}
            >
              🎨 {t('game.tabs.result')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Settings Modal */}
      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />

      {/* Hint Modal — statusBarTranslucent sichert volle Überdeckung auf Android */}
      <Modal
        visible={showHintModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowHintModal(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}
          activeOpacity={1}
          onPress={() => setShowHintModal(false)}
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
        >
          <View style={[styles.hintModal, { backgroundColor: colors.background }]}>
            <View style={styles.hintModalHeader}>
              <Text style={[styles.hintModalTitle, { color: colors.text.primary }]}>
                {t('game.draw.hintModalTitle')}
              </Text>
              <TouchableOpacity onPress={() => setShowHintModal(false)} style={styles.closeButton}>
                <Text style={[styles.closeText, { color: colors.text.secondary }]}>✕</Text>
              </TouchableOpacity>
            </View>
            {currentImage && (
              <ErrorBoundary>
                <LevelImageDisplay
                  image={currentImage}
                  size={Math.min(screenWidth - 80, 280)}
                  mode={variant === 'outline' ? 'outline' : 'normal'}
                  mirror={variant === 'mirror'}
                />
              </ErrorBoundary>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Phase Content — crossfade on transition */}
      <Animated.View style={phaseAnimStyle}>
        {visiblePhase === 'memorize' && (
          <MemorizePhase
            timeRemaining={timeRemaining}
            totalTime={displayDuration}
            currentImage={currentImage}
            levelNumber={levelNumber}
            currentLang={currentLang}
            memorizeImageSize={layout.memorizeImageSize}
            imagePlaceholderMinSize={layout.imagePlaceholderMinSize}
            revealStep={revealStep}
            variant={variant}
          />
        )}
        {visiblePhase === 'draw' && (
          <DrawPhase
            currentImage={currentImage}
            currentLang={currentLang}
            hasUsedHint={hasUsedHint}
            onUseHint={() => setHasUsedHint(true)}
            onShowHintModal={() => setShowHintModal(true)}
            drawing={drawing}
            layout={{
              canvasMaxHeight: layout.canvasMaxHeight,
              canvasMinHeight: layout.canvasMinHeight,
              canvasMarginVertical: layout.canvasMarginVertical,
              toolbarMarginVertical: layout.toolbarMarginVertical,
              buttonMinHeight: layout.buttonMinHeight,
              buttonPaddingVertical: layout.buttonPaddingVertical,
              isSmall,
            }}
            onDone={() => {
              SoundManager.playPhaseTransition();
              setPhase('result');
            }}
          />
        )}
        {visiblePhase === 'result' && (
          <ResultPhase
            currentImage={currentImage}
            levelNumber={levelNumber}
            currentLang={currentLang}
            userRating={userRating}
            savedToGallery={savedToGallery}
            isReplaying={isReplaying}
            replayPaths={replayPaths}
            drawingPaths={drawing.paths}
            screenWidth={screenWidth}
            isSmall={isSmall}
            onRatingSubmit={handleRatingSubmit}
            onSaveToGallery={saveToGallery}
            onStartReplay={startReplay}
            onStopReplay={() => setIsReplaying(false)}
            onNextLevel={handleStartNextLevel}
            onRestartFromLevel1={handleRestartFromLevel1}
          />
        )}
      </Animated.View>

      {/* Delight overlays */}
      {phase === 'result' && (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <ConfettiBurst
            width={screenWidth}
            height={layout.canvasMaxHeight + 200}
            active={showConfetti}
            intensity={confettiIntensity}
          />
        </View>
      )}
      <BadgeUnlockToast achievement={unlockedBadge} onHide={handleBadgeToastHide} />
      <MascotUnlockToast unlock={newMascotUnlock} onHide={clearMascotUnlock} />

      {/* Tutorial Coach Mark */}
      {isTutorial &&
        tutorialHintVisible &&
        (phase === 'memorize' || phase === 'draw' || phase === 'result') && (
          <TutorialOverlay phase={phase} onDismiss={() => setTutorialHintVisible(false)} />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    lineHeight: 26,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  progressBarTrack: {
    width: 60,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd5c8',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
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
    ...Colors.shadow.small,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  tabTextActive: {
    fontWeight: FontWeight.bold,
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
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  hintModal: {
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
    width: '90%',
    maxWidth: 380,
    maxHeight: '85%',
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
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 24,
  },
});
