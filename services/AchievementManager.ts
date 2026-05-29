/**
 * AchievementManager — Badge-System
 * Speichert freigeschaltete Badges via AsyncStorage.
 */

import { createPersistedJson } from './storage/persistedJson';

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

const store = createPersistedJson<UnlockedAchievement[]>({
  key: '@merke_male:achievements',
  defaultValue: [],
  isValid: (v): v is UnlockedAchievement[] => Array.isArray(v),
});

export async function getUnlockedAchievements(): Promise<UnlockedAchievement[]> {
  try {
    return await store.load();
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
  const list = await store.load();
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
    await store.save(updated);
  }
  return newly;
}

export async function resetAchievements(): Promise<void> {
  await store.reset();
}
