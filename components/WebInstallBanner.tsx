import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';
import { isWeb } from '../utils/platform';
import { getPlayStoreUrl } from '../constants/ExternalLinks';
import { Spacing, FontSize, FontWeight, FontFamily, BorderRadius } from '../constants/Layout';

/**
 * Nur auf Web sichtbarer Install-Hinweis oberhalb des Spiel-CTAs.
 *
 * Die Web-Demo war bisher eine Sackgasse Richtung Play Store: der einzige
 * Store-Link stand im Footer ganz unten (`WebTrustFooter`), sichtbar erst nach
 * dem Scrollen. Besucher wurden dadurch zu PWA-Nutzern statt zu Play-Store-
 * Installationen konvertiert. Dieser Banner macht die Android-App direkt im
 * sichtbaren Bereich zum Angebot — mit Attributions-Link, damit die Installs
 * in der Play Console als Web-Traffic erkennbar sind.
 */
export default function WebInstallBanner() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  if (!isWeb) return null;

  const open = () => {
    Linking.openURL(getPlayStoreUrl('web_banner')).catch(() => {});
  };

  return (
    <TouchableOpacity
      onPress={open}
      accessibilityRole="link"
      accessibilityLabel={t('webInstall.title')}
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.primary }]}
    >
      <Text style={styles.icon}>📲</Text>
      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: colors.primary }]} numberOfLines={1}>
          {t('webInstall.title')}
        </Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]} numberOfLines={1}>
          {t('webInstall.subtitle')}
        </Text>
      </View>
      <Text style={[styles.chevron, { color: colors.primary }]}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
  },
  icon: {
    fontSize: 20,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
  },
  subtitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    fontFamily: FontFamily.regular,
    marginTop: 1,
  },
  chevron: {
    fontSize: 22,
    fontWeight: FontWeight.bold,
  },
});
