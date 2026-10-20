import { listSites } from '@/gallery/lib/api';

import { useRequest } from './useRequest';

/**
 * Every site group with published styles, most installed first.
 */
export function useSites() {
  return useRequest(() => listSites().then((r) => r.sites), [], 'sites');
}
