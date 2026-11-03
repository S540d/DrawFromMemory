import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';
import { isWeb } from '../utils/platform';
import { getPlayStoreUrl } from '../constants/ExternalLinks';
import { Spacing, FontSize, FontWeight, FontFamily } from '../constants/Layout';

/**
 * Nur auf Web sichtbarer Install-Hinweis oberhalb des Spiel-CTAs.
 *
 * Die Web-Demo war bisher eine Sackgasse Richtung Play Store: der einzige
 * Store-Link stand im Footer ganz unten (`WebTrustFooter`), sichtbar erst nach
 * dem Scrollen. Besucher wurden dadurch zu PWA-Nutzern statt zu Play-Store-
 * Installationen konvertiert. Dieser Banner macht die Android-App direkt im
 * sichtbaren Bereich zum Angebot — mit Attributions-Link, damit die Installs
 * in der Play Console als Web-Traffic erkennbar sind.
 *
 * Bewusst nur eine dezente Textzeile (kein Rahmen, kein Emoji), damit
 * "Spiel starten" die einzige auffällige Aktion der Startseite bleibt.
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
      style={styles.container}
    >
      <Text style={[styles.title, { color: colors.primary }]} numberOfLines={1}>
        {t('webInstall.title')} ›
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
  },
});
