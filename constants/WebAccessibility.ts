/**
 * Web Accessibility Styles
 * Focus rings, keyboard navigation, and web-specific accessibility features
 * Following WCAG 2.1 AA guidelines
 */

import { Platform } from 'react-native';
import Colors from './Colors';

/**
 * Focus Ring Styles for Web Keyboard Navigation
 * WCAG requires 2px minimum, 2px offset for contrast
 */
export const focusRing = Platform.select({
  web: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: Colors.primary,
    outlineOffset: 2,
  },
  default: {},
});

/**
 * Minimum Touch Target Size (Apple HIG & WCAG)
 * 44x44px for clickable elements
 */
export const minTouchTarget = {
  minHeight: 44,
  minWidth: 44,
};

/**
 * Web-Specific Focus Visible Styles
 * Apply to interactive elements for keyboard navigation
 */
export const webFocusVisible = Platform.select({
  web: {
    ':focus-visible': {
      outlineWidth: 2,
      outlineStyle: 'solid',
      outlineColor: Colors.primary,
      outlineOffset: 2,
    },
  },
  default: {},
});

/**
 * Global CSS for Web Accessibility
 * Insert this into HTML <head> for web builds
 */
export const webAccessibilityCSS = `
/* WCAG 2.1 AA Focus Rings */
*:focus-visible {
  outline: 2px solid ${Colors.primary};
  outline-offset: 2px;
}

/* Remove default focus outline (we add our own) */
*:focus:not(:focus-visible) {
  outline: none;
}

/* Button Focus States */
button:focus-visible,
a:focus-visible,
[role="button"]:focus-visible,
[role="link"]:focus-visible {
  outline: 2px solid ${Colors.primary};
  outline-offset: 2px;
}

/* Ensure minimum touch targets */
button,
a,
[role="button"],
[role="link"] {
  min-height: 44px;
  min-width: 44px;
}

/* Keyboard Navigation Highlight */
:focus-visible {
  animation: focus-pulse 0.3s ease-in-out;
}

@keyframes focus-pulse {
  0% {
    outline-color: transparent;
  }
  100% {
    outline-color: ${Colors.primary};
  }
}
`;

export default {
  focusRing,
  minTouchTarget,
  webFocusVisible,
  webAccessibilityCSS,
};
