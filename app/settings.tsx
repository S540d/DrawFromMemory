import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { t, getLanguage, setLanguage } from '../services/i18n';
import { useTheme } from '../services/ThemeContext';
import storageManager from '../services/StorageManager';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/Layout';

/**
 * Settings Screen - Einstellungen
 * Sprache, Sound, Fortschritt zurücksetzen, etc.
 */
export default function SettingsScreen() {
  const router = useRouter();
  const { theme, themeSetting, setTheme, colors } = useTheme();
  const [currentLang, setCurrentLang] = useState(getLanguage());
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>(themeSetting);

  const handleLanguageChange = (lang: 'de' | 'en') => {
    setLanguage(lang);
    setCurrentLang(lang);
    // In einer echten App würde hier ein Re-Render aller Komponenten getriggert
    // Für jetzt zeigen wir einfach einen Alert
    Alert.alert(
      lang === 'de' ? 'Sprache geändert' : 'Language changed',
      lang === 'de' 
        ? 'Die Sprache wurde auf Deutsch geändert. Bitte starte die App neu, damit die Änderungen überall wirksam werden.'
        : 'Language has been changed to English. Please restart the app for changes to take effect everywhere.'
    );
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    setCurrentTheme(newTheme);
    await setTheme(newTheme);
  };

  const handleResetProgress = () => {
    Alert.alert(
      t('settings.resetProgress'),
      t('settings.resetConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.yes'),
          style: 'destructive',
          onPress: async () => {
            await storageManager.resetProgress();
            Alert.alert(
              currentLang === 'de' ? 'Fortschritt gelöscht' : 'Progress reset',
              currentLang === 'de'
                ? 'Dein Spielfortschritt wurde erfolgreich zurückgesetzt.'
                : 'Your game progress has been successfully reset.'
            );
          },
        },
      ]
    );
  };

  const openGitHub = () => {
    Linking.openURL('https://github.com/S540d/DrawFromMemory');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.surface }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>← {t('common.close')}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text.primary }]}>{t('settings.title')}</Text>
      </View>

      <ScrollView style={[styles.content, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
        {/* Sprache / Language */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>{t('settings.language')}</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: colors.surface, borderColor: 'transparent' },
                currentLang === 'de' && [styles.optionButtonActive, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]
              ]}
              onPress={() => handleLanguageChange('de')}
            >
              <Text style={[
                styles.optionText,
                { color: colors.text.secondary },
                currentLang === 'de' && [styles.optionTextActive, { color: colors.primary }]
              ]}>
                🇩🇪 Deutsch
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: colors.surface, borderColor: 'transparent' },
                currentLang === 'en' && [styles.optionButtonActive, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]
              ]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={[
                styles.optionText,
                { color: colors.text.secondary },
                currentLang === 'en' && [styles.optionTextActive, { color: colors.primary }]
              ]}>
                🇬🇧 English
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Theme / Erscheinungsbild */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            {currentLang === 'de' ? 'Erscheinungsbild' : 'Theme'}
          </Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: colors.surface, borderColor: 'transparent' },
                currentTheme === 'light' && [styles.optionButtonActive, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]
              ]}
              onPress={() => handleThemeChange('light')}
            >
              <Text style={[
                styles.optionText,
                { color: colors.text.secondary },
                currentTheme === 'light' && [styles.optionTextActive, { color: colors.primary }]
              ]}>
                ☀️ {currentLang === 'de' ? 'Hell' : 'Light'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: colors.surface, borderColor: 'transparent' },
                currentTheme === 'dark' && [styles.optionButtonActive, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]
              ]}
              onPress={() => handleThemeChange('dark')}
            >
              <Text style={[
                styles.optionText,
                { color: colors.text.secondary },
                currentTheme === 'dark' && [styles.optionTextActive, { color: colors.primary }]
              ]}>
                🌙 {currentLang === 'de' ? 'Dunkel' : 'Dark'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: colors.surface, borderColor: 'transparent' },
                currentTheme === 'system' && [styles.optionButtonActive, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]
              ]}
              onPress={() => handleThemeChange('system')}
            >
              <Text style={[
                styles.optionText,
                { color: colors.text.secondary },
                currentTheme === 'system' && [styles.optionTextActive, { color: colors.primary }]
              ]}>
                🖥️ {currentLang === 'de' ? 'System' : 'System'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sound-Effekte (Platzhalter) */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>{t('settings.sound')}</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                styles.optionButtonActive,
                { backgroundColor: colors.primary + '20', borderColor: colors.primary }
              ]}
              onPress={() => Alert.alert(
                currentLang === 'de' ? 'Noch nicht verfügbar' : 'Not yet available',
                currentLang === 'de'
                  ? 'Sound-Effekte werden in einer zukünftigen Version hinzugefügt.'
                  : 'Sound effects will be added in a future version.'
              )}
            >
              <Text style={[styles.optionText, styles.optionTextActive, { color: colors.primary }]}>
                {currentLang === 'de' ? 'Ein' : 'On'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: colors.surface }]}
              disabled
            >
              <Text style={[styles.optionText, { color: colors.text.secondary }]}>
                {currentLang === 'de' ? 'Aus' : 'Off'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.comingSoon, { color: colors.text.light }]}>
            {currentLang === 'de' ? '(Demnächst verfügbar)' : '(Coming soon)'}
          </Text>
        </View>

        {/* Hintergrundmusik (Platzhalter) */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>{t('settings.music')}</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: colors.surface }]}
              disabled
            >
              <Text style={[styles.optionText, { color: colors.text.secondary }]}>
                {currentLang === 'de' ? 'Ein' : 'On'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                styles.optionButtonActive,
                { backgroundColor: colors.primary + '20', borderColor: colors.primary }
              ]}
              onPress={() => Alert.alert(
                currentLang === 'de' ? 'Noch nicht verfügbar' : 'Not yet available',
                currentLang === 'de'
                  ? 'Hintergrundmusik wird in einer zukünftigen Version hinzugefügt.'
                  : 'Background music will be added in a future version.'
              )}
            >
              <Text style={[styles.optionText, styles.optionTextActive, { color: colors.primary }]}>
                {currentLang === 'de' ? 'Aus' : 'Off'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.comingSoon, { color: colors.text.light }]}>
            {currentLang === 'de' ? '(Demnächst verfügbar)' : '(Coming soon)'}
          </Text>
        </View>

        {/* Fortschritt zurücksetzen */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.dangerButton, { backgroundColor: colors.error + '10', borderColor: colors.error }]}
            onPress={handleResetProgress}
          >
            <Text style={[styles.dangerButtonText, { color: colors.error }]}>{t('settings.resetProgress')}</Text>
          </TouchableOpacity>
        </View>

        {/* Über die App */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>{t('settings.about')}</Text>
          <View style={[styles.infoBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.infoText, { color: colors.text.secondary }]}>
              <Text style={[styles.infoBold, { color: colors.text.primary }]}>
                {currentLang === 'de' ? 'Merke und Male' : 'Remember & Draw'}
              </Text>
              {'\n'}
              {t('settings.version')}: 1.0.0
              {'\n\n'}
              {currentLang === 'de' 
                ? 'Eine Gedächtnistraining-App für Kinder.' 
                : 'A memory training app for children.'}
              {'\n\n'}
              {currentLang === 'de' ? 'Entwickelt mit ❤️' : 'Made with ❤️'}
            </Text>
            
            <TouchableOpacity style={styles.linkButton} onPress={openGitHub}>
              <Text style={[styles.linkText, { color: colors.primary }]}>
                GitHub Repository ↗
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacer am Ende */}
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  backButton: {
    fontSize: FontSize.lg,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  optionButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    ...Colors.shadow.small, // Soft & Modern: Subtile Schatten
  },
  optionButtonActive: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
    ...Colors.shadow.medium, // Aktive Option mit stärkerem Schatten
  },
  optionText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.text.secondary,
  },
  optionTextActive: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  comingSoon: {
    fontSize: FontSize.sm,
    color: Colors.text.light,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  dangerButton: {
    backgroundColor: Colors.error + '10',
    borderWidth: 2,
    borderColor: Colors.error,
    borderRadius: BorderRadius.lg, // md → lg (weicher)
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    ...Colors.shadow.small, // Soft & Modern: Subtile Schatten
  },
  dangerButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.error,
  },
  infoBox: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl, // md → xl (16px → 20px für Cards)
    padding: Spacing.lg,
    ...Colors.shadow.medium, // Soft & Modern: Weiche Schatten für Info-Box
  },
  infoText: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  infoBold: {
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    fontSize: FontSize.lg,
  },
  linkButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  linkText: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
});
