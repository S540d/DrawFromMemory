import { renderHook, act } from '@testing-library/react-native';
import { Linking, Alert } from 'react-native';
import { useParentalGateAction } from '../useParentalGateAction';

describe('useParentalGateAction', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('starts with the gate closed', () => {
    const { result } = renderHook(() => useParentalGateAction());
    expect(result.current.gateVisible).toBe(false);
  });

  it('openWithAction shows the gate and runs the action on success', async () => {
    const run = jest.fn();
    const { result } = renderHook(() => useParentalGateAction());

    act(() => {
      result.current.openWithAction(run);
    });
    expect(result.current.gateVisible).toBe(true);

    await act(async () => {
      await result.current.onSuccess();
    });
    expect(run).toHaveBeenCalled();
    expect(result.current.gateVisible).toBe(false);
  });

  it('openWithUrl calls Linking.openURL on success', async () => {
    const canOpen = jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    const { result } = renderHook(() => useParentalGateAction());

    act(() => {
      result.current.openWithUrl('https://example.com', { errorTitle: 'E', errorMessage: 'M' });
    });
    await act(async () => {
      await result.current.onSuccess();
    });

    expect(canOpen).toHaveBeenCalledWith('https://example.com');
    expect(open).toHaveBeenCalledWith('https://example.com');
  });

  it('alerts when Linking cannot open the URL', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { result } = renderHook(() => useParentalGateAction());

    act(() => {
      result.current.openWithUrl('https://x', { errorTitle: 'Err', errorMessage: 'Msg' });
    });
    await act(async () => {
      await result.current.onSuccess();
    });

    expect(alert).toHaveBeenCalledWith('Err', 'Msg');
  });

  it('onCancel hides the gate and discards the pending intent', async () => {
    const run = jest.fn();
    const { result } = renderHook(() => useParentalGateAction());

    act(() => {
      result.current.openWithAction(run);
    });
    act(() => {
      result.current.onCancel();
    });
    expect(result.current.gateVisible).toBe(false);

    await act(async () => {
      await result.current.onSuccess();
    });
    expect(run).not.toHaveBeenCalled();
  });
});
