import { ApiError, getStyle } from '@/gallery/lib/api';

import { useRequest } from './useRequest';

/**
 * The style with this ID. `missing` when there's no such style, `failed` when
 * it couldn't be loaded.
 */
export function useStyle(id: string) {
  const request = useRequest(() => getStyle(id), [id]);
  const missing =
    request.error instanceof ApiError && request.error.status === 404;

  return {
    style: request.data,
    missing,
    failed: request.error !== undefined && !missing,
    reload: request.reload,
  };
}
