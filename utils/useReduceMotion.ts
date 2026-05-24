import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Returns `true` when the OS-level "reduce motion" accessibility setting is on.
 *
 * Starts as `false` (the safe default — animate) and updates once the async
 * `AccessibilityInfo.isReduceMotionEnabled()` resolves. The check is also
 * re-subscribed via the `reduceMotionChanged` event so runtime toggles take
 * effect without reload.
 *
 * Replaces ~9 copies of the same useEffect + cancelled-flag boilerplate.
 */
export function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((rm) => {
      if (!cancelled) setReduceMotion(rm);
    });
    // addEventListener is undefined in some test/jsdom environments — guard it.
    const sub = AccessibilityInfo.addEventListener?.('reduceMotionChanged', (rm) => {
      if (!cancelled) setReduceMotion(rm);
    });
    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, []);

  return reduceMotion;
}
