import { type Inputs, useEffect, useRef, useState } from 'preact/hooks';

type RequestState<T> = {
  data: T | undefined;
  error: unknown;
  loading: boolean;
};

/**
 * Runs a request when the island starts and whenever `deps` change. Answers to
 * requests that a newer one replaced are dropped.
 */
export function useRequest<T>(request: () => Promise<T>, deps: Inputs = []) {
  const [state, setState] = useState<RequestState<T>>({
    data: undefined,
    error: undefined,
    loading: true,
  });
  const latest = useRef(0);

  const reload = () => {
    const id = ++latest.current;

    setState((prev) => ({ ...prev, error: undefined, loading: true }));
    request().then(
      (data) => {
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
    reload();
    // The caller's deps say when the request changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, reload };
}
