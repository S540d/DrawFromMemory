import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../services/ThemeContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useEffect } from 'react';
import { initLanguage } from '../services/i18n';

/**
 * Root Layout Content - wrapped with theme context
 */
function RootLayoutContent() {
  const { theme, colors } = useTheme();

  // Initialize language from storage
  useEffect(() => {
    initLanguage();
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
