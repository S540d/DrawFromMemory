import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  recordSession,
  getSessions,
  clearSessions,
  computeStats,
  getSessionStats,
  FOUR_WEEKS_MS,
} from '../SessionTracker';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const mockStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('SessionTracker', () => {
  beforeEach(async () => {
    mockStorage.getItem.mockReset();
    mockStorage.setItem.mockReset();
    mockStorage.removeItem.mockReset();
    mockStorage.getItem.mockResolvedValue(null);
    await clearSessions();
  });

  it('records a session and reads it back', async () => {
    await recordSession({ durationMs: 30_000, stars: 4, levelId: 3 });
    // simulate storage returning the just-saved value
    const saved = mockStorage.setItem.mock.calls[0][1];
    mockStorage.getItem.mockResolvedValue(saved);
    const sessions = await getSessions();
    expect(sessions).toHaveLength(1);
    expect(sessions[0]).toMatchObject({ durationMs: 30_000, stars: 4, levelId: 3 });
  });

  it('prunes entries older than 4 weeks on read', async () => {
    const now = Date.now();
    const old = new Date(now - FOUR_WEEKS_MS - 60_000).toISOString();
    const fresh = new Date(now - 5_000).toISOString();
    mockStorage.getItem.mockResolvedValue(
      JSON.stringify([
        { date: old, durationMs: 10_000, stars: 3, levelId: 1 },
        { date: fresh, durationMs: 20_000, stars: 5, levelId: 2 },
      ]),
    );
    const sessions = await getSessions(now);
    expect(sessions).toHaveLength(1);
    expect(sessions[0].levelId).toBe(2);
  });

  it('clamps stars to 0..5 and durationMs to >= 0', async () => {
    await recordSession({ durationMs: -10, stars: 99, levelId: 1 });
    const saved = JSON.parse(mockStorage.setItem.mock.calls[0][1]);
    expect(saved[0].durationMs).toBe(0);
    expect(saved[0].stars).toBe(5);
  });

  it('recovers from corrupt JSON gracefully', async () => {
    mockStorage.getItem.mockResolvedValue('{not-valid-json');
    const sessions = await getSessions();
    expect(sessions).toEqual([]);
  });

  describe('computeStats', () => {
    it('returns empty stats for no records', () => {
      const s = computeStats([]);
      expect(s.totalSessions).toBe(0);
      expect(s.favoriteLevels).toEqual([]);
      expect(s.dailyBreakdown).toEqual([]);
    });

    it('computes totals and averages', () => {
      const s = computeStats([
        { date: '2026-05-01T10:00:00.000Z', durationMs: 60_000, stars: 5, levelId: 1 },
        { date: '2026-05-01T11:00:00.000Z', durationMs: 30_000, stars: 3, levelId: 1 },
        { date: '2026-05-02T12:00:00.000Z', durationMs: 90_000, stars: 4, levelId: 2 },
      ]);
      expect(s.totalSessions).toBe(3);
      expect(s.totalDurationMs).toBe(180_000);
      expect(s.averageStars).toBeCloseTo((5 + 3 + 4) / 3, 5);
    });

    it('returns top 3 favorite levels by play count', () => {
      const records = [
        ...Array(5).fill({ date: '2026-05-01T10:00:00.000Z', durationMs: 0, stars: 0, levelId: 1 }),
        ...Array(3).fill({ date: '2026-05-01T10:00:00.000Z', durationMs: 0, stars: 0, levelId: 2 }),
        ...Array(2).fill({ date: '2026-05-01T10:00:00.000Z', durationMs: 0, stars: 0, levelId: 3 }),
        ...Array(1).fill({ date: '2026-05-01T10:00:00.000Z', durationMs: 0, stars: 0, levelId: 4 }),
      ];
      const s = computeStats(records);
      expect(s.favoriteLevels.map(f => f.levelId)).toEqual([1, 2, 3]);
      expect(s.favoriteLevels[0].count).toBe(5);
    });

    it('produces chronological daily breakdown', () => {
      const s = computeStats([
        { date: '2026-05-02T10:00:00.000Z', durationMs: 60_000, stars: 5, levelId: 1 },
        { date: '2026-05-01T10:00:00.000Z', durationMs: 30_000, stars: 3, levelId: 1 },
      ]);
      expect(s.dailyBreakdown.map(d => d.date)).toEqual(['2026-05-01', '2026-05-02']);
    });
  });

  it('getSessionStats integrates loading + computing', async () => {
    mockStorage.getItem.mockResolvedValue(
      JSON.stringify([
        { date: new Date().toISOString(), durationMs: 60_000, stars: 5, levelId: 1 },
      ]),
    );
    const s = await getSessionStats();
    expect(s.totalSessions).toBe(1);
    expect(s.averageStars).toBe(5);
  });
});
