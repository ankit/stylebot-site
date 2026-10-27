import { useEffect } from 'preact/hooks';

import { type useRegionDraw } from '@/gallery/hooks/useRegionDraw';

/**
 * Keys for blurring a screenshot: Escape cancels a drag before it closes the
 * dialog, and Enter is Done, except on an area's remove button.
 */
export function useBlurKeys(
  draw: ReturnType<typeof useRegionDraw>,
  onDone: () => void,
) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && draw.drawing) {
        e.preventDefault();
        draw.cancel();

        return;
      }

      const onRemove =
        e.target instanceof Element &&
        e.target.closest('.screenshot-blur-remove');

      if (e.key === 'Enter' && !onRemove) {
        e.preventDefault();
        onDone();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [draw, onDone]);
}
