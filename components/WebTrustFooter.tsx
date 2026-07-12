import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';
import { isWeb } from '../utils/platform';
import { Spacing, FontSize, FontWeight, FontFamily } from '../constants/Layout';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.s540d.merkeundmale';
const PRIVACY_POLICY_URL = 'https://s540d.github.io/DrawFromMemory/PRIVACY_POLICY.html';

/**
 * Nur auf Web sichtbarer Footer für die gh-pages-Demo: macht den Play-Store-Link
 * und das Datenschutz-Versprechen sichtbar, damit die Demo auch verkauft
 * statt nur zu zeigen (Issue #279, Punkt 3.4). Die URLs werden hier hart kodiert,
 * da `expo-constants` die android-Config-Sektion im Web-Build nicht bündelt.
 */
export default function WebTrustFooter() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  if (!isWeb) return null;

  const openUrl = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.tagline, { color: colors.text.secondary }]}>
        {t('footer.tagline')}
      </Text>
      <View style={styles.linkRow}>
        <TouchableOpacity onPress={() => openUrl(PLAY_STORE_URL)} accessibilityRole="link">
          <Text style={[styles.link, { color: colors.primary }]}>{t('footer.playStore')}</Text>
        </TouchableOpacity>
        <Text style={[styles.separator, { color: colors.text.light }]}>·</Text>
        <TouchableOpacity onPress={() => openUrl(PRIVACY_POLICY_URL)} accessibilityRole="link">
          <Text style={[styles.link, { color: colors.primary }]}>
            {t('footer.privacyPolicy')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: 2,
  },
  tagline: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  link: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    textDecorationLine: 'underline',
  },
  separator: {
    fontSize: FontSize.xs,
  },
});
