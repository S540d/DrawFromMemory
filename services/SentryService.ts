import { Platform } from 'react-native';
import * as Sentry from '@sentry/react-native';

const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN ?? '';

export function initSentry() {
  // Skip on web – Sentry React Native SDK targets native only
  if (Platform.OS === 'web' || !DSN) return;

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
  if (Platform.OS === 'web' || !DSN) return;

  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => scope.setTag(key, value));
    }
    Sentry.captureException(error);
  });
}
