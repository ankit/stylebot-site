import { useState } from 'preact/hooks';

const KEY = 'stylebot-gallery:welcome-seen';

function readSeen(accountId: string) {
  try {
    return localStorage.getItem(KEY) === accountId;
  } catch {
    return false;
  }
}

/**
 * Whether this browser has shown an account its welcome, so it isn't shown on
 * every page.
 */
export function useWelcomeSeen(accountId: string) {
  const [seen, setSeen] = useState(() => readSeen(accountId));

  const markSeen = () => {
    try {
      localStorage.setItem(KEY, accountId);
    } catch {
      // Blocked storage only means it's shown again next visit.
    }

    setSeen(true);
  };

  return [seen, markSeen] as const;
}
