/**
 * Rating Manager - Merke und Male
 * Verwaltet Bewertungen und Feedback-Nachrichten
 */

import { RatingFeedback, StarRating } from '../types';

/**
 * Motivierende Aussagen für 1-2 Sterne (werden rotiert)
 */
const lowRatingMessages = {
  de: [
    'Das war schon besser als vorhin, willst du es trotzdem nochmal versuchen?',
    'Übung macht den Meister! Versuch es nochmal?',
    'Fast geschafft! Beim nächsten Mal klappt es bestimmt!',
    'Nicht aufgeben! Du kannst das schaffen!',
  ],
  en: [
    'That was better than before, do you want to try again?',
    'Practice makes perfect! Try again?',
    'Almost there! You\'ll get it next time for sure!',
    'Don\'t give up! You can do it!',
  ],
};

let lowRatingMessageIndex = 0;

/**
 * Gibt eine zufällige motivierende Nachricht für niedrige Bewertungen zurück
 */
function getRotatingLowRatingMessage(language: 'de' | 'en' = 'de'): string {
  const messages = lowRatingMessages[language];
  const message = messages[lowRatingMessageIndex % messages.length];
  lowRatingMessageIndex++;
  return message;
}

/**
 * Gibt Feedback für eine Bewertung zurück
 */
export function getRatingFeedback(stars: StarRating, language: 'de' | 'en' = 'de'): RatingFeedback {
  switch (stars) {
    case 1:
    case 2:
      return {
        stars,
        message: getRotatingLowRatingMessage('de'),
        messageEn: getRotatingLowRatingMessage('en'),
        animation: 'none',
        sound: 'huchhu.mp3',
      };

    case 3:
      return {
        stars,
        message: 'Gut gemacht! Beim nächsten Mal wird es noch besser!',
        messageEn: 'Well done! Next time it will be even better!',
        animation: 'none',
        sound: null,
      };

    case 4:
      return {
        stars,
        message: 'Super! Das hast du toll gezeichnet!',
        messageEn: 'Super! You drew that really well!',
        animation: 'none',
        sound: null,
      };

    case 5:
      return {
        stars,
        message: 'Perfekt! Du bist ein Gedächtnis-Meister!',
        messageEn: 'Perfect! You are a memory master!',
        animation: 'jumping-person',
        sound: 'success.mp3',
      };
  }
}

/**
 * Berechnet die Sterne-Bewertung basierend auf einem Ähnlichkeits-Score (0-100)
 */
export function calculateStarsFromSimilarity(similarityScore: number): StarRating {
  if (similarityScore >= 90) return 5;
  if (similarityScore >= 75) return 4;
  if (similarityScore >= 60) return 3;
  if (similarityScore >= 40) return 2;
  return 1;
}

/**
 * Gibt die passende Stern-Farbe für die UI zurück
 */
export function getStarColor(stars: StarRating): string {
  // Verwendet Colors.difficulty aus constants/Colors.ts
  const colorMap: Record<StarRating, string> = {
    1: '#E74C3C', // Rot
    2: '#E67E22', // Dunkles Orange
    3: '#F39C12', // Orange
    4: '#2ECC71', // Hellgrün
    5: '#27AE60', // Grün
  };
  return colorMap[stars];
}
