import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, ActivityIndicator } from 'react-native';

jest.mock('react-native-reanimated', () => {
  const { View, Text: RNText } = require('react-native');
  return {
    __esModule: true,
    default: {
      View,
      Text: RNText,
      createAnimatedComponent: (c: any) => c,
      call: () => {},
    },
    useSharedValue: (v: any) => ({ value: v }),
    useAnimatedStyle: (_fn: any) => ({}),
    withSpring: (v: any) => v,
    withTiming: (v: any) => v,
    withDelay: (_d: any, v: any) => v,
    withSequence: (...args: any[]) => args[args.length - 1],
    Easing: { out: () => () => {}, ease: {} },
    runOnJS: (fn: any) => fn,
  };
});

import { Badge, CountBadge } from '../Badge';
import { Chip, ChipGroup } from '../Chip';
import { Button } from '../Button';

/** Hilfsfunktion: alle Text-Inhalte als flaches Array */
const getAllTexts = (getAllByType: (t: any) => any[]) =>
  getAllByType(Text).map((n: any) => n.props.children).flat().map(String);

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
describe('Badge', () => {
  it('renders label text', () => {
    const { UNSAFE_getAllByType } = render(<Badge label="Einfach" />);
    expect(getAllTexts(UNSAFE_getAllByType)).toContain('Einfach');
  });

  it('renders difficulty variant', () => {
    const { UNSAFE_getAllByType } = render(
      <Badge label="Sehr einfach" variant="difficulty" difficulty={1} />
    );
    expect(getAllTexts(UNSAFE_getAllByType)).toContain('Sehr einfach');
  });

  it('renders sm size', () => {
    const { UNSAFE_getAllByType } = render(<Badge label="Tag" size="sm" />);
    expect(getAllTexts(UNSAFE_getAllByType)).toContain('Tag');
  });

  it('renders all variants without crashing', () => {
    const variants = ['primary', 'success', 'warning', 'error', 'info'] as const;
    for (const variant of variants) {
      expect(() => render(<Badge label={variant} variant={variant} />)).not.toThrow();
    }
  });
});

describe('CountBadge', () => {
  it('renders count', () => {
    const { UNSAFE_getAllByType } = render(<CountBadge count={5} />);
    expect(getAllTexts(UNSAFE_getAllByType)).toContain('5');
  });

  it('caps display at 99+', () => {
    const { UNSAFE_getAllByType } = render(<CountBadge count={150} />);
    expect(getAllTexts(UNSAFE_getAllByType)).toContain('99+');
  });
});

// ---------------------------------------------------------------------------
// Chip
// ---------------------------------------------------------------------------
describe('Chip', () => {
  it('renders label', () => {
    const { UNSAFE_getAllByType } = render(<Chip label="Alle" />);
    expect(getAllTexts(UNSAFE_getAllByType)).toContain('Alle');
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { UNSAFE_getAllByType } = render(<Chip label="Filter" onPress={onPress} />);
    const texts = UNSAFE_getAllByType(Text);
    fireEvent.press(texts[0]);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('sets disabled prop on Pressable when disabled', () => {
    const { UNSAFE_getAllByType } = render(<Chip label="Gesperrt" disabled />);
    const { Pressable } = require('react-native');
    const pressable = UNSAFE_getAllByType(Pressable)[0];
    expect(pressable.props.disabled).toBe(true);
  });

  it('renders filled variant selected', () => {
    const { UNSAFE_getAllByType } = render(<Chip label="Aktiv" variant="filled" selected />);
    expect(getAllTexts(UNSAFE_getAllByType)).toContain('Aktiv');
  });
});

describe('ChipGroup', () => {
  it('renders all options', () => {
    const { UNSAFE_getAllByType } = render(
      <ChipGroup options={['Alle', 'Einfach', 'Schwer']} selected="Alle" onSelect={jest.fn()} />
    );
    const texts = getAllTexts(UNSAFE_getAllByType);
    expect(texts).toContain('Alle');
    expect(texts).toContain('Einfach');
    expect(texts).toContain('Schwer');
  });

  it('calls onSelect with the tapped option', () => {
    const onSelect = jest.fn();
    const { UNSAFE_getAllByType } = render(
      <ChipGroup options={['Alle', 'Einfach']} selected="Alle" onSelect={onSelect} />
    );
    // Second text element corresponds to 'Einfach'
    const textNodes = UNSAFE_getAllByType(Text);
    fireEvent.press(textNodes[1]);
    expect(onSelect).toHaveBeenCalledWith('Einfach');
  });
});

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------
describe('Button', () => {
  it('renders label', () => {
    const { UNSAFE_getAllByType } = render(<Button label="Spielen" />);
    expect(getAllTexts(UNSAFE_getAllByType)).toContain('Spielen');
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { UNSAFE_getAllByType } = render(<Button label="Start" onPress={onPress} />);
    fireEvent.press(UNSAFE_getAllByType(Text)[0]);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('sets disabled prop on Pressable when disabled', () => {
    const { UNSAFE_getAllByType } = render(<Button label="Gesperrt" disabled />);
    const { Pressable } = require('react-native');
    const pressable = UNSAFE_getAllByType(Pressable)[0];
    expect(pressable.props.disabled).toBe(true);
  });

  it('hides label and shows spinner when loading', () => {
    const { queryByText, UNSAFE_getAllByType } = render(<Button label="Laden" loading />);
    expect(queryByText('Laden')).toBeNull();
    expect(UNSAFE_getAllByType(ActivityIndicator).length).toBe(1);
  });

  it('renders all variants without crashing', () => {
    const variants = ['primary', 'secondary', 'ghost', 'danger'] as const;
    for (const variant of variants) {
      expect(() => render(<Button label={variant} variant={variant} />)).not.toThrow();
    }
  });

  it('renders all sizes without crashing', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
      expect(() => render(<Button label="Test" size={size} />)).not.toThrow();
    }
  });

  it('renders fullWidth', () => {
    const { UNSAFE_getAllByType } = render(<Button label="Voll" fullWidth />);
    expect(getAllTexts(UNSAFE_getAllByType)).toContain('Voll');
  });
});
