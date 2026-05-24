import { useCallback, useState } from 'react';
import { Alert, Linking } from 'react-native';

interface UrlIntent {
  type: 'url';
  url: string;
  /** Error message shown if Linking can't open the URL. */
  errorMessage: string;
  /** Title used in the error Alert. */
  errorTitle: string;
}

interface ActionIntent {
  type: 'action';
  run: () => void;
}

type Intent = UrlIntent | ActionIntent;

interface UseParentalGateActionResult {
  /** Wire into `<ParentalGate visible={...} />`. */
  gateVisible: boolean;
  /** Wire into `<ParentalGate onSuccess={...} />`. */
  onSuccess: () => Promise<void>;
  /** Wire into `<ParentalGate onCancel={...} />`. */
  onCancel: () => void;
  /**
   * Open the gate; if the user passes it, open the URL via `Linking`.
   */
  openWithUrl: (url: string, opts: { errorMessage: string; errorTitle: string }) => void;
  /**
   * Open the gate; if the user passes it, run `action()` (e.g. open a modal).
   */
  openWithAction: (action: () => void) => void;
}

/**
 * Hook for "do X behind a Parental Gate" flows.
 *
 * Replaces the pendingUrl + pendingAction + parentalGateVisible state machine
 * that previously lived inline in SettingsModal — and keeps the URL vs.
 * action branching out of the component body.
 */
export function useParentalGateAction(): UseParentalGateActionResult {
  const [gateVisible, setGateVisible] = useState(false);
  const [pending, setPending] = useState<Intent | null>(null);

  const openWithUrl = useCallback(
    (url: string, opts: { errorMessage: string; errorTitle: string }) => {
      setPending({ type: 'url', url, errorMessage: opts.errorMessage, errorTitle: opts.errorTitle });
      setGateVisible(true);
    },
    [],
  );

  const openWithAction = useCallback((action: () => void) => {
    setPending({ type: 'action', run: action });
    setGateVisible(true);
  }, []);

  const onCancel = useCallback(() => {
    setGateVisible(false);
    setPending(null);
  }, []);

  const onSuccess = useCallback(async () => {
    setGateVisible(false);
    const intent = pending;
    setPending(null);
    if (!intent) return;

    if (intent.type === 'action') {
      intent.run();
      return;
    }

    try {
      const supported = await Linking.canOpenURL(intent.url);
      if (supported) {
        await Linking.openURL(intent.url);
      } else {
        Alert.alert(intent.errorTitle, intent.errorMessage);
      }
    } catch {
      Alert.alert(intent.errorTitle, intent.errorMessage);
    }
  }, [pending]);

  return { gateVisible, onSuccess, onCancel, openWithUrl, openWithAction };
}
