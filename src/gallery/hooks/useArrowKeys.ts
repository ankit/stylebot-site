import { useEffect } from 'preact/hooks';

/**
 * While `active`, the left and right arrow keys step `index` through `count`
 * items, stopping at either end.
 */
export function useArrowKeys(
  active: boolean,
  index: number,
  count: number,
  onChange: (index: number) => void,
) {
  useEffect(() => {
    if (!active) {
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      let next = index;

      if (e.key === 'ArrowLeft') {
        next = index - 1;
      } else if (e.key === 'ArrowRight') {
        next = index + 1;
      }

      if (next !== index && next >= 0 && next < count) {
        e.preventDefault();
        onChange(next);
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [active, index, count, onChange]);
}
