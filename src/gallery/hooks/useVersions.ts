import { listVersions } from '@/gallery/lib/api';

import { useRequest } from './useRequest';

/**
 * A style's versions, newest first.
 */
export function useVersions(styleId: number) {
  return useRequest(
    () => listVersions(styleId).then((r) => r.versions),
    [styleId],
  );
}
