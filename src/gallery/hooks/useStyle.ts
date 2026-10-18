import { ApiError, getStyle } from '@/gallery/lib/api';
import { styleRoute } from '@/gallery/lib/paths';

import { useRequest } from './useRequest';

/**
 * The style this page's address names. `missing` when there's no such style,
 * `failed` when it couldn't be loaded.
 */
export function useStyle() {
  const request = useRequest(() => {
    const { group, slug } = styleRoute();

    return getStyle(group, slug);
  });
  const missing =
    request.error instanceof ApiError && request.error.status === 404;

  return {
    style: request.data,
    missing,
    failed: request.error !== undefined && !missing,
    reload: request.reload,
  };
}
