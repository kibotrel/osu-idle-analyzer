import { TimeUnits } from '../constants/maths.constants.ts';
import { Coordinate, TimeUnit } from '../types/maths.types.ts';

export const isNormalized = (value: number): boolean => {
  return value >= 0 && value <= 1;
};

export const cubicBezierCurve = (
  start: Coordinate,
  end: Coordinate
): ((input: number) => number) => {
  if (!isNormalized(start.x) || !isNormalized(end.x)) {
    throw new Error(
      '[cubicBezierCurve]: abscissa components of control points are not between 0 and 1.'
    );
  }

  const bFactor: Coordinate = { x: end.x, y: end.y };
  const cFactor: Coordinate = { x: start.x, y: start.y };
  const aFactor: Coordinate = {
    x: 1 - (bFactor.x = 3 * (bFactor.x - cFactor.x) - (cFactor.x *= 3)) - cFactor.x,
    y: 1 - (bFactor.y = 3 * (bFactor.y - cFactor.y) - (cFactor.y *= 3)) - cFactor.y,
  };

  return (input: number) => {
    if (input < 0) {
      return 0;
    }

    if (input > 1) {
      return 1;
    }

    for (let estimate = input, iteration = 0; iteration < 32; iteration++) {
      const error = estimate * (estimate * (estimate * aFactor.x + bFactor.x) + cFactor.x) - input;
      const hasConverged = Math.abs(error) < 1e-5;

      if (hasConverged) {
        return estimate * (estimate * (estimate * aFactor.y + bFactor.y) + cFactor.y);
      }

      const derivative = estimate * (estimate * aFactor.x * 3 + bFactor.x * 2.0) + cFactor.x;
      const isNearNumericInstability = Math.abs(derivative) < 1e-5;

      if (isNearNumericInstability) {
        break;
      }

      estimate -= error / derivative;
    }

    let estimate = input;

    for (
      let iteration = 0, lowerBound = 0, upperBound = 0;
      upperBound > lowerBound && iteration < 64;
      iteration++
    ) {
      const xAtEstimate = estimate * (estimate * (estimate * aFactor.x + bFactor.x) + cFactor.x);
      const hasConverged = Math.abs(xAtEstimate - input) < 1e-5;

      if (hasConverged) {
        break;
      }

      if (input > xAtEstimate) {
        lowerBound = estimate;
      } else {
        upperBound = estimate;
      }

      estimate = 0.5 * (upperBound - lowerBound) + lowerBound;
    }

    return estimate * (estimate * (estimate * aFactor.y + bFactor.y) + cFactor.y);
  };
};

export const convertDuration = (
  value: number,
  options: { fromUnit: TimeUnit; toUnit: TimeUnit }
): number => {
  const { fromUnit, toUnit } = options;

  if (fromUnit === toUnit) {
    return value;
  }

  if (toUnit === TimeUnits.Millisecond) {
    return Math.round(value * 1000);
  }

  return Math.round(value / 1000);
};

export const unitsPerSecond = (options: { duration: number; total: number }): number => {
  const { duration, total } = options;

  if (duration <= 0) {
    throw new Error('[unitsPerSecond] duration must be strictly positive.');
  }

  return total / duration;
};
