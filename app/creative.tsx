import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DrawingCanvas, { useDrawingCanvas } from '@components/DrawingCanvas';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { DrawingColors } from '../constants/Colors';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/Layout';
import { useTranslation } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';
import storageManager from '@services/StorageManager';
import { shareDrawing } from '@services/ShareService';
import SoundManager from '@services/SoundManager';

export default function CreativeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const drawing = useDrawingCanvas();
  const [savedToGallery, setSavedToGallery] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 320, height: 420 });

  const handleSave = async () => {
    if (savedToGallery || drawing.paths.length === 0) return;
    await storageManager.saveToGallery({
      levelNumber: 0,
      imageFilename: 'creative',
      imageName: t('creative.imageName'),
      paths: drawing.paths,
      rating: 0,
    });
    SoundManager.playSuccess();
    setSavedToGallery(true);
  };

  const handleShare = async () => {
    if (drawing.paths.length === 0) return;
    try {
      await shareDrawing(drawing.paths, t('creative.imageName'));
    } catch (e) {
      Alert.alert(t('gallery.shareError'));
    }
  };

  const handleClear = () => {
    if (drawing.paths.length === 0) return;
    if (Platform.OS === 'web') {
      if (window.confirm(t('game.draw.clearConfirm'))) { // platform-safe
        drawing.setPaths([]);
        setSavedToGallery(false);
      }
    } else {
      Alert.alert(
        t('game.draw.clear'),
        t('game.draw.clearConfirm'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('common.yes'), style: 'destructive', onPress: () => { drawing.setPaths([]); setSavedToGallery(false); } },
        ]
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button">
          <Text style={[styles.backText, { color: colors.primary }]}>← {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text.primary }]}>{t('creative.title')}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Canvas — nimmt den gesamten freien Platz ein */}
      <View
        style={styles.canvasContainer}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setCanvasSize({ width: Math.floor(width), height: Math.floor(height) });
        }}
      >
        <ErrorBoundary>
          <DrawingCanvas
            width={canvasSize.width}
            height={canvasSize.height}
            strokeColor={drawing.color}
            strokeWidth={drawing.strokeWidth}
            tool={drawing.tool}
            paths={drawing.paths}
            onDrawingChange={(paths) => { drawing.setPaths(paths); setSavedToGallery(false); }}
          />
        </ErrorBoundary>
      </View>

      {/* Toolbar */}
      <View style={[styles.toolbarGroup, { backgroundColor: colors.surfaceAlt }]}>
        <FlatList
          data={DrawingColors}
          keyExtractor={(item) => item.hex}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.colorRowContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.colorSwatch,
                { borderColor: item.border ?? colors.border },
                drawing.color === item.hex && styles.colorSwatchActive,
              ]}
              onPress={() => drawing.setColor(item.hex)}
              accessibilityRole="button"
            >
              <View style={[styles.colorSwatchInner, { backgroundColor: item.hex }]} />
              {drawing.color === item.hex && <Text style={styles.colorCheckmark}>✓</Text>}
            </TouchableOpacity>
          )}
        />

        <View style={[styles.toolbarDivider, { backgroundColor: colors.border }]} />

        <View style={styles.toolRow}>
          <TouchableOpacity
            style={[styles.toolButton, { backgroundColor: colors.surface, borderColor: colors.border }, drawing.tool === 'brush' && styles.toolButtonActive]}
            onPress={() => drawing.setTool('brush')}
            accessibilityRole="button"
            accessibilityLabel={t('game.draw.toolBrush')}
          >
            <Text style={styles.toolIcon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toolButton, { backgroundColor: colors.surface, borderColor: colors.border }, drawing.tool === 'fill' && styles.toolButtonActive]}
            onPress={() => drawing.setTool('fill')}
            accessibilityRole="button"
            accessibilityLabel={t('game.draw.toolFill')}
          >
            <Text style={styles.toolIcon}>🪣</Text>
          </TouchableOpacity>

          <View style={[styles.toolRowSeparator, { backgroundColor: colors.border }]} />

          {([2, 3, 5] as const).map((size) => (
            <TouchableOpacity
              key={size}
              style={[styles.strokeButton, drawing.tool === 'fill' && styles.strokeButtonDisabled]}
              onPress={() => { if (drawing.tool !== 'fill') drawing.setStrokeWidth(size); }}
              disabled={drawing.tool === 'fill'}
              accessibilityRole="button"
            >
              <View style={[
                styles.strokeCircle,
                {
                  width: size === 2 ? 10 : size === 3 ? 16 : 22,
                  height: size === 2 ? 10 : size === 3 ? 16 : 22,
                  backgroundColor: drawing.strokeWidth === size && drawing.tool !== 'fill'
                    ? drawing.color
                    : colors.text.secondary,
                },
              ]} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: Colors.primary }, drawing.paths.length === 0 && styles.buttonDisabled]}
          onPress={drawing.undo}
          disabled={drawing.paths.length === 0}
          accessibilityRole="button"
          accessibilityLabel={t('game.draw.undo')}
        >
          <Text style={[styles.secondaryButtonText, { color: Colors.primary }]}>{t('game.draw.undo')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: Colors.primary }, drawing.paths.length === 0 && styles.buttonDisabled]}
          onPress={handleClear}
          disabled={drawing.paths.length === 0}
          accessibilityRole="button"
          accessibilityLabel={t('game.draw.clear')}
        >
          <Text style={[styles.secondaryButtonText, { color: Colors.primary }]}>{t('game.draw.clear')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: Colors.primary }, drawing.paths.length === 0 && styles.buttonDisabled]}
          onPress={handleShare}
          disabled={drawing.paths.length === 0}
          accessibilityRole="button"
          accessibilityLabel={t('gallery.share')}
        >
          <Text style={[styles.secondaryButtonText, { color: Colors.primary }]}>{t('gallery.share')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.saveButton,
            (savedToGallery || drawing.paths.length === 0) && styles.buttonDisabled,
            savedToGallery && styles.saveButtonDone,
          ]}
          onPress={handleSave}
          disabled={savedToGallery || drawing.paths.length === 0}
          accessibilityRole="button"
          accessibilityLabel={savedToGallery ? t('gallery.saved') : t('gallery.save')}
        >
          <Text style={styles.saveButtonText}>
            {savedToGallery ? `✓ ${t('gallery.saved')}` : t('gallery.save')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 52,
  },
  backButton: {
    minWidth: 80,
  },
  backText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },
  headerRight: {
    minWidth: 80,
  },
  canvasContainer: {
    flex: 1,
  },
  toolbarGroup: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
  },
  colorRowContent: {
    gap: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  colorSwatchActive: {
    borderColor: Colors.primary,
    borderWidth: 3,
    transform: [{ scale: 1.15 }],
  },
  colorSwatchInner: {
    ...StyleSheet.absoluteFillObject,
  },
  colorCheckmark: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: '#2c2c2c',
    textShadowColor: '#f7f2eb',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  toolbarDivider: {
    height: 1,
    marginHorizontal: Spacing.xs,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  toolButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  toolButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toolIcon: {
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  toolRowSeparator: {
    width: 1,
    height: 28,
    marginHorizontal: Spacing.xs,
  },
  strokeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strokeButtonDisabled: {
    opacity: 0.35,
  },
  strokeCircle: {
    borderRadius: 999,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    minHeight: 44,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  saveButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
    ...Colors.shadow.medium,
  },
  saveButtonDone: {
    backgroundColor: Colors.success,
  },
  saveButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: '#ffffff',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});
