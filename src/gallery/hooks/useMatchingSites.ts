import { useMemo } from 'preact/hooks';

import { type Site } from '@/gallery/lib/api';

import { type SiteSort } from './useSiteSort';

const matches = (site: Site, filter: string) =>
  site.group.includes(filter) ||
  site.hosts.some((host) => host.site.includes(filter));

/**
 * The sites whose name or hostnames contain `query`, in `sort` order. They
 * arrive most installed first.
 */
export function useMatchingSites(
  sites: Array<Site> | undefined,
  query: string,
  sort: SiteSort,
) {
  return useMemo(() => {
    const filter = query.trim().toLowerCase();
    const found = (sites ?? []).filter((site) => matches(site, filter));

    if (sort === 'name') {
      found.sort((a, b) => a.group.localeCompare(b.group));
    }

    return found;
  }, [sites, query, sort]);
}
