import { ref } from 'vue';

import { BackgroundQueries, ContentQueries } from '#/shared/constants/internal.constants.ts';
import { Score } from '#/shared/types/data.type.ts';
import {
  BackgroundCopyToClipboardQuery,
  BackgroundCopyToClipboardResponse,
  ContentExtractScoreDataQuery,
  ContentExtractScoreDataResponse,
  LocalStorageData,
} from '#/shared/types/internal.types.ts';

export interface ActionFeedback {
  level: 'error' | 'success';
  message: string;
}

const fetchScoreDataFromContent = async (): Promise<ContentExtractScoreDataResponse> => {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!activeTab?.id) {
    return { error: 'No active tab found.', success: false };
  }

  return new Promise((resolve) => {
    chrome.tabs.sendMessage<ContentExtractScoreDataQuery>(
      activeTab.id!,
      { name: ContentQueries.ExtractScoreData, data: {} as Record<string, never> },
      (response: ContentExtractScoreDataResponse) => {
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

const isLoading = ref<boolean>(false);
const score = ref<Score | null>(null);
const actionFeedback = ref<ActionFeedback | null>(null);

let actionFeedbackTimer: ReturnType<typeof setTimeout> | null = null;

export const useScoreExtractor = () => {
  const loadFromStorage = async (): Promise<void> => {
    const { scores = [] } =
      await chrome.storage.local.get<Pick<LocalStorageData, 'scores'>>('scores');

    if (scores.length === 0) {
      return;
    }

    const lastScore = scores
      .map(([, recordedScore]) => recordedScore)
      .toSorted((a, b) => b.timestamp - a.timestamp)
      .at(0)!;

    score.value = lastScore;
  };

  const fetchFromContent = async () => {
    actionFeedback.value = null;
    isLoading.value = true;

    try {
      const response = await fetchScoreDataFromContent();

      if (response.success) {
        score.value = response.score;
      } else {
        setActionFeedback({ level: 'error', message: response.error });
      }
    } finally {
      isLoading.value = false;
    }
  };

  const extractScoreData = async (): Promise<void> => {
    await fetchFromContent();
  };

  const setActionFeedback = (data: ActionFeedback) => {
    actionFeedback.value = data;

    if (actionFeedbackTimer) {
      clearTimeout(actionFeedbackTimer);
    }

    actionFeedbackTimer = setTimeout(() => {
      actionFeedback.value = null;
    }, 2000);
  };

  const copyScoreToClipboard = async (data: string) => {
    actionFeedback.value = null;
    isLoading.value = true;

    const successActionFeedback = {
      level: 'success',
      message: 'Data successfully copied to clipboard!',
    } as const;

    try {
      await navigator.clipboard.writeText(data);
      setActionFeedback(successActionFeedback);
    } catch {
      chrome.runtime.sendMessage<BackgroundCopyToClipboardQuery, BackgroundCopyToClipboardResponse>(
        { name: BackgroundQueries.CopyToClipboard, data: { content: data } },
        (response) => {
          if (response?.success === true) {
            setActionFeedback(successActionFeedback);
          }
        }
      );
    }

    isLoading.value = false;
  };

  const init = async (): Promise<void> => {
    await loadFromStorage();
  };

  return {
    actionFeedback,
    isLoading,
    score,

    copyScoreToClipboard,
    extractScoreData,
    init,
  };
};
