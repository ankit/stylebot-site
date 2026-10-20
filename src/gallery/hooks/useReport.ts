import { useState } from 'preact/hooks';

import { ApiError, reportStyle } from '@/gallery/lib/api';
import { onAuthError, readSession, signIn } from '@/gallery/lib/auth';

// `signedOut` is a session the API no longer takes, now signed out;
// `forbidden` a report the API wouldn't take without one; `gone` a style
// that's no longer live.
export type ReportState =
  | 'idle'
  | 'sending'
  | 'sent'
  | 'signInFailed'
  | 'signedOut'
  | 'forbidden'
  | 'gone'
  | 'failed';

/**
 * Reports a style, signing in first when signed out, since the API only takes
 * reports from accounts (or from installs, which the gallery doesn't have).
 */
export function useReport(styleId: number) {
  const [state, setState] = useState<ReportState>('idle');

  const send = async (reason: string) => {
    setState('sending');

    let session = readSession();

    if (!session) {
      try {
        session = await signIn();
      } catch {
        setState('signInFailed');

        return;
      }
    }

    if (!session) {
      setState('idle');

      return;
    }

    try {
      await reportStyle(session.session, styleId, reason).catch(onAuthError);
      setState('sent');
    } catch (error) {
      setState(failure(error));
    }
  };

  return { state, send, reset: () => setState('idle') };
}

function failure(error: unknown): ReportState {
  if (!(error instanceof ApiError)) {
    return 'failed';
  }

  if (error.status === 401) {
    return 'signedOut';
  }

  if (error.status === 403) {
    return 'forbidden';
  }

  if (error.status === 404) {
    return 'gone';
  }

  return 'failed';
}
