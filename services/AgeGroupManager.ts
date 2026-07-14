/**
 * AgeGroupManager — Altersstufen-Auswahl (Issue #279, 1.3)
 * Ersetzt den früheren versteckten `extra_time_mode`-Schalter durch eine
 * bewusste Altersauswahl (3–5 / 6–8 / 9+) beim ersten Start.
 * Steuert Anzeigedauer-Bonus, empfohlenen Level-Bereich (Bildkomplexität)
 * und Standard-Strichstärke.
 */

import { createPersistedJson } from './storage/persistedJson';
import type { AgeGroup } from '../types';

interface AgeGroupState {
  ageGroup: AgeGroup | null;
}

const DEFAULT_STATE: AgeGroupState = { ageGroup: null };

const VALID_AGE_GROUPS: AgeGroup[] = ['3-5', '6-8', '9plus'];

function isAgeGroupState(v: unknown): v is AgeGroupState {
  if (typeof v !== 'object' || v === null) return false;
  const s = v as Record<string, unknown>;
  return s.ageGroup === null || VALID_AGE_GROUPS.includes(s.ageGroup as AgeGroup);
}

const store = createPersistedJson<AgeGroupState>({
  key: '@merke_male:age_group',
  defaultValue: DEFAULT_STATE,
  isValid: isAgeGroupState,
});

/**
 * Lädt die gewählte Altersstufe. `null` bedeutet: noch nicht ausgewählt
 * (löst die Erst-Start-Abfrage auf dem Home-Screen aus).
 */
export async function getAgeGroup(): Promise<AgeGroup | null> {
  const state = await store.load();
  return state.ageGroup;
}

export async function setAgeGroup(ageGroup: AgeGroup): Promise<void> {
  await store.save({ ageGroup });
}

export async function isAgeGroupSelected(): Promise<boolean> {
  return (await getAgeGroup()) !== null;
}

export async function resetAgeGroup(): Promise<void> {
  await store.reset();
}

/**
 * Zusätzliche Anzeigezeit (analog zum früheren `extra_time_mode`-Bonus von
 * +3 s in `LevelManager.getDisplayDuration`) für jüngere Kinder.
 */
export function getExtraTimeForAgeGroup(ageGroup: AgeGroup | null): boolean {
  return ageGroup === '3-5';
}

/**
 * Standard-Strichstärke beim Start einer Zeichenrunde je Altersstufe
 * (Werte passend zu den drei Strichstärken-Optionen in DrawPhase: 2/3/5).
 */
export function getDefaultStrokeWidthForAgeGroup(ageGroup: AgeGroup | null): 2 | 3 | 5 {
  switch (ageGroup) {
    case '3-5':
      return 5;
    case '9plus':
      return 2;
    case '6-8':
    default:
      return 3;
  }
}

/**
 * Empfohlener Level-Bereich je Altersstufe (Bildkomplexität-Steuerung).
 * Bewusst keine harte Sperre — bestehende Level bleiben für alle spielbar,
 * das ist nur eine Empfehlung auf dem Level-Auswahl-Screen.
 */
export function getRecommendedLevelRange(ageGroup: AgeGroup | null): [number, number] {
  switch (ageGroup) {
    case '3-5':
      return [1, 8];
    case '6-8':
      return [1, 14];
    case '9plus':
    default:
      return [1, 20];
  }
}
