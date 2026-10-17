import { useEffect, useState } from 'preact/hooks';

import { type Sort } from '@/gallery/lib/api';

const SORTS: Array<Sort> = ['popular', 'new'];

function sortFromUrl() {
  const param = new URLSearchParams(location.search).get('sort');

  return SORTS.find((sort) => sort === param) ?? 'popular';
}

function setSortInUrl(sort: Sort) {
  const url = new URL(location.href);

  if (sort === 'popular') {
    url.searchParams.delete('sort');
  } else {
    url.searchParams.set('sort', sort);
  }

  history.replaceState(null, '', url);
}

/**
 * The sort in the page's address, ?sort=new, and a setter that updates both.
 * It's null until the island runs, since the page is built without the
 * address.
 */
export function useSort() {
  const [sort, setSort] = useState<Sort | null>(null);

  useEffect(() => setSort(sortFromUrl()), []);

  const changeSort = (value: Sort) => {
    setSort(value);
    setSortInUrl(value);
  };

  return [sort, changeSort] as const;
}
