/**
 * OnboardingManager — Erst-Start-Tour-Flag
 * Eigener AsyncStorage-Key, damit das typisierte AppSettings-Schema
 * nicht aufgebohrt werden muss.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@merke_male:onboarding_done';
const MEMORY: Record<string, string> = {};

export async function isOnboardingDone(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw === '1') return true;
    return MEMORY[STORAGE_KEY] === '1';
  } catch {
    return MEMORY[STORAGE_KEY] === '1';
  }
}

export async function markOnboardingDone(): Promise<void> {
  MEMORY[STORAGE_KEY] = '1';
  try {
    await AsyncStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // in-memory fallback for web sessions
  }
}

export async function resetOnboarding(): Promise<void> {
  delete MEMORY[STORAGE_KEY];
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // best-effort
  }
}
