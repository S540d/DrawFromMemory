/**
 * SoundManager - Sound-Effekte und Haptisches Feedback
 * Web: Web Audio API (programmatische Tonerzeugung, keine Sound-Dateien nötig)
 * Native: expo-haptics für Vibration
 */

import { Platform } from 'react-native';
import storageManager from './StorageManager';

// Dynamic import for haptics (native only)
let Haptics: typeof import('expo-haptics') | null = null;
if (Platform.OS !== 'web') {
  try {
    Haptics = require('expo-haptics');
  } catch {
    // expo-haptics not available
  }
}

class SoundManager {
  private audioContext: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private initialized: boolean = false;

  private getAudioContext(): AudioContext | null {
    if (Platform.OS !== 'web') return null;
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch {
        return null;
      }
    }
    // Resume if suspended (browsers require user gesture)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  async init() {
    if (this.initialized) return;
    this.soundEnabled = await storageManager.getSetting('soundEnabled');
    this.initialized = true;
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.3
  ) {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  /** Timer-Tick (Memorize-Phase Countdown) */
  playTimerTick() {
    this.playTone(800, 0.08, 'sine', 0.12);
    this.hapticLight();
  }

  /** Stern-Bewertung antippen */
  playStarTap(starNumber: number) {
    this.playTone(400 + starNumber * 100, 0.15, 'sine', 0.2);
    this.hapticLight();
  }

  /** Phasenwechsel-Chime (Memorize → Draw, Draw → Result) */
  playPhaseTransition() {
    if (!this.soundEnabled) return;
    [523, 659, 784].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.2), i * 100);
    });
    this.hapticSuccess();
  }

  /** Button-Tap (allgemein) */
  playButtonTap() {
    this.playTone(600, 0.05, 'sine', 0.1);
    this.hapticLight();
  }

  /** Zeichnungsstrich beginnen */
  playDrawStart() {
    this.playTone(300, 0.04, 'triangle', 0.08);
  }

  /** Erfolg (Galerie gespeichert, etc.) */
  playSuccess() {
    if (!this.soundEnabled) return;
    [660, 880].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.2), i * 80);
    });
    this.hapticSuccess();
  }

  // Haptic feedback (native only)
  private async hapticLight() {
    if (Platform.OS === 'web' || !Haptics) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Silently ignore haptic errors
    }
  }

  private async hapticSuccess() {
    if (Platform.OS === 'web' || !Haptics) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Silently ignore haptic errors
    }
  }
}

export default new SoundManager();
