/**
 * useGamePhase Hook Tests
 */
import { renderHook, act, waitFor } from '@testing-library/react-native';
import type { DrawingPath } from '../../components/DrawingCanvas.shared';

const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

const mockImage = {
  filename: 'test.svg',
  displayName: 'Testbild',
  strokeCount: 5,
  difficulty: 1,
};

jest.mock('../ImagePoolManager', () => ({
  getRandomImageForLevel: jest.fn(() => mockImage),
}));

jest.mock('../LevelManager', () => ({
  getLevel: jest.fn((level: number) => ({
    number: level,
    difficulty: 1,
    displayDuration: 3,
  })),
  getTotalLevels: jest.fn(() => 10),
}));

jest.mock('../../components/LevelImageDisplay', () => ({
  getImageElementCount: jest.fn(() => 5),
}));

jest.mock('../StorageManager', () => ({
  __esModule: true,
  default: {
    saveLevelProgress: jest.fn().mockResolvedValue(undefined),
    saveToGallery: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../SoundManager', () => ({
  __esModule: true,
  default: {
    playPhaseTransition: jest.fn(),
    playStarTap: jest.fn(),
    playSuccess: jest.fn(),
    playTimerTick: jest.fn(),
  },
}));

import { useGamePhase } from '../useGamePhase';

describe('useGamePhase', () => {
  const clearCanvas = jest.fn();
  const defaultPaths: DrawingPath[] = [];

  const renderGamePhase = (overrides = {}) =>
    renderHook(() =>
      useGamePhase({
        initialLevel: 1,
        drawingPaths: defaultPaths,
        clearCanvas,
        ...overrides,
      })
    );

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // --- Initialization ---

  it('starts in memorize phase', () => {
    const { result } = renderGamePhase();
    expect(result.current.phase).toBe('memorize');
  });

  it('sets currentImage from ImagePoolManager', () => {
    const { result } = renderGamePhase();
    expect(result.current.currentImage).toEqual(mockImage);
  });

  it('initializes with correct level number', () => {
    const { result } = renderGamePhase({ initialLevel: 3 });
    expect(result.current.levelNumber).toBe(3);
  });

  it('calls router.back on initialization error', () => {
    const { getLevel } = require('../LevelManager');
    getLevel.mockImplementationOnce(() => {
      throw new Error('Invalid level');
    });

    renderGamePhase();
    expect(mockBack).toHaveBeenCalled();
  });

  // --- Timer & Phase Transition ---

  it('can manually transition to draw phase via setPhase', () => {
    const { result } = renderGamePhase();
    expect(result.current.phase).toBe('memorize');

    act(() => { result.current.setPhase('draw'); });
    expect(result.current.phase).toBe('draw');
  });

  it('initializes timeRemaining from level displayDuration', () => {
    const { result } = renderGamePhase();
    // getLevel returns displayDuration: 3
    expect(result.current.timeRemaining).toBe(3);
  });

  // --- Rating ---

  it('handles rating submit', async () => {
    const storageManager = require('../StorageManager').default;
    const SoundManager = require('../SoundManager').default;
    const { result } = renderGamePhase();

    await act(async () => {
      await result.current.handleRatingSubmit(4);
    });

    expect(result.current.userRating).toBe(4);
    expect(SoundManager.playStarTap).toHaveBeenCalledWith(4);
    expect(storageManager.saveLevelProgress).toHaveBeenCalledWith(1, 4);
  });

  it('handles rating save error gracefully', async () => {
    const storageManager = require('../StorageManager').default;
    storageManager.saveLevelProgress.mockRejectedValueOnce(new Error('Save failed'));
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderGamePhase();

    await act(async () => {
      await result.current.handleRatingSubmit(3);
    });

    expect(result.current.userRating).toBe(3);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  // --- Gallery ---

  it('saves to gallery', async () => {
    const storageManager = require('../StorageManager').default;
    const SoundManager = require('../SoundManager').default;
    const paths: DrawingPath[] = [
      { points: [{ x: 0, y: 0 }], color: '#000', strokeWidth: 2 },
    ];

    const { result } = renderGamePhase({ drawingPaths: paths });

    await act(async () => {
      await result.current.saveToGallery();
    });

    expect(storageManager.saveToGallery).toHaveBeenCalledWith({
      levelNumber: 1,
      imageFilename: 'test.svg',
      imageName: 'Testbild',
      paths,
      rating: 0,
    });
    expect(SoundManager.playSuccess).toHaveBeenCalled();
    expect(result.current.savedToGallery).toBe(true);
  });

  it('does not save to gallery with empty paths', async () => {
    const storageManager = require('../StorageManager').default;
    const { result } = renderGamePhase({ drawingPaths: [] });

    await act(async () => {
      await result.current.saveToGallery();
    });

    expect(storageManager.saveToGallery).not.toHaveBeenCalled();
  });

  it('handles gallery save error gracefully', async () => {
    const storageManager = require('../StorageManager').default;
    storageManager.saveToGallery.mockRejectedValueOnce(new Error('Gallery error'));
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const paths: DrawingPath[] = [
      { points: [{ x: 0, y: 0 }], color: '#000', strokeWidth: 2 },
    ];

    const { result } = renderGamePhase({ drawingPaths: paths });

    await act(async () => {
      await result.current.saveToGallery();
    });

    expect(result.current.savedToGallery).toBe(false);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  // --- Level Navigation ---

  it('starts next level', () => {
    const { result } = renderGamePhase();

    act(() => { result.current.startNextLevel(); });

    expect(result.current.levelNumber).toBe(2);
    expect(result.current.phase).toBe('memorize');
    expect(result.current.userRating).toBe(0);
    expect(clearCanvas).toHaveBeenCalled();
  });

  it('does not go beyond total levels', () => {
    const { result } = renderGamePhase({ initialLevel: 10 });

    act(() => { result.current.startNextLevel(); });

    expect(result.current.levelNumber).toBe(10);
  });

  it('starts previous level', () => {
    const { result } = renderGamePhase({ initialLevel: 3 });

    act(() => { result.current.startPreviousLevel(); });

    expect(result.current.levelNumber).toBe(2);
    expect(result.current.phase).toBe('memorize');
    expect(clearCanvas).toHaveBeenCalled();
  });

  it('does not go below level 1', () => {
    const { result } = renderGamePhase({ initialLevel: 1 });

    act(() => { result.current.startPreviousLevel(); });

    expect(result.current.levelNumber).toBe(1);
  });

  it('restarts current level with new image', () => {
    const { result } = renderGamePhase();

    act(() => { result.current.restartCurrentLevel(); });

    expect(result.current.phase).toBe('memorize');
    expect(result.current.userRating).toBe(0);
    expect(result.current.savedToGallery).toBe(false);
    expect(clearCanvas).toHaveBeenCalled();
  });

  it('restarts from level 1', () => {
    const { result } = renderGamePhase({ initialLevel: 5 });

    act(() => { result.current.restartFromLevel1(); });

    expect(result.current.levelNumber).toBe(1);
    expect(result.current.phase).toBe('memorize');
    expect(clearCanvas).toHaveBeenCalled();
  });

  // --- Replay ---

  it('starts replay', () => {
    const paths: DrawingPath[] = [
      { points: [{ x: 0, y: 0 }, { x: 1, y: 1 }], color: '#000', strokeWidth: 2 },
    ];
    const { result } = renderGamePhase({ drawingPaths: paths });

    act(() => { result.current.startReplay(); });

    expect(result.current.isReplaying).toBe(true);
  });

  it('does not start replay with empty paths', () => {
    const { result } = renderGamePhase({ drawingPaths: [] });

    act(() => { result.current.startReplay(); });

    expect(result.current.isReplaying).toBe(false);
  });

  it('can stop replay manually', () => {
    const paths: DrawingPath[] = [
      { points: [{ x: 0, y: 0 }], color: '#000', strokeWidth: 2 },
    ];
    const { result } = renderGamePhase({ drawingPaths: paths });

    act(() => { result.current.startReplay(); });
    expect(result.current.isReplaying).toBe(true);

    act(() => { result.current.setIsReplaying(false); });
    expect(result.current.isReplaying).toBe(false);
  });

  // --- Cleanup ---

  it('cleans up timeouts on unmount', () => {
    const { result, unmount } = renderGamePhase();

    // Trigger timer expire to create timeout
    act(() => { jest.advanceTimersByTime(3000); });

    unmount();
    // Should not throw when pending timeouts fire
    jest.advanceTimersByTime(1000);
  });
});
