import { useDebounced } from './useDebounced';
import { useQueryParam } from './useQueryParam';

const SEARCH_DELAY_MS = 250;

/**
 * The search in the page's address, ?q=, as typed (`query`, for the search
 * box) and trimmed once typing pauses (`search`, for the request). Both are
 * null until the island runs.
 */
export function useSearch() {
  const [query, setQuery] = useQueryParam('q');
  const search = useDebounced(query?.trim() ?? null, SEARCH_DELAY_MS);

  return { query, setQuery, search };
}
