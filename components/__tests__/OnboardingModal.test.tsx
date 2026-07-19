import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Pressable } from 'react-native';

// Der echte react-native Modal lässt sich unter react-test-renderer/jsdom nicht
// sichtbar mounten (parentInstance.children.indexOf). Alle anderen Exports bleiben
// unverändert; nur Modal wird zu einem Passthrough, damit der Inhalt gerendert wird.
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  const ReactLocal = require('react');
  return new Proxy(RN, {
    get(target, prop) {
      if (prop === 'Modal') {
        return ({ children, visible = true }: any) =>
          visible ? ReactLocal.createElement(target.View, null, children) : null;
      }
      return target[prop as keyof typeof target];
    },
  });
});

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (c: any) => c,
    },
    cancelAnimation: jest.fn(),
    useSharedValue: (v: any) => ({ value: v }),
    useAnimatedStyle: (_fn: any) => ({}),
    withTiming: (v: any) => v,
    withRepeat: jest.fn((v: any) => v),
    withSequence: (...args: any[]) => args[args.length - 1],
    Easing: { ease: (t: number) => t, inOut: (fn: any) => fn, out: (fn: any) => fn },
  };
});

jest.mock('../../utils/useReduceMotion', () => ({
  useReduceMotion: jest.fn(() => true),
}));

jest.mock('../../services/OnboardingManager', () => ({
  markOnboardingDone: jest.fn(async () => {}),
}));
const { markOnboardingDone } = require('../../services/OnboardingManager') as {
  markOnboardingDone: jest.Mock;
};

jest.mock('../../services/i18n', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../services/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      background: '#fff',
      surface: '#eee',
      surfaceAlt: '#ddd',
      text: { primary: '#000', secondary: '#666', light: '#999' },
    },
  }),
}));

import OnboardingModal from '../OnboardingModal';

describe('OnboardingModal', () => {
  beforeEach(() => {
    markOnboardingDone.mockClear();
  });

  // Reihenfolge der Pressables im JSX: [0] = Skip, [1] = Start.
  const renderModal = () => {
    const onClose = jest.fn();
    const onStartTutorial = jest.fn();
    const utils = render(
      <OnboardingModal visible onClose={onClose} onStartTutorial={onStartTutorial} />,
    );
    return { onClose, onStartTutorial, ...utils };
  };

  it('marks onboarding done and starts the tutorial when "Spielen!" is tapped', async () => {
    const { onStartTutorial, UNSAFE_getAllByType } = renderModal();
    fireEvent.press(UNSAFE_getAllByType(Pressable)[1]);
    // handleStart ist async: markOnboardingDone läuft vor onStartTutorial
    await Promise.resolve();
    expect(markOnboardingDone).toHaveBeenCalledTimes(1);
    expect(onStartTutorial).toHaveBeenCalledTimes(1);
  });

  it('marks onboarding done and closes when skipped', async () => {
    const { onClose, UNSAFE_getAllByType } = renderModal();
    fireEvent.press(UNSAFE_getAllByType(Pressable)[0]);
    await Promise.resolve();
    expect(markOnboardingDone).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
