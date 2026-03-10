import { useState } from 'react';
import type { DrawingPath } from './DrawingCanvas.shared';

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
