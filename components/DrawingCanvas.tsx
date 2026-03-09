import { useState } from 'react';
import { StyleSheet } from 'react-native';

// Default width for SSR (will be overridden by actual window dimensions on client)
export const DEFAULT_CANVAS_WIDTH = 300;

export interface DrawingPath {
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
  type?: 'stroke' | 'fill'; // Optional: default = 'stroke'
}

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5E6',
    padding: 16,
  },
  fallbackEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  fallbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  fallbackMessage: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  fallbackErrorDetail: {
    marginTop: 12,
    fontSize: 11,
    color: '#C33',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: '#4ECDC4',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    minWidth: 140,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

/**
 * Hook für Canvas-Steuerung (wird vom Parent verwendet)
 */
export function useDrawingCanvas() {
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [tool, setTool] = useState<'brush' | 'fill'>('brush');
  const [paths, setPaths] = useState<DrawingPath[]>([]);

  const clearCanvas = () => {
    setPaths([]);
  };

  const undo = () => {
    if (paths.length > 0) {
      setPaths(paths.slice(0, -1));
    }
  };

  // Custom setPaths that auto-switches from fill to brush after fill is used
  const setPathsWithAutoSwitch = (newPaths: DrawingPath[] | ((prev: DrawingPath[]) => DrawingPath[])) => {
    setPaths((prevPaths) => {
      const updatedPaths = typeof newPaths === 'function' ? newPaths(prevPaths) : newPaths;

      // Check if a new fill path was just added (Issue #45)
      if (tool === 'fill' && updatedPaths.length > prevPaths.length) {
        const lastPath = updatedPaths[updatedPaths.length - 1];
        if (lastPath?.type === 'fill') {
          // Auto-switch to brush after fill is used (synchronously, to avoid timer race conditions)
          setTool('brush');
        }
      }

      return updatedPaths;
    });
  };

  return {
    color,
    setColor,
    strokeWidth,
    setStrokeWidth,
    tool,
    setTool,
    paths,
    setPaths: setPathsWithAutoSwitch,
    clearCanvas,
    undo,
  };
}

// Platform-specific implementations are resolved automatically by the bundler:
// DrawingCanvas.web.tsx   → used on web
// DrawingCanvas.native.tsx → used on iOS/Android
