/**
 * SoundManager Tests
 * Testet das Verhalten auf Web-Plattform (AudioContext) und Native (Haptics)
 */

// Mock react-native Platform
jest.mock('react-native', () => ({
  Platform: { OS: 'web' },
}));

// Mock StorageManager
jest.mock('../StorageManager', () => ({
  __esModule: true,
  default: {
    getSetting: jest.fn().mockResolvedValue(true),
  },
}));

describe('SoundManager', () => {
  let mockOscillator: {
    type: string;
    frequency: { value: number };
    connect: jest.Mock;
    start: jest.Mock;
    stop: jest.Mock;
  };
  let mockGainNode: {
    gain: { setValueAtTime: jest.Mock; exponentialRampToValueAtTime: jest.Mock };
    connect: jest.Mock;
  };
  let mockAudioContext: {
    state: string;
    currentTime: number;
    destination: object;
    resume: jest.Mock;
    createOscillator: jest.Mock;
    createGain: jest.Mock;
  };
  let MockAudioContextClass: jest.Mock;

  beforeEach(() => {
    // Reset modules so singleton is re-created fresh each test
    jest.resetModules();

    mockOscillator = {
      type: 'sine',
      frequency: { value: 0 },
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
    };

    mockGainNode = {
      gain: {
        setValueAtTime: jest.fn(),
        exponentialRampToValueAtTime: jest.fn(),
      },
      connect: jest.fn(),
    };

    mockAudioContext = {
      state: 'running',
      currentTime: 0,
      destination: {},
      resume: jest.fn(),
      createOscillator: jest.fn(() => mockOscillator),
      createGain: jest.fn(() => mockGainNode),
    };

    MockAudioContextClass = jest.fn(() => mockAudioContext);

    // Setup window with AudioContext before module loads
    Object.defineProperty(global, 'window', {
      value: { AudioContext: MockAudioContextClass },
      writable: true,
      configurable: true,
    });

    // Re-apply mocks after resetModules
    jest.mock('react-native', () => ({ Platform: { OS: 'web' } }));
    jest.mock('../StorageManager', () => ({
      __esModule: true,
      default: { getSetting: jest.fn().mockResolvedValue(true) },
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const getSoundManager = () => require('../SoundManager').default;

  describe('init', () => {
    it('should initialize and load soundEnabled setting', async () => {
      const sm = getSoundManager();
      const storageManager = require('../StorageManager').default;
      await sm.init();
      expect(storageManager.getSetting).toHaveBeenCalledWith('soundEnabled');
    });

    it('should not re-initialize if already initialized', async () => {
      const sm = getSoundManager();
      const storageManager = require('../StorageManager').default;
      await sm.init();
      await sm.init();
      expect(storageManager.getSetting).toHaveBeenCalledTimes(1);
    });
  });

  describe('setSoundEnabled + playback', () => {
    it('should play tone when sound is enabled', () => {
      const sm = getSoundManager();
      sm.setSoundEnabled(true);
      sm.playTimerTick();
      expect(MockAudioContextClass).toHaveBeenCalled();
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
      expect(mockAudioContext.createGain).toHaveBeenCalled();
    });

    it('should not play tone when sound is disabled', () => {
      const sm = getSoundManager();
      sm.setSoundEnabled(false);
      sm.playTimerTick();
      expect(mockAudioContext.createOscillator).not.toHaveBeenCalled();
    });

    it('should connect oscillator to gain and gain to destination', () => {
      const sm = getSoundManager();
      sm.setSoundEnabled(true);
      sm.playTimerTick();
      expect(mockOscillator.connect).toHaveBeenCalledWith(mockGainNode);
      expect(mockGainNode.connect).toHaveBeenCalledWith(mockAudioContext.destination);
    });
  });

  describe('playButtonTap', () => {
    it('should play a tone when sound is enabled', () => {
      const sm = getSoundManager();
      sm.setSoundEnabled(true);
      sm.playButtonTap();
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    it('should not play when disabled', () => {
      const sm = getSoundManager();
      sm.setSoundEnabled(false);
      sm.playButtonTap();
      expect(mockAudioContext.createOscillator).not.toHaveBeenCalled();
    });
  });

  describe('playDrawStart', () => {
    it('should play a tone when enabled', () => {
      const sm = getSoundManager();
      sm.setSoundEnabled(true);
      sm.playDrawStart();
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });
  });

  describe('playStarTap', () => {
    it('should play a different tone per star number', () => {
      const sm = getSoundManager();
      sm.setSoundEnabled(true);
      [1, 2, 3, 4, 5].forEach(star => {
        mockAudioContext.createOscillator.mockClear();
        sm.playStarTap(star);
        expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(1);
        // Frequency increases with star number
        expect(mockOscillator.frequency.value).toBe(400 + star * 100);
      });
    });

    it('should not play when disabled', () => {
      const sm = getSoundManager();
      sm.setSoundEnabled(false);
      sm.playStarTap(3);
      expect(mockAudioContext.createOscillator).not.toHaveBeenCalled();
    });
  });

  describe('playPhaseTransition', () => {
    it('should not play when disabled', () => {
      const sm = getSoundManager();
      sm.setSoundEnabled(false);
      sm.playPhaseTransition();
      expect(mockAudioContext.createOscillator).not.toHaveBeenCalled();
    });

    it('should schedule 3 tones via setTimeout when enabled', () => {
      const timeouts: (() => void)[] = [];
      jest.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
        timeouts.push(fn);
        return 0 as any;
      });

      const sm = getSoundManager();
      sm.setSoundEnabled(true);
      sm.playPhaseTransition();

      // All 3 tones are scheduled via setTimeout (0ms, 150ms, 300ms)
      expect(timeouts.length).toBeGreaterThanOrEqual(2);

      // Fire all scheduled callbacks
      timeouts.forEach(fn => fn());
      expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(3);

      jest.restoreAllMocks();
    });
  });

  describe('playSuccess', () => {
    it('should not play when disabled', () => {
      const sm = getSoundManager();
      sm.setSoundEnabled(false);
      sm.playSuccess();
      expect(mockAudioContext.createOscillator).not.toHaveBeenCalled();
    });

    it('should schedule 2 tones via setTimeout when enabled', () => {
      const timeouts: (() => void)[] = [];
      jest.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
        timeouts.push(fn);
        return 0 as any;
      });

      const sm = getSoundManager();
      sm.setSoundEnabled(true);
      sm.playSuccess();

      // Fire all scheduled callbacks
      timeouts.forEach(fn => fn());
      expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(2);

      jest.restoreAllMocks();
    });
  });

  describe('AudioContext suspended state', () => {
    it('should resume suspended AudioContext before playing', () => {
      const sm = getSoundManager();
      mockAudioContext.state = 'suspended';
      sm.setSoundEnabled(true);
      sm.playTimerTick();
      expect(mockAudioContext.resume).toHaveBeenCalled();
    });
  });

  describe('AudioContext creation failure', () => {
    it('should not crash if AudioContext throws', () => {
      MockAudioContextClass.mockImplementationOnce(() => {
        throw new Error('AudioContext not supported');
      });
      // Clear cached context by resetting modules
      jest.resetModules();
      jest.mock('react-native', () => ({ Platform: { OS: 'web' } }));
      jest.mock('../StorageManager', () => ({
        __esModule: true,
        default: { getSetting: jest.fn().mockResolvedValue(true) },
      }));

      const sm2 = require('../SoundManager').default;
      sm2.setSoundEnabled(true);
      expect(() => sm2.playTimerTick()).not.toThrow();
    });
  });
});
