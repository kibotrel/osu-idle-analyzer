import { ref } from 'vue';

import { DEFAULT_CHARACTER } from '#/shared/constants/data.constants.ts';
import { BackgroundQueries } from '#/shared/constants/internal.constants.ts';
import { Character } from '#/shared/types/data.type.ts';
import {
  BackgroundGetCharacterQuery,
  BackgroundGetCharacterResponse,
  LocalStorageData,
} from '#/shared/types/internal.types.ts';

const fetchCharacterFromBackground = async (
  id: number
): Promise<BackgroundGetCharacterResponse> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage<BackgroundGetCharacterQuery>(
      { name: BackgroundQueries.FetchCharacter, data: { id } },
      (response: BackgroundGetCharacterResponse) => {
        if (chrome.runtime.lastError) {
          resolve({
            error: chrome.runtime.lastError.message ?? 'Unknown error',
            success: false,
          });

          return;
        }

        resolve(response);
      }
    );
  });
};

const character = ref<Character>(DEFAULT_CHARACTER);
const isLoading = ref<boolean>(false);

export const useCharacter = () => {
  const loadFromStorage = async (): Promise<void> => {
    const { character: savedCharacter } =
      await chrome.storage.local.get<Pick<LocalStorageData, 'character'>>('character');

    if (!savedCharacter) {
      return;
    }

    character.value = savedCharacter;
  };

  const fetchFromBackground = async (id: number): Promise<void> => {
    isLoading.value = true;

    try {
      const response = await fetchCharacterFromBackground(id);

      if (response.success) {
        character.value = response.character;
      }
    } finally {
      isLoading.value = false;
    }
  };

  const fetchCharacter = async (id: number): Promise<void> => {
    await fetchFromBackground(id);
  };

  const init = async (): Promise<void> => {
    await loadFromStorage();
  };

  return {
    character,
    isLoading,

    fetchCharacter,
    init,
  };
};
