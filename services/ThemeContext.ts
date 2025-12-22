/**
 * ThemeContext - Dark Mode & Theme Management
 * Verwaltet das Farbschema der App
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import storageManager from './StorageManager';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeColors {
  // Primary
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;

  // Background & Surface
  background: string;
  surface: string;
  surfaceElevated: string;

  // Text
  text: {
    primary: string;
    secondary: string;
    light: string;
  };

  // Feedback
  success: string;
  warning: string;
  error: string;
  info: string;

  // Drawing
  drawing: {
    [key: string]: string;
  };

  // Stars
  stars: {
    filled: string;
    empty: string;
  };

  // Difficulty
  difficulty: {
    [key: string]: string;
  };
}

interface ThemeContextType {
  theme: 'light' | 'dark';
  themeSetting: Theme;
  colors: ThemeColors;
  setTheme: (theme: Theme) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Light theme colors
const LIGHT_COLORS: ThemeColors = {
  primary: '#667eea',
  primaryLight: '#8599f3',
  primaryDark: '#4c63d2',
  secondary: '#f093fb',
  accent: '#A8E6CF',

  background: '#FAFAFA',
  surface: '#F5F5F5',
  surfaceElevated: '#EFEFEF',

  text: {
    primary: '#2C3E50',
    secondary: '#7F8C8D',
    light: '#95A5A6',
  },

  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',

  drawing: {
    black: '#000000',
    white: '#FFFFFF',
    red: '#E74C3C',
    orange: '#FFA500',
    yellow: '#FFD700',
    green: '#27AE60',
    blue: '#3498DB',
    lightBlue: '#87CEEB',
    purple: '#9B59B6',
    pink: '#FF69B4',
    brown: '#8B4513',
    gray: '#808080',
    skin: '#FDBCB4',
  },

  stars: {
    filled: '#FFD700',
    empty: '#E0E0E0',
  },

  difficulty: {
    '1': '#27AE60',
    '2': '#2ECC71',
    '3': '#F39C12',
    '4': '#E67E22',
    '5': '#E74C3C',
  },
};

// Dark theme colors
const DARK_COLORS: ThemeColors = {
  primary: '#8599f3',
  primaryLight: '#a8b9f7',
  primaryDark: '#667eea',
  secondary: '#f5b3fc',
  accent: '#7FD8B8',

  background: '#0F1419',
  surface: '#1A1F2E',
  surfaceElevated: '#242B3E',

  text: {
    primary: '#E8EFF5',
    secondary: '#A0B0C0',
    light: '#6B7A8A',
  },

  success: '#48C77E',
  warning: '#FDB022',
  error: '#FF6B6B',
  info: '#4DB8FF',

  drawing: {
    black: '#000000',
    white: '#FFFFFF',
    red: '#FF6B6B',
    orange: '#FFB347',
    yellow: '#FFD700',
    green: '#48C77E',
    blue: '#4DB8FF',
    lightBlue: '#87CEEB',
    purple: '#C77DFF',
    pink: '#FF69B4',
    brown: '#A0826D',
    gray: '#B0B0B0',
    skin: '#FFB8A0',
  },

  stars: {
    filled: '#FFD700',
    empty: '#404A5C',
  },

  difficulty: {
    '1': '#48C77E',
    '2': '#5DD891',
    '3': '#FDB022',
    '4': '#FFA500',
    '5': '#FF6B6B',
  },
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeSetting, setThemeSetting] = useState<Theme>('system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(
    Appearance.getColorScheme() || 'light'
  );

  // Initialize theme from storage
  useEffect(() => {
    const initTheme = async () => {
      const theme = await storageManager.getSetting('theme');
      setThemeSetting(theme);
    };
    initTheme();

    // Listen to system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme || 'light');
    });

    return () => subscription.remove();
  }, []);

  const currentTheme: 'light' | 'dark' =
    themeSetting === 'system' ? systemTheme : themeSetting;

  const colors = currentTheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  const handleSetTheme = async (newTheme: Theme) => {
    setThemeSetting(newTheme);
    await storageManager.setSetting('theme', newTheme);
  };

  const value: ThemeContextType = {
    theme: currentTheme,
    themeSetting,
    colors,
    setTheme: handleSetTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
