import Colors from '../../constants/Colors';

/**
 * Shared urgency-color logic for TimerArc.native.tsx and TimerArc.web.tsx
 * (previously duplicated verbatim in both files, Issue #334).
 */
export function getTimerArcColor(timeRemaining: number): string {
  if (timeRemaining <= 1) return Colors.timerArc.critical;
  if (timeRemaining <= 3) return Colors.timerArc.warning;
  return Colors.timerArc.normal;
}
