import Colors from '../constants/Colors';

export interface ConfettiBurstProps {
  width: number;
  height: number;
  active: boolean;
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
export const CONFETTI_COUNT = 40;

const CONFETTI_COLORS = [
  Colors.gradient.cta[0],
  Colors.gradient.cta[1],
  Colors.stars.filled,
  Colors.gradient.warm[0],
  Colors.gradient.teal[0],
];

export function buildParticles(width: number, height: number, seed = 0): ConfettiParticle[] {
  // simple deterministic PRNG so tests / SSR stay stable
  let s = seed || 1;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 0xffffffff;
    return s / 0xffffffff;
  };
  return Array.from({ length: CONFETTI_COUNT }, () => ({
    x: rand() * width,
    startY: -20 - rand() * 60,
    endY: height + 40,
    color: CONFETTI_COLORS[Math.floor(rand() * CONFETTI_COLORS.length)],
    size: 6 + rand() * 6,
    drift: (rand() - 0.5) * 80,
    duration: 1800 + rand() * 700,
    delay: rand() * 400,
    rotation: rand() * 360,
  }));
}
