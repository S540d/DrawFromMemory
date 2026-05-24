import AsyncStorage from '@react-native-async-storage/async-storage';
import { isOnboardingDone, markOnboardingDone, resetOnboarding } from '../OnboardingManager';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const mockStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('OnboardingManager', () => {
  beforeEach(async () => {
    mockStorage.getItem.mockReset();
    mockStorage.setItem.mockReset();
    mockStorage.removeItem.mockReset();
    mockStorage.getItem.mockResolvedValue(null);
    await resetOnboarding();
  });

  it('returns false when nothing is stored', async () => {
    expect(await isOnboardingDone()).toBe(false);
  });

  it('returns true after markOnboardingDone', async () => {
    await markOnboardingDone();
    mockStorage.getItem.mockResolvedValue('1');
    expect(await isOnboardingDone()).toBe(true);
  });

  it('persists the flag to AsyncStorage', async () => {
    await markOnboardingDone();
    expect(mockStorage.setItem).toHaveBeenCalledWith('@merke_male:onboarding_done', '1');
  });

  it('falls back to in-memory when AsyncStorage throws', async () => {
    mockStorage.setItem.mockRejectedValueOnce(new Error('storage offline'));
    await markOnboardingDone();
    // getItem will return null but in-memory cache should still report done
    mockStorage.getItem.mockResolvedValue(null);
    expect(await isOnboardingDone()).toBe(true);
  });
});
