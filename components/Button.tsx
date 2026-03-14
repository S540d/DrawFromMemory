import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, AccessibilityInfo } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import Colors from '../constants/Colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/Layout';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_STYLES: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
  primary: {
    container: {
      backgroundColor: Colors.primaryDark,
      ...Colors.shadow.large,
    },
    text: { color: Colors.drawing.white },
  },
  secondary: {
    container: {
      backgroundColor: Colors.surface,
      borderWidth: 2,
      borderColor: Colors.primary,
      ...Colors.shadow.small,
    },
    text: { color: Colors.primary },
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
    },
    text: { color: Colors.primary },
  },
  danger: {
    container: {
      backgroundColor: Colors.error,
      ...Colors.shadow.medium,
    },
    text: { color: Colors.drawing.white },
  },
};

const SIZE_STYLES: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: {
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.md,
      minHeight: 36,
      borderRadius: BorderRadius.md,
    },
    text: { fontSize: FontSize.sm },
  },
  md: {
    container: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.lg,
      minHeight: 44,
      borderRadius: BorderRadius.lg,
    },
    text: { fontSize: FontSize.md },
  },
  lg: {
    container: {
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.xl,
      minHeight: 56,
      borderRadius: BorderRadius.lg,
    },
    text: { fontSize: FontSize.xl },
  },
};

/**
 * Button – vollständig animierter, zugänglicher Button.
 *
 * Varianten: primary | secondary | ghost | danger
 * Größen:    sm | md | lg
 *
 * Beispiele:
 *   <Button label="Spielen" onPress={...} />
 *   <Button label="Löschen" variant="danger" size="sm" onPress={...} />
 *   <Button label="Laden..." loading />
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  style,
  accessibilityLabel,
}: {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  style?: ViewStyle;
  accessibilityLabel?: string;
}) {
  const scale = useSharedValue(1);
  const reduceMotion = useRef(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((v) => { reduceMotion.current = v; });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (reduceMotion.current) return;
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    if (reduceMotion.current) return;
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const variantStyle = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];
  const isDisabled = disabled || loading;

  return (
    <Animated.View style={[animatedStyle, fullWidth && styles.fullWidth]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled: isDisabled }}
        style={[
          styles.base,
          variantStyle.container,
          sizeStyle.container,
          isDisabled && styles.disabled,
          fullWidth && styles.fullWidth,
          style ?? {},
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' || variant === 'danger' ? Colors.drawing.white : Colors.primary}
            size="small"
          />
        ) : (
          <>
            {leftIcon}
            <Text style={[styles.label, variantStyle.text, sizeStyle.text]}>
              {label}
            </Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  label: {
    fontWeight: FontWeight.bold,
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
});

export default Button;
