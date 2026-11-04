import { useState } from 'preact/hooks';

import { ApiError } from '@/gallery/lib/api';

// `limited` is the API's rate limit, which lifts after a minute.
export type FeedbackState = 'idle' | 'sending' | 'sent' | 'limited' | 'failed';

/**
 * Sends feedback with `post`, tracking whether it's on its way, sent, or
 * turned away so it can be tried again.
 */
export function useFeedback<T>(post: (feedback: T) => Promise<void>) {
  const [state, setState] = useState<FeedbackState>('idle');

  const send = async (feedback: T) => {
    setState('sending');

    try {
      await post(feedback);
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
