import { listMyStyles } from '@/gallery/lib/api';
import { onAuthError } from '@/gallery/lib/auth';

import { useRequest } from './useRequest';

/**
 * One of the signed-in account's styles, whatever its status. Undefined while
 * it loads, and null when there's no id or the account has no such style.
 */
export function useOwnStyle(session: string, id: number | null) {
  const request = useRequest(async () => {
    if (id === null) {
      return null;
    }

    const { styles } = await listMyStyles(session).catch(onAuthError);

    return styles.find((style) => style.id === id) ?? null;
  }, [session, id]);

  return {
    style: request.data,
    failed: request.error !== undefined,
    reload: request.reload,
  };
}
