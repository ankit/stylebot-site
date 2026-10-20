import { useMemo } from 'preact/hooks';

import { type Site } from '@/gallery/lib/api';

import { type SiteSort } from './useSiteSort';

/**
 * The sites whose hostname contains `query`, in `sort` order. They
 * arrive most installed first.
 */
export function useMatchingSites(
  sites: Array<Site> | undefined,
  query: string,
  sort: SiteSort,
) {
  return useMemo(() => {
    const filter = query.trim().toLowerCase();
    const found = (sites ?? []).filter((site) => site.site.includes(filter));

    if (sort === 'name') {
      found.sort((a, b) => a.site.localeCompare(b.site));
    }

    return found;
  }, [sites, query, sort]);
}
