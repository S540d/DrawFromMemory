import React from 'react';
import { render, act } from '@testing-library/react-native';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useFocusEffect: (cb: () => void) => { cb(); },
}));

jest.mock('../../services/DailyChallengeManager', () => ({
  getDailyChallengeLevel: () => 3,
  getSecondsUntilMidnight: () => 3600,
  isTodayCompleted: () => Promise.resolve(false),
}));

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
  return function SettingsModal() { return <View />; };
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
  return getAllByType(Text).map((n: any) => n.props.children).flat();
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
