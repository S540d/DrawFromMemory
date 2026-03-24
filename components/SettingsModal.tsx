import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, Linking, Share, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { t, getLanguage, setLanguage } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';
import storageManager from '@services/StorageManager';
import SoundManager from '@services/SoundManager';
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
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setCurrentLang(getLanguage());
    setCurrentTheme(themeSetting);
    storageManager.getSetting('soundEnabled').then(setSoundEnabled);
  }, [visible, themeSetting]);

  const handleLanguageChange = async (lang: 'de' | 'en') => {
    await setLanguage(lang);
    setCurrentLang(lang);
    Alert.alert(
      t('settings.languageChanged'),
      t('settings.languageChangedMessage')
    );
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    setCurrentTheme(newTheme);
    await setTheme(newTheme);
  };

  const handleResetProgress = () => {
    Alert.alert(
      t('settings.resetProgress'),
      t('settings.resetConfirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.yes'),
          style: 'destructive',
          onPress: async () => {
            try {
              await storageManager.resetProgress();
              Alert.alert(
                t('settings.resetSuccess'),
                t('settings.resetSuccessMessage')
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
    const subject = encodeURIComponent(t('settings.feedbackEmailSubject'));
    const body = encodeURIComponent(t('settings.feedbackEmailBody'));
    const url = `mailto:devsven@posteo.de?subject=${subject}&body=${body}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(t('settings.error'), t('settings.feedbackEmailError'));
      }
    } catch (error) {
      Alert.alert(t('settings.error'), t('settings.feedbackEmailError'));
    }
  };

  const handleSupport = async () => {
    const url = 'https://ko-fi.com/s540d';

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(t('settings.error'), t('settings.browserError'));
      }
    } catch (error) {
      Alert.alert(t('settings.error'), t('settings.browserError'));
    }
  };

  const handleShareApp = async () => {
    try {
      await Share.share({ message: t('settings.shareMessage') });
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
            {t('settings.aboutTitle')}
          </Text>

          <View style={styles.modalBody}>
            <Text style={[styles.modalLabel, { color: colors.text.light }]}>
              {t('settings.versionLabel')}
            </Text>
            <Text style={[styles.modalValue, { color: colors.text.primary }]}>
              {Constants.expoConfig?.version ?? '–'}
            </Text>

            <Text style={[styles.modalLabel, { color: colors.text.light, marginTop: Spacing.md }]}>
              {t('settings.licenseLabel')}
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
                {t('settings.featureTeaser')}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.modalCloseButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowAboutModal(false)}
          >
            <Text style={styles.modalCloseButtonText}>
              {t('common.close')}
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
        {t('settings.appearance')}
      </Text>

      {/* Theme */}
      <View style={styles.section}>
        <Text style={[styles.optionLabel, { color: colors.text.primary }]}>
          {t('settings.theme')}
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
              {t('settings.themeLight')}
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
              {t('settings.themeDark')}
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
              {t('settings.themeSystem')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Language */}
      <View style={styles.section}>
        <Text style={[styles.optionLabel, { color: colors.text.primary }]}>
          {t('settings.language')}
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

      {/* Sound */}
      <View style={styles.section}>
        <Text style={[styles.optionLabel, { color: colors.text.primary }]}>
          {t('settings.sound')}
        </Text>
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
              soundEnabled && [styles.optionButtonActive, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]
            ]}
            onPress={async () => {
              setSoundEnabled(true);
              SoundManager.setSoundEnabled(true);
              await storageManager.setSetting('soundEnabled', true);
            }}
          >
            <Text style={[
              styles.optionText,
              { color: colors.text.secondary },
              soundEnabled && [styles.optionTextActive, { color: colors.primary }]
            ]}>
              {t('settings.soundOn')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
              !soundEnabled && [styles.optionButtonActive, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]
            ]}
            onPress={async () => {
              setSoundEnabled(false);
              SoundManager.setSoundEnabled(false);
              await storageManager.setSetting('soundEnabled', false);
            }}
          >
            <Text style={[
              styles.optionText,
              { color: colors.text.secondary },
              !soundEnabled && [styles.optionTextActive, { color: colors.primary }]
            ]}>
              {t('settings.soundOff')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Separator */}
      <View style={[styles.separator, { backgroundColor: colors.border }]} />

      {/* DATA Section */}
      <Text style={[styles.sectionTitle, { color: colors.text.light }]}>
        {t('settings.dataSection')}
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
        {t('settings.aboutSupport')}
      </Text>

      <View style={styles.section}>
        <View style={styles.gridRow}>
          <TouchableOpacity
            style={[styles.gridButton, { backgroundColor: colors.background, borderColor: colors.primary }]}
            onPress={handleSendFeedback}
          >
            <Text style={[styles.gridButtonText, { color: colors.primary }]}>
              {t('settings.feedback')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.gridButton, { backgroundColor: colors.background, borderColor: colors.primary }]}
            onPress={handleSupport}
          >
            <Text style={[styles.gridButtonText, { color: colors.primary }]}>
              {t('settings.support')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.gridRow}>
          <TouchableOpacity
            style={[styles.gridButton, { backgroundColor: colors.background, borderColor: colors.primary }]}
            onPress={handleShareApp}
          >
            <Text style={[styles.gridButtonText, { color: colors.primary }]}>
              {t('settings.share')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.gridButton, { backgroundColor: colors.background, borderColor: colors.primary }]}
            onPress={() => setShowAboutModal(true)}
          >
            <Text style={[styles.gridButtonText, { color: colors.primary }]}>
              {t('settings.aboutButton')}
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
                {t('settings.title')}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={[styles.closeText, { color: colors.text.secondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Content – scrollable so all settings are reachable on small screens */}
            <ScrollView
              style={styles.settingsContent}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.settingsContentInner}
            >
              {renderContent()}
            </ScrollView>
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
    overflow: 'hidden',
    ...Colors.shadow.large,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
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
    flexGrow: 1,
    flexShrink: 1,
  },
  settingsContentInner: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },

  // Content styles
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.sm,
  },
  optionLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing.xs,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  optionButton: {
    flex: 1,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
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
    marginVertical: Spacing.sm,
  },
  dangerButton: {
    borderWidth: 2,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
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
    paddingVertical: Spacing.sm,
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
