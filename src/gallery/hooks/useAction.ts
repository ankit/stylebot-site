import { useState } from 'preact/hooks';

import { onAuthError } from '@/gallery/lib/auth';

/**
 * Runs a signed-in request on demand and passes its result to `onDone`, with
 * whether it's running and whether the last try failed. An expired session
 * signs out.
 */
export function useAction<T>(
  action: () => Promise<T>,
  onDone: (result: T) => void,
) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const run = async () => {
    setBusy(true);
    setFailed(false);

    try {
      onDone(await action().catch(onAuthError));
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  return { run, busy, failed, reset: () => setFailed(false) };
}
