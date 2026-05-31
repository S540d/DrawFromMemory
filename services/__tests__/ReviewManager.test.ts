/**
 * ReviewManager Tests
 * Prüft Review-Trigger-Logik: Cooldown, 5-Sterne, Daily-Counter, Web-Guard
 */

jest.mock('react-native', () => ({
  Platform: { OS: 'android' },
}));

jest.mock('../StorageManager', () => ({
  __esModule: true,
  default: {
    getReviewLastShown: jest.fn(),
    setReviewLastShown: jest.fn(),
    incrementReviewDailyCount: jest.fn(),
    resetReviewDailyCount: jest.fn(),
  },
}));

jest.mock('expo-store-review', () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  requestReview: jest.fn().mockResolvedValue(undefined),
}));

import { Platform } from 'react-native';
import { requestReviewIfEligible } from '../ReviewManager';
import storageManager from '../StorageManager';

type MockSM = {
  getReviewLastShown: jest.Mock;
  setReviewLastShown: jest.Mock;
  incrementReviewDailyCount: jest.Mock;
  resetReviewDailyCount: jest.Mock;
};

const sm = storageManager as unknown as MockSM;

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

describe('ReviewManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_ENABLE_IN_APP_REVIEW = 'true';
    (Platform as { OS: string }).OS = 'android';
    sm.getReviewLastShown.mockResolvedValue(null);
    sm.setReviewLastShown.mockResolvedValue(undefined);
    sm.incrementReviewDailyCount.mockResolvedValue(1);
    sm.resetReviewDailyCount.mockResolvedValue(undefined);
  });

  describe('feature flag', () => {
    it('tut nichts wenn EXPO_PUBLIC_ENABLE_IN_APP_REVIEW nicht gesetzt', async () => {
      delete process.env.EXPO_PUBLIC_ENABLE_IN_APP_REVIEW;
      await requestReviewIfEligible(true, false);
      expect(sm.getReviewLastShown).not.toHaveBeenCalled();
      expect(sm.setReviewLastShown).not.toHaveBeenCalled();
    });
  });

  describe('web platform guard', () => {
    it('returns immediately on web without touching storage', async () => {
      (Platform as { OS: string }).OS = 'web';
      await requestReviewIfEligible(true, false);
      expect(sm.getReviewLastShown).not.toHaveBeenCalled();
      expect(sm.setReviewLastShown).not.toHaveBeenCalled();
    });
  });

  describe('cooldown guard (90 Tage)', () => {
    it('zeigt keinen Dialog wenn vor 10 Tagen bereits gezeigt', async () => {
      sm.getReviewLastShown.mockResolvedValue(daysAgo(10));
      await requestReviewIfEligible(true, false);
      expect(sm.setReviewLastShown).not.toHaveBeenCalled();
    });

    it('zeigt Dialog wenn vor 91 Tagen gezeigt (> Cooldown)', async () => {
      sm.getReviewLastShown.mockResolvedValue(daysAgo(91));
      await requestReviewIfEligible(true, false);
      expect(sm.setReviewLastShown).toHaveBeenCalled();
    });

    it('zeigt Dialog wenn noch nie gezeigt (null)', async () => {
      await requestReviewIfEligible(true, false);
      expect(sm.setReviewLastShown).toHaveBeenCalled();
    });
  });

  describe('5-Sterne-Trigger', () => {
    it('triggert Dialog bei 5-Sterne-Bewertung', async () => {
      await requestReviewIfEligible(true, false);
      expect(sm.setReviewLastShown).toHaveBeenCalled();
      expect(sm.resetReviewDailyCount).toHaveBeenCalled();
    });

    it('triggert keinen Dialog ohne 5 Sterne und ohne Daily Challenge', async () => {
      await requestReviewIfEligible(false, false);
      expect(sm.setReviewLastShown).not.toHaveBeenCalled();
    });
  });

  describe('Daily-Challenge-Counter', () => {
    it('triggert keinen Dialog bei Counter 1', async () => {
      sm.incrementReviewDailyCount.mockResolvedValue(1);
      await requestReviewIfEligible(false, true);
      expect(sm.setReviewLastShown).not.toHaveBeenCalled();
    });

    it('triggert keinen Dialog bei Counter 2', async () => {
      sm.incrementReviewDailyCount.mockResolvedValue(2);
      await requestReviewIfEligible(false, true);
      expect(sm.setReviewLastShown).not.toHaveBeenCalled();
    });

    it('triggert Dialog und resettet Counter bei Counter 3', async () => {
      sm.incrementReviewDailyCount.mockResolvedValue(3);
      await requestReviewIfEligible(false, true);
      expect(sm.setReviewLastShown).toHaveBeenCalled();
      expect(sm.resetReviewDailyCount).toHaveBeenCalled();
    });

    it('resettet Counter auch wenn 5-Sterne-Trigger feuert (Bug-Fix)', async () => {
      // Counter ist 2 (nicht 3), aber 5 Sterne triggern trotzdem den Dialog
      sm.incrementReviewDailyCount.mockResolvedValue(2);
      await requestReviewIfEligible(true, true);
      expect(sm.setReviewLastShown).toHaveBeenCalled();
      // Counter muss trotzdem zurückgesetzt werden, sonst würde er nach
      // Ablauf des Cooldowns zu früh wieder triggern
      expect(sm.resetReviewDailyCount).toHaveBeenCalled();
    });
  });
});
