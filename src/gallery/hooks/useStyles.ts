import { listStyles, type Sort } from '@/gallery/lib/api';

import { usePages } from './usePages';

const PAGE = 24;

/**
 * The styles matching `search`, in `sort` order, loaded a page at a time.
 * Waits while either is null, as before the island has read the address.
 */
export function useStyles(search: string | null, sort: Sort | null) {
  return usePages(
    (offset) =>
      listStyles({
        q: search ?? '',
        sort: sort ?? 'popular',
        limit: PAGE,
        offset,
      }).then((page) => ({ items: page.styles, next: page.nextOffset })),
    [search, sort],
    search !== null && sort !== null,
  );
}
