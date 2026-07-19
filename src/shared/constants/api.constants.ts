import { ApiCharacterSkillName } from '../types/api.types.ts';
import { SkillName } from '../types/data.type.ts';
import { Skills } from './data.constants.ts';

export const API_CHARACTER_SKILL_KEYS: Array<{ name: SkillName; key: ApiCharacterSkillName }> = [
  { name: Skills.Accuracy, key: 'accuracy' },
  { name: Skills.Speed, key: 'speed' },
  { name: Skills.Stamina, key: 'stamina' },
  { name: Skills.JackSpeed, key: 'jackspeed' },
  { name: Skills.Coordination, key: 'coordination' },
  { name: Skills.Release, key: 'release' },
  { name: Skills.Reading, key: 'reading' },
  { name: Skills.Consistency, key: 'consistency' },
  { name: Skills.Concentration, key: 'concentration' },
  { name: Skills.SpeedJam, key: 'speedjam' },
  { name: Skills.Memory, key: 'memory' },
];

export const OSU_IDLE_BASE_URL = 'https://api.osu.idle.rhythmgamers.net';

export const OsuIdleApiEndpoints = {
  Characters: `${OSU_IDLE_BASE_URL}/v1/characters`,
} as const;

export const OsuIdleIndexedDbDatabases = {
  Beatmaps: 'beatmaps',
  OsuIdle: 'osu-idle',
} as const;
