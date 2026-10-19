import { type Inputs, useEffect, useRef, useState } from 'preact/hooks';

export type Page<T> = { items: Array<T>; next: number | null };

/**
 * A list loaded a page at a time, starting over from offset 0 whenever
 * `deps` change, once `enabled`. The old items stay until the new first page
 * replaces them, with `refreshing` set meanwhile. `more` loads the next page;
 * `retry` repeats a failed one. Answers to requests that a newer one replaced
 * are dropped.
 */
export function usePages<T>(
  fetchPage: (offset: number) => Promise<Page<T>>,
  deps: Inputs = [],
  enabled = true,
) {
  const [items, setItems] = useState<Array<T>>([]);
  const [next, setNext] = useState<number | null>(null);
  // The offset of the page being loaded, or null when none is.
  const [loadingOffset, setLoadingOffset] = useState<number | null>(0);
  const [error, setError] = useState<unknown>();
  const latest = useRef(0);
  const lastOffset = useRef(0);

  const load = (offset: number) => {
    const id = ++latest.current;

    lastOffset.current = offset;
    setLoadingOffset(offset);
    setError(undefined);
    fetchPage(offset).then(
      (page) => {
        if (id === latest.current) {
          setItems((prev) => {
            if (offset === 0) {
              return page.items;
            }

            return [...prev, ...page.items];
          });
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
    if (enabled) {
      setNext(null);
      load(0);
    }
    // The caller's deps say when the list changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

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
