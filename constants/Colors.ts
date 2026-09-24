/**
 * Design Tokens - Merke und Male
 * "Warm Paper" Design-System
 * Warme, papiertexturartige Ästhetik mit klarem Layout
 */

export const Colors = {
  // Primärfarben - Gradient-ready
  // Blau-Familie passend zur App-Icon-/Store-Markenfarbe #60D5FA (Issue #306).
  // #60D5FA selbst ist zu hell für Text/Buttons (Kontrast <2:1 gegen Weiß) —
  // primary/primaryDark sind daher dieselbe Farbfamilie in einem Ton, der
  // WCAG-Kontrast für weißen Button-Text einhält (~4:1, analog zum bisherigen
  // Violett-Wert); primaryLight bleibt die reine Icon-Farbe für dekorative
  // Flächen ohne Text (Kreise, Icon-Referenz, Splash-Hintergrund).
  primary: '#0585AD',
  primaryLight: '#60D5FA',
  primaryDark: '#045B77',
  secondary: '#F093FB', // Rosa - Spielerisch & Warm
  accent: '#4ECDC4', // Mint-Teal - frischer Akzent
  accentWarm: '#FFB547', // Apricot - spielerisch warm

  // Gradient-Kombinationen (für LinearGradient)
  gradient: {
    primary: ['#0585AD', '#045B77'] as const,
    secondary: ['#F093FB', '#f5576c'] as const,
    warm: ['#FFB547', '#FF6B6B'] as const,
    cta: ['#0585AD', '#045B77'] as const,
    teal: ['#4ECDC4', '#44CF6C'] as const,
  },

  // UI Farben - "Warm Paper"
  background: '#f7f2eb', // Warmes Cremeweiß - Papierton
  surface: '#ffffff', // Rein weiß - Cards/Container
  surfaceElevated: '#fdfaf5', // Leicht warmes Weiß für erhöhte Elemente
  surfaceAlt: '#ede7dd', // Warmes Graubeige - Toolbar-Gruppen, Tab-Switcher
  border: '#e8e0d5', // Warmes Graubeige - Rahmen
  modalOverlay: 'rgba(0, 0, 0, 0.5)', // Halbtransparenter Overlay
  text: {
    primary: '#2c2c2c', // Fast Schwarz - Haupttext (WCAG AAA)
    secondary: '#9c8b7a', // Warmes Graubraun - Sekundärtext
    light: '#717171', // Grau - Platzhalter (WCAG AA compliant)
  },

  // Shadow-System (Soft & Modern)
  shadow: {
    small: {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      elevation: 2,
    },
    medium: {
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
      elevation: 4,
    },
    large: {
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
      elevation: 8,
    },
    buttonPrimary: {
      boxShadow: '0 4px 20px rgba(5, 133, 173, 0.40)',
      elevation: 6,
    },
  },

  // Glassmorphism-Tokens (für GlassCard in Levels/Gallery)
  glass: {
    lightSurface: 'rgba(255, 255, 255, 0.88)',
    darkSurface: 'rgba(42, 35, 64, 0.88)',
    lightBorder: 'rgba(255, 255, 255, 0.70)',
    darkBorder: 'rgba(255, 255, 255, 0.10)',
    lightShadow: {
      boxShadow: '0 6px 24px rgba(96, 213, 250, 0.20)',
      elevation: 5,
    },
    darkShadow: {
      boxShadow: '0 6px 24px rgba(0, 0, 0, 0.45)',
      elevation: 6,
    },
  },

  // Feedback Farben
  success: '#27AE60', // Grün - Erfolg
  warning: '#F39C12', // Orange - Warnung
  error: '#E74C3C', // Rot - Fehler
  info: '#3498DB', // Blau - Info

  // Zeichen-Farben (für Canvas)
  drawing: {
    black: '#000000',
    white: '#FFFFFF',
    red: '#E74C3C',
    orange: '#FFA500',
    yellow: '#FFD700',
    green: '#27AE60',
    blue: '#3498DB',
    lightBlue: '#87CEEB',
    purple: '#9B59B6',
    pink: '#FF69B4',
    brown: '#8B4513',
    gray: '#808080',
    skin: '#FDBCB4',
  },

  // Sternen-Bewertung
  stars: {
    filled: '#FFD700', // Gold - Gefüllter Stern
    empty: '#E0E0E0', // Hellgrau - Leerer Stern
  },

  // Schwierigkeitsgrade (für Level-Anzeige)
  difficulty: {
    1: '#27AE60', // Grün - Sehr einfach
    2: '#2ECC71', // Hellgrün - Einfach
    3: '#F39C12', // Orange - Mittel
    4: '#E67E22', // Dunkles Orange - Schwierig
    5: '#E74C3C', // Rot - Sehr schwierig
  },

  // Timer-Zustandsfarben (TimerArc.native.tsx / TimerArc.web.tsx) — referenzieren
  // bewusst dieselben Hex-Werte wie gradient.warm[1] / stars.filled, damit eine
  // künftige Palettenänderung nur an einer Stelle nachgezogen werden muss (Issue #334).
  timerArc: {
    critical: '#FF6B6B',
    warning: '#FFD700',
    normal: '#FFFFFF',
  },

  // UI-Akzentfarben außerhalb des Zeichnungskontexts (Home-Screen), zentralisiert
  // statt als Hex-Literal an der Verwendungsstelle (Issue #334).
  accents: {
    dailyChallengeBorder: '#F59E0B',
    dailyChallengeText: '#D97706',
    streakBadge: '#FF6B35',
  },
};

/**
 * Zeichen-Farben mit Namen (für UI)
 * WICHTIG: Genau 12 Farben für 3x4 Grid Layout
 * Diese Farben sind fest und sollten in allen Level-Bildern verwendet werden
 */
export const DrawingColors = [
  // Reihe 1: Basics
  { name: 'Schwarz', hex: Colors.drawing.black, nameEn: 'Black' },
  { name: 'Weiß', hex: Colors.drawing.white, nameEn: 'White', border: '#CCCCCC' },
  { name: 'Grau', hex: Colors.drawing.gray, nameEn: 'Gray' },

  // Reihe 2: Warme Farben
  { name: 'Rot', hex: Colors.drawing.red, nameEn: 'Red' },
  { name: 'Orange', hex: Colors.drawing.orange, nameEn: 'Orange' },
  { name: 'Gelb', hex: Colors.drawing.yellow, nameEn: 'Yellow' },

  // Reihe 3: Kalte Farben
  { name: 'Grün', hex: Colors.drawing.green, nameEn: 'Green' },
  { name: 'Blau', hex: Colors.drawing.blue, nameEn: 'Blue' },
  { name: 'Lila', hex: Colors.drawing.purple, nameEn: 'Purple' },

  // Reihe 4: Spezialfarben
  { name: 'Rosa', hex: Colors.drawing.pink, nameEn: 'Pink' },
  { name: 'Braun', hex: Colors.drawing.brown, nameEn: 'Brown' },
  { name: 'Hautfarbe', hex: Colors.drawing.skin, nameEn: 'Skin' },
];

export default Colors;
