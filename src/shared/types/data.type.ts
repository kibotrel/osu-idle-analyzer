import { Skills } from '../constants/data.constants.ts';

export type SkillName = (typeof Skills)[keyof typeof Skills];

export interface SkillXp {
  inCurrentLevel: number;
  remainingToNextLevel: number;
  toNextLevel: number;
  total: number;
}
export interface Skill {
  name: SkillName;
  level: number;
  xp: SkillXp;
}

export interface Character {
  avatarUrl: string;
  globalLevel: number;
  id: number;
  name: string;
  skills: Skill[];
}

export interface Beatmap {
  artist: string;
  backgroundUrl: string;
  difficultyName: string;
  durationInSeconds: number;
  id: number;
  starRating: number;
  title: string;
}

export interface ScoreSkillXp {
  absolute: number;
  perSecond: number;
}

export interface ScoreSkill {
  name: SkillName;
  xp: ScoreSkillXp;
}

export interface Score {
  beatmap: Beatmap;
  exportableData: string;
  gainedSkills: ScoreSkill[];
  timestamp: number;
}

export type ScoresMap = Map<number, Score>;
