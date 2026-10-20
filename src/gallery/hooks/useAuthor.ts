import { ApiError, getAuthor } from '@/gallery/lib/api';

import { useRequest } from './useRequest';

/**
 * The author with this username. `missing` when there's no such author with
 * live styles, `failed` when they couldn't be loaded.
 */
export function useAuthor(username: string) {
  const request = useRequest(() => getAuthor(username), [username]);
  const missing =
    request.error instanceof ApiError && request.error.status === 404;

  return {
    author: request.data,
    missing,
    failed: request.error !== undefined && !missing,
    reload: request.reload,
  };
}
