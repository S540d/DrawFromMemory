/**
 * SessionTracker — Lokale Spielsessions für Eltern-Dashboard (Issue #188)
 *
 * Speichert pro abgeschlossener Runde:
 *   { date, durationMs, stars, levelId }
 *
 * Auto-Cleanup: Einträge älter als FOUR_WEEKS_MS (28 Tage) werden beim
 * nächsten Zugriff entfernt. Daten verlassen das Gerät nicht.
 */

import { createPersistedJson } from './storage/persistedJson';

export const FOUR_WEEKS_MS = 28 * 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 1000; // hard cap, defensiv

export interface SessionRecord {
  date: string;       // ISO timestamp
  durationMs: number;
  stars: number;      // 0..5
  levelId: number;
}

export interface SessionStats {
  totalSessions: number;
  totalDurationMs: number;
  averageStars: number;
  favoriteLevels: { levelId: number; count: number }[]; // top 3
  dailyBreakdown: { date: string; sessions: number; totalDurationMs: number; avgStars: number }[];
}

const store = createPersistedJson<SessionRecord[]>({
  key: '@merke_male:sessions',
  defaultValue: [],
  isValid: (v): v is SessionRecord[] => Array.isArray(v),
});

function pruneOld(records: SessionRecord[], now: number = Date.now()): SessionRecord[] {
  const cutoff = now - FOUR_WEEKS_MS;
  const fresh = records.filter((r) => {
    const t = Date.parse(r.date);
    return Number.isFinite(t) && t >= cutoff;
  });
  // Hard-cap (defensiv falls jemand sehr viel spielt)
  return fresh.length > MAX_ENTRIES ? fresh.slice(-MAX_ENTRIES) : fresh;
}

export async function recordSession(record: Omit<SessionRecord, 'date'> & { date?: string }): Promise<void> {
  try {
    const records = await store.load();
    const next: SessionRecord = {
      date: record.date ?? new Date().toISOString(),
      durationMs: Math.max(0, Math.floor(record.durationMs)),
      stars: Math.max(0, Math.min(5, Math.floor(record.stars))),
      levelId: Math.max(0, Math.floor(record.levelId)),
    };
    const pruned = pruneOld([...records, next]);
    await store.save(pruned);
  } catch {
    // best-effort
  }
}

export async function getSessions(now: number = Date.now()): Promise<SessionRecord[]> {
  try {
    const records = await store.load();
    const pruned = pruneOld(records, now);
    if (pruned.length !== records.length) {
      // persistiere Cleanup
      await store.save(pruned);
    }
    return pruned;
  } catch {
    return [];
  }
}

export async function clearSessions(): Promise<void> {
  await store.reset();
}

function localDateKey(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function computeStats(records: SessionRecord[]): SessionStats {
  if (records.length === 0) {
    return {
      totalSessions: 0,
      totalDurationMs: 0,
      averageStars: 0,
      favoriteLevels: [],
      dailyBreakdown: [],
    };
  }
  const totalSessions = records.length;
  const totalDurationMs = records.reduce((sum, r) => sum + r.durationMs, 0);
  const totalStars = records.reduce((sum, r) => sum + r.stars, 0);
  const averageStars = totalStars / totalSessions;

  // Favorite levels (top 3 by play count)
  const levelCounts = new Map<number, number>();
  records.forEach((r) => levelCounts.set(r.levelId, (levelCounts.get(r.levelId) ?? 0) + 1));
  const favoriteLevels = Array.from(levelCounts.entries())
    .map(([levelId, count]) => ({ levelId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // Daily breakdown (chronological)
  const dailyMap = new Map<string, { sessions: number; totalDurationMs: number; starsSum: number }>();
  records.forEach((r) => {
    const key = localDateKey(r.date);
    const entry = dailyMap.get(key) ?? { sessions: 0, totalDurationMs: 0, starsSum: 0 };
    entry.sessions += 1;
    entry.totalDurationMs += r.durationMs;
    entry.starsSum += r.stars;
    dailyMap.set(key, entry);
  });
  const dailyBreakdown = Array.from(dailyMap.entries())
    .map(([date, v]) => ({
      date,
      sessions: v.sessions,
      totalDurationMs: v.totalDurationMs,
      avgStars: v.starsSum / v.sessions,
    }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  return { totalSessions, totalDurationMs, averageStars, favoriteLevels, dailyBreakdown };
}

export async function getSessionStats(): Promise<SessionStats> {
  const records = await getSessions();
  return computeStats(records);
}
