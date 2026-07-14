import React from 'react';
import { render, act } from '@testing-library/react-native';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useFocusEffect: (cb: () => (() => void) | void) => {
    const { useEffect } = require('react');
    useEffect(() => {
      const cleanup = cb();
      return typeof cleanup === 'function' ? cleanup : undefined;
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
  },
}));

jest.mock('../../services/DailyChallengeManager', () => ({
  getDailyChallengeLevel: () => 3,
  getSecondsUntilMidnight: () => 3600,
  isTodayCompleted: () => Promise.resolve(false),
}));

jest.mock('../../services/StreakManager', () => ({
  getStreakData: () =>
    Promise.resolve({ currentStreak: 0, longestStreak: 0, lastPlayedDate: null }),
}));

jest.mock('../../components/QuickStatsCards', () => {
  const { View } = require('react-native');
  return function QuickStatsCards() {
    return <View />;
  };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children, style }: any) => <View style={style}>{children}</View>,
  };
});

jest.mock('../../components/SettingsModal', () => {
  const { View } = require('react-native');
  return function SettingsModal() {
    return <View />;
  };
});

jest.mock('../../components/WebTrustFooter', () => {
  const { View } = require('react-native');
  return function WebTrustFooter() {
    return <View />;
  };
});

jest.mock('../../components/FloatingStars', () => {
  const { View } = require('react-native');
  return { FloatingStars: () => <View testID="floating-stars" /> };
});

jest.mock('../../components/AnimatedHero', () => {
  const { View } = require('react-native');
  return { AnimatedHero: () => <View testID="animated-hero" /> };
});

jest.mock('../../components/OnboardingModal', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: () => <View testID="onboarding-modal" /> };
});

jest.mock('../../services/OnboardingManager', () => ({
  isOnboardingDone: jest.fn(async () => true),
  markOnboardingDone: jest.fn(async () => {}),
}));

jest.mock('../../services/AgeGroupManager', () => ({
  isAgeGroupSelected: jest.fn(async () => true),
  setAgeGroup: jest.fn(async () => {}),
}));

jest.mock('../../services/MascotManager', () => ({
  getMascotProgress: jest.fn(async () => ({
    totalStars: 0,
    currentStreak: 0,
    unlocked: [],
    nextUnlock: null,
  })),
  getHomeGreetingKey: () => 'mascot.greeting.default',
}));

jest.mock('../../components/Mascot', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: () => <View testID="mascot" /> };
});

jest.mock('../../components/AgeGroupModal', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: () => <View testID="age-group-modal" /> };
});

jest.mock('../../services/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      background: '#fff',
      surface: '#f0f0f0',
      primary: '#6200ee',
      text: { primary: '#000', secondary: '#666', light: '#999' },
    },
  }),
}));

jest.mock('../../services/i18n', () => ({
  t: (key: string) => key,
  useTranslation: () => ({ t: (key: string) => key }),
}));

import HomeScreen from '../../app/index';

const getAllTexts = (getAllByType: (type: any) => any[]) => {
  const { Text } = require('react-native');
  return getAllByType(Text)
    .map((n: any) => n.props.children)
    .flat();
};

describe('HomeScreen', () => {
  it('renders the app name via translation key, not hardcoded', async () => {
    const { UNSAFE_getAllByType } = render(<HomeScreen />);
    await act(async () => {});
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('app.name');
    expect(texts).not.toContain('Merke & Male');
  });
});
