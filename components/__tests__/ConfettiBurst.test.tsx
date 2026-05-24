import { buildParticles, CONFETTI_COUNT } from '../ConfettiBurst.shared';

describe('ConfettiBurst.shared', () => {
  it('builds the expected number of particles', () => {
    const particles = buildParticles(300, 600, 42);
    expect(particles).toHaveLength(CONFETTI_COUNT);
  });

  it('keeps particles roughly inside the canvas X range', () => {
    const particles = buildParticles(400, 800, 7);
    particles.forEach((p) => {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(400);
    });
  });

  it('is deterministic given the same seed', () => {
    const a = buildParticles(300, 600, 99);
    const b = buildParticles(300, 600, 99);
    expect(a[0]).toEqual(b[0]);
    expect(a[CONFETTI_COUNT - 1]).toEqual(b[CONFETTI_COUNT - 1]);
  });

  it('produces particles that fall from above into the canvas', () => {
    const particles = buildParticles(300, 600, 5);
    particles.forEach((p) => {
      expect(p.startY).toBeLessThan(0);
      expect(p.endY).toBeGreaterThan(600);
    });
  });
});
