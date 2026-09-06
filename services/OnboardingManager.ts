/**
 * OnboardingManager — Erst-Start-Tour-Flag
 * Eigener AsyncStorage-Key, damit das typisierte AppSettings-Schema
 * nicht aufgebohrt werden muss.
 */

import { safeStorageOps } from './StorageManager';

const STORAGE_KEY = '@merke_male:onboarding_done';

export async function isOnboardingDone(): Promise<boolean> {
  const raw = await safeStorageOps.getItem(STORAGE_KEY);
  return raw === '1';
}

export async function markOnboardingDone(): Promise<void> {
  await safeStorageOps.setItem(STORAGE_KEY, '1');
}

export async function resetOnboarding(): Promise<void> {
  await safeStorageOps.removeItem(STORAGE_KEY);
}
