import { BackgroundQueries } from '#/shared/constants/internal.constants.ts';
import { BackgroundQuery } from '#/shared/types/internal.types.ts';

import { handleCopyToClipboard } from './handlers/copyTocClipboard.handler.ts';
import { handleFetchCharacterData } from './handlers/fetchCharacter.handler.ts';

chrome.runtime.onMessage.addListener(
  (query: BackgroundQuery, _sender, sendResponse: (response: unknown) => void) => {
    const { data, name } = query;

    switch (name) {
      case BackgroundQueries.CopyToClipboard: {
        return handleCopyToClipboard(data, sendResponse);
      }

      case BackgroundQueries.FetchCharacter: {
        return handleFetchCharacterData(data, sendResponse);
      }
    }
  }
);
