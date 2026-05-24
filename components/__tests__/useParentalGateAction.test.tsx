import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text, Linking, Alert } from 'react-native';
import { useParentalGateAction } from '../useParentalGateAction';

// Render the hook into a probe so we can drive it from tests.
type Driver = ReturnType<typeof useParentalGateAction>;
let captured: Driver | null = null;

function Probe() {
  captured = useParentalGateAction();
  return <Text>{captured.gateVisible ? 'open' : 'closed'}</Text>;
}

describe('useParentalGateAction', () => {
  beforeEach(() => {
    captured = null;
    jest.restoreAllMocks();
  });

  it('starts with the gate closed', () => {
    render(<Probe />);
    expect(captured!.gateVisible).toBe(false);
  });

  it('openWithAction shows the gate and runs the action on success', async () => {
    const run = jest.fn();
    render(<Probe />);
    act(() => { captured!.openWithAction(run); });
    expect(captured!.gateVisible).toBe(true);

    await act(async () => { await captured!.onSuccess(); });
    expect(run).toHaveBeenCalled();
    expect(captured!.gateVisible).toBe(false);
  });

  it('openWithUrl calls Linking.openURL on success', async () => {
    const canOpen = jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    render(<Probe />);
    act(() => {
      captured!.openWithUrl('https://example.com', { errorTitle: 'E', errorMessage: 'M' });
    });
    await act(async () => { await captured!.onSuccess(); });
    expect(canOpen).toHaveBeenCalledWith('https://example.com');
    expect(open).toHaveBeenCalledWith('https://example.com');
  });

  it('alerts when Linking cannot open the URL', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    render(<Probe />);
    act(() => {
      captured!.openWithUrl('https://x', { errorTitle: 'Err', errorMessage: 'Msg' });
    });
    await act(async () => { await captured!.onSuccess(); });
    expect(alert).toHaveBeenCalledWith('Err', 'Msg');
  });

  it('onCancel hides the gate and discards the pending intent', async () => {
    const run = jest.fn();
    render(<Probe />);
    act(() => { captured!.openWithAction(run); });
    act(() => { captured!.onCancel(); });
    expect(captured!.gateVisible).toBe(false);
    await act(async () => { await captured!.onSuccess(); });
    expect(run).not.toHaveBeenCalled();
  });
});
