import {
  BackgroundCopyToClipboardQueryData,
  BackgroundCopyToClipboardResponse,
} from '#/shared/types/internal.types.ts';

export const handleCopyToClipboard = (
  data: BackgroundCopyToClipboardQueryData,
  sendResponse: (response: BackgroundCopyToClipboardResponse) => void
): void => {
  const { content } = data;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs.at(0);

    if (!tab?.id) {
      sendResponse({ success: false });

      return;
    }

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: (textToCopy: string) => {
          return navigator.clipboard
            .writeText(textToCopy)
            .then(() => true)
            .catch(() => false);
        },
        args: [content],
      },
      (results) => {
        const success = results?.at(0)?.result === true;

        sendResponse({ success });
      }
    );
  });
};
