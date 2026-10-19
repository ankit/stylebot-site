import { useEffect, useState } from 'preact/hooks';

/**
 * `value`, once it has stopped changing for `ms`. The first value comes
 * through at once.
 */
export function useDebounced<T>(value: T, ms: number) {
  const [settled, setSettled] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), ms);

    return () => clearTimeout(timer);
  }, [value, ms]);

  return settled;
}
