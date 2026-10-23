import { useEffect, useState } from 'preact/hooks';

/**
 * Runs an action right away once the account's username is confirmed, or
 * holds it, `asking`, until the username is confirmed or `cancel` drops it.
 */
export function useUsernameGate(confirmed: boolean) {
  const [pending, setPending] = useState<{ run: () => void }>();

  useEffect(() => {
    if (confirmed && pending) {
      setPending(undefined);
      pending.run();
    }
  }, [confirmed, pending]);

  const guard = (run: () => void) => {
    if (confirmed) {
      run();
    } else {
      setPending({ run });
    }
  };

  return {
    asking: pending !== undefined && !confirmed,
    guard,
    cancel: () => setPending(undefined),
  };
}
