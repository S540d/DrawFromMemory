import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, LogBox } from 'react-native';
import { ThemeProvider, useTheme } from '../services/ThemeContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useEffect } from 'react';
import { initLanguage } from '../services/i18n';

// Global error handler for unhandled errors (prevents crashes in production)
if (!__DEV__) {
  try {
    const originalHandler = ErrorUtils.getGlobalHandler();
    ErrorUtils.setGlobalHandler((error, isFatal) => {
      // Log but don't crash on non-fatal errors
      console.error('Global error:', error);
      if (isFatal) {
        originalHandler(error, isFatal);
      }
    });
  } catch (e) {
    // ErrorUtils may not be available in all environments
  }
}

/**
 * Root Layout Content - wrapped with theme context
 */
function RootLayoutContent() {
  const { theme, colors } = useTheme();

  // Initialize language from storage
  useEffect(() => {
    initLanguage().catch((error) => {
      console.error('Failed to initialize language:', error);
    });
  }, []);

  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="levels" />
        <Stack.Screen name="game" />
        <Stack.Screen name="settings" />
      </Stack>
    </>
  );
}

/**
 * Root Layout für Expo Router - wrapped with ErrorBoundary and ThemeProvider
 */
export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RootLayoutContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
