import { useState } from 'preact/hooks';

import {
  ApiError,
  sendUninstallFeedback,
  type UninstallFeedback,
} from '@/gallery/lib/api';

// `limited` is the API's rate limit, which lifts after a minute.
export type FeedbackState = 'idle' | 'sending' | 'sent' | 'limited' | 'failed';

/**
 * Sends the goodbye page's survey to the styles API.
 */
export function useUninstallFeedback() {
  const [state, setState] = useState<FeedbackState>('idle');

  const send = async (feedback: UninstallFeedback) => {
    setState('sending');

    try {
      await sendUninstallFeedback(feedback);
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        setState('limited');
      } else {
        setState('failed');
      }

      return;
    }

    setState('sent');
  };

  return { state, send };
}
