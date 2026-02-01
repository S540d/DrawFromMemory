/**
 * i18n Service Tests
 */

// Mock expo-localization
jest.mock('expo-localization', () => ({
  getLocales: jest.fn().mockReturnValue([{ languageCode: 'de' }]),
}));

// Mock storageManager before importing i18n
jest.mock('../StorageManager', () => ({
  __esModule: true,
  default: {
    getSetting: jest.fn().mockResolvedValue('de'),
    setSetting: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('i18n Service', () => {
  let setLanguage: any;
  let getLanguage: any;
  let initLanguage: any;
  let getDeviceLanguage: any;
  let storageManager: any;
  let Localization: any;

  beforeEach(() => {
    // Reset the module to clear isInitialized flag
    jest.resetModules();
    
    // Re-import modules
    storageManager = require('../StorageManager').default;
    Localization = require('expo-localization');
    const i18n = require('../i18n');
    setLanguage = i18n.setLanguage;
    getLanguage = i18n.getLanguage;
    initLanguage = i18n.initLanguage;
    getDeviceLanguage = i18n.getDeviceLanguage;
    
    // Clear mock history
    jest.clearAllMocks();
  });

  describe('getDeviceLanguage', () => {
    it('should detect German locale', () => {
      Localization.getLocales.mockReturnValue([{ languageCode: 'de' }]);
      expect(getDeviceLanguage()).toBe('de');
    });

    it('should detect English locale', () => {
      Localization.getLocales.mockReturnValue([{ languageCode: 'en' }]);
      expect(getDeviceLanguage()).toBe('en');
    });

    it('should fallback to German for unsupported locales', () => {
      Localization.getLocales.mockReturnValue([{ languageCode: 'fr' }]);
      expect(getDeviceLanguage()).toBe('de');
    });

    it('should fallback to German on error', () => {
      Localization.getLocales.mockImplementation(() => {
        throw new Error('Localization error');
      });
      expect(getDeviceLanguage()).toBe('de');
    });
  });

  describe('setLanguage', () => {
    it('should save language to storage', async () => {
      await setLanguage('en');
      
      expect(storageManager.setSetting).toHaveBeenCalledWith('language', 'en');
      expect(getLanguage()).toBe('en');
    });

    it('should handle storage errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      storageManager.setSetting.mockRejectedValueOnce(new Error('Storage error'));
      
      await setLanguage('en');
      
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save language to storage:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('initLanguage', () => {
    it('should load language from storage when available', async () => {
      storageManager.getSetting.mockResolvedValueOnce('en');
      
      await initLanguage();
      
      expect(storageManager.getSetting).toHaveBeenCalledWith('language');
      expect(getLanguage()).toBe('en');
    });

    it('should use device language when no saved language exists', async () => {
      storageManager.getSetting.mockResolvedValueOnce(null);
      Localization.getLocales.mockReturnValue([{ languageCode: 'en' }]);
      
      await initLanguage();
      
      expect(getLanguage()).toBe('en');
      expect(storageManager.setSetting).toHaveBeenCalledWith('language', 'en');
    });

    it('should use device language when saved language is invalid', async () => {
      storageManager.getSetting.mockResolvedValueOnce('invalid');
      Localization.getLocales.mockReturnValue([{ languageCode: 'en' }]);
      
      await initLanguage();
      
      expect(getLanguage()).toBe('en');
      expect(storageManager.setSetting).toHaveBeenCalledWith('language', 'en');
    });

    it('should only initialize once', async () => {
      storageManager.getSetting.mockResolvedValue('en');
      
      await initLanguage();
      await initLanguage();
      
      // Should only call getSetting once
      expect(storageManager.getSetting).toHaveBeenCalledTimes(1);
    });

    it('should fallback to device language on storage error', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      storageManager.getSetting.mockRejectedValueOnce(new Error('Storage error'));
      Localization.getLocales.mockReturnValue([{ languageCode: 'en' }]);
      
      await initLanguage();
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('Failed to load language from storage:', expect.any(Error));
      expect(getLanguage()).toBe('en');
      consoleWarnSpy.mockRestore();
    });
  });
});
