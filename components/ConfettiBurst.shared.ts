import Colors from '../constants/Colors';

export type ConfettiIntensity = 'full' | 'light';

export interface ConfettiBurstProps {
  width: number;
  height: number;
  active: boolean;
  intensity?: ConfettiIntensity;
}

export interface ConfettiParticle {
  x: number;
  startY: number;
  endY: number;
  color: string;
  size: number;
  drift: number;
  duration: number;
  delay: number;
  rotation: number;
}

export const CONFETTI_DURATION_MS = 2500;
export const CONFETTI_LIGHT_DURATION_MS = 1500;
export const CONFETTI_COUNT = 40;
export const CONFETTI_LIGHT_COUNT = 20;

const CONFETTI_COLORS = [
  Colors.gradient.cta[0],
  Colors.gradient.cta[1],
  Colors.stars.filled,
  Colors.gradient.warm[0],
  Colors.gradient.teal[0],
];

const CONFETTI_LIGHT_COLORS = [
  '#C8C8E8',
  '#E8E8F8',
  '#FFFFFF',
  '#D4C8FF',
  '#B8B4E0',
];

export function buildParticles(width: number, height: number, seed = 0, intensity: ConfettiIntensity = 'full'): ConfettiParticle[] {
  // simple deterministic PRNG so tests / SSR stay stable
  let s = seed || 1;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 0xffffffff;
    return s / 0xffffffff;
  };
  const count = intensity === 'light' ? CONFETTI_LIGHT_COUNT : CONFETTI_COUNT;
  const colors = intensity === 'light' ? CONFETTI_LIGHT_COLORS : CONFETTI_COLORS;
  const maxSize = intensity === 'light' ? 8 : 12;
  const minSize = intensity === 'light' ? 4 : 6;

  return Array.from({ length: count }, () => ({
    x: rand() * width,
    startY: -20 - rand() * 60,
    endY: height + 40,
    color: colors[Math.floor(rand() * colors.length)],
    size: minSize + rand() * (maxSize - minSize),
    drift: (rand() - 0.5) * 80,
    duration: 1800 + rand() * 700,
    delay: rand() * 400,
    rotation: rand() * 360,
  }));
}
