import { ContentQueries } from '#/shared/constants/internal.constants.ts';
import { ContentQuery } from '#/shared/types/internal.types.ts';

import { handleExtractScoreData } from './handlers/extractScoreData.handler.ts';

chrome.runtime.onMessage.addListener(
  (query: ContentQuery, _sender, sendResponse: (response: unknown) => void) => {
    const { data, name } = query;

    switch (name) {
      case ContentQueries.ExtractScoreData: {
        return handleExtractScoreData(data, sendResponse);
      }
    }
  }
);
