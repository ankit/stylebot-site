import { type Inputs, useEffect, useRef, useState } from 'preact/hooks';

type RequestState<T> = {
  data: T | undefined;
  error: unknown;
  loading: boolean;
};

// Results loaded this visit, by key.
const cache = new Map<string, unknown>();

/**
 * Runs a request whenever `deps` change, or reads its result from the cache by
 * `key`. Stale results are dropped.
 */
export function useRequest<T>(
  request: () => Promise<T>,
  deps: Inputs = [],
  key?: string,
) {
  let cached: T | undefined;

  if (key) {
    cached = cache.get(key) as T | undefined;
  }

  const [state, setState] = useState<RequestState<T>>({
    data: cached,
    error: undefined,
    loading: cached === undefined,
  });
  const latest = useRef(0);

  const reload = () => {
    const id = ++latest.current;

    setState((prev) => ({ ...prev, error: undefined, loading: true }));
    request().then(
      (data) => {
        if (key) {
          cache.set(key, data);
        }

        if (id === latest.current) {
          setState({ data, error: undefined, loading: false });
        }
      },
      (error: unknown) => {
        if (id === latest.current) {
          setState((prev) => ({ ...prev, error, loading: false }));
        }
      },
    );
  };

  useEffect(() => {
    if (key && cache.has(key)) {
      latest.current++;
      setState({ data: cache.get(key) as T, error: undefined, loading: false });

      return;
    }

    reload();
    // The caller's deps say when the request changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, reload };
}
