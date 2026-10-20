import { listStyles, type Sort } from '@/gallery/lib/api';

import { usePages } from './usePages';

const PAGE = 24;

type Filter = {
  search: string;
  sort: Sort;
  // A hostname, such as github.com; all sites when left out.
  site?: string;
  // An author's username; everyone when left out.
  author?: string;
};

/**
 * The styles matching a filter, loaded a page at a time.
 */
export function useStyles({ search, sort, site = '', author = '' }: Filter) {
  return usePages(
    (offset) =>
      listStyles({ q: search, site, author, sort, limit: PAGE, offset }).then(
        (page) => ({ items: page.styles, next: page.nextOffset }),
      ),
    JSON.stringify([search, sort, site, author]),
  );
}
