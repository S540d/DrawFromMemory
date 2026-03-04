import { useState, useEffect } from 'react';
import SoundManager from '@services/SoundManager';
import type { GamePhase } from '../types';

interface UseTimerOptions {
  phase: GamePhase;
  onExpire: () => void;
}

export function useTimer({ phase, onExpire }: UseTimerOptions) {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (phase === 'memorize' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        SoundManager.playTimerTick();
        setTimeRemaining((t) => t - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'memorize' && timeRemaining === 0) {
      onExpire();
    }
  }, [phase, timeRemaining, onExpire]);

  return { timeRemaining, setTimeRemaining };
}
