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

  /** Segment-Auswahl: mehrere Optionen nebeneinander */
  const renderSegment = (
    options: { label: string; value: string }[],
    current: string,
    onSelect: (value: string) => void
  ) => (
    <View style={[styles.segment, { backgroundColor: colors.surfaceElevated }]}>
      {options.map((opt) => {
        const active = opt.value === current;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.segmentItem,
              active && { backgroundColor: colors.primary },
            ]}
            onPress={() => onSelect(opt.value)}
          >
            <Text style={[
              styles.segmentText,
              { color: active ? Colors.drawing.white : colors.text.secondary },
              active && styles.segmentTextActive,
            ]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  /** Eine Einstellungs-Zeile mit Label + Inhalt */
  const renderRow = (label: string, children: React.ReactNode) => (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <Text style={[styles.rowLabel, { color: colors.text.primary }]}>{label}</Text>
      <View style={styles.rowControl}>{children}</View>
    </View>
  );

  /** Tap-Zeile (für Aktionen wie Feedback, About …) */
  const renderTapRow = (label: string, onPress: () => void, danger = false) => (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: colors.border }]}
      onPress={onPress}
    >
      <Text style={[styles.rowLabel, { color: danger ? colors.error : colors.text.primary }]}>
        {label}
      </Text>
      <Text style={[styles.rowChevron, { color: danger ? colors.error : colors.text.light }]}>
        {danger ? '' : '›'}
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => (
    <View>
      {/* DARSTELLUNG */}
      <Text style={[styles.sectionHeader, { color: colors.text.light }]}>
        {t('settings.appearance')}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        {renderRow(t('settings.theme'), renderSegment(
          [
            { label: t('settings.themeLight'), value: 'light' },
            { label: t('settings.themeDark'),  value: 'dark'  },
            { label: t('settings.themeSystem'), value: 'system' },
          ],
          currentTheme,
          (v) => handleThemeChange(v as 'light' | 'dark' | 'system')
        ))}
        {renderRow(t('settings.language'), renderSegment(
          [
            { label: 'DE', value: 'de' },
            { label: 'EN', value: 'en' },
          ],
          currentLang,
          (v) => handleLanguageChange(v as 'de' | 'en')
        ))}
        {renderRow(t('settings.sound'), renderSegment(
          [
            { label: t('settings.soundOn'),  value: 'on'  },
            { label: t('settings.soundOff'), value: 'off' },
          ],
          soundEnabled ? 'on' : 'off',
          async (v) => {
            const enabled = v === 'on';
            setSoundEnabled(enabled);
            SoundManager.setSoundEnabled(enabled);
            await storageManager.setSetting('soundEnabled', enabled);
          }
        ))}
      </View>

      {/* DATEN */}
      <Text style={[styles.sectionHeader, { color: colors.text.light }]}>
        {t('settings.dataSection')}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        {renderTapRow(t('settings.resetProgress'), handleResetProgress, true)}
      </View>

      {/* INFO & SUPPORT */}
      <Text style={[styles.sectionHeader, { color: colors.text.light }]}>
        {t('settings.aboutSupport')}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        {renderTapRow(t('settings.feedback'), handleSendFeedback)}
        {renderTapRow(t('settings.support'), handleSupport)}
        {renderTapRow(t('settings.share'), handleShareApp)}
        {renderTapRow(t('settings.aboutButton'), () => setShowAboutModal(true))}
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
            <View style={[styles.settingsHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.settingsTitle, { color: colors.text.primary }]}>
                {t('settings.title')}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={[styles.closeText, { color: colors.text.secondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

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

  return <>{renderContent()}</>;
}

const styles = StyleSheet.create({
  // ── Modal wrapper ───────────────────────────────────────────────────────
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
    maxHeight: '85%',
    overflow: 'hidden',
    ...Colors.shadow.large,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  settingsTitle: {
    fontSize: FontSize.lg,      // H3 – Modal-Titel
    fontWeight: FontWeight.semibold,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: FontSize.md,
  },
  settingsContent: {
    flexGrow: 1,
    flexShrink: 1,
  },
  settingsContentInner: {
    padding: Spacing.md,
  },

  // ── Abschnitts-Beschriftung ─────────────────────────────────────────────
  sectionHeader: {
    fontSize: FontSize.xs,      // Tiny – uppercase label
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },

  // ── Card-Container pro Abschnitt ────────────────────────────────────────
  card: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Colors.shadow.small,
  },

  // ── Einzel-Zeile ────────────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 44,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    fontSize: FontSize.sm,      // Body
    fontWeight: FontWeight.medium,
    flex: 1,
  },
  rowControl: {
    marginLeft: Spacing.sm,
  },
  rowChevron: {
    fontSize: FontSize.lg,
    marginLeft: Spacing.sm,
  },

  // ── Segment-Control ─────────────────────────────────────────────────────
  segment: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  segmentItem: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontSize: FontSize.xs,      // Tiny
    fontWeight: FontWeight.medium,
  },
  segmentTextActive: {
    fontWeight: FontWeight.bold,
  },

  // ── About-Modal ─────────────────────────────────────────────────────────
  aboutModalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    ...Colors.shadow.large,
  },
  modalTitle: {
    fontSize: FontSize.lg,      // H3
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  modalBody: {
    marginBottom: Spacing.lg,
  },
  modalLabel: {
    fontSize: FontSize.xs,      // Caption
    fontWeight: FontWeight.medium,
    marginBottom: Spacing.xs,
  },
  modalValue: {
    fontSize: FontSize.sm,      // Body
    fontWeight: FontWeight.semibold,
  },
  modalLink: {
    fontSize: FontSize.sm,
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
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
  modalCloseButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: Colors.drawing.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
});
