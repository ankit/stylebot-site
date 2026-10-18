import { useEffect, useState } from 'preact/hooks';

import { type Session } from '@/gallery/lib/api';
import { readSession, SESSION_EVENT } from '@/gallery/lib/auth';

/**
 * The signed-in session, kept in step across islands and tabs. Undefined until
 * the island runs, since the built page can't know.
 */
export function useSession() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    const update = () => setSession(readSession());

    update();
    window.addEventListener(SESSION_EVENT, update);
    window.addEventListener('storage', update);

    return () => {
      window.removeEventListener(SESSION_EVENT, update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return session;
}
