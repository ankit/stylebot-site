import { useEffect } from 'preact/hooks';

/**
 * Removes the copy of the page the functions render for crawlers, once the
 * app shows its own.
 */
export function useRemoveStaticContent() {
  useEffect(() => {
    document.getElementById('g-static')?.remove();
  }, []);
}
