import { listStyles, type Sort } from '@/gallery/lib/api';

import { usePages } from './usePages';

const PAGE = 24;

type Filter = {
  search: string | null;
  sort: Sort | null;
  // A site group, such as github; all sites when left out.
  group?: string | null;
};

/**
 * The styles matching a filter, loaded a page at a time. Waits while any part
 * of it is null, as before the island has read the address.
 */
export function useStyles({ search, sort, group = '' }: Filter) {
  return usePages(
    (offset) =>
      listStyles({
        q: search ?? '',
        group: group ?? '',
        sort: sort ?? 'popular',
        limit: PAGE,
        offset,
      }).then((page) => ({ items: page.styles, next: page.nextOffset })),
    [search, sort, group],
    search !== null && sort !== null && group !== null,
  );
}
