import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';
import Mascot from './Mascot';
import Colors from '../constants/Colors';
import { BorderRadius, FontSize, FontWeight, FontFamily, Spacing } from '../constants/Layout';
import type { AgeGroup } from '../types';

interface Props {
  visible: boolean;
  onConfirm: (ageGroup: AgeGroup) => void;
}

const AGE_GROUPS: { id: AgeGroup; labelKey: string }[] = [
  { id: '3-5', labelKey: 'ageGroup.group3to5' },
  { id: '6-8', labelKey: 'ageGroup.group6to8' },
  { id: '9plus', labelKey: 'ageGroup.group9plus' },
];

/**
 * Erst-Start-Altersauswahl (Issue #279, 1.3). Ersetzt den früheren
 * versteckten `extra_time_mode`-Schalter durch eine bewusste Entscheidung
 * vor dem ersten Spiel — steuert Anzeigedauer, empfohlenen Level-Bereich
 * und Standard-Strichstärke. Änderbar jederzeit in den Einstellungen.
 */
export default function AgeGroupModal({ visible, onConfirm }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [selected, setSelected] = useState<AgeGroup | null>(null);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={() => {}}
      testID="age-group-modal"
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.heroSection}>
          <Mascot size={96} mood="happy" testID="age-group-mascot" />
          <Text style={[styles.title, { color: colors.text.primary }]}>{t('ageGroup.title')}</Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            {t('ageGroup.subtitle')}
          </Text>
        </View>

        <View style={styles.optionsList}>
          {AGE_GROUPS.map(group => {
            const active = selected === group.id;
            return (
              <Pressable
                key={group.id}
                onPress={() => setSelected(group.id)}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: active ? Colors.primary : colors.surface,
                    borderColor: active ? Colors.primary : colors.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                testID={`age-group-option-${group.id}`}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: active ? Colors.drawing.white : colors.text.primary },
                  ]}
                >
                  {t(group.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.changeLater, { color: colors.text.light }]}>
          {t('ageGroup.changeLater')}
        </Text>

        <Pressable
          onPress={() => selected && onConfirm(selected)}
          disabled={!selected}
          style={[styles.confirmButton, !selected && styles.confirmButtonDisabled]}
          accessibilityRole="button"
          testID="age-group-confirm"
        >
          <Text style={styles.confirmButtonText}>{t('ageGroup.confirm')}</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
  },
  heroSection: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: FontSize.md * 1.4,
    maxWidth: 300,
  },
  optionsList: {
    gap: Spacing.sm,
  },
  optionCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    ...Colors.shadow.small,
  },
  optionText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  changeLater: {
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    ...Colors.shadow.large,
  },
  confirmButtonDisabled: {
    opacity: 0.4,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    letterSpacing: 0.4,
  },
});
