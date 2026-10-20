import { useEffect, useState } from 'preact/hooks';

/**
 * How many of a list to show, `step` at first and `step` more each time
 * `more` is called, back to `step` when `key` changes.
 */
export function useRevealed(step: number, key: string) {
  const [count, setCount] = useState(step);

  useEffect(() => setCount(step), [step, key]);

  return [count, () => setCount((n) => n + step)] as const;
}
