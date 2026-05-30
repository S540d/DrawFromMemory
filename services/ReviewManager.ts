/**
 * ReviewManager — steuert wann der native In-App-Review-Dialog angezeigt wird.
 *
 * Trigger: 5-Sterne-Bewertung ODER 3. abgeschlossene Daily Challenge
 * Guard:   max. 1× alle 90 Tage; kein Web-Support (native only)
 */

import { Platform } from 'react-native';
import storageManager from './StorageManager';

const REVIEW_COOLDOWN_DAYS = 90;

async function canShowReview(): Promise<boolean> {
  const lastShown = await storageManager.getReviewLastShown();
  if (!lastShown) return true;
  const daysSince = (Date.now() - new Date(lastShown).getTime()) / (1000 * 60 * 60 * 24);
  return daysSince >= REVIEW_COOLDOWN_DAYS;
}

async function requestNativeReview(): Promise<void> {
  try {
    // Dynamic import to avoid crashing on Web where the module may not exist
    const StoreReview = await import('expo-store-review');
    if (await StoreReview.isAvailableAsync()) {
      await StoreReview.requestReview();
    }
  } catch {
    // Silently ignore — review is non-critical
  }
}

/**
 * Prüft ob Review-Bedingungen erfüllt sind und zeigt ggf. den Dialog.
 * Muss nach dem Speichern des Spielergebnisses aufgerufen werden.
 *
 * @param hasFiveStar  Ob der Nutzer gerade 5 Sterne gegeben hat
 * @param isDailyChallenge  Ob es sich um eine abgeschlossene Daily Challenge handelt
 */
export async function requestReviewIfEligible(
  hasFiveStar: boolean,
  isDailyChallenge: boolean
): Promise<void> {
  if (Platform.OS === 'web') return;

  let shouldTrigger = hasFiveStar;

  if (isDailyChallenge) {
    const count = await storageManager.incrementReviewDailyCount();
    if (count >= 3) {
      shouldTrigger = true;
      await storageManager.resetReviewDailyCount();
    }
  }

  if (!shouldTrigger) return;
  if (!(await canShowReview())) return;

  await storageManager.setReviewLastShown();
  await requestNativeReview();
}
