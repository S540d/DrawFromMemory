import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Linking, Text, TouchableOpacity } from 'react-native';

jest.mock('../../services/i18n', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../services/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      primary: '#6200ee',
      surface: '#fff',
      text: { primary: '#000', secondary: '#666', light: '#999' },
    },
  }),
}));

import WebInstallBanner from '../WebInstallBanner';

describe('WebInstallBanner', () => {
  it('zeigt Titel und Untertitel', () => {
    const { UNSAFE_getAllByType } = render(<WebInstallBanner />);
    const texts = UNSAFE_getAllByType(Text)
      .map((n: any) => n.props.children)
      .flat();

    expect(texts).toContain('webInstall.title');
    expect(texts).toContain('webInstall.subtitle');
  });

  it('öffnet den Play Store mit Banner-Attribution', async () => {
    const openUrlSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true as any);
    const { UNSAFE_getAllByType } = render(<WebInstallBanner />);

    const [banner] = UNSAFE_getAllByType(TouchableOpacity);
    await act(async () => {
      banner.props.onPress();
    });

    expect(openUrlSpy).toHaveBeenCalledWith(
      'https://play.google.com/store/apps/details?id=com.s540d.merkeundmale' +
        '&referrer=utm_source%3Dgithub-pages%26utm_medium%3Dweb_banner%26utm_campaign%3Dweb_demo',
    );
    openUrlSpy.mockRestore();
  });

  it('ist als Link ausgezeichnet', () => {
    const { UNSAFE_getAllByType } = render(<WebInstallBanner />);
    const [banner] = UNSAFE_getAllByType(TouchableOpacity);

    expect(banner.props.accessibilityRole).toBe('link');
  });
});
