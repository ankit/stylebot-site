import { ApiError, getStyle } from '@/gallery/lib/api';

import { useRequest } from './useRequest';

/**
 * The style with this group and slug. `missing` when there's no such style,
 * `failed` when it couldn't be loaded.
 */
export function useStyle(group: string, slug: string) {
  const request = useRequest(() => getStyle(group, slug), [group, slug]);
  const missing =
    request.error instanceof ApiError && request.error.status === 404;

  return {
    style: request.data,
    missing,
    failed: request.error !== undefined && !missing,
    reload: request.reload,
  };
}
