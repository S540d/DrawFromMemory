import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../services/ThemeContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import AnimatedSplashScreen from '../components/AnimatedSplashScreen';
import { useCallback, useEffect, useState } from 'react';
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
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashFinish = useCallback(() => setShowSplash(false), []);

  // Initialize language from storage
  useEffect(() => {
    initLanguage().catch((error) => {
      console.error('Failed to initialize language:', error);
    });
  }, []);

  return (
    <>
      <Head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Merke und Male" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </Head>
      <StatusBar style={showSplash ? 'light' : (theme === 'dark' ? 'light' : 'dark')} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="levels" />
        <Stack.Screen name="game" />
        <Stack.Screen name="gallery" />
        <Stack.Screen name="settings" />
      </Stack>
      {showSplash && (
        <AnimatedSplashScreen onFinish={handleSplashFinish} />
      )}
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
