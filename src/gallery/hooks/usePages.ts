import { useEffect, useRef, useState } from 'preact/hooks';

export type Page<T> = { items: Array<T>; next: number | null };

// Lists loaded this visit, by key.
const cache = new Map<string, Page<unknown>>();

/**
 * A list loaded a page at a time, reloaded when `key` changes, or taken from
 * the cache. Old items stay, `refreshing`, until the new first page arrives.
 */
export function usePages<T>(
  fetchPage: (offset: number) => Promise<Page<T>>,
  key: string,
) {
  const cached = cache.get(key) as Page<T> | undefined;
  const [items, setItems] = useState<Array<T>>(cached?.items ?? []);
  const [next, setNext] = useState<number | null>(cached?.next ?? null);
  // The offset of the page being loaded, or null when none is.
  const [loadingOffset, setLoadingOffset] = useState<number | null>(() => {
    if (cached) {
      return null;
    }

    return 0;
  });
  const [error, setError] = useState<unknown>();
  const latest = useRef(0);
  const lastOffset = useRef(0);
  const itemsNow = useRef(items);

  itemsNow.current = items;

  const load = (offset: number) => {
    const id = ++latest.current;

    lastOffset.current = offset;
    setLoadingOffset(offset);
    setError(undefined);
    fetchPage(offset).then(
      (page) => {
        if (id === latest.current) {
          let all = page.items;

          if (offset > 0) {
            all = [...itemsNow.current, ...page.items];
          }

          cache.set(key, { items: all, next: page.next });
          setItems(all);
          setNext(page.next);
          setLoadingOffset(null);
        }
      },
      (e: unknown) => {
        if (id === latest.current) {
          if (offset === 0) {
            setItems([]);
          }

          setError(e);
          setLoadingOffset(null);
        }
      },
    );
  };

  useEffect(() => {
    const hit = cache.get(key) as Page<T> | undefined;

    if (!hit) {
      setNext(null);
      load(0);

      return;
    }

    latest.current++;
    setItems(hit.items);
    setNext(hit.next);
    setLoadingOffset(null);
    setError(undefined);
    // A new key is a new list; fetchPage changes with it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return {
    items,
    loading: loadingOffset !== null,
    refreshing: loadingOffset === 0 && items.length > 0,
    error,
    hasMore: next !== null,
    more: () => {
      if (next !== null && loadingOffset === null && !error) {
        load(next);
      }
    },
    retry: () => load(lastOffset.current),
  };
}
