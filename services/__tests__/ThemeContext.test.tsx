/**
 * ThemeContext Tests
 */
import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { Appearance } from 'react-native';

// Mock StorageManager
jest.mock('../StorageManager', () => ({
  __esModule: true,
  default: {
    getSetting: jest.fn().mockResolvedValue('system'),
    setSetting: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock Appearance
const mockRemove = jest.fn();
jest.spyOn(Appearance, 'getColorScheme').mockReturnValue('light');
jest.spyOn(Appearance, 'addChangeListener').mockReturnValue({ remove: mockRemove } as any);

import { ThemeProvider, useTheme } from '../ThemeContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemeContext', () => {
  const storageManager = require('../StorageManager').default;

  beforeEach(() => {
    jest.clearAllMocks();
    (Appearance.getColorScheme as jest.Mock).mockReturnValue('light');
    storageManager.getSetting.mockResolvedValue('system');
  });

  it('throws when useTheme is called outside ThemeProvider', () => {
    // Suppress console.error for expected error
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within ThemeProvider');
    spy.mockRestore();
  });

  it('defaults to light theme', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('light');
    expect(result.current.themeSetting).toBe('system');
  });

  it('returns light colors for light theme', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.colors.background).toBe('#FAFAFA');
  });

  it('uses dark theme when setting is dark', async () => {
    storageManager.getSetting.mockResolvedValue('dark');
    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.theme).toBe('dark');
    });
    expect(result.current.colors.background).toBe('#0F1419');
  });

  it('follows system theme when setting is system', async () => {
    (Appearance.getColorScheme as jest.Mock).mockReturnValue('dark');
    storageManager.getSetting.mockResolvedValue('system');

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.theme).toBe('dark');
    });
  });

  it('persists theme change to storage via setTheme', async () => {
    storageManager.getSetting.mockResolvedValue('light');
    const { result } = renderHook(() => useTheme(), { wrapper });

    // Wait for initial theme load to complete
    await waitFor(() => {
      expect(result.current.themeSetting).toBe('light');
    });

    await act(async () => {
      await result.current.setTheme('dark');
    });

    expect(storageManager.setSetting).toHaveBeenCalledWith('theme', 'dark');
    expect(result.current.themeSetting).toBe('dark');
    expect(result.current.theme).toBe('dark');
  });

  it('responds to system appearance changes', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('light');

    // Simulate system theme change via the listener callback
    const listenerCall = (Appearance.addChangeListener as jest.Mock).mock.calls[0][0];
    act(() => {
      listenerCall({ colorScheme: 'dark' });
    });

    expect(result.current.theme).toBe('dark');
  });

  it('removes appearance listener on unmount', () => {
    const { unmount } = renderHook(() => useTheme(), { wrapper });
    unmount();
    expect(mockRemove).toHaveBeenCalled();
  });

  it('does not crash when storage load fails', async () => {
    storageManager.getSetting.mockRejectedValue(new Error('Storage error'));
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });
    // Falls back to system/light
    expect(result.current.theme).toBe('light');
    spy.mockRestore();
  });

  it('handles null colorScheme gracefully', () => {
    (Appearance.getColorScheme as jest.Mock).mockReturnValue(null);
    const { result } = renderHook(() => useTheme(), { wrapper });
    // null defaults to 'light'
    expect(result.current.theme).toBe('light');
  });
});
