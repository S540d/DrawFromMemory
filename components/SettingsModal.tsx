import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Linking,
  Share,
  ScrollView,
} from 'react-native';
import Constants from 'expo-constants';
import { useTranslation, getLanguage, setLanguage, type Language } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';
import storageManager from '@services/StorageManager';
import SoundManager from '@services/SoundManager';
import { getAgeGroup, setAgeGroup } from '@services/AgeGroupManager';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/Layout';
import ParentalGate from './ParentalGate';
import ParentDashboard from './ParentDashboard';
import BadgesModal from './BadgesModal';
import { useParentalGateAction } from './useParentalGateAction';
import type { AgeGroup } from '../types';

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
  const { t } = useTranslation();
  const { colors, themeSetting, setTheme } = useTheme();
  const [currentLang, setCurrentLang] = useState(getLanguage());
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>(themeSetting);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [celebrationEnabled, setCelebrationEnabled] = useState(true);
  const [showParentDashboard, setShowParentDashboard] = useState(false);
  const [ageGroup, setCurrentAgeGroup] = useState<AgeGroup | null>(null);
  const parentalGate = useParentalGateAction();

  useEffect(() => {
    setCurrentLang(getLanguage());
    setCurrentTheme(themeSetting);
    storageManager.getSetting('soundEnabled').then(setSoundEnabled);
    storageManager.getSetting('celebrationEnabled').then(setCelebrationEnabled);
    getAgeGroup().then(setCurrentAgeGroup);
  }, [visible, themeSetting]);

  const handleAgeGroupChange = async (value: AgeGroup) => {
    setCurrentAgeGroup(value);
    await setAgeGroup(value);
  };

  const handleLanguageChange = async (lang: Language) => {
    await setLanguage(lang);
    setCurrentLang(lang);
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    setCurrentTheme(newTheme);
    await setTheme(newTheme);
  };

  const handleResetProgress = () => {
    Alert.alert(t('settings.resetProgress'), t('settings.resetConfirmMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.yes'),
        style: 'destructive',
        onPress: async () => {
          try {
            await storageManager.resetProgress();
            Alert.alert(t('settings.resetSuccess'), t('settings.resetSuccessMessage'));
          } catch (error) {
            console.error('Error resetting progress:', error);
          }
        },
      },
    ]);
  };

  const openExternalUrl = (url: string) => {
    parentalGate.openWithUrl(url, {
      errorTitle: t('settings.error'),
      errorMessage: url.includes('ko-fi.com')
        ? t('settings.browserError')
        : t('settings.browserErrorGeneric'),
    });
  };

  const openParentDashboard = () => {
    parentalGate.openWithAction(() => setShowParentDashboard(true));
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

  const handleSupport = () => {
    openExternalUrl('https://ko-fi.com/s540d');
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
            <Text style={[styles.modalValue, { color: colors.text.primary }]}>
              Open Source • MIT
            </Text>

            <Text style={[styles.modalLabel, { color: colors.text.light, marginTop: Spacing.md }]}>
              GitHub
            </Text>
            <TouchableOpacity
              onPress={() => openExternalUrl('https://github.com/S540d/DrawFromMemory')}
            >
              <Text style={[styles.modalLink, { color: colors.primary }]}>
                S540d/DrawFromMemory ↗
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.modalCloseButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowAboutModal(false)}
          >
            <Text style={styles.modalCloseButtonText}>{t('common.close')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  /** Segment-Auswahl: mehrere Optionen nebeneinander */
  const renderSegment = (
    options: { label: string; value: string }[],
    current: string,
    onSelect: (value: string) => void,
  ) => (
    <View style={[styles.segment, { backgroundColor: colors.surfaceElevated }]}>
      {options.map(opt => {
        const active = opt.value === current;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.segmentItem, active && { backgroundColor: colors.primary }]}
            onPress={() => onSelect(opt.value)}
            accessibilityRole="button"
            accessibilityLabel={opt.label}
            accessibilityState={{ selected: active }}
          >
            <Text
              style={[
                styles.segmentText,
                { color: active ? Colors.drawing.white : colors.text.secondary },
                active && styles.segmentTextActive,
              ]}
            >
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
    <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]} onPress={onPress}>
      <Text style={[styles.rowLabel, { color: danger ? colors.error : colors.text.primary }]}>
        {label}
      </Text>
      {!danger && (
        <Text
          style={[styles.rowChevron, { color: colors.text.light }]}
          accessible={false}
          importantForAccessibility="no"
        >
          ›
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderContent = () => (
    <View>
      {/* DARSTELLUNG */}
      <Text style={[styles.sectionHeader, { color: colors.text.light }]}>
        {t('settings.appearance')}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        {renderRow(
          t('settings.theme'),
          renderSegment(
            [
              { label: t('settings.themeLight'), value: 'light' },
              { label: t('settings.themeDark'), value: 'dark' },
              { label: t('settings.themeSystem'), value: 'system' },
            ],
            currentTheme,
            v => handleThemeChange(v as 'light' | 'dark' | 'system'),
          ),
        )}
        <View style={[styles.row, styles.languageRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.rowLabel, { color: colors.text.primary, marginBottom: Spacing.xs }]}>
            {t('settings.language')}
          </Text>
          {renderSegment(
            [
              { label: 'DE', value: 'de' },
              { label: 'EN', value: 'en' },
              { label: 'ES', value: 'es' },
              { label: 'FR', value: 'fr' },
              { label: 'IT', value: 'it' },
              { label: 'NL', value: 'nl' },
              { label: 'PL', value: 'pl' },
            ],
            currentLang,
            v => handleLanguageChange(v as Language),
          )}
        </View>
        {renderRow(
          t('settings.sound'),
          renderSegment(
            [
              { label: t('settings.soundOn'), value: 'on' },
              { label: t('settings.soundOff'), value: 'off' },
            ],
            soundEnabled ? 'on' : 'off',
            async v => {
              const enabled = v === 'on';
              setSoundEnabled(enabled);
              SoundManager.setSoundEnabled(enabled);
              await storageManager.setSetting('soundEnabled', enabled);
            },
          ),
        )}
      </View>

      {/* PERSONALISIEREN */}
      <Text style={[styles.sectionHeader, { color: colors.text.light }]}>
        {t('settings.personalize')}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        {renderRow(
          t('ageGroup.settingsLabel'),
          renderSegment(
            [
              { label: t('ageGroup.group3to5'), value: '3-5' },
              { label: t('ageGroup.group6to8'), value: '6-8' },
              { label: t('ageGroup.group9plus'), value: '9plus' },
            ],
            ageGroup ?? '',
            v => handleAgeGroupChange(v as AgeGroup),
          ),
        )}
        {renderRow(
          t('settings.celebration'),
          renderSegment(
            [
              { label: t('settings.soundOn'), value: 'on' },
              { label: t('settings.soundOff'), value: 'off' },
            ],
            celebrationEnabled ? 'on' : 'off',
            async v => {
              const enabled = v === 'on';
              setCelebrationEnabled(enabled);
              await storageManager.setSetting('celebrationEnabled', enabled);
            },
          ),
        )}
      </View>

      {/* INFO & SUPPORT + DATEN */}
      <Text style={[styles.sectionHeader, { color: colors.text.light }]}>
        {t('settings.aboutSupport')}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.actionGrid}>
          {(
            [
              {
                id: 'trophies',
                label: t('achievements.menuLabel'),
                icon: '🏆',
                onPress: () => setShowBadgesModal(true),
              },
              {
                id: 'parents',
                label: t('parentDashboard.menuLabel'),
                icon: '👨‍👩‍👧',
                onPress: openParentDashboard,
              },
              {
                id: 'feedback',
                label: t('settings.feedback'),
                icon: '✉️',
                onPress: handleSendFeedback,
              },
              { id: 'support', label: t('settings.support'), icon: '☕', onPress: handleSupport },
              { id: 'share', label: t('settings.share'), icon: '↗', onPress: handleShareApp },
              {
                id: 'about',
                label: t('settings.aboutButton'),
                icon: 'ℹ',
                onPress: () => setShowAboutModal(true),
              },
            ] as const
          ).map(({ id, label, icon, onPress }, idx) => (
            <TouchableOpacity
              key={id}
              style={[
                styles.actionGridItem,
                { borderColor: colors.border },
                idx < 3 && styles.actionGridItemTop,
                idx % 3 !== 0 && styles.actionGridItemRight,
              ]}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityLabel={label}
            >
              <Text
                accessible={false}
                importantForAccessibility="no"
                style={[styles.actionGridIcon, { color: colors.primary }]}
              >
                {icon}
              </Text>
              <Text style={[styles.actionGridLabel, { color: colors.text.primary }]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {renderTapRow(t('settings.resetProgress'), handleResetProgress, true)}
      </View>

      {renderAboutModal()}
      <ParentDashboard
        visible={showParentDashboard}
        onClose={() => setShowParentDashboard(false)}
      />
      <BadgesModal visible={showBadgesModal} onClose={() => setShowBadgesModal(false)} />
    </View>
  );

  // Modal wrapper if not embedded
  if (!embedded) {
    return (
      <>
        <ParentalGate
          visible={parentalGate.gateVisible}
          onSuccess={parentalGate.onSuccess}
          onCancel={parentalGate.onCancel}
        />
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
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
      </>
    );
  }

  // Embedded: ParentalGate lives outside the content fragment
  return (
    <>
      <ParentalGate
        visible={parentalGate.gateVisible}
        onSuccess={parentalGate.onSuccess}
        onCancel={parentalGate.onCancel}
      />
      {renderContent()}
    </>
  );
}

const styles = StyleSheet.create({
  // ── Modal wrapper ───────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  settingsModalContent: {
    borderRadius: BorderRadius.xl,
    width: '100%',
    maxWidth: 400,
    maxHeight: '75%',
    overflow: 'hidden',
    ...Colors.shadow.large,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
  },
  settingsTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: FontSize.sm,
  },
  settingsContent: {
    flexGrow: 1,
    flexShrink: 1,
  },
  settingsContentInner: {
    padding: Spacing.sm,
  },

  // ── Abschnitts-Beschriftung ─────────────────────────────────────────────
  sectionHeader: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: Spacing.sm,
    marginBottom: 2,
    paddingHorizontal: Spacing.xs,
  },

  // ── Card-Container pro Abschnitt ────────────────────────────────────────
  card: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Colors.shadow.small,
  },

  // ── Einzel-Zeile ────────────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  languageRow: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  rowLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    flex: 1,
  },
  rowControl: {
    marginLeft: Spacing.xs,
  },
  rowChevron: {
    fontSize: FontSize.md,
    marginLeft: Spacing.xs,
  },

  // ── Action Grid ─────────────────────────────────────────────────────────
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionGridItem: {
    width: '33.333%',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionGridItemTop: {
    borderTopWidth: 0,
  },
  actionGridItemRight: {
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
  actionGridIcon: {
    fontSize: 16,
  },
  actionGridLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },

  // ── Segment-Control ─────────────────────────────────────────────────────
  segment: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  segmentItem: {
    paddingVertical: 3,
    paddingHorizontal: Spacing.xs,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontSize: FontSize.xs,
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
    padding: Spacing.md,
    ...Colors.shadow.large,
  },
  modalTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  modalBody: {
    marginBottom: Spacing.md,
  },
  modalLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    marginBottom: 2,
  },
  modalValue: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  modalLink: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    textDecorationLine: 'underline',
  },
  modalCloseButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: Colors.drawing.white,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
});
