import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  checkAndUnlock,
  getUnlockedAchievements,
  isUnlocked,
  resetAchievements,
} from '../AchievementManager';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const mockStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('AchievementManager', () => {
  beforeEach(async () => {
    mockStorage.getItem.mockReset();
    mockStorage.setItem.mockReset();
    mockStorage.removeItem.mockReset();
    mockStorage.getItem.mockResolvedValue(null);
    await resetAchievements();
  });

  it('returns empty list when nothing unlocked yet', async () => {
    expect(await getUnlockedAchievements()).toEqual([]);
  });

  it('unlocks first_5_stars on rating === 5', async () => {
    const newly = await checkAndUnlock({ stars: 5 });
    expect(newly.map((a) => a.id)).toContain('first_5_stars');
    expect(await isUnlocked('first_5_stars')).toBe(true);
  });

  it('does not unlock same badge twice', async () => {
    await checkAndUnlock({ stars: 5 });
    mockStorage.getItem.mockResolvedValue(
      JSON.stringify([{ id: 'first_5_stars', unlockedAt: '2026-01-01' }]),
    );
    const newly = await checkAndUnlock({ stars: 5 });
    expect(newly).toEqual([]);
  });

  it('unlocks gallery_10 only at >= 10 entries', async () => {
    expect((await checkAndUnlock({ galleryCount: 9 })).map((a) => a.id)).not.toContain('gallery_10');
    mockStorage.getItem.mockResolvedValue(null);
    expect((await checkAndUnlock({ galleryCount: 10 })).map((a) => a.id)).toContain('gallery_10');
  });

  it('unlocks streak_7 at >= 7 days', async () => {
    expect((await checkAndUnlock({ currentStreak: 6 })).map((a) => a.id)).not.toContain('streak_7');
    mockStorage.getItem.mockResolvedValue(null);
    expect((await checkAndUnlock({ currentStreak: 7 })).map((a) => a.id)).toContain('streak_7');
  });

  it('unlocks all_levels_done at 10 levels', async () => {
    expect((await checkAndUnlock({ levelsCompleted: 10 })).map((a) => a.id)).toContain('all_levels_done');
  });

  it('unlocks all_difficulties only when 1..5 all played', async () => {
    expect((await checkAndUnlock({ difficultiesPlayed: [1, 2, 3, 4] })).map((a) => a.id))
      .not.toContain('all_difficulties');
    mockStorage.getItem.mockResolvedValue(null);
    expect((await checkAndUnlock({ difficultiesPlayed: [1, 2, 3, 4, 5] })).map((a) => a.id))
      .toContain('all_difficulties');
  });

  it('recovers from corrupt JSON in storage', async () => {
    mockStorage.getItem.mockResolvedValue('{not-json');
    expect(await getUnlockedAchievements()).toEqual([]);
    expect(mockStorage.removeItem).toHaveBeenCalled();
  });
});
