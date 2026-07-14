/**
 * AgeGroupManager Tests (Issue #279, 1.3)
 */
import {
  getAgeGroup,
  setAgeGroup,
  isAgeGroupSelected,
  resetAgeGroup,
  getExtraTimeForAgeGroup,
  getDefaultStrokeWidthForAgeGroup,
  getRecommendedLevelRange,
} from '../AgeGroupManager';

describe('AgeGroupManager', () => {
  beforeEach(async () => {
    await resetAgeGroup();
  });

  it('returns null before any age group is selected', async () => {
    expect(await getAgeGroup()).toBeNull();
    expect(await isAgeGroupSelected()).toBe(false);
  });

  it('persists a selected age group', async () => {
    await setAgeGroup('6-8');
    expect(await getAgeGroup()).toBe('6-8');
    expect(await isAgeGroupSelected()).toBe(true);
  });

  describe('getExtraTimeForAgeGroup', () => {
    it('grants extra time only for 3-5', () => {
      expect(getExtraTimeForAgeGroup('3-5')).toBe(true);
      expect(getExtraTimeForAgeGroup('6-8')).toBe(false);
      expect(getExtraTimeForAgeGroup('9plus')).toBe(false);
      expect(getExtraTimeForAgeGroup(null)).toBe(false);
    });
  });

  describe('getDefaultStrokeWidthForAgeGroup', () => {
    it('returns thick strokes for young kids and thin for older kids', () => {
      expect(getDefaultStrokeWidthForAgeGroup('3-5')).toBe(5);
      expect(getDefaultStrokeWidthForAgeGroup('6-8')).toBe(3);
      expect(getDefaultStrokeWidthForAgeGroup('9plus')).toBe(2);
      expect(getDefaultStrokeWidthForAgeGroup(null)).toBe(3);
    });
  });

  describe('getRecommendedLevelRange', () => {
    it('narrows the range for younger age groups', () => {
      expect(getRecommendedLevelRange('3-5')).toEqual([1, 8]);
      expect(getRecommendedLevelRange('6-8')).toEqual([1, 14]);
      expect(getRecommendedLevelRange('9plus')).toEqual([1, 20]);
      expect(getRecommendedLevelRange(null)).toEqual([1, 20]);
    });
  });
});
