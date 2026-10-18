import { type RefObject } from 'preact';
import { useEffect } from 'preact/hooks';

/**
 * Focuses `ref` when / is pressed, unless the reader is typing somewhere, and
 * leaves it on Escape, keeping what was typed.
 */
export function useSearchShortcut(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      if (e.key === 'Escape' && target === ref.current) {
        e.preventDefault();
        ref.current.blur();

        return;
      }

      if (
        e.key === '/' &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !target.closest('input, textarea, select, [contenteditable]')
      ) {
        e.preventDefault();
        ref.current?.focus();
      }
    };

    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, [ref]);
}
