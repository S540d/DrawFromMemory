import { renderHook, act } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { useReduceMotion } from '../useReduceMotion';

describe('useReduceMotion', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('starts as false (safe default)', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({ remove: jest.fn() } as any);
    const { result } = renderHook(() => useReduceMotion());
    await act(async () => {});
    expect(result.current).toBe(false);
  });

  it('returns true once isReduceMotionEnabled resolves true', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({ remove: jest.fn() } as any);
    const { result } = renderHook(() => useReduceMotion());
    await act(async () => {});
    expect(result.current).toBe(true);
  });

  it('subscribes to reduceMotionChanged event and updates state on toggle', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    let capturedHandler: ((rm: boolean) => void) | undefined;
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation((_event, handler) => {
      capturedHandler = handler as unknown as (rm: boolean) => void;
      return { remove: jest.fn() } as any;
    });

    const { result } = renderHook(() => useReduceMotion());
    await act(async () => {});
    expect(result.current).toBe(false);

    await act(async () => {
      capturedHandler?.(true);
    });
    expect(result.current).toBe(true);

    await act(async () => {
      capturedHandler?.(false);
    });
    expect(result.current).toBe(false);
  });

  it('cleans up subscription on unmount', async () => {
    const remove = jest.fn();
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({ remove } as any);
    const { unmount } = renderHook(() => useReduceMotion());
    await act(async () => {});
    unmount();
    expect(remove).toHaveBeenCalled();
  });
});
