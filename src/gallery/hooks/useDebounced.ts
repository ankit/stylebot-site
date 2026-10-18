import { useEffect, useState } from 'preact/hooks';

/**
 * `value`, once it has stopped changing for `ms`. The first value that isn't
 * null, such as one read from the address as the island starts, comes through
 * at once.
 */
export function useDebounced<T>(value: T | null, ms: number) {
  const [settled, setSettled] = useState(value);

  useEffect(() => {
    if (settled === null) {
      setSettled(value);

      return;
    }

    const timer = setTimeout(() => setSettled(value), ms);

    return () => clearTimeout(timer);
  }, [value, ms, settled]);

  return settled;
}
