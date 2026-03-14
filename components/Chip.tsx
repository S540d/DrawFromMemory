import React from 'react';
import { Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/Layout';

type ChipVariant = 'outlined' | 'filled';

/**
 * Chip – auswählbares, kompaktes Label (z. B. Filter, Tags, Kategorien).
 *
 * Beispiele:
 *   <Chip label="Alle" selected onPress={() => setFilter('all')} />
 *   <Chip label="Einfach" onPress={() => setFilter('easy')} />
 */
export function Chip({
  label,
  selected = false,
  onPress,
  variant = 'outlined',
  disabled = false,
  style,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  variant?: ChipVariant;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.94, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const isFilledSelected = variant === 'filled' && selected;
  const isOutlinedSelected = variant === 'outlined' && selected;

  const containerStyle: ViewStyle = {
    backgroundColor: isFilledSelected
      ? Colors.primary
      : variant === 'filled'
      ? Colors.surface
      : 'transparent',
    borderColor: isOutlinedSelected ? Colors.primary : Colors.border,
    opacity: disabled ? 0.4 : 1,
  };

  const textColor = isFilledSelected || (variant === 'outlined' && isOutlinedSelected)
    ? Colors.primary
    : Colors.text.secondary;

  const finalTextColor = isFilledSelected ? Colors.drawing.white : textColor;

  return (
    <Animated.View style={[animatedStyle, style ?? {}]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ selected, disabled }}
        style={[styles.chip, containerStyle]}
      >
        <Text style={[styles.label, { color: finalTextColor }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

/**
 * ChipGroup – horizontale Gruppe von Chips (Single-Select).
 *
 * Beispiel:
 *   <ChipGroup
 *     options={['Alle', 'Einfach', 'Schwer']}
 *     selected="Alle"
 *     onSelect={setFilter}
 *   />
 */
export function ChipGroup({
  options,
  selected,
  onSelect,
  style,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  style?: ViewStyle;
}) {
  return (
    <Animated.View style={[styles.group, style ?? {}]}>
      {options.map((option) => (
        <Chip
          key={option}
          label={option}
          selected={selected === option}
          onPress={() => onSelect(option)}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.round,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  group: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
});

export default Chip;
