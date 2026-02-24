import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Colors from '../constants/Colors';
import { FontWeight } from '../constants/Layout';

interface Props {
  onFinish: () => void;
}

/**
 * Animierter Splash Screen mit Fade-In und Scale-Animationen.
 * Zeigt App-Titel und Untertitel, dann Übergang zum Home Screen.
 */
export default function AnimatedSplashScreen({ onFinish }: Props) {
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.7)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(20)).current;
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconRotation = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Sequenzielle Animation
    Animated.sequence([
      // 1. Icon erscheint mit Bounce
      Animated.parallel([
        Animated.spring(iconScale, {
          toValue: 1,
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(iconRotation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      // 2. Titel Fade-In + Scale
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(titleScale, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),

      // 3. Untertitel Slide-In
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),

      // 4. Pause
      Animated.delay(800),

      // 5. Alles ausfaden
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  }, []);

  const spin = iconRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      {/* Dekorative Kreise im Hintergrund */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      {/* Icon / Symbol */}
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ scale: iconScale }, { rotate: spin }],
          },
        ]}
      >
        <Text style={styles.iconText}>🎨</Text>
      </Animated.View>

      {/* Titel */}
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: titleOpacity,
            transform: [{ scale: titleScale }],
          },
        ]}
      >
        Merke und Male
      </Animated.Text>

      {/* Untertitel */}
      <Animated.Text
        style={[
          styles.subtitle,
          {
            opacity: subtitleOpacity,
            transform: [{ translateY: subtitleTranslateY }],
          },
        ]}
      >
        Trainiere dein Gedächtnis!
      </Animated.Text>
    </Animated.View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  bgCircle1: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: Colors.primaryLight,
    opacity: 0.2,
    top: -width * 0.2,
    right: -width * 0.2,
  },
  bgCircle2: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: Colors.secondary,
    opacity: 0.15,
    bottom: -width * 0.1,
    left: -width * 0.15,
  },
  bgCircle3: {
    position: 'absolute',
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: Colors.accent,
    opacity: 0.1,
    bottom: height * 0.15,
    right: -width * 0.05,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconText: {
    fontSize: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: FontWeight.bold as '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: FontWeight.medium as '500',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
  },
});
