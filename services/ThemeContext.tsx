/**
 * ThemeContext - Dark Mode & Theme Management
 * Verwaltet das Farbschema der App
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import storageManager from './StorageManager';

export type Theme = 'light' | 'dark' | 'system';

/** Maps ColorSchemeName (which can be null or "unspecified") to a concrete light/dark value. */
function normalizeColorScheme(
  scheme: ReturnType<typeof Appearance.getColorScheme>,
): 'light' | 'dark' {
  return scheme === 'dark' ? 'dark' : 'light';
}

export interface ThemeColors {
  // Primary
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  accentWarm: string;

  // Background & Surface
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceAlt: string;
  border: string;
  modalOverlay: string;

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
  primary: '#7C5CFF',
  primaryLight: '#9E84FF',
  primaryDark: '#5A3FE0',
  secondary: '#F093FB',
  accent: '#4ECDC4',
  accentWarm: '#FFB547',

  background: '#FAFAFA',
  surface: '#F5F5F5',
  surfaceElevated: '#EFEFEF',
  surfaceAlt: '#EDE8F5',
  border: '#DDDDDD',
  modalOverlay: 'rgba(0, 0, 0, 0.5)',

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

// Dark theme colors — wärmere, leicht lila getönte Töne (Issue #176 §1.2)
const DARK_COLORS: ThemeColors = {
  primary: '#9E84FF',
  primaryLight: '#B8A3FF',
  primaryDark: '#7C5CFF',
  secondary: '#F5B3FC',
  accent: '#4ECDC4',
  accentWarm: '#FFB547',

  background: '#1F1B2E',
  surface: '#2A2340',
  surfaceElevated: '#352B4D',
  surfaceAlt: '#302848',
  border: '#4A3F60',
  modalOverlay: 'rgba(0, 0, 0, 0.7)',

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
  const [themeSetting, setThemeSetting] = useState<Theme>('dark');
  // Always start with 'light' to ensure consistent SSR/client hydration
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme from storage and system
  useEffect(() => {
    let isMounted = true;

    // Set initial system theme after mount (client-side only)
    setSystemTheme(normalizeColorScheme(Appearance.getColorScheme()));

    const initTheme = async () => {
      try {
        const theme = await storageManager.getSetting('theme');
        if (isMounted) {
          setThemeSetting(theme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    initTheme();

    // Listen to system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (isMounted) {
        setSystemTheme(normalizeColorScheme(colorScheme));
      }
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  const currentTheme: 'light' | 'dark' = themeSetting === 'system' ? systemTheme : themeSetting;

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

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
