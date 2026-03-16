/**
 * useTimer Hook Tests
 */
import { renderHook, act } from '@testing-library/react-native';
import { useTimer } from '../useTimer';

jest.mock('../SoundManager', () => ({
  __esModule: true,
  default: {
    playTimerTick: jest.fn(),
  },
}));

describe('useTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts with timeRemaining = 0', () => {
    const { result } = renderHook(() =>
      useTimer({ phase: 'memorize', onExpire: jest.fn() })
    );
    expect(result.current.timeRemaining).toBe(0);
  });

  it('does not call onExpire on initial 0', () => {
    const onExpire = jest.fn();
    renderHook(() => useTimer({ phase: 'memorize', onExpire }));
    act(() => { jest.advanceTimersByTime(2000); });
    expect(onExpire).not.toHaveBeenCalled();
  });

  it('counts down every second during memorize phase', () => {
    const { result } = renderHook(() =>
      useTimer({ phase: 'memorize', onExpire: jest.fn() })
    );

    act(() => { result.current.setTimeRemaining(3); });
    // After setting, hasStarted is false, so we need to trigger the effect
    // setTimeRemaining resets hasStarted, but timeRemaining > 0 + memorize will set hasStarted=true
    act(() => { jest.advanceTimersByTime(1000); });
    expect(result.current.timeRemaining).toBe(2);

    act(() => { jest.advanceTimersByTime(1000); });
    expect(result.current.timeRemaining).toBe(1);
  });

  it('plays tick sound on each countdown step', () => {
    const SoundManager = require('../SoundManager').default;
    const { result } = renderHook(() =>
      useTimer({ phase: 'memorize', onExpire: jest.fn() })
    );

    act(() => { result.current.setTimeRemaining(2); });
    act(() => { jest.advanceTimersByTime(1000); });
    expect(SoundManager.playTimerTick).toHaveBeenCalledTimes(1);

    act(() => { jest.advanceTimersByTime(1000); });
    expect(SoundManager.playTimerTick).toHaveBeenCalledTimes(2);
  });

  it('calls onExpire when countdown reaches 0', () => {
    const onExpire = jest.fn();
    const { result } = renderHook(() =>
      useTimer({ phase: 'memorize', onExpire })
    );

    act(() => { result.current.setTimeRemaining(1); });
    act(() => { jest.advanceTimersByTime(1000); });
    expect(result.current.timeRemaining).toBe(0);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('does not count down during draw phase', () => {
    const { result } = renderHook(() =>
      useTimer({ phase: 'draw', onExpire: jest.fn() })
    );

    act(() => { result.current.setTimeRemaining(5); });
    act(() => { jest.advanceTimersByTime(3000); });
    expect(result.current.timeRemaining).toBe(5);
  });

  it('does not count down during result phase', () => {
    const { result } = renderHook(() =>
      useTimer({ phase: 'result', onExpire: jest.fn() })
    );

    act(() => { result.current.setTimeRemaining(5); });
    act(() => { jest.advanceTimersByTime(3000); });
    expect(result.current.timeRemaining).toBe(5);
  });

  it('setTimeRemaining resets hasStarted so onExpire is not called on next 0', () => {
    const onExpire = jest.fn();
    const { result } = renderHook(() =>
      useTimer({ phase: 'memorize', onExpire })
    );

    // First countdown
    act(() => { result.current.setTimeRemaining(1); });
    act(() => { jest.advanceTimersByTime(1000); });
    expect(onExpire).toHaveBeenCalledTimes(1);

    // Set to 0 directly via setTimeRemaining - should NOT trigger onExpire again
    act(() => { result.current.setTimeRemaining(0); });
    act(() => { jest.advanceTimersByTime(1000); });
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('cleans up timer on unmount', () => {
    const { result, unmount } = renderHook(() =>
      useTimer({ phase: 'memorize', onExpire: jest.fn() })
    );

    act(() => { result.current.setTimeRemaining(5); });
    // Start ticking
    act(() => { jest.advanceTimersByTime(1000); });
    expect(result.current.timeRemaining).toBe(4);

    unmount();
    // No error should occur when timers fire after unmount
    jest.advanceTimersByTime(5000);
  });
});
