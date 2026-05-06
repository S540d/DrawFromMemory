import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children, style }: any) => <View style={style}>{children}</View>,
  };
});

jest.mock('../../components/SettingsModal', () => {
  const React = require('react');
  return function SettingsModal() {
    return null;
  };
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
  useTranslation: () => ({
    t: (key: string) => {
      if (key === 'app.name') return 'Remember & Draw';
      return key;
    },
  }),
}));

import HomeScreen from '../../app/index';

describe('HomeScreen', () => {
  it('renders the localized app name in the header', () => {
    const { toJSON } = render(<HomeScreen />);
    const renderedTree = JSON.stringify(toJSON());

    expect(renderedTree).toContain('Remember & Draw');
    expect(renderedTree).not.toContain('Merke & Male');
  });
});
