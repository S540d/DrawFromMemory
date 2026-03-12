import { Platform } from 'react-native';

const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN ?? '';

// Dynamic import: web bundle never imports the native-only Sentry SDK
let Sentry: typeof import('@sentry/react-native') | null = null;
if (Platform.OS !== 'web') {
  try {
    Sentry = require('@sentry/react-native');
  } catch {
    // SDK not available
  }
}

export function initSentry() {
  if (!Sentry || !DSN) return;

  Sentry.init({
    dsn: DSN,
    enabled: !__DEV__,
    tracesSampleRate: 0.2,
    environment: __DEV__ ? 'development' : 'production',
  });
}

/**
 * Capture an exception with optional context tags.
 * Safe to call on all platforms – no-ops on web or when Sentry is not initialized.
 */
export function captureException(error: unknown, context?: Record<string, string>) {
  if (!Sentry || !DSN) return;

  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => scope.setTag(key, value));
    }
    Sentry.captureException(error);
  });
}
