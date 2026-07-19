export interface GetCharacterResponseBody {
  accuracyLevel: number;
  accuracyTotalXp: number;
  accuracyXp: number;
  avatarUrl: string;
  concentrationLevel: number;
  concentrationTotalXp: number;
  concentrationXp: number;
  consistencyLevel: number;
  consistencyTotalXp: number;
  consistencyXp: number;
  coordinationLevel: number;
  coordinationTotalXp: number;
  coordinationXp: number;
  id: number;
  jackspeedLevel: number;
  jackspeedTotalXp: number;
  jackspeedXp: number;
  memoryLevel: number;
  memoryTotalXp: number;
  memoryXp: number;
  name: string;
  overallLevel: number;
  overallTotalXp: number;
  overallXp: number;
  readingLevel: number;
  readingTotalXp: number;
  readingXp: number;
  releaseLevel: number;
  releaseTotalXp: number;
  releaseXp: number;
  speedjamLevel: number;
  speedjamTotalXp: number;
  speedjamXp: number;
  speedLevel: number;
  speedTotalXp: number;
  speedXp: number;
  staminaLevel: number;
  staminaTotalXp: number;
  staminaXp: number;
  userId: number;
}

export type ApiCharacterSkillName = {
  [Key in keyof GetCharacterResponseBody]: Key extends `${infer Prefix}Level` ? Prefix : never;
}[keyof GetCharacterResponseBody];
