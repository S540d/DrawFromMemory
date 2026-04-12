import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { t } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/Layout';

interface ParentalGateProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

function generateChallenge(): { a: number; b: number; answer: number } {
  const a = Math.floor(Math.random() * 9) + 2; // 2–10
  const b = Math.floor(Math.random() * 9) + 2; // 2–10
  return { a, b, answer: a * b };
}

/**
 * Parental Gate — required by Google Play Families Policy.
 * Shows a simple multiplication challenge before opening external links.
 * Children are unlikely to solve it; adults can confirm in seconds.
 */
export default function ParentalGate({ visible, onSuccess, onCancel }: ParentalGateProps) {
  const { colors } = useTheme();
  const [challenge, setChallenge] = useState(generateChallenge);
  const [input, setInput] = useState('');
  const [showError, setShowError] = useState(false);

  const reset = useCallback(() => {
    setChallenge(generateChallenge());
    setInput('');
    setShowError(false);
  }, []);

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const handleConfirm = () => {
    if (parseInt(input, 10) === challenge.answer) {
      reset();
      onSuccess();
    } else {
      setShowError(true);
      setInput('');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            {t('parentalGate.title')}
          </Text>

          <Text style={[styles.message, { color: colors.text.secondary }]}>
            {t('parentalGate.message')}
          </Text>

          <Text style={[styles.question, { color: colors.text.primary }]}>
            {challenge.a} × {challenge.b} = ?
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                color: colors.text.primary,
                borderColor: showError ? colors.error : colors.border,
                backgroundColor: colors.background,
              },
            ]}
            keyboardType="number-pad"
            value={input}
            onChangeText={(v) => {
              setInput(v);
              setShowError(false);
            }}
            onSubmitEditing={handleConfirm}
            placeholder={t('parentalGate.placeholder')}
            placeholderTextColor={colors.text.light}
            maxLength={4}
            autoFocus
          />

          {showError && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {t('parentalGate.wrongAnswer')}
            </Text>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
              onPress={handleCancel}
            >
              <Text style={[styles.buttonText, { color: colors.text.secondary }]}>
                {t('common.cancel')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton, { backgroundColor: colors.primary }]}
              onPress={handleConfirm}
            >
              <Text style={[styles.buttonText, styles.confirmText]}>
                {t('parentalGate.confirm')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  container: {
    width: '100%',
    maxWidth: 340,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  question: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginVertical: Spacing.sm,
    letterSpacing: 2,
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.lg,
    textAlign: 'center',
  },
  errorText: {
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {},
  buttonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  confirmText: {
    color: '#ffffff',
  },
});
