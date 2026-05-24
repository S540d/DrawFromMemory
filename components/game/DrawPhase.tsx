import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, FlatList } from 'react-native';
import DrawingCanvas from '@components/DrawingCanvas';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { DrawingColors } from '../../constants/Colors';
import Colors from '../../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Layout';
import type { DrawPhaseProps } from './game.shared';
import { useTranslation } from '@services/i18n';

export default function DrawPhase({
  currentImage,
  currentLang,
  hasUsedHint,
  onUseHint,
  onShowHintModal,
  drawing,
  layout,
  onDone,
}: DrawPhaseProps) {
  const { t } = useTranslation();

  const levelName = currentLang === 'en' ? currentImage?.displayNameEn : currentImage?.displayName;

  const dynCanvasContainer = useMemo(() => ({
    maxHeight: layout.canvasMaxHeight,
    minHeight: layout.canvasMinHeight,
    marginVertical: layout.canvasMarginVertical,
  }), [layout.canvasMaxHeight, layout.canvasMinHeight, layout.canvasMarginVertical]);

  const dynToolbar = useMemo(() => ({
    marginVertical: layout.toolbarMarginVertical,
  }), [layout.toolbarMarginVertical]);

  const dynButton = useMemo(() => ({
    minHeight: layout.buttonMinHeight,
    paddingVertical: layout.buttonPaddingVertical,
  }), [layout.buttonMinHeight, layout.buttonPaddingVertical]);

  return (
    <View style={styles.phaseContainer}>
      {/* Info-Streifen: Aufgabe + Hint-Joker */}
      <View style={styles.infoStrip}>
        <View style={styles.infoStripCenter}>
          <Text style={styles.infoStripLabel}>{t('game.draw.referenceLabel')}</Text>
          <Text style={styles.infoStripText} numberOfLines={2}>
            {t('game.draw.drawFromMemory')}{levelName ? ` — ${levelName}` : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.hintButton, hasUsedHint && styles.hintButtonUsed]}
          onPress={() => {
            if (!hasUsedHint) {
              onUseHint();
              onShowHintModal();
            }
          }}
          disabled={hasUsedHint}
          accessibilityLabel={hasUsedHint ? t('game.draw.hintUsed') : t('game.draw.hintButton')}
          accessibilityRole="button"
        >
          <Text style={styles.hintButtonIcon}>👁</Text>
        </TouchableOpacity>
      </View>

      {/* Zeichenfläche */}
      <View style={[styles.canvasContainer, dynCanvasContainer]}>
        <ErrorBoundary>
          <DrawingCanvas
            strokeColor={drawing.color}
            strokeWidth={drawing.strokeWidth}
            tool={drawing.tool}
            paths={drawing.paths}
            onDrawingChange={drawing.setPaths}
          />
        </ErrorBoundary>
      </View>

      {/* Toolbar-Gruppe */}
      <View style={[styles.toolbarGroup, dynToolbar]}>
        {/* Reihe 1: Inline-Farbreihe */}
        <FlatList
          data={DrawingColors}
          keyExtractor={(item) => item.hex}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.colorRowContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.inlineColorSwatch,
                item.border && { borderColor: item.border },
                drawing.color === item.hex && styles.inlineColorSwatchActive,
              ]}
              onPress={() => drawing.setColor(item.hex)}
              accessibilityLabel={currentLang === 'de' ? item.name : item.nameEn}
              accessibilityRole="button"
            >
              <View style={[styles.inlineColorSwatchInner, { backgroundColor: item.hex }]} />
              {drawing.color === item.hex && (
                <Text style={styles.inlineColorCheckmark}>✓</Text>
              )}
            </TouchableOpacity>
          )}
        />

        <View style={styles.toolbarDivider} />

        {/* Reihe 2: Pen/Fill + Strichstärken */}
        <View style={styles.toolRow}>
          <TouchableOpacity
            style={[styles.toolToggleButton, drawing.tool === 'brush' && styles.toolToggleButtonActive]}
            onPress={() => drawing.setTool('brush')}
            accessibilityLabel={t('game.draw.toolBrush')}
            accessibilityRole="button"
          >
            <Text style={styles.toolToggleIcon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toolToggleButton, drawing.tool === 'fill' && styles.toolToggleButtonActive]}
            onPress={() => drawing.setTool('fill')}
            accessibilityLabel={t('game.draw.toolFill')}
            accessibilityRole="button"
          >
            <Text style={styles.toolToggleIcon}>🪣</Text>
          </TouchableOpacity>

          <View style={styles.toolRowSeparator} />

          {([2, 3, 5] as const).map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.strokeCircleButton,
                drawing.tool === 'fill' && styles.strokeCircleDisabled,
              ]}
              onPress={() => { if (drawing.tool !== 'fill') drawing.setStrokeWidth(size); }}
              disabled={drawing.tool === 'fill'}
              accessibilityLabel={`${t('game.draw.strokeWidth')} ${size}`}
              accessibilityRole="button"
            >
              <View style={[
                styles.strokeCircle,
                {
                  width: size === 2 ? 10 : size === 3 ? 16 : 22,
                  height: size === 2 ? 10 : size === 3 ? 16 : 22,
                  backgroundColor: drawing.strokeWidth === size && drawing.tool !== 'fill'
                    ? drawing.color
                    : Colors.text.secondary,
                },
              ]} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, dynButton]}
          onPress={drawing.undo}
          disabled={drawing.paths.length === 0}
          accessibilityLabel={t('game.draw.undo')}
          accessibilityRole="button"
        >
          <Text
            style={[styles.secondaryButtonText, layout.isSmall && styles.buttonTextSmall]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >{t('game.draw.undo')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryButton, dynButton, drawing.paths.length === 0 && styles.buttonDisabled]}
          accessibilityLabel={t('game.draw.clear')}
          accessibilityRole="button"
          onPress={() => {
            if (Platform.OS === 'web') {
              if (drawing.paths.length > 0 && window.confirm(t('game.draw.clearConfirm'))) { // platform-safe
                drawing.setPaths([]);
              }
            } else {
              if (drawing.paths.length === 0) return;
              Alert.alert(
                t('game.draw.clear'),
                t('game.draw.clearConfirm'),
                [
                  { text: t('common.cancel'), style: 'cancel' },
                  { text: t('common.yes'), style: 'destructive', onPress: () => { drawing.setPaths([]); } },
                ]
              );
            }
          }}
          disabled={drawing.paths.length === 0}
        >
          <Text
            style={[styles.secondaryButtonText, layout.isSmall && styles.buttonTextSmall]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >{t('game.draw.clear')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, dynButton]}
          onPress={onDone}
        >
          <Text
            style={[styles.primaryButtonText, layout.isSmall && styles.buttonTextSmall]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >{t('game.draw.done')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  phaseContainer: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  infoStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.sm,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Colors.shadow.small,
  },
  infoStripCenter: {
    flex: 1,
  },
  infoStripLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  infoStripText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  hintButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    ...Colors.shadow.small,
  },
  hintButtonUsed: {
    backgroundColor: Colors.border,
    opacity: 0.5,
  },
  hintButtonIcon: {
    fontSize: 20,
  },
  canvasContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbarGroup: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.xl,
    padding: Spacing.sm,
    marginVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  colorRowContent: {
    gap: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
  },
  inlineColorSwatch: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  inlineColorSwatchActive: {
    borderColor: Colors.primary,
    borderWidth: 3,
    transform: [{ scale: 1.15 }],
  },
  inlineColorSwatchInner: {
    ...StyleSheet.absoluteFillObject,
  },
  inlineColorCheckmark: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    textShadowColor: Colors.background,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  toolbarDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xs,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  toolToggleButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  toolToggleButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toolToggleIcon: {
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  toolRowSeparator: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xs,
  },
  strokeCircleButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strokeCircle: {
    borderRadius: 999,
  },
  strokeCircleDisabled: {
    opacity: 0.35,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    ...Colors.shadow.medium,
  },
  primaryButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.background,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    minHeight: 48,
    justifyContent: 'center',
    ...Colors.shadow.small,
  },
  secondaryButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  buttonDisabled: {
    opacity: 0.4,
    borderColor: Colors.text.light,
  },
  buttonTextSmall: {
    fontSize: FontSize.md,
  },
});
