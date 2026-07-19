import { API_CHARACTER_SKILL_KEYS, OsuIdleApiEndpoints } from '#/shared/constants/api.constants.ts';
import { DEFAULT_CHARACTER } from '#/shared/constants/data.constants.ts';
import { computeLevelXp } from '#/shared/methods/gameplay.methods.ts';
import { GetCharacterResponseBody } from '#/shared/types/api.types.ts';
import { Character } from '#/shared/types/data.type.ts';
import {
  BackgroundGetCharacterQueryData,
  BackgroundGetCharacterResponse,
  LocalStorageData,
} from '#/shared/types/internal.types.ts';

const mapApiResponseToCharacterData = (characterData: GetCharacterResponseBody): Character => {
  return {
    avatarUrl: characterData.avatarUrl,
    globalLevel: characterData.overallLevel,
    id: characterData.id,
    name: characterData.name,
    skills: API_CHARACTER_SKILL_KEYS.map(({ name, key }) => {
      const level = characterData[`${key}Level`];
      const inCurrentLevel = characterData[`${key}Xp`];
      const toNextLevel = computeLevelXp(level);

      return {
        name,
        level,
        xp: {
          inCurrentLevel,
          remainingToNextLevel: toNextLevel - inCurrentLevel,
          toNextLevel,
          total: characterData[`${key}TotalXp`],
        },
      };
    }),
  };
};

const fetchAndStoreCharacterData = async (id: number): Promise<Character> => {
  if (!id) {
    await chrome.storage.local.set<Pick<LocalStorageData, 'character'>>({
      character: DEFAULT_CHARACTER,
    });

    return DEFAULT_CHARACTER;
  }

  const response = await fetch(`${OsuIdleApiEndpoints.Characters}/${id}`);

  if (!response.ok) {
    return DEFAULT_CHARACTER;
  }

  const characterData = (await response.json()) as GetCharacterResponseBody;
  const character = mapApiResponseToCharacterData(characterData);

  await chrome.storage.local.set<Pick<LocalStorageData, 'character'>>({ character });

  return character;
};

export const handleFetchCharacterData = async (
  data: BackgroundGetCharacterQueryData,
  sendResponse: (response: BackgroundGetCharacterResponse) => void
): Promise<void> => {
  const { id } = data;

  try {
    const character = await fetchAndStoreCharacterData(id);

    sendResponse({ character, success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    sendResponse({ error: errorMessage, success: false });
  }
};
