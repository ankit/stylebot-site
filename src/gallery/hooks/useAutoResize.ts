import { type RefObject } from 'preact';
import { useLayoutEffect } from 'preact/hooks';

/**
 * Grows and shrinks a textarea to fit `value`, never below its `rows`.
 */
export function useAutoResize(
  ref: RefObject<HTMLTextAreaElement>,
  value: string,
) {
  useLayoutEffect(() => {
    const textarea = ref.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = 'auto';
    const borders = textarea.offsetHeight - textarea.clientHeight;

    textarea.style.height = `${textarea.scrollHeight + borders}px`;
  }, [ref, value]);
}
