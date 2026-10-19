import { listMyStyles } from '@/gallery/lib/api';
import { onAuthError } from '@/gallery/lib/auth';

import { useRequest } from './useRequest';

/**
 * The signed-in account's styles, live and hidden, most recently updated
 * first.
 */
export function useMyStyles(session: string) {
  return useRequest(
    () =>
      listMyStyles(session)
        .then((r) => r.styles)
        .catch(onAuthError),
    [session],
  );
}
