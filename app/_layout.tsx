import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '@services/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@components/ErrorBoundary';
import AnimatedSplashScreen from '@components/AnimatedSplashScreen';
import { useCallback, useEffect, useState, useReducer } from 'react';
import { initLanguage, addLanguageChangeListener } from '@services/i18n';
import { initSentry } from '@services/SentryService';
import { initAnalytics } from '@services/AnalyticsService';
import { useFonts } from 'expo-font';
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

// Initialize Sentry as early as possible (no-op on web or without DSN)
initSentry();

// Privacy-freundliches, minimales Analytics (no-op ohne EXPO_PUBLIC_PLAUSIBLE_DOMAIN)
initAnalytics();

const SITE_URL = 'https://s540d.github.io/DrawFromMemory/';
const OG_IMAGE_URL = `${SITE_URL}feature-graphic.png`;
const SEO_TITLE = 'Merke und Male – Gedächtnistraining für Kinder';
const SEO_DESCRIPTION =
  'Gedächtnistraining für Kinder ab 3 Jahren: Bild merken, aus dem Gedächtnis nachzeichnen, vergleichen. Kostenlos im Browser spielen – offline, ohne Werbung, ohne Datensammlung.';

/**
 * Root Layout Content - wrapped with theme context
 */
function RootLayoutContent() {
  const { theme, colors } = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashFinish = useCallback(() => setShowSplash(false), []);
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  // Initialize language from storage, then re-render so all screens show the correct language
  useEffect(() => {
    const unsubscribe = addLanguageChangeListener(() => forceUpdate());
    initLanguage().catch(error => {
      console.error('Failed to initialize language:', error);
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <Head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Merke und Male" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* SEO für die gh-pages-Demo (Issue #279, 3.4) */}
        <title>{SEO_TITLE}</title>
        <meta name="description" content={SEO_DESCRIPTION} />
        <meta
          name="keywords"
          content="Gedächtnistraining Kinder App, Memory Kinder, Zeichenspiel Kinder, Malen lernen, Konzentration Kinder, offline Kinder App ohne Werbung"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={SITE_URL} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content={SEO_TITLE} />
        <meta property="og:description" content={SEO_DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta property="og:locale" content="de_DE" />
        <meta property="og:site_name" content="Merke und Male" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SEO_TITLE} />
        <meta name="twitter:description" content={SEO_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE_URL} />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MobileApplication',
            name: 'Merke und Male',
            url: SITE_URL,
            description: SEO_DESCRIPTION,
            applicationCategory: 'GameApplication',
            operatingSystem: 'Android, Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'EUR',
            },
            installUrl: 'https://play.google.com/store/apps/details?id=com.s540d.merkeundmale',
          })}
        </script>
      </Head>
      <StatusBar style={showSplash ? 'light' : theme === 'dark' ? 'light' : 'dark'} />
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
      {showSplash && <AnimatedSplashScreen onFinish={handleSplashFinish} />}
    </>
  );
}

/**
 * Root Layout für Expo Router - wrapped with ErrorBoundary and ThemeProvider
 */
export default function RootLayout() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <RootLayoutContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
