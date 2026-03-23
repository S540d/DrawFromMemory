/**
 * useScreenLayout – Responsive Layout Hook
 *
 * Teilt den verfügbaren Bildschirmbereich systematisch auf mehrere
 * Größenklassen auf, damit das Zeichenfenster und die Steuerelemente
 * auf Geräten aller Bildschirmgrößen korrekt dargestellt werden.
 *
 * Größenklassen (basierend auf nutzbarer Bildschirmhöhe nach Safe-Area-Abzug):
 *   xs  – < 500 px  (sehr kleine Geräte / Querformat)
 *   sm  – 500–639 px (kleine Smartphones)
 *   md  – 640–767 px (mittlere Smartphones)
 *   lg  – ≥ 768 px  (große Smartphones, Tablets)
 *
 * Alle abgeleiteten Größen werden proportional zur tatsächlich nutzbaren
 * Höhe berechnet, sodass das Zeichenfenster stets den größten Teil des
 * Bildschirms belegt und gleichzeitig alle Steuerelemente und Texte
 * sichtbar bleiben.
 */

import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ScreenLayout {
  /** Gesamte Bildschirmbreite in px */
  screenWidth: number;
  /** Gesamte Bildschirmhöhe in px */
  screenHeight: number;
  /** Höhe nach Abzug der Safe-Area-Bereiche (Notch, Home-Indikator …) */
  safeHeight: number;
  /** Aktive Größenklasse */
  size: ScreenSize;

  // Hilfs-Booleans für einfache Abfragen
  isXSmall: boolean; // size === 'xs'
  isSmall: boolean;  // size === 'xs' | 'sm'
  isMedium: boolean; // size === 'md'
  isLarge: boolean;  // size === 'lg'

  // ── Header ──────────────────────────────────────────────────────────
  /** Vertikales Innen-Padding des Headers */
  headerPaddingVertical: number;
  /** Horizontales Innen-Padding des Headers */
  headerPaddingHorizontal: number;

  // ── Zeichenfenster (Draw-Phase) ──────────────────────────────────────
  /** Maximale Höhe des Zeichenbereichs */
  canvasMaxHeight: number;
  /** Minimale Höhe des Zeichenbereichs */
  canvasMinHeight: number;
  /** Vertikaler Außenabstand des Zeichenbereichs */
  canvasMarginVertical: number;

  // ── Toolbar-Buttons (Farbe / Werkzeug / Strichstärke) ─────────────
  /** Mindesthöhe eines Toolbar-Buttons */
  toolbarButtonMinHeight: number;
  /** Vertikales Innen-Padding eines Toolbar-Buttons */
  toolbarButtonPaddingVertical: number;
  /** Außenabstand der Toolbar-Zeile */
  toolbarMarginVertical: number;

  // ── Aktions-Buttons (Rückgängig / Löschen / Fertig) ───────────────
  /** Mindesthöhe eines Aktions-Buttons */
  buttonMinHeight: number;
  /** Vertikales Innen-Padding eines Aktions-Buttons */
  buttonPaddingVertical: number;

  // ── Merke-Phase (Bild anzeigen) ────────────────────────────────────
  /** Seitenlänge des Vorschaubildes in der Merke-Phase */
  memorizeImageSize: number;
  /** Mindest-Seitenlänge des Bild-Containers */
  imagePlaceholderMinSize: number;
}

/**
 * Gibt den optimalen Layout-Plan für die aktuelle Bildschirmgröße zurück.
 *
 * Verwendung:
 * ```tsx
 * const layout = useScreenLayout();
 * <View style={{ maxHeight: layout.canvasMaxHeight }} />
 * ```
 */
export function useScreenLayout(): ScreenLayout {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Nutzbare Höhe ohne Systemelemente
  const safeHeight = height - insets.top - insets.bottom;

  // Größenklasse ermitteln
  const size: ScreenSize =
    safeHeight < 500 ? 'xs' :
    safeHeight < 640 ? 'sm' :
    safeHeight < 768 ? 'md' : 'lg';

  const isXSmall = size === 'xs';
  const isSmall  = size === 'xs' || size === 'sm';
  const isMedium = size === 'md';
  const isLarge  = size === 'lg';

  // ── Header ──────────────────────────────────────────────────────────
  const headerPaddingVertical   = isXSmall ? 4  : isSmall ? 8  : 24;
  const headerPaddingHorizontal = isXSmall ? 12 : isSmall ? 16 : 24;

  // ── Toolbar ─────────────────────────────────────────────────────────
  const toolbarButtonMinHeight      = isXSmall ? 36 : isSmall ? 40 : 60;
  const toolbarButtonPaddingVertical = isXSmall ? 4  : isSmall ? 6  : 8;
  const toolbarMarginVertical        = isXSmall ? 2  : isSmall ? 4  : 8;

  // ── Aktions-Buttons ─────────────────────────────────────────────────
  const buttonMinHeight      = isXSmall ? 34 : isSmall ? 38 : 48;
  const buttonPaddingVertical = isXSmall ? 4  : isSmall ? 6  : 16;

  // ── Canvas ───────────────────────────────────────────────────────────
  // Schätzung des Platzes, der von festen Elementen verbraucht wird:
  //   Header + phaseContainer-Padding + Toolbar + Buttons + Gaps
  const headerHeight   = headerPaddingVertical * 2 + 44; // content ~44 px
  const phasepadding   = (isXSmall ? 8 : 16) * 2;
  const toolbarHeight  = toolbarButtonMinHeight + toolbarMarginVertical * 2;
  const buttonHeight   = buttonMinHeight;
  const gapTotal       = isXSmall ? 8 : 16;

  const reservedHeight = headerHeight + phasepadding + toolbarHeight + buttonHeight + gapTotal;
  const remainingHeight = Math.max(safeHeight - reservedHeight, 0);

  // Canvas bekommt 95 % des verbleibenden Platzes, aber immer im Bereich [minH, maxH]
  const rawCanvasHeight = remainingHeight * 0.95;
  const canvasMinHeight  = isXSmall ? 90  : isSmall ? 120 : 160;
  const canvasMaxHeight  = Math.min(Math.max(rawCanvasHeight, canvasMinHeight), isLarge ? 400 : 320);
  const canvasMarginVertical = isXSmall ? 2 : 4;

  // ── Merke-Phase ───────────────────────────────────────────────────
  // Bild bekommt ~40 % der sicheren Höhe, eingegrenzt auf [140 px, 280 px]
  const memorizeImageSize      = Math.min(Math.max(safeHeight * 0.40, 140), 280);
  const imagePlaceholderMinSize = Math.min(Math.max(safeHeight * 0.42, 150), 280);

  return {
    screenWidth: width,
    screenHeight: height,
    safeHeight,
    size,
    isXSmall,
    isSmall,
    isMedium,
    isLarge,
    headerPaddingVertical,
    headerPaddingHorizontal,
    canvasMaxHeight,
    canvasMinHeight,
    canvasMarginVertical,
    toolbarButtonMinHeight,
    toolbarButtonPaddingVertical,
    toolbarMarginVertical,
    buttonMinHeight,
    buttonPaddingVertical,
    memorizeImageSize,
    imagePlaceholderMinSize,
  };
}
