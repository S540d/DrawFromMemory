/**
 * Design Tokens - Merke und Male
 * Helles, freundliches Farbschema für Kinder
 */

export const Colors = {
  // Primärfarben
  primary: '#60D5FA',      // Helles Cyan - Hauptfarbe
  secondary: '#FFB84D',    // Helles Orange - Akzentfarbe
  accent: '#A8E6CF',       // Mint - Zusätzlicher Akzent

  // UI Farben
  background: '#FFFFFF',   // Weiß - Hintergrund
  surface: '#F5F5F5',      // Hellgrau - Karten/Container
  text: {
    primary: '#2C3E50',    // Dunkelgrau - Haupttext
    secondary: '#7F8C8D',  // Mittelgrau - Sekundärtext
    light: '#95A5A6',      // Hellgrau - Platzhalter
  },

  // Feedback Farben
  success: '#27AE60',      // Grün - Erfolg
  warning: '#F39C12',      // Orange - Warnung
  error: '#E74C3C',        // Rot - Fehler
  info: '#3498DB',         // Blau - Info

  // Zeichen-Farben (für Canvas)
  drawing: {
    red: '#E74C3C',
    green: '#27AE60',
    brown: '#8B4513',
    skin: '#FDBCB4',
    blue: '#3498DB',
    white: '#FFFFFF',
    pink: '#FF69B4',
    purple: '#9B59B6',
    black: '#000000',
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
 */
export const DrawingColors = [
  { name: 'Rot', hex: Colors.drawing.red, nameEn: 'Red' },
  { name: 'Grün', hex: Colors.drawing.green, nameEn: 'Green' },
  { name: 'Braun', hex: Colors.drawing.brown, nameEn: 'Brown' },
  { name: 'Hautfarbe', hex: Colors.drawing.skin, nameEn: 'Skin' },
  { name: 'Blau', hex: Colors.drawing.blue, nameEn: 'Blue' },
  { name: 'Weiß', hex: Colors.drawing.white, nameEn: 'White', border: '#CCCCCC' },
  { name: 'Rosa', hex: Colors.drawing.pink, nameEn: 'Pink' },
  { name: 'Lila', hex: Colors.drawing.purple, nameEn: 'Purple' },
  { name: 'Schwarz', hex: Colors.drawing.black, nameEn: 'Black' },
];

export default Colors;
