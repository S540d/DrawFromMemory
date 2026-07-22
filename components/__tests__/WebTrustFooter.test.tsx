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
      text: { primary: '#000', secondary: '#666', light: '#999' },
    },
  }),
}));

import WebTrustFooter from '../WebTrustFooter';

const getAllTexts = (getAllByType: (t: any) => any[]) =>
  getAllByType(Text)
    .map((n: any) => n.props.children)
    .flat();

describe('WebTrustFooter', () => {
  it('renders tagline, Play Store link and privacy policy link', () => {
    const { UNSAFE_getAllByType } = render(<WebTrustFooter />);
    const texts = getAllTexts(UNSAFE_getAllByType);

    expect(texts).toContain('footer.tagline');
    expect(texts).toContain('footer.playStore');
    expect(texts).toContain('footer.privacyPolicy');
  });

  it('opens the Play Store URL on press', async () => {
    const openUrlSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true as any);
    const { UNSAFE_getAllByType } = render(<WebTrustFooter />);

    const [playStoreLink] = UNSAFE_getAllByType(TouchableOpacity);
    await act(async () => {
      playStoreLink.props.onPress();
    });

    expect(openUrlSpy).toHaveBeenCalledWith(
      'https://play.google.com/store/apps/details?id=com.s540d.merkeundmale',
    );
    openUrlSpy.mockRestore();
  });

  it('opens the privacy policy URL on press', async () => {
    const openUrlSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true as any);
    const { UNSAFE_getAllByType } = render(<WebTrustFooter />);

    const [, privacyLink] = UNSAFE_getAllByType(TouchableOpacity);
    await act(async () => {
      privacyLink.props.onPress();
    });

    expect(openUrlSpy).toHaveBeenCalledWith(
      'https://s540d.github.io/DrawFromMemory/PRIVACY_POLICY.html',
    );
    openUrlSpy.mockRestore();
  });
});
