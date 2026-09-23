import { useState, useEffect, useCallback, useRef } from 'react';
import storageManager from '@services/StorageManager';
import SoundManager from '@services/SoundManager';
import { checkAndUnlock, type AchievementDef } from '@services/AchievementManager';
import { getStreakData } from '@services/StreakManager';
import { getDifficultyForLevel } from '@services/LevelManager';
import { FeatureFlags } from '../constants/featureFlags';
import type { ConfettiIntensity } from '@components/ConfettiBurst';

/**
 * Bündelt den Overlay-/Feedback-State der Ergebnis-Phase (Hint-Modal, Confetti,
 * Badge-Unlock-Toast), der vorher direkt in app/game.tsx lag (Issue #334).
 */
export function useGameFeedback(userRating: number) {
  const [showHintModal, setShowHintModal] = useState(false);
  const [hasUsedHint, setHasUsedHint] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationEnabled, setCelebrationEnabled] = useState(true);
  const [confettiIntensity, setConfettiIntensity] = useState<ConfettiIntensity>('full');
  const [unlockedBadge, setUnlockedBadge] = useState<AchievementDef | null>(null);
  const lastCheckedRatingRef = useRef(0);

  const handleBadgeToastHide = useCallback(() => setUnlockedBadge(null), []);
  const resetHint = useCallback(() => setHasUsedHint(false), []);

  useEffect(() => {
    storageManager.getSetting('celebrationEnabled').then(setCelebrationEnabled);
  }, []);

  const checkAchievements = useCallback(async (rating: number) => {
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
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRating, celebrationEnabled]);

  return {
    showHintModal,
    setShowHintModal,
    hasUsedHint,
    resetHint,
    onUseHint: useCallback(() => setHasUsedHint(true), []),
    showConfetti,
    confettiIntensity,
    unlockedBadge,
    handleBadgeToastHide,
  };
}
