import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { t, getLanguage, setLanguage } from '../services/i18n';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/Layout';

/**
 * Settings Screen - Einstellungen
 * Sprache, Sound, Fortschritt zurücksetzen, etc.
 */
export default function SettingsScreen() {
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState(getLanguage());

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

  const handleResetProgress = () => {
    Alert.alert(
      t('settings.resetProgress'),
      t('settings.resetConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.yes'),
          style: 'destructive',
          onPress: () => {
            // TODO: Implement when AsyncStorage is integrated
            Alert.alert(
              currentLang === 'de' ? 'Noch nicht verfügbar' : 'Not yet available',
              currentLang === 'de'
                ? 'Diese Funktion wird implementiert, sobald die Fortschritts-Speicherung aktiv ist.'
                : 'This feature will be implemented once progress storage is active.'
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← {t('common.close')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('settings.title')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sprache / Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[styles.optionButton, currentLang === 'de' && styles.optionButtonActive]}
              onPress={() => handleLanguageChange('de')}
            >
              <Text style={[styles.optionText, currentLang === 'de' && styles.optionTextActive]}>
                🇩🇪 Deutsch
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, currentLang === 'en' && styles.optionButtonActive]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={[styles.optionText, currentLang === 'en' && styles.optionTextActive]}>
                🇬🇧 English
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sound-Effekte (Platzhalter) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.sound')}</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[styles.optionButton, styles.optionButtonActive]}
              onPress={() => Alert.alert(
                currentLang === 'de' ? 'Noch nicht verfügbar' : 'Not yet available',
                currentLang === 'de'
                  ? 'Sound-Effekte werden in einer zukünftigen Version hinzugefügt.'
                  : 'Sound effects will be added in a future version.'
              )}
            >
              <Text style={[styles.optionText, styles.optionTextActive]}>
                {currentLang === 'de' ? 'Ein' : 'On'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              disabled
            >
              <Text style={styles.optionText}>
                {currentLang === 'de' ? 'Aus' : 'Off'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.comingSoon}>
            {currentLang === 'de' ? '(Demnächst verfügbar)' : '(Coming soon)'}
          </Text>
        </View>

        {/* Hintergrundmusik (Platzhalter) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.music')}</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.optionButton}
              disabled
            >
              <Text style={styles.optionText}>
                {currentLang === 'de' ? 'Ein' : 'On'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, styles.optionButtonActive]}
              onPress={() => Alert.alert(
                currentLang === 'de' ? 'Noch nicht verfügbar' : 'Not yet available',
                currentLang === 'de'
                  ? 'Hintergrundmusik wird in einer zukünftigen Version hinzugefügt.'
                  : 'Background music will be added in a future version.'
              )}
            >
              <Text style={[styles.optionText, styles.optionTextActive]}>
                {currentLang === 'de' ? 'Aus' : 'Off'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.comingSoon}>
            {currentLang === 'de' ? '(Demnächst verfügbar)' : '(Coming soon)'}
          </Text>
        </View>

        {/* Fortschritt zurücksetzen */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleResetProgress}
          >
            <Text style={styles.dangerButtonText}>{t('settings.resetProgress')}</Text>
          </TouchableOpacity>
        </View>

        {/* Über die App */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>
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
              <Text style={styles.linkText}>
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
