import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';

// All mocks must be declared before imports that use them
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn() }),
}));

jest.mock('../../services/i18n', () => ({
  t: (key: string) => key,
}));

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

jest.mock('../../components/DrawingCanvas', () => {
  const { View } = require('react-native');
  return () => <View testID="drawing-canvas" />;
});

jest.mock('../../services/StorageManager', () => ({
  __esModule: true,
  default: {
    getGallery: jest.fn().mockResolvedValue([]),
    deleteFromGallery: jest.fn().mockResolvedValue(undefined),
  },
}));

import GalleryScreen from '../../app/gallery';
import type { GalleryEntry } from '../../services/StorageManager';

const mockStorage = require('../../services/StorageManager').default as {
  getGallery: jest.Mock;
  deleteFromGallery: jest.Mock;
};

const mockGallery: GalleryEntry[] = [
  {
    id: 'test1',
    levelNumber: 3,
    imageFilename: 'cat.svg',
    imageName: 'Katze',
    paths: [{ points: [{ x: 0, y: 0 }], color: '#000', strokeWidth: 2 }],
    rating: 4,
    savedAt: '2026-02-15T10:00:00.000Z',
  },
  {
    id: 'test2',
    levelNumber: 1,
    imageFilename: 'house.svg',
    imageName: 'Haus',
    paths: [],
    rating: 2,
    savedAt: '2026-02-10T08:00:00.000Z',
  },
];

const getAllTexts = (getAllByType: (type: any) => any[]) => {
  const { Text } = require('react-native');
  return getAllByType(Text).map((n: any) => n.props.children).flat();
};

describe('GalleryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.getGallery.mockResolvedValue([]);
    mockStorage.deleteFromGallery.mockResolvedValue(undefined);
  });

  it('should render header title', async () => {
    const { UNSAFE_getAllByType } = render(<GalleryScreen />);
    await act(async () => {});
    expect(getAllTexts(UNSAFE_getAllByType)).toContain('gallery.title');
  });

  it('should show empty state when no entries', async () => {
    mockStorage.getGallery.mockResolvedValue([]);
    const { UNSAFE_getAllByType } = render(<GalleryScreen />);
    await act(async () => {});
    expect(getAllTexts(UNSAFE_getAllByType)).toContain('gallery.empty');
  });

  it('should render gallery entry names after loading', async () => {
    mockStorage.getGallery.mockResolvedValue(mockGallery);
    const { UNSAFE_getAllByType } = render(<GalleryScreen />);
    await act(async () => {});
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('Katze');
    expect(texts).toContain('Haus');
  });

  it('should show level and star info for entries', async () => {
    mockStorage.getGallery.mockResolvedValue(mockGallery);
    const { UNSAFE_getAllByType } = render(<GalleryScreen />);
    await act(async () => {});
    const texts = getAllTexts(UNSAFE_getAllByType).join('');
    expect(texts).toContain('Level 3');
    expect(texts).toContain('★★★★');
    expect(texts).toContain('Level 1');
    expect(texts).toContain('★★');
  });

  it('should call getGallery on mount', async () => {
    render(<GalleryScreen />);
    await act(async () => {});
    expect(mockStorage.getGallery).toHaveBeenCalledTimes(1);
  });

  it('should call deleteFromGallery when confirm returns true on web', async () => {
    mockStorage.getGallery.mockResolvedValue([mockGallery[0]]);
    const Platform = require('react-native').Platform;
    Platform.OS = 'web';
    window.confirm = jest.fn(() => true); // platform-safe

    const { UNSAFE_getAllByProps } = render(<GalleryScreen />);
    await act(async () => {});

    const deleteButtons = UNSAFE_getAllByProps({ accessibilityLabel: 'gallery.delete' });
    fireEvent.press(deleteButtons[0]);
    await act(async () => {});

    expect(mockStorage.deleteFromGallery).toHaveBeenCalledWith('test1');
  });

  it('should not delete when confirm returns false on web', async () => {
    mockStorage.getGallery.mockResolvedValue([mockGallery[0]]);
    const Platform = require('react-native').Platform;
    Platform.OS = 'web';
    window.confirm = jest.fn(() => false); // platform-safe

    const { UNSAFE_getAllByProps } = render(<GalleryScreen />);
    await act(async () => {});

    const deleteButtons = UNSAFE_getAllByProps({ accessibilityLabel: 'gallery.delete' });
    fireEvent.press(deleteButtons[0]);

    expect(mockStorage.deleteFromGallery).not.toHaveBeenCalled();
  });

  it('should format date using toLocaleDateString', async () => {
    mockStorage.getGallery.mockResolvedValue([mockGallery[0]]);
    const { UNSAFE_getAllByType } = render(<GalleryScreen />);
    await act(async () => {});
    const formattedDate = new Date('2026-02-15T10:00:00.000Z').toLocaleDateString();
    expect(getAllTexts(UNSAFE_getAllByType)).toContain(formattedDate);
  });
});
