import { type Inputs, useEffect, useRef, useState } from 'preact/hooks';

export type Page<T> = { items: Array<T>; next: number | null };

/**
 * A list loaded a page at a time, starting over from offset 0 whenever
 * `deps` change. `more` loads the next page; `retry` repeats a failed one.
 * Answers to requests that a newer one replaced are dropped.
 */
export function usePages<T>(
  fetchPage: (offset: number) => Promise<Page<T>>,
  deps: Inputs = [],
) {
  const [items, setItems] = useState<Array<T>>([]);
  const [next, setNext] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const latest = useRef(0);
  const lastOffset = useRef(0);

  const load = (offset: number) => {
    const id = ++latest.current;

    lastOffset.current = offset;
    setLoading(true);
    setError(undefined);
    fetchPage(offset).then(
      (page) => {
        if (id === latest.current) {
          setItems((prev) =>
            offset === 0 ? page.items : [...prev, ...page.items],
          );
          setNext(page.next);
          setLoading(false);
        }
      },
      (e: unknown) => {
        if (id === latest.current) {
          setError(e);
          setLoading(false);
        }
      },
    );
  };

  useEffect(() => {
    load(0);
    // The caller's deps say when the list changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    items,
    loading,
    error,
    hasMore: next !== null,
    more: () => {
      if (next !== null && !loading && !error) {
        load(next);
      }
    },
    retry: () => load(lastOffset.current),
  };
}
