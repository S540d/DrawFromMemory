import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { getRandomImageForLevel } from '@services/ImagePoolManager';
import { getLevel, getTotalLevels } from '@services/LevelManager';
import { getImageElementCount } from '@components/LevelImageDisplay';
import storageManager from '@services/StorageManager';
import SoundManager from '@services/SoundManager';
import { useTimer } from '@services/useTimer';
import type { DrawingPath } from '@components/DrawingCanvas';
import type { GamePhase, LevelImage } from '../types';

interface UseGamePhaseOptions {
  initialLevel: number;
  drawingPaths: DrawingPath[];
  clearCanvas: () => void;
  setPaths: (paths: DrawingPath[]) => void;
}

export function useGamePhase({
  initialLevel,
  drawingPaths,
  clearCanvas,
  setPaths,
}: UseGamePhaseOptions) {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>('memorize');
  const [levelNumber, setLevelNumber] = useState(initialLevel);
  const [currentImage, setCurrentImage] = useState<LevelImage | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [revealStep, setRevealStep] = useState(0);
  const [savedToGallery, setSavedToGallery] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayPaths, setReplayPaths] = useState<DrawingPath[]>([]);

  const REPLAY_DURATION_MS = 3000;
  const REPLAY_FRAME_MS = 30;

  const handleTimerExpire = useCallback(() => {
    if (currentImage) {
      SoundManager.playPhaseTransition();
      setTimeout(() => setPhase('draw'), 500);
    }
  }, [currentImage]);

  const { timeRemaining, setTimeRemaining } = useTimer({
    phase,
    onExpire: handleTimerExpire,
  });

  // Initialize level on mount and when levelNumber changes
  useEffect(() => {
    try {
      const level = getLevel(levelNumber);
      const image = getRandomImageForLevel(levelNumber);
      setCurrentImage(image);
      setTimeRemaining(level.displayDuration);
    } catch (error) {
      console.error('Error initializing level:', error);
      router.back();
    }
  }, [levelNumber, router, setTimeRemaining]);

  // Progressive reveal during memorize phase
  useEffect(() => {
    if (phase !== 'memorize' || !currentImage) return;

    const totalElements = getImageElementCount(currentImage);
    const level = getLevel(levelNumber);
    const revealDurationMs = level.displayDuration * 800;
    const stepInterval = revealDurationMs / totalElements;

    setRevealStep(0);
    let step = 0;

    const interval = setInterval(() => {
      step++;
      if (step >= totalElements) {
        clearInterval(interval);
        setRevealStep(totalElements);
      } else {
        setRevealStep(step);
      }
    }, stepInterval);

    return () => clearInterval(interval);
  }, [phase, currentImage, levelNumber]);

  // Replay animation
  useEffect(() => {
    if (!isReplaying || drawingPaths.length === 0) return;

    const totalPoints = drawingPaths.reduce(
      (sum, p) => sum + (p.type === 'fill' ? 1 : p.points.length),
      0
    );
    const totalFrames = Math.ceil(REPLAY_DURATION_MS / REPLAY_FRAME_MS);
    const pointsPerFrame = Math.max(1, Math.ceil(totalPoints / totalFrames));
    let pointsShown = 0;

    const interval = setInterval(() => {
      pointsShown += pointsPerFrame;

      const visiblePaths: DrawingPath[] = [];
      let remaining = pointsShown;

      for (const path of drawingPaths) {
        const count = path.type === 'fill' ? 1 : path.points.length;
        if (remaining >= count) {
          visiblePaths.push(path);
          remaining -= count;
        } else if (remaining > 0) {
          if (path.type === 'fill') {
            visiblePaths.push(path);
          } else {
            visiblePaths.push({ ...path, points: path.points.slice(0, remaining) });
          }
          remaining = 0;
          break;
        } else {
          break;
        }
      }

      setReplayPaths(visiblePaths);

      if (pointsShown >= totalPoints) {
        clearInterval(interval);
        setReplayPaths(drawingPaths);
        setTimeout(() => setIsReplaying(false), 500);
      }
    }, REPLAY_FRAME_MS);

    return () => clearInterval(interval);
  }, [isReplaying, drawingPaths]);

  const handleRatingSubmit = async (rating: number) => {
    try {
      SoundManager.playStarTap(rating);
      setUserRating(rating);
      await storageManager.saveLevelProgress(levelNumber, rating);
    } catch (error) {
      console.error('Error saving rating:', error);
    }
  };

  const saveToGallery = async () => {
    if (!currentImage || drawingPaths.length === 0) return;
    try {
      await storageManager.saveToGallery({
        levelNumber,
        imageFilename: currentImage.filename,
        imageName: currentImage.displayName,
        paths: drawingPaths,
        rating: userRating,
      });
      SoundManager.playSuccess();
      setSavedToGallery(true);
    } catch (error) {
      console.error('Error saving to gallery:', error);
    }
  };

  const startReplay = useCallback(() => {
    if (drawingPaths.length === 0) return;
    setReplayPaths([]);
    setIsReplaying(true);
  }, [drawingPaths]);

  const restartCurrentLevel = () => {
    try {
      setPhase('memorize');
      setUserRating(0);
      setSavedToGallery(false);
      clearCanvas();
      const image = getRandomImageForLevel(levelNumber);
      const level = getLevel(levelNumber);
      setCurrentImage(image);
      setTimeRemaining(level.displayDuration);
    } catch (error) {
      console.error('Error restarting level:', error);
    }
  };

  const startNextLevel = () => {
    try {
      const nextLevel = levelNumber + 1;
      if (nextLevel <= getTotalLevels()) {
        setLevelNumber(nextLevel);
        setPhase('memorize');
        setUserRating(0);
        setSavedToGallery(false);
        clearCanvas();
        const image = getRandomImageForLevel(nextLevel);
        const level = getLevel(nextLevel);
        setCurrentImage(image);
        setTimeRemaining(level.displayDuration);
      }
    } catch (error) {
      console.error('Error starting next level:', error);
    }
  };

  const startPreviousLevel = () => {
    try {
      const prevLevel = levelNumber - 1;
      if (prevLevel >= 1) {
        setLevelNumber(prevLevel);
        setPhase('memorize');
        setUserRating(0);
        setSavedToGallery(false);
        clearCanvas();
        const image = getRandomImageForLevel(prevLevel);
        const level = getLevel(prevLevel);
        setCurrentImage(image);
        setTimeRemaining(level.displayDuration);
      }
    } catch (error) {
      console.error('Error starting previous level:', error);
    }
  };

  const restartFromLevel1 = () => {
    try {
      setLevelNumber(1);
      setPhase('memorize');
      setUserRating(0);
      clearCanvas();
      const image = getRandomImageForLevel(1);
      const level = getLevel(1);
      setCurrentImage(image);
      setTimeRemaining(level.displayDuration);
    } catch (error) {
      console.error('Error restarting from level 1:', error);
    }
  };

  return {
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
    startPreviousLevel,
    restartFromLevel1,
  };
}
