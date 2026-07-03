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

function getRotatingLowRatingMessage(language: 'de' | 'en' = 'de'): string {
  const messages = lowRatingMessages[language];
  const message = messages[lowRatingMessageIndex % messages.length];
  lowRatingMessageIndex++;
  return message;
}

/**
 * Kindgerechte Jubel-Kommentare für 4-5 Sterne (rotierend)
 * DE und EN werden immer als Paar mit demselben Index abgerufen.
 */
const highRatingMessages = {
  4: {
    de: [
      'Super gemacht! Du hast ein tolles Gedächtnis!',
      'Wow, fast perfekt! Du wirst immer besser!',
      'Klasse! Deine Zeichnung sieht wirklich toll aus!',
      'Fast perfekt — du bist ein echtes Zeichentalent!',
      'Wahnsinn, wie gut du dir das gemerkt hast!',
    ],
    en: [
      'Great job! You have an amazing memory!',
      'Wow, almost perfect! You\'re getting better and better!',
      'Awesome! Your drawing looks really great!',
      'Nearly perfect — you\'re a true drawing talent!',
      'Incredible how well you remembered that!',
    ],
  },
  5: {
    de: [
      'Perfekt! Du bist ein echter Gedächtnis-Meister!',
      'Unglaublich! Du hast alles richtig gemerkt!',
      'Wow, das ist der Hammer! 5 Sterne voll verdient!',
      'Spitzenklasse — du bist einfach unschlagbar!',
      'Fantastisch! Dein Gedächtnis ist super stark!',
    ],
    en: [
      'Perfect! You are a true memory master!',
      'Incredible! You remembered everything correctly!',
      'Wow, that\'s amazing! 5 stars well earned!',
      'Outstanding — you\'re simply unbeatable!',
      'Fantastic! Your memory is super strong!',
    ],
  },
};

let highRating4Index = 0;
let highRating5Index = 0;

function getRotatingHighRatingMessages(stars: 4 | 5): { de: string; en: string } {
  if (stars === 5) {
    const idx = highRating5Index % highRatingMessages[5].de.length;
    highRating5Index++;
    return { de: highRatingMessages[5].de[idx], en: highRatingMessages[5].en[idx] };
  }
  const idx = highRating4Index % highRatingMessages[4].de.length;
  highRating4Index++;
  return { de: highRatingMessages[4].de[idx], en: highRatingMessages[4].en[idx] };
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

    case 4: {
      const msgs4 = getRotatingHighRatingMessages(4);
      return {
        stars,
        message: msgs4.de,
        messageEn: msgs4.en,
        animation: 'none',
        sound: null,
      };
    }

    case 5: {
      const msgs5 = getRotatingHighRatingMessages(5);
      return {
        stars,
        message: msgs5.de,
        messageEn: msgs5.en,
        animation: 'jumping-person',
        sound: 'success.mp3',
      };
    }
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
