import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
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
  return function SettingsModal() { return null; };
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

describe('HomeScreen', () => {
  it('renders the app name via translation key, not hardcoded', () => {
    const { getByText, queryByText } = render(<HomeScreen />);
    expect(getByText('app.name')).toBeTruthy();
    expect(queryByText('Merke & Male')).toBeNull();
  });
});
