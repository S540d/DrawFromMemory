/**
 * SentryService Tests
 * Testet die Gating-Logik: no-op auf Web, no-op ohne DSN, aktiv auf Native mit DSN
 */

const mockInit = jest.fn();
const mockCaptureException = jest.fn();
const mockWithScope = jest.fn((cb: (scope: object) => void) => cb({ setTag: jest.fn() }));

describe('SentryService – web platform (no-op)', () => {
  beforeEach(() => {
    jest.resetModules();
    mockInit.mockClear();
    mockCaptureException.mockClear();
    mockWithScope.mockClear();

    jest.mock('react-native', () => ({ Platform: { OS: 'web' } }));
    jest.mock('@sentry/react-native', () => ({
      init: mockInit,
      captureException: mockCaptureException,
      withScope: mockWithScope,
    }));
  });

  it('initSentry does not call Sentry.init on web', () => {
    process.env.EXPO_PUBLIC_SENTRY_DSN = 'https://test@sentry.io/123';
    const { initSentry } = require('../SentryService');
    initSentry();
    expect(mockInit).not.toHaveBeenCalled();
  });

  it('captureException does not call Sentry on web', () => {
    process.env.EXPO_PUBLIC_SENTRY_DSN = 'https://test@sentry.io/123';
    const { captureException } = require('../SentryService');
    captureException(new Error('test'));
    expect(mockWithScope).not.toHaveBeenCalled();
    expect(mockCaptureException).not.toHaveBeenCalled();
  });
});

describe('SentryService – native platform, empty DSN (no-op)', () => {
  beforeEach(() => {
    jest.resetModules();
    mockInit.mockClear();
    mockCaptureException.mockClear();
    mockWithScope.mockClear();

    jest.mock('react-native', () => ({ Platform: { OS: 'android' } }));
    jest.mock('@sentry/react-native', () => ({
      init: mockInit,
      captureException: mockCaptureException,
      withScope: mockWithScope,
    }));
    process.env.EXPO_PUBLIC_SENTRY_DSN = '';
  });

  it('initSentry does not call Sentry.init without DSN', () => {
    const { initSentry } = require('../SentryService');
    initSentry();
    expect(mockInit).not.toHaveBeenCalled();
  });

  it('captureException does not call Sentry without DSN', () => {
    const { captureException } = require('../SentryService');
    captureException(new Error('test'));
    expect(mockWithScope).not.toHaveBeenCalled();
  });
});

describe('SentryService – native platform, with DSN (active)', () => {
  beforeEach(() => {
    jest.resetModules();
    mockInit.mockClear();
    mockCaptureException.mockClear();
    mockWithScope.mockClear();

    jest.mock('react-native', () => ({ Platform: { OS: 'android' } }));
    jest.mock('@sentry/react-native', () => ({
      init: mockInit,
      captureException: mockCaptureException,
      withScope: mockWithScope,
    }));
    process.env.EXPO_PUBLIC_SENTRY_DSN = 'https://test@sentry.io/123';
  });

  it('initSentry calls Sentry.init with correct config', () => {
    const { initSentry } = require('../SentryService');
    initSentry();
    expect(mockInit).toHaveBeenCalledTimes(1);
    expect(mockInit).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'https://test@sentry.io/123',
        tracesSampleRate: 0.2,
      })
    );
  });

  it('captureException calls Sentry.withScope and captureException', () => {
    const { captureException } = require('../SentryService');
    const error = new Error('crash');
    captureException(error);
    expect(mockWithScope).toHaveBeenCalledTimes(1);
    expect(mockCaptureException).toHaveBeenCalledWith(error);
  });

  it('captureException sets context tags on scope', () => {
    const mockSetTag = jest.fn();
    mockWithScope.mockImplementationOnce((cb: (scope: { setTag: jest.Mock }) => void) =>
      cb({ setTag: mockSetTag })
    );
    const { captureException } = require('../SentryService');
    captureException(new Error('crash'), { platform: 'android', version: '1.2.1' });
    expect(mockSetTag).toHaveBeenCalledWith('platform', 'android');
    expect(mockSetTag).toHaveBeenCalledWith('version', '1.2.1');
  });
});
