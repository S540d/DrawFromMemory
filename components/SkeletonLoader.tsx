import React, { useEffect } from 'react';
import { View, StyleSheet, AccessibilityInfo } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@services/ThemeContext';

interface SkeletonProps {
  width: number;
  height: number;
  borderRadius?: number;
  style?: object;
}

export function Skeleton({ width, height, borderRadius = 8, style }: SkeletonProps) {
  const { colors } = useTheme();
  const translateX = useSharedValue(-width);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (cancelled) return;
      if (!reduceMotion) {
        translateX.value = withRepeat(
          withTiming(width, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          -1,
          false
        );
      }
    });
    return () => { cancelled = true; };
  }, [translateX, width]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.surface,
          overflow: 'hidden',
        },
        style,
      ]}
      accessibilityLabel="Loading..."
    >
      <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ width, height }}
        />
      </Animated.View>
    </View>
  );
}

export function GalleryCardSkeleton() {
  return (
    <View style={skeletonStyles.card}>
      <Skeleton width={170} height={140} borderRadius={0} />
      <View style={skeletonStyles.cardInfo}>
        <Skeleton width={120} height={14} borderRadius={4} />
        <Skeleton width={90} height={12} borderRadius={4} style={{ marginTop: 4 }} />
        <Skeleton width={60} height={12} borderRadius={4} style={{ marginTop: 4 }} />
      </View>
    </View>
  );
}

export function GallerySkeleton() {
  return (
    <View style={skeletonStyles.grid}>
      {[0, 1, 2, 3].map((i) => (
        <GalleryCardSkeleton key={i} />
      ))}
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  card: {
    width: 170,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  cardInfo: {
    padding: 8,
  },
});
