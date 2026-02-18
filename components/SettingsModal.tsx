import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, Linking, Share } from 'react-native';
import { t, getLanguage, setLanguage } from '../services/i18n';
import { useTheme } from '../services/ThemeContext';
import storageManager from '../services/StorageManager';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/Layout';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  embedded?: boolean; // If true, renders without modal wrapper (for full settings screen)
}

/**
 * Reusable Settings Modal Component
 * Can be used as a modal popup on home/game screens or embedded in a full settings screen
 */
export default function SettingsModal({ visible, onClose, embedded = false }: SettingsModalProps) {
  const { colors, themeSetting, setTheme } = useTheme();
  const [currentLang, setCurrentLang] = useState(getLanguage());
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>(themeSetting);
  const [showAboutModal, setShowAboutModal] = useState(false);

  useEffect(() => {
    setCurrentLang(getLanguage());
    setCurrentTheme(themeSetting);
  }, [visible, themeSetting]);

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
            try {
              await storageManager.resetProgress();
              Alert.alert(
                currentLang === 'de' ? 'Fortschritt gelöscht' : 'Progress reset',
                currentLang === 'de'
                  ? 'Dein Spielfortschritt wurde erfolgreich zurückgesetzt.'
                  : 'Your game progress has been successfully reset.'
              );
            } catch (error) {
              console.error('Error resetting progress:', error);
            }
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

  const renderAboutModal = () => (
    <Modal
      visible={showAboutModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowAboutModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.aboutModalContent, { backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
            {currentLang === 'de' ? 'Über Merke und Male' : 'About Remember & Draw'}
          </Text>

          <View style={styles.modalBody}>
            <Text style={[styles.modalLabel, { color: colors.text.light }]}>
              {currentLang === 'de' ? 'Version' : 'Version'}
            </Text>
            <Text style={[styles.modalValue, { color: colors.text.primary }]}>1.1.1</Text>

            <Text style={[styles.modalLabel, { color: colors.text.light, marginTop: Spacing.md }]}>
              {currentLang === 'de' ? 'Lizenz' : 'License'}
            </Text>
            <Text style={[styles.modalValue, { color: colors.text.primary }]}>Open Source • MIT</Text>

            <Text style={[styles.modalLabel, { color: colors.text.light, marginTop: Spacing.md }]}>
              GitHub
            </Text>
            <TouchableOpacity onPress={() => {
              Linking.openURL('https://github.com/S540d/DrawFromMemory').catch(() => {
                // Silently ignore if URL cannot be opened
              });
            }}>
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
  );

  const renderContent = () => (
    <View>
      {/* APPEARANCE Section */}
      <Text style={[styles.sectionTitle, { color: colors.text.light }]}>
        {currentLang === 'de' ? '⚙️ ERSCHEINUNGSBILD' : '⚙️ APPEARANCE'}
      </Text>

      {/* Theme */}
      <View style={styles.section}>
        <Text style={[styles.optionLabel, { color: colors.text.primary }]}>
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

      {/* Language */}
      <View style={styles.section}>
        <Text style={[styles.optionLabel, { color: colors.text.primary }]}>
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
      <Text style={[styles.sectionTitle, { color: colors.text.light }]}>
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
      <Text style={[styles.sectionTitle, { color: colors.text.light }]}>
        {currentLang === 'de' ? 'ℹ️ ÜBER & SUPPORT' : 'ℹ️ ABOUT & SUPPORT'}
      </Text>

      <View style={styles.section}>
        <View style={styles.gridRow}>
          <TouchableOpacity
            style={[styles.gridButton, { backgroundColor: colors.background, borderColor: colors.primary }]}
            onPress={handleSendFeedback}
          >
            <Text style={[styles.gridButtonText, { color: colors.primary }]}>
              {currentLang === 'de' ? '💬 Feedback' : '💬 Feedback'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.gridButton, { backgroundColor: colors.background, borderColor: colors.primary }]}
            onPress={handleSupport}
          >
            <Text style={[styles.gridButtonText, { color: colors.primary }]}>
              ☕ Support
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.gridRow}>
          <TouchableOpacity
            style={[styles.gridButton, { backgroundColor: colors.background, borderColor: colors.primary }]}
            onPress={handleShareApp}
          >
            <Text style={[styles.gridButtonText, { color: colors.primary }]}>
              {currentLang === 'de' ? '📤 Teilen' : '📤 Share'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.gridButton, { backgroundColor: colors.background, borderColor: colors.primary }]}
            onPress={() => setShowAboutModal(true)}
          >
            <Text style={[styles.gridButtonText, { color: colors.primary }]}>
              {currentLang === 'de' ? 'ℹ️ Über' : 'ℹ️ About'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderAboutModal()}
    </View>
  );

  // Modal wrapper if not embedded
  if (!embedded) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
          <View style={[styles.settingsModalContent, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.settingsHeader}>
              <Text style={[styles.settingsTitle, { color: colors.text.primary }]}>
                {currentLang === 'de' ? 'Einstellungen' : 'Settings'}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={[styles.closeText, { color: colors.text.secondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.settingsContent}>
              {renderContent()}
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // Embedded content only
  return <>{renderContent()}</>;
}

const styles = StyleSheet.create({
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  settingsModalContent: {
    borderRadius: BorderRadius.xxl,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    ...Colors.shadow.large,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingsTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 24,
  },
  settingsContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },

  // Content styles
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  optionLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
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
    borderRadius: BorderRadius.md,
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
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    ...Colors.shadow.small,
  },
  dangerButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },

  // Grid styles (2x2 for About & Support)
  gridRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  gridButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
    ...Colors.shadow.small,
  },
  gridButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },

  // About modal styles
  aboutModalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    ...Colors.shadow.large,
  },
  modalTitle: {
    fontSize: FontSize.lg,
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
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: Colors.drawing.white,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});
