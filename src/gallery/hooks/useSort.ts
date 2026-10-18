import { type Sort } from '@/gallery/lib/api';

import { useQueryParam } from './useQueryParam';

const SORTS: Array<Sort> = ['popular', 'new'];

function sortOf(param: string | null) {
  if (param === null) {
    return null;
  }

  return SORTS.find((sort) => sort === param) ?? 'popular';
}

/**
 * The sort in the page's address, ?sort=new, and a setter that updates both.
 * It's null until the island runs.
 */
export function useSort() {
  const [param, setParam] = useQueryParam('sort', 'popular');

  return [sortOf(param), (sort: Sort) => setParam(sort)] as const;
}
