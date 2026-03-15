import { useState, useEffect, useRef, useCallback } from 'react';
import SoundManager from '@services/SoundManager';
import type { GamePhase } from '../types';

interface UseTimerOptions {
  phase: GamePhase;
  onExpire: () => void;
}

export function useTimer({ phase, onExpire }: UseTimerOptions) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const hasStartedRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

  useEffect(() => {
    if (phase === 'memorize' && timeRemaining > 0) {
      hasStartedRef.current = true;
      const timer = setTimeout(() => {
        SoundManager.playTimerTick();
        setTimeRemaining((t) => t - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'memorize' && timeRemaining === 0 && hasStartedRef.current) {
      hasStartedRef.current = false;
      onExpireRef.current();
    }
  }, [phase, timeRemaining]);

  const setTimeRemainingWrapped = useCallback((value: number | ((prev: number) => number)) => {
    hasStartedRef.current = false;
    setTimeRemaining(value);
  }, []);

  return { timeRemaining, setTimeRemaining: setTimeRemainingWrapped };
}
