import { StandardUnitMultipliers, TimeUnits } from '../constants/maths.constants.ts';

export interface Coordinate {
  x: number;
  y: number;
}

export type StandardUnitMultiplier =
  (typeof StandardUnitMultipliers)[keyof typeof StandardUnitMultipliers];
export type StandardUnitMultiplierKey = keyof typeof StandardUnitMultipliers;
export type TimeUnit = (typeof TimeUnits)[keyof typeof TimeUnits];
