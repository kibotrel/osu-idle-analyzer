import { TimeUnits } from '../constants/maths.constants.ts';

export interface Coordinate {
  x: number;
  y: number;
}

export type TimeUnit = (typeof TimeUnits)[keyof typeof TimeUnits];
