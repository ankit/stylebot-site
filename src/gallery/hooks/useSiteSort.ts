import { useQueryParam } from './useQueryParam';

export type SiteSort = 'popular' | 'name';

const SORTS: Array<SiteSort> = ['popular', 'name'];

/**
 * The sites page's sort in its address, ?sort=name, and a setter that updates
 * it.
 */
export function useSiteSort() {
  const [param, setParam] = useQueryParam('sort', 'popular');
  const sort = SORTS.find((s) => s === param) ?? 'popular';

  return [sort, (next: SiteSort) => setParam(next)] as const;
}
