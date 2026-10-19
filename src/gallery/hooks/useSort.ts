import { type Sort } from '@/gallery/lib/api';

import { useQueryParam } from './useQueryParam';

const SORTS: Array<Sort> = ['popular', 'new'];

/**
 * The sort in the page's address, ?sort=new, and a setter that updates it.
 */
export function useSort() {
  const [param, setParam] = useQueryParam('sort', 'popular');
  const sort = SORTS.find((s) => s === param) ?? 'popular';

  return [sort, (next: Sort) => setParam(next)] as const;
}
