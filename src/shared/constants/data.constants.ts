import { Character } from '../types/data.type.ts';

export const Skills = {
  Accuracy: 'Accuracy',
  Concentration: 'Concentration',
  Consistency: 'Consistency',
  Coordination: 'Coordination',
  JackSpeed: 'Jack Speed',
  Memory: 'Memory',
  Reading: 'Reading',
  Release: 'Release',
  Speed: 'Speed',
  SpeedJam: 'Speed Jam',
  Stamina: 'Stamina',
  Total: 'Total',
} as const;

export const DEFAULT_SKILLS_XP = {
  [Skills.Accuracy]: 0,
  [Skills.Stamina]: 0,
  [Skills.Consistency]: 0,
  [Skills.Reading]: 0,
  [Skills.Concentration]: 0,
  [Skills.SpeedJam]: 0,
  [Skills.Speed]: 0,
  [Skills.Coordination]: 0,
  [Skills.JackSpeed]: 0,
  [Skills.Memory]: 0,
  [Skills.Release]: 0,
} as const;

export const SKILL_ORDER = [
  Skills.Accuracy,
  Skills.Stamina,
  Skills.Consistency,
  Skills.Reading,
  Skills.Concentration,
  Skills.SpeedJam,
  Skills.Speed,
  Skills.Coordination,
  Skills.JackSpeed,
  Skills.Memory,
  Skills.Release,
] as const;

export const DEFAULT_CHARACTER = {
  avatarUrl: '',
  globalLevel: 0,
  id: 0,
  name: '',
  skills: SKILL_ORDER.map((name) => ({
    name,
    level: 0,
    xp: { inCurrentLevel: 0, remainingToNextLevel: 100, toNextLevel: 100, total: 0 },
  })),
} satisfies Character;
