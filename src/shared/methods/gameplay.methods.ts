import { cubicBezierCurve } from './maths.methods.ts';

/**
 * Smooth and slow continuous increase up to level 70, then exponential
 * curve.
 */
const earlyXp = (level: number): number => {
  const earlyLevelsXpCurve = cubicBezierCurve({ x: 0.1, y: 0.4 }, { x: 0.95, y: 0 });

  return earlyLevelsXpCurve(level / 100) * 9_900;
};

/**
 * Additional exponential-like curve for levels between 61 and 100.
 */
const lateXp = (level: number): number => {
  const earlyLevelsXpCurve = cubicBezierCurve({ x: 0.5, y: 0 }, { x: 1, y: 0.4 });

  return earlyLevelsXpCurve((level - 60) / 40) * 90_000;
};

/**
 * Linear curve past level 100.
 */
const extraXp = (level: number): number => {
  if (level < 100) {
    return 0;
  }

  return (level - 99) * 10_000_000;
};

export const computeLevelXp = (level: number): number => {
  return Math.round(100 + earlyXp(level) + lateXp(level) + extraXp(level));
};
