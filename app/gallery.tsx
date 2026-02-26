import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { t } from '../services/i18n';
import { useTheme } from '../services/ThemeContext';
import storageManager, { GalleryEntry } from '../services/StorageManager';
import DrawingCanvas from '../components/DrawingCanvas';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/Layout';

export default function GalleryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [entries, setEntries] = useState<GalleryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGallery = useCallback(async () => {
    const gallery = await storageManager.getGallery();
    setEntries(gallery);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const handleDelete = (entry: GalleryEntry) => {
    const doDelete = async () => {
      await storageManager.deleteFromGallery(entry.id);
      setEntries(prev => prev.filter(e => e.id !== entry.id));
    };

    if (Platform.OS === 'web') {
      if (window.confirm(t('gallery.deleteConfirm'))) {
        doDelete();
      }
    } else {
      Alert.alert(
        t('gallery.deleteTitle'),
        t('gallery.deleteConfirm'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('common.yes'), style: 'destructive', onPress: doDelete },
        ]
      );
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>
            ← {t('common.back')}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          {t('gallery.title')}
        </Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading && (
          <Text style={[styles.emptyText, { color: colors.text.secondary }]}>...</Text>
        )}

        {!loading && entries.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyIcon]}>🖼️</Text>
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              {t('gallery.empty')}
            </Text>
          </View>
        )}

        {/* Gallery Grid */}
        <View style={styles.grid}>
          {entries.map((entry) => (
            <View key={entry.id} style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.cardPreview}>
                <DrawingCanvas
                  width={140}
                  height={140}
                  paths={entry.paths}
                  strokeColor="#000000"
                  strokeWidth={2}
                />
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
                  {entry.imageName}
                </Text>
                <Text style={[styles.cardMeta, { color: colors.text.secondary }]}>
                  Level {entry.levelNumber} • {'★'.repeat(entry.rating)}{'☆'.repeat(5 - entry.rating)}
                </Text>
                <Text style={[styles.cardDate, { color: colors.text.light }]}>
                  {formatDate(entry.savedAt)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(entry)}
                accessibilityLabel={t('gallery.delete')}
              >
                <Text style={styles.deleteIcon}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  backButton: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
    minWidth: 80,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'center',
  },
  card: {
    width: 170,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Colors.shadow.medium,
  },
  cardPreview: {
    width: 170,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cardInfo: {
    padding: Spacing.sm,
  },
  cardTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  },
  cardMeta: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  cardDate: {
    fontSize: FontSize.xs,
    color: Colors.text.light,
    marginTop: 2,
  },
  deleteButton: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: FontWeight.bold,
  },
});
