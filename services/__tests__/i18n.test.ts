/**
 * i18n Service Tests
 */

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
  let storageManager: any;

  beforeEach(() => {
    // Reset the module to clear isInitialized flag
    jest.resetModules();
    
    // Re-import modules
    storageManager = require('../StorageManager').default;
    const i18n = require('../i18n');
    setLanguage = i18n.setLanguage;
    getLanguage = i18n.getLanguage;
    initLanguage = i18n.initLanguage;
    
    // Clear mock history
    jest.clearAllMocks();
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
    it('should load language from storage', async () => {
      storageManager.getSetting.mockResolvedValueOnce('en');
      
      await initLanguage();
      
      expect(storageManager.getSetting).toHaveBeenCalledWith('language');
      expect(getLanguage()).toBe('en');
    });

    it('should only initialize once', async () => {
      storageManager.getSetting.mockResolvedValue('en');
      
      await initLanguage();
      await initLanguage();
      
      // Should only call getSetting once
      expect(storageManager.getSetting).toHaveBeenCalledTimes(1);
    });

    it('should handle storage errors gracefully', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      storageManager.getSetting.mockRejectedValueOnce(new Error('Storage error'));
      
      await initLanguage();
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('Failed to load language from storage:', expect.any(Error));
      consoleWarnSpy.mockRestore();
    });
  });
});
