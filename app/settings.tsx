import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { t } from '../services/i18n';
import { useTheme } from '../services/ThemeContext';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/Layout';
import SettingsModal from '../components/SettingsModal';

/**
 * Settings Screen - Einstellungen (Full Screen)
 * Displays the embedded SettingsModal component
 */
export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.surface }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>← {t('common.close')}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text.primary }]}>{t('settings.title')}</Text>
      </View>

      {/* Content as ScrollView for embedded SettingsModal */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: Spacing.lg }}>
          {/* Embedded SettingsModal content (without modal wrapper) */}
          <SettingsModal visible={true} onClose={() => {}} embedded={true} />

          {/* Spacer at the end */}
          <View style={{ height: Spacing.xxl }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    fontSize: FontSize.lg,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
