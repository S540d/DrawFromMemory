import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';
import {
  ACHIEVEMENTS,
  getUnlockedAchievements,
  type AchievementId,
} from '@services/AchievementManager';
import Colors from '../constants/Colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../constants/Layout';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function BadgesModal({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [unlockedIds, setUnlockedIds] = useState<Set<AchievementId>>(new Set());

  useEffect(() => {
    if (!visible) return;
    getUnlockedAchievements().then((list) => {
      setUnlockedIds(new Set(list.map((u) => u.id)));
    });
  }, [visible]);

  const unlockedCount = unlockedIds.size;
  const total = ACHIEVEMENTS.length;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              {t('achievements.title')}
            </Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              {t('achievements.progress', { unlocked: String(unlockedCount), total: String(total) })}
            </Text>
          </View>

          <ScrollView contentContainerStyle={styles.list}>
            {ACHIEVEMENTS.map((a) => {
              const isUnlocked = unlockedIds.has(a.id);
              return (
                <View
                  key={a.id}
                  style={[
                    styles.row,
                    {
                      backgroundColor: colors.surface ?? Colors.surface,
                      opacity: isUnlocked ? 1 : 0.45,
                      borderColor: isUnlocked ? Colors.primary : 'transparent',
                    },
                  ]}
                  testID={`badge-row-${a.id}`}
                >
                  <Text style={[styles.emoji, !isUnlocked && styles.grayscale]}>
                    {isUnlocked ? a.emoji : '🔒'}
                  </Text>
                  <View style={styles.textCol}>
                    <Text style={[styles.rowTitle, { color: colors.text.primary }]}>
                      {t(a.titleKey)}
                    </Text>
                    <Text style={[styles.rowDesc, { color: colors.text.secondary }]}>
                      {t(a.descKey)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          <Pressable onPress={onClose} style={styles.closeButton} testID="badges-modal-close">
            <Text style={styles.closeButtonText}>{t('common.close')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '85%',
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  subtitle: {
    fontSize: FontSize.sm,
    marginTop: 4,
  },
  list: {
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
  },
  emoji: {
    fontSize: 36,
    marginRight: Spacing.md,
  },
  grayscale: {
    opacity: 0.6,
  },
  textCol: {
    flex: 1,
  },
  rowTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  rowDesc: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  closeButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
});
