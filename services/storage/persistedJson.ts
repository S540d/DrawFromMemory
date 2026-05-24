/**
 * createPersistedJson — small JSON-Persistence-Helper für AsyncStorage.
 *
 * Verwendet von Services, die typed JSON-Datenstrukturen unter einem
 * AsyncStorage-Key halten und folgende Eigenschaften brauchen:
 *
 *  - Async-Lesen mit In-Memory-Fallback (Web-Sessions oder Storage-Errors)
 *  - Schutz vor korrupten JSON-Werten (silent recover → default + cleanup)
 *  - Defensive Parse-Validierung pro Typ (Caller liefert Predicate)
 *
 * Ersetzt 3× kopierten Boilerplate in
 *   - StreakManager · AchievementManager · SessionTracker
 *
 * Beispiel:
 *
 *   const store = createPersistedJson<StreakData>({
 *     key: '@merke_male:streak',
 *     defaultValue: { currentStreak: 0, longestStreak: 0, lastPlayedDate: null },
 *     isValid: (v): v is StreakData =>
 *       typeof v === 'object' && v !== null && 'currentStreak' in v,
 *   });
 *   await store.load();
 *   await store.save({ ... });
 *   await store.reset();
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PersistedJsonStore<T> {
  load(): Promise<T>;
  save(value: T): Promise<void>;
  reset(): Promise<void>;
}

interface CreateOptions<T> {
  key: string;
  defaultValue: T;
  /**
   * Type-guard / shape-validator. If a stored value does not pass this check,
   * it is treated as corrupt — storage is cleared and `defaultValue` returned.
   * If omitted, any successfully-parsed JSON is accepted.
   */
  isValid?: (parsed: unknown) => parsed is T;
}

export function createPersistedJson<T>(opts: CreateOptions<T>): PersistedJsonStore<T> {
  const { key, defaultValue, isValid } = opts;
  let memory: string | undefined;

  // Returns null both on parse failure and on validation failure.
  // Callers treat null as "missing/corrupt". This means `T` must not include
  // JSON `null` as a valid value — document this constraint at call sites.
  function safeParse(raw: string | undefined | null): T | null {
    if (raw == null) return null; // null/undefined → missing (not corrupt)
    try {
      const v = JSON.parse(raw) as unknown;
      if (isValid && !isValid(v)) return null;
      return v as T;
    } catch {
      return null;
    }
  }

  async function load(): Promise<T> {
    let raw: string | null = null;
    try {
      raw = await AsyncStorage.getItem(key);
    } catch {
      // fall through to in-memory
    }

    const parsed = safeParse(raw) ?? safeParse(memory);
    if (parsed !== null) {
      if (raw) memory = raw;
      return parsed;
    }

    if (raw != null) {
      // value stored but unparseable — drop it so future loads don't keep tripping
      memory = undefined;
      try { await AsyncStorage.removeItem(key); } catch { /* best-effort */ }
    }
    // Return a deep copy so callers cannot mutate the shared defaultValue reference.
    return JSON.parse(JSON.stringify(defaultValue)) as T;
  }

  async function save(value: T): Promise<void> {
    const raw = JSON.stringify(value);
    memory = raw;
    try {
      await AsyncStorage.setItem(key, raw);
    } catch {
      // in-memory fallback is sufficient
    }
  }

  async function reset(): Promise<void> {
    memory = undefined;
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // best-effort
    }
  }

  return { load, save, reset };
}
