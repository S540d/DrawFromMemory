import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, FlatList } from 'react-native';
import DrawingCanvas from '@components/DrawingCanvas';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { DrawingColors } from '../../constants/Colors';
import Colors from '../../constants/Colors';
import { PenIcon, FillIcon, EyeIcon } from './ToolIcons';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Layout';
import type { DrawPhaseProps } from './game.shared';
import { useTranslation } from '@services/i18n';
import { useTheme } from '@services/ThemeContext';

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
  const { colors } = useTheme();

  const levelName = currentLang === 'en' ? currentImage?.displayNameEn : currentImage?.displayName;

  // Querformat: Werkzeugleiste steht neben statt unter der Zeichenfläche,
  // damit die Zeichenfläche die verfügbare Höhe voll ausnutzt (Issue #279, 2.4).
  const isSideToolbar = layout.toolbarPosition === 'side';
  const sideToolbarWidth = layout.sideToolbarWidth ?? 120;

  const dynCanvasContainer = useMemo(
    () => ({
      maxHeight: layout.canvasMaxHeight,
      minHeight: layout.canvasMinHeight,
      marginVertical: layout.canvasMarginVertical,
    }),
    [layout.canvasMaxHeight, layout.canvasMinHeight, layout.canvasMarginVertical],
  );

  const dynToolbar = useMemo(
    () =>
      isSideToolbar
        ? { marginVertical: 0, marginLeft: Spacing.sm, width: sideToolbarWidth }
        : { marginVertical: layout.toolbarMarginVertical },
    [isSideToolbar, sideToolbarWidth, layout.toolbarMarginVertical],
  );

  const colorList = (
    <FlatList
      data={DrawingColors}
      keyExtractor={item => item.hex}
      horizontal={!isSideToolbar}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={isSideToolbar ? styles.colorColumnContent : styles.colorRowContent}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.inlineColorSwatch,
            { borderColor: item.border ?? colors.border },
            drawing.color === item.hex && styles.inlineColorSwatchActive,
          ]}
          onPress={() => drawing.setColor(item.hex)}
          accessibilityLabel={currentLang === 'de' ? item.name : item.nameEn}
          accessibilityRole="button"
        >
          <View style={[styles.inlineColorSwatchInner, { backgroundColor: item.hex }]} />
          {drawing.color === item.hex && <Text style={styles.inlineColorCheckmark}>✓</Text>}
        </TouchableOpacity>
      )}
    />
  );

  const toolControls = (
    <View style={[styles.toolRow, isSideToolbar && styles.toolRowWrap]}>
      <TouchableOpacity
        style={[
          styles.toolToggleButton,
          { backgroundColor: colors.surface, borderColor: colors.border },
          drawing.tool === 'brush' && styles.toolToggleButtonActive,
        ]}
        onPress={() => drawing.setTool('brush')}
        accessibilityLabel={t('game.draw.toolBrush')}
        accessibilityRole="button"
      >
        <PenIcon
          size={20}
          color={drawing.tool === 'brush' ? Colors.drawing.white : colors.text.secondary}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.toolToggleButton,
          { backgroundColor: colors.surface, borderColor: colors.border },
          drawing.tool === 'fill' && styles.toolToggleButtonActive,
        ]}
        onPress={() => drawing.setTool('fill')}
        accessibilityLabel={t('game.draw.toolFill')}
        accessibilityRole="button"
      >
        <FillIcon
          size={20}
          color={drawing.tool === 'fill' ? Colors.drawing.white : colors.text.secondary}
        />
      </TouchableOpacity>

      {!isSideToolbar && (
        <View style={[styles.toolRowSeparator, { backgroundColor: colors.border }]} />
      )}

      {([2, 3, 5] as const).map(size => {
        const isSelected = drawing.strokeWidth === size && drawing.tool !== 'fill';
        // Alle drei Punkte zeigen die aktuell gewählte Pinselfarbe (unterscheiden sich
        // nur in der Größe). Die Auswahl selbst wird über den Ring (borderColor) angezeigt.
        const dotColor = drawing.tool !== 'fill' ? drawing.color : colors.text.secondary;
        return (
          <TouchableOpacity
            key={size}
            style={[
              styles.strokeCircleButton,
              isSelected && styles.strokeCircleButtonSelected,
              drawing.tool === 'fill' && styles.strokeCircleDisabled,
            ]}
            onPress={() => {
              if (drawing.tool !== 'fill') drawing.setStrokeWidth(size);
            }}
            disabled={drawing.tool === 'fill'}
            accessibilityLabel={`${t('game.draw.strokeWidth')} ${size}`}
            accessibilityRole="button"
          >
            <View
              style={[
                styles.strokeCircle,
                {
                  width: size === 2 ? 10 : size === 3 ? 16 : 22,
                  height: size === 2 ? 10 : size === 3 ? 16 : 22,
                  backgroundColor: dotColor,
                },
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const buttonRow = (
    <View style={styles.buttonRow}>
      <TouchableOpacity
        style={[
          styles.secondaryButton,
          { backgroundColor: colors.surface, borderColor: Colors.primary },
        ]}
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
        >
          {t('game.draw.undo')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.secondaryButton,
          { backgroundColor: colors.surface, borderColor: Colors.primary },
          drawing.paths.length === 0 && styles.buttonDisabled,
        ]}
        accessibilityLabel={t('game.draw.clear')}
        accessibilityRole="button"
        onPress={() => {
          if (Platform.OS === 'web') {
            if (drawing.paths.length === 0) return;
            if (window.confirm(t('game.draw.clearConfirm'))) drawing.setPaths([]); // platform-safe
          } else {
            if (drawing.paths.length === 0) return;
            Alert.alert(t('game.draw.clear'), t('game.draw.clearConfirm'), [
              { text: t('common.cancel'), style: 'cancel' },
              {
                text: t('common.yes'),
                style: 'destructive',
                onPress: () => {
                  drawing.setPaths([]);
                },
              },
            ]);
          }
        }}
        disabled={drawing.paths.length === 0}
      >
        <Text
          style={[styles.secondaryButtonText, layout.isSmall && styles.buttonTextSmall]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {t('game.draw.clear')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.primaryButton} onPress={onDone}>
        <Text
          style={[styles.primaryButtonText, layout.isSmall && styles.buttonTextSmall]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {t('game.draw.done')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.phaseContainer}>
      {/* Info-Streifen: Aufgabe + Hint-Joker */}
      <View
        style={[styles.infoStrip, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <View style={styles.infoStripCenter}>
          <Text style={[styles.infoStripLabel, { color: colors.text.secondary }]}>
            {t('game.draw.referenceLabel')}
          </Text>
          <Text style={[styles.infoStripText, { color: colors.text.primary }]} numberOfLines={2}>
            {t('game.draw.drawFromMemory')}
            {levelName ? ` — ${levelName}` : ''}
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
          <View style={styles.hintButtonContent}>
            <EyeIcon size={14} color={hasUsedHint ? colors.text.secondary : Colors.drawing.white} />
            {!hasUsedHint && <Text style={styles.hintButtonIcon}>{t('game.draw.hintButton')}</Text>}
          </View>
        </TouchableOpacity>
      </View>

      {/* Hauptbereich: Zeichenfläche + Werkzeugleiste — nebeneinander im Querformat (Issue #279, 2.4) */}
      <View style={[styles.mainArea, isSideToolbar && styles.mainAreaRow]}>
        <View style={styles.canvasColumn}>
          {/* Zeichenfläche */}
          <View style={[styles.canvasContainer, dynCanvasContainer]}>
            <ErrorBoundary>
              <DrawingCanvas
                height={Math.floor(layout.canvasMaxHeight)}
                strokeColor={drawing.color}
                strokeWidth={drawing.strokeWidth}
                tool={drawing.tool}
                paths={drawing.paths}
                onDrawingChange={drawing.setPaths}
              />
            </ErrorBoundary>
          </View>

          {isSideToolbar && buttonRow}
        </View>

        {/* Werkzeugleiste-Gruppe */}
        <View
          style={[
            styles.toolbarGroup,
            dynToolbar,
            { backgroundColor: colors.surfaceAlt },
            isSideToolbar && styles.toolbarGroupSide,
          ]}
        >
          {colorList}
          <View
            style={[
              styles.toolbarDivider,
              isSideToolbar && styles.toolbarDividerSide,
              { backgroundColor: colors.border },
            ]}
          />
          {toolControls}
        </View>
      </View>

      {!isSideToolbar && buttonRow}
    </View>
  );
}

const styles = StyleSheet.create({
  phaseContainer: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  infoStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: BorderRadius.xl,
    padding: Spacing.sm,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    ...Colors.shadow.small,
  },
  infoStripCenter: {
    flex: 1,
  },
  infoStripLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  infoStripText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  hintButton: {
    minWidth: 52,
    height: 40,
    paddingHorizontal: Spacing.sm,
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
  hintButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hintButtonIcon: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: '#FFFFFF',
  },
  mainArea: {
    flex: 1,
  },
  mainAreaRow: {
    flexDirection: 'row',
  },
  canvasColumn: {
    flex: 1,
  },
  canvasContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbarGroup: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.sm,
    marginVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  toolbarGroupSide: {
    justifyContent: 'flex-start',
  },
  colorRowContent: {
    gap: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
  },
  colorColumnContent: {
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
    color: '#2c2c2c',
    textShadowColor: '#f7f2eb',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  toolbarDivider: {
    height: 1,
    marginHorizontal: Spacing.xs,
  },
  toolbarDividerSide: {
    height: 1,
    width: '100%',
    marginHorizontal: 0,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  toolRowWrap: {
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  toolToggleButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  toolToggleButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toolRowSeparator: {
    width: 1,
    height: 28,
    marginHorizontal: Spacing.xs,
  },
  strokeCircleButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  strokeCircleButtonSelected: {
    borderColor: Colors.primary,
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
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
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
  },
  buttonTextSmall: {
    fontSize: FontSize.md,
  },
});
