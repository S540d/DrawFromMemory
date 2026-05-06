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
    const { UNSAFE_getAllByType } = render(<HomeScreen />);
    const { Text } = require('react-native');
    const renderedTexts = UNSAFE_getAllByType(Text).map((node: any) => node.props.children).flat();

    expect(renderedTexts).toContain('Remember & Draw');
    expect(renderedTexts).not.toContain('Merke & Male');
  });
});
