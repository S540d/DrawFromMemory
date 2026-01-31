import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking, Modal, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { t, getLanguage, setLanguage, initLanguage } from '../services/i18n';
import { useTheme } from '../services/ThemeContext';
import storageManager from '../services/StorageManager';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/Layout';

/**
 * Settings Screen - Einstellungen
 * Strukturiert nach UX-Vorgaben Phase 2.1
 */
export default function SettingsScreen() {
  const router = useRouter();
  const { themeSetting, setTheme, colors } = useTheme();
  const [currentLang, setCurrentLang] = useState(getLanguage());
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>(themeSetting);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Sync language state on mount (in case it was loaded async)
  useEffect(() => {
    const syncLanguage = async () => {
      await initLanguage();
      setCurrentLang(getLanguage());
    };
    syncLanguage();
  }, []);

  const handleLanguageChange = async (lang: 'de' | 'en') => {
    await setLanguage(lang);
    setCurrentLang(lang);
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
      currentLang === 'de'
        ? 'Möchtest du deinen Fortschritt wirklich zurücksetzen? Diese Aktion kann nicht rückgängig gemacht werden.'
        : 'Do you really want to reset your progress? This action cannot be undone.',
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

  const handleSendFeedback = async () => {
    const subject = encodeURIComponent('Feedback: Merke und Male');
    const body = encodeURIComponent(
      currentLang === 'de'
        ? 'Hallo,\n\nIch habe Feedback zu Merke und Male:\n\n'
        : 'Hello,\n\nI have feedback about Remember & Draw:\n\n'
    );
    const url = `mailto:devsven@posteo.de?subject=${subject}&body=${body}`;
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          currentLang === 'de' ? 'Fehler' : 'Error',
          currentLang === 'de'
            ? 'E-Mail-Client konnte nicht geöffnet werden. Bitte sende dein Feedback an: devsven@posteo.de'
            : 'Could not open email client. Please send your feedback to: devsven@posteo.de'
        );
      }
    } catch (error) {
      Alert.alert(
        currentLang === 'de' ? 'Fehler' : 'Error',
        currentLang === 'de'
          ? 'E-Mail-Client konnte nicht geöffnet werden. Bitte sende dein Feedback an: devsven@posteo.de'
          : 'Could not open email client. Please send your feedback to: devsven@posteo.de'
      );
    }
  };

  const handleSupport = async () => {
    const url = 'https://ko-fi.com/s540d';
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          currentLang === 'de' ? 'Fehler' : 'Error',
          currentLang === 'de'
            ? 'Browser konnte nicht geöffnet werden. Bitte besuche: https://ko-fi.com/s540d'
            : 'Could not open browser. Please visit: https://ko-fi.com/s540d'
        );
      }
    } catch (error) {
      Alert.alert(
        currentLang === 'de' ? 'Fehler' : 'Error',
        currentLang === 'de'
          ? 'Browser konnte nicht geöffnet werden. Bitte besuche: https://ko-fi.com/s540d'
          : 'Could not open browser. Please visit: https://ko-fi.com/s540d'
      );
    }
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: currentLang === 'de'
          ? 'Schau dir diese coole Gedächtnistraining-App an: Merke und Male! https://github.com/S540d/DrawFromMemory'
          : 'Check out this cool memory training app: Remember & Draw! https://github.com/S540d/DrawFromMemory',
      });
    } catch (error) {
      // User cancelled share
    }
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
        {/* APPEARANCE Section */}
        <Text style={[styles.sectionHeader, { color: colors.text.light }]}>
          {currentLang === 'de' ? '⚙️ ERSCHEINUNGSBILD' : '⚙️ APPEARANCE'}
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            {currentLang === 'de' ? 'Design' : 'Theme'}
          </Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: colors.surface, borderColor: colors.border },
                currentTheme === 'light' && [styles.optionButtonActive, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]
              ]}
              onPress={() => handleThemeChange('light')}
            >
              <Text style={[
                styles.optionText,
                { color: colors.text.secondary },
                currentTheme === 'light' && [styles.optionTextActive, { color: colors.primary }]
              ]}>
                {currentLang === 'de' ? 'Hell' : 'Light'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: colors.surface, borderColor: colors.border },
                currentTheme === 'dark' && [styles.optionButtonActive, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]
              ]}
              onPress={() => handleThemeChange('dark')}
            >
              <Text style={[
                styles.optionText,
                { color: colors.text.secondary },
                currentTheme === 'dark' && [styles.optionTextActive, { color: colors.primary }]
              ]}>
                {currentLang === 'de' ? 'Dunkel' : 'Dark'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: colors.surface, borderColor: colors.border },
                currentTheme === 'system' && [styles.optionButtonActive, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]
              ]}
              onPress={() => handleThemeChange('system')}
            >
              <Text style={[
                styles.optionText,
                { color: colors.text.secondary },
                currentTheme === 'system' && [styles.optionTextActive, { color: colors.primary }]
              ]}>
                System
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            {currentLang === 'de' ? 'Sprache' : 'Language'}
          </Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: colors.surface, borderColor: colors.border },
                currentLang === 'de' && [styles.optionButtonActive, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]
              ]}
              onPress={() => handleLanguageChange('de')}
            >
              <Text style={[
                styles.optionText,
                { color: colors.text.secondary },
                currentLang === 'de' && [styles.optionTextActive, { color: colors.primary }]
              ]}>
                Deutsch
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: colors.surface, borderColor: colors.border },
                currentLang === 'en' && [styles.optionButtonActive, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]
              ]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={[
                styles.optionText,
                { color: colors.text.secondary },
                currentLang === 'en' && [styles.optionTextActive, { color: colors.primary }]
              ]}>
                English
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Separator */}
        <View style={[styles.separator, { backgroundColor: colors.border }]} />

        {/* DATA Section */}
        <Text style={[styles.sectionHeader, { color: colors.text.light }]}>
          {currentLang === 'de' ? '📊 DATEN' : '📊 DATA'}
        </Text>

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.dangerButton, { backgroundColor: colors.error + '15', borderColor: colors.error }]}
            onPress={handleResetProgress}
          >
            <Text style={[styles.dangerButtonText, { color: colors.error }]}>{t('settings.resetProgress')}</Text>
          </TouchableOpacity>
        </View>

        {/* Separator */}
        <View style={[styles.separator, { backgroundColor: colors.border }]} />

        {/* ABOUT & SUPPORT Section - 2x2 Grid */}
        <Text style={[styles.sectionHeader, { color: colors.text.light }]}>
          {currentLang === 'de' ? 'ℹ️ ÜBER & SUPPORT' : 'ℹ️ ABOUT & SUPPORT'}
        </Text>

        <View style={styles.section}>
          <View style={styles.gridContainer}>
            <TouchableOpacity
              style={[styles.gridButton, { backgroundColor: colors.background, borderColor: colors.primary }]}
              onPress={handleSendFeedback}
            >
              <Text style={[styles.gridButtonText, { color: colors.primary }]}>
                Feedback
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.gridButton, { backgroundColor: colors.background, borderColor: colors.primary }]}
              onPress={handleSupport}
            >
              <Text style={[styles.gridButtonText, { color: colors.primary }]}>
                Support
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.gridButton, { backgroundColor: colors.background, borderColor: colors.primary }]}
              onPress={handleShareApp}
            >
              <Text style={[styles.gridButtonText, { color: colors.primary }]}>
                {currentLang === 'de' ? 'Teilen' : 'Share'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.gridButton, { backgroundColor: colors.background, borderColor: colors.primary }]}
              onPress={() => setShowAboutModal(true)}
            >
              <Text style={[styles.gridButtonText, { color: colors.primary }]}>
                {currentLang === 'de' ? 'Über' : 'About'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacer am Ende */}
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      {/* About Modal */}
      <Modal
        visible={showAboutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAboutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
              {currentLang === 'de' ? 'Über Merke und Male' : 'About Remember & Draw'}
            </Text>

            <View style={styles.modalBody}>
              <Text style={[styles.modalLabel, { color: colors.text.light }]}>
                {currentLang === 'de' ? 'Version' : 'Version'}
              </Text>
              <Text style={[styles.modalValue, { color: colors.text.primary }]}>1.1.0</Text>

              <Text style={[styles.modalLabel, { color: colors.text.light, marginTop: Spacing.md }]}>
                {currentLang === 'de' ? 'Lizenz' : 'License'}
              </Text>
              <Text style={[styles.modalValue, { color: colors.text.primary }]}>Open Source • MIT</Text>

              <Text style={[styles.modalLabel, { color: colors.text.light, marginTop: Spacing.md }]}>
                GitHub
              </Text>
              <TouchableOpacity onPress={() => Linking.openURL('https://github.com/S540d/DrawFromMemory')}>
                <Text style={[styles.modalLink, { color: colors.primary }]}>
                  S540d/DrawFromMemory ↗
                </Text>
              </TouchableOpacity>

              <View style={[styles.featureTeaser, { backgroundColor: colors.primary + '15', borderColor: colors.primary }]}>
                <Text style={[styles.teaserText, { color: colors.text.primary }]}>
                  {currentLang === 'de'
                    ? '🎨 Demnächst: Eigene Zeichnungen fotografieren und teilen!'
                    : '🎨 Coming soon: Take photos of your drawings and share them!'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowAboutModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>
                {currentLang === 'de' ? 'Schließen' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    letterSpacing: 1,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  optionButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    alignItems: 'center',
    ...Colors.shadow.small,
  },
  optionButtonActive: {
    ...Colors.shadow.medium,
  },
  optionText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  optionTextActive: {
    fontWeight: FontWeight.bold,
  },
  separator: {
    height: 1,
    marginVertical: Spacing.lg,
  },
  dangerButton: {
    borderWidth: 2,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    ...Colors.shadow.small,
  },
  dangerButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  gridButton: {
    width: '48%', // 2 columns with gap
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    alignItems: 'center',
    ...Colors.shadow.small,
  },
  gridButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Colors.shadow.large,
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  modalBody: {
    marginBottom: Spacing.lg,
  },
  modalLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing.xs,
  },
  modalValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  modalLink: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    textDecorationLine: 'underline',
  },
  featureTeaser: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  teaserText: {
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  modalCloseButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: Colors.drawing.white,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});
