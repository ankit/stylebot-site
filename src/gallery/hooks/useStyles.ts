import { listStyles, type Sort } from '@/gallery/lib/api';

import { usePages } from './usePages';

const PAGE = 24;

type Filter = {
  search: string;
  sort: Sort;
  // A site group, such as github; all sites when left out.
  group?: string;
};

/**
 * The styles matching a filter, loaded a page at a time.
 */
export function useStyles({ search, sort, group = '' }: Filter) {
  return usePages(
    (offset) =>
      listStyles({ q: search, group, sort, limit: PAGE, offset }).then(
        (page) => ({ items: page.styles, next: page.nextOffset }),
      ),
    JSON.stringify([search, sort, group]),
  );
}
