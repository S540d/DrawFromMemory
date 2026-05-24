/**
 * AchievementManager — Badge-System
 * Speichert freigeschaltete Badges via AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@merke_male:achievements';

export type AchievementId =
  | 'first_5_stars'
  | 'gallery_10'
  | 'streak_7'
  | 'all_levels_done'
  | 'daily_5'
  | 'all_difficulties';

export interface AchievementDef {
  id: AchievementId;
  emoji: string;
  titleKey: string;
  descKey: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first_5_stars',    emoji: '🌟', titleKey: 'achievements.first_5_stars.title',    descKey: 'achievements.first_5_stars.desc' },
  { id: 'gallery_10',       emoji: '🎨', titleKey: 'achievements.gallery_10.title',       descKey: 'achievements.gallery_10.desc' },
  { id: 'streak_7',         emoji: '🔥', titleKey: 'achievements.streak_7.title',         descKey: 'achievements.streak_7.desc' },
  { id: 'all_levels_done',  emoji: '🏆', titleKey: 'achievements.all_levels_done.title',  descKey: 'achievements.all_levels_done.desc' },
  { id: 'daily_5',          emoji: '🎯', titleKey: 'achievements.daily_5.title',          descKey: 'achievements.daily_5.desc' },
  { id: 'all_difficulties', emoji: '🌈', titleKey: 'achievements.all_difficulties.title', descKey: 'achievements.all_difficulties.desc' },
];

export interface UnlockedAchievement {
  id: AchievementId;
  unlockedAt: string; // ISO date
}

export interface AchievementEvent {
  stars?: number;
  galleryCount?: number;
  currentStreak?: number;
  levelsCompleted?: number;
  dailyChallengesCompleted?: number;
  difficultiesPlayed?: number[]; // distinct difficulties played at least once
}

const MEMORY: Record<string, string> = {};

function safeParse(raw: string | null | undefined): UnlockedAchievement[] | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : null;
  } catch {
    return null;
  }
}

async function loadUnlocked(): Promise<UnlockedAchievement[]> {
  let raw: string | null = null;
  try {
    raw = await AsyncStorage.getItem(STORAGE_KEY);
  } catch {
    // fall through
  }
  const parsed = safeParse(raw) ?? safeParse(MEMORY[STORAGE_KEY]);
  if (parsed) {
    if (raw) MEMORY[STORAGE_KEY] = raw;
    return parsed;
  }
  if (raw) {
    delete MEMORY[STORAGE_KEY];
    try { await AsyncStorage.removeItem(STORAGE_KEY); } catch { /* best-effort */ }
  }
  return [];
}

async function saveUnlocked(list: UnlockedAchievement[]): Promise<void> {
  const raw = JSON.stringify(list);
  MEMORY[STORAGE_KEY] = raw;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // in-memory fallback
  }
}

export async function getUnlockedAchievements(): Promise<UnlockedAchievement[]> {
  try {
    return await loadUnlocked();
  } catch {
    return [];
  }
}

export async function isUnlocked(id: AchievementId): Promise<boolean> {
  const list = await getUnlockedAchievements();
  return list.some((u) => u.id === id);
}

/**
 * Prüft Event gegen Achievement-Regeln und gibt neu freigeschaltete Badges zurück.
 */
export async function checkAndUnlock(event: AchievementEvent): Promise<AchievementDef[]> {
  const list = await loadUnlocked();
  const has = (id: AchievementId) => list.some((u) => u.id === id);
  const newly: AchievementDef[] = [];

  const tryUnlock = (id: AchievementId, condition: boolean) => {
    if (condition && !has(id)) {
      const def = ACHIEVEMENTS.find((a) => a.id === id);
      if (def) newly.push(def);
    }
  };

  tryUnlock('first_5_stars',    (event.stars ?? 0) >= 5);
  tryUnlock('gallery_10',       (event.galleryCount ?? 0) >= 10);
  tryUnlock('streak_7',         (event.currentStreak ?? 0) >= 7);
  tryUnlock('all_levels_done',  (event.levelsCompleted ?? 0) >= 10);
  tryUnlock('daily_5',          (event.dailyChallengesCompleted ?? 0) >= 5);
  tryUnlock(
    'all_difficulties',
    Array.isArray(event.difficultiesPlayed) &&
      [1, 2, 3, 4, 5].every((d) => event.difficultiesPlayed!.includes(d)),
  );

  if (newly.length > 0) {
    const now = new Date().toISOString();
    const updated = [...list, ...newly.map((d) => ({ id: d.id, unlockedAt: now }))];
    await saveUnlocked(updated);
  }
  return newly;
}

export async function resetAchievements(): Promise<void> {
  delete MEMORY[STORAGE_KEY];
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // best-effort
  }
}
