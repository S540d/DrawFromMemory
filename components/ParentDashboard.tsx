import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';
import { getSessionStats, type SessionStats } from '@services/SessionTracker';
import { getStreakData, type StreakData } from '@services/StreakManager';
import Colors from '../constants/Colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../constants/Layout';

interface Props {
  visible: boolean;
  onClose: () => void;
}

function formatDuration(ms: number): string {
  const totalMin = Math.round(ms / 60000);
  if (totalMin < 60) return `${totalMin} min`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export default function ParentDashboard({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);

  useEffect(() => {
    if (!visible) return;
    Promise.all([getSessionStats(), getStreakData()]).then(([s, st]) => {
      setStats(s);
      setStreak(st);
    });
  }, [visible]);

  const cardBg = colors.surface ?? Colors.surface;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              {t('parentDashboard.title')}
            </Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              {t('parentDashboard.subtitle')}
            </Text>
            <Text style={[styles.privacyHint, { color: colors.text.light }]}>
              {t('parentDashboard.privacyHint')}
            </Text>
          </View>

          <ScrollView contentContainerStyle={styles.body}>
            {stats === null ? (
              <Text style={[styles.empty, { color: colors.text.secondary }]}>
                {t('parentDashboard.loading')}
              </Text>
            ) : stats.totalSessions === 0 ? (
              <Text style={[styles.empty, { color: colors.text.secondary }]}>
                {t('parentDashboard.empty')}
              </Text>
            ) : (
              <>
                <View style={styles.cardRow}>
                  <View style={[styles.statCard, { backgroundColor: cardBg }]}>
                    <Text style={[styles.statLabel, { color: colors.text.light }]}>
                      {t('parentDashboard.totalSessions')}
                    </Text>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                      {stats.totalSessions}
                    </Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: cardBg }]}>
                    <Text style={[styles.statLabel, { color: colors.text.light }]}>
                      {t('parentDashboard.totalTime')}
                    </Text>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                      {formatDuration(stats.totalDurationMs)}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardRow}>
                  <View style={[styles.statCard, { backgroundColor: cardBg }]}>
                    <Text style={[styles.statLabel, { color: colors.text.light }]}>
                      {t('parentDashboard.avgStars')}
                    </Text>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                      {stats.averageStars.toFixed(1)} ★
                    </Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: cardBg }]}>
                    <Text style={[styles.statLabel, { color: colors.text.light }]}>
                      {t('parentDashboard.streak')}
                    </Text>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                      {streak?.currentStreak ?? 0} / {streak?.longestStreak ?? 0}
                    </Text>
                  </View>
                </View>

                {stats.favoriteLevels.length > 0 && (
                  <View style={[styles.section, { backgroundColor: cardBg }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                      {t('parentDashboard.favoriteLevels')}
                    </Text>
                    {stats.favoriteLevels.map((f) => (
                      <View key={f.levelId} style={styles.listRow}>
                        <Text style={[styles.listText, { color: colors.text.primary }]}>
                          {t('parentDashboard.levelLine', { level: String(f.levelId), count: String(f.count) })}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {stats.dailyBreakdown.length > 0 && (
                  <View style={[styles.section, { backgroundColor: cardBg }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                      {t('parentDashboard.dailyBreakdown')}
                    </Text>
                    {stats.dailyBreakdown.slice(-14).reverse().map((d) => (
                      <View key={d.date} style={styles.listRow}>
                        <Text style={[styles.listText, { color: colors.text.primary }]}>
                          {d.date}
                        </Text>
                        <Text style={[styles.listSub, { color: colors.text.secondary }]}>
                          {d.sessions}× · {formatDuration(d.totalDurationMs)} · {d.avgStars.toFixed(1)}★
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          </ScrollView>

          <Pressable onPress={onClose} style={styles.closeButton} testID="parent-dashboard-close">
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
    maxHeight: '90%',
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
  privacyHint: {
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  body: {
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  empty: {
    textAlign: 'center',
    paddingVertical: Spacing.xl,
    fontSize: FontSize.md,
  },
  cardRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: FontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginTop: 4,
  },
  section: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  listText: {
    fontSize: FontSize.sm,
  },
  listSub: {
    fontSize: FontSize.xs,
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
