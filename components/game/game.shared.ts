import type { DrawingPath } from '@components/DrawingCanvas';
import type { LevelImage, GameVariant } from '../../types';

export interface MemorizePhaseProps {
  timeRemaining: number;
  totalTime: number;
  currentImage: LevelImage | null;
  levelNumber: number;
  currentLang: string;
  memorizeImageSize: number;
  imagePlaceholderMinSize: number;
  revealStep: number;
  variant?: GameVariant;
}

export interface DrawPhaseProps {
  currentImage: LevelImage | null;
  currentLang: string;
  hasUsedHint: boolean;
  onUseHint: () => void;
  onShowHintModal: () => void;
  drawing: {
    color: string;
    strokeWidth: number;
    tool: 'brush' | 'fill';
    paths: DrawingPath[];
    setPaths: (paths: DrawingPath[]) => void;
    setColor: (color: string) => void;
    setTool: (tool: 'brush' | 'fill') => void;
    setStrokeWidth: (width: number) => void;
    undo: () => void;
  };
  layout: {
    canvasMaxHeight: number;
    canvasMinHeight: number;
    canvasMarginVertical: number;
    toolbarMarginVertical: number;
    buttonMinHeight: number;
    buttonPaddingVertical: number;
    isSmall: boolean;
  };
  onDone: () => void;
}

export interface ResultPhaseProps {
  currentImage: LevelImage | null;
  levelNumber: number;
  currentLang: string;
  userRating: number;
  savedToGallery: boolean;
  isReplaying: boolean;
  replayPaths: DrawingPath[];
  drawingPaths: DrawingPath[];
  screenWidth: number;
  isSmall: boolean;
  onRatingSubmit: (rating: number) => void;
  onSaveToGallery: () => void;
  onStartReplay: () => void;
  onStopReplay: () => void;
  onNextLevel: () => void;
  onRestartFromLevel1: () => void;
}
