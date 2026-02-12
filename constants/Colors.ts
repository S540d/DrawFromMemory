/**
 * Design Tokens - Merke und Male
 * "Soft & Modern" Design-System (Option 1)
 * Warme, sanfte Ästhetik mit subtiler Tiefe und Eleganz
 */

export const Colors = {
  // Primärfarben - Gradient-ready
  primary: '#667eea',      // Lila/Blau - Kreativität & Spielfreude
  primaryLight: '#8599f3', // Hellere Variante
  primaryDark: '#4c63d2',  // Dunklere Variante
  secondary: '#f093fb',    // Rosa - Spielerisch & Warm
  accent: '#A8E6CF',       // Mint - Zusätzlicher Akzent

  // Gradient-Kombinationen (für LinearGradient)
  gradient: {
    primary: ['#667eea', '#764ba2'],     // Lila-Gradient
    secondary: ['#f093fb', '#f5576c'],   // Rosa-Gradient
    warm: ['#FFB84D', '#FF6B6B'],        // Warm-Gradient
  },

  // UI Farben - "Soft & Modern"
  background: '#FAFAFA',   // Cremeweiß (nicht pures Weiß)
  surface: '#F5F5F5',      // Hellgrau - Karten/Container
  surfaceElevated: '#EFEFEF', // Dunklerer Surface für mehr Tiefe
  border: '#DDDDDD',       // Standardrahmen
  modalOverlay: 'rgba(0, 0, 0, 0.5)', // Halbtransparenter Overlay
  text: {
    primary: '#2C3E50',    // Dunkelgrau - Haupttext (WCAG AAA)
    secondary: '#5D6D7E',  // Mittelgrau - Sekundärtext (WCAG AA compliant, darkened from #7F8C8D)
    light: '#717171',      // Grau - Platzhalter (WCAG AA compliant, darkened from #95A5A6)
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
  },

  // Feedback Farben
  success: '#27AE60',      // Grün - Erfolg
  warning: '#F39C12',      // Orange - Warnung
  error: '#E74C3C',        // Rot - Fehler
  info: '#3498DB',         // Blau - Info

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
    filled: '#FFD700',     // Gold - Gefüllter Stern
    empty: '#E0E0E0',      // Hellgrau - Leerer Stern
  },

  // Schwierigkeitsgrade (für Level-Anzeige)
  difficulty: {
    1: '#27AE60',          // Grün - Sehr einfach
    2: '#2ECC71',          // Hellgrün - Einfach
    3: '#F39C12',          // Orange - Mittel
    4: '#E67E22',          // Dunkles Orange - Schwierig
    5: '#E74C3C',          // Rot - Sehr schwierig
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
