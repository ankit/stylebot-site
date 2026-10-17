import { useEffect, useRef } from 'preact/hooks';

// How far below the viewport to start loading, so the next page is usually in
// before the reader gets there.
const AHEAD = '800px';

/**
 * Calls `onVisible` when it scrolls within reach of the viewport, and again
 * after each render while it stays there, so short pages keep filling in.
 */
export default function ScrollSentinel({
  onVisible,
}: {
  onVisible: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && onVisible(),
      { rootMargin: `0px 0px ${AHEAD}` },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [onVisible]);

  return <div ref={ref} aria-hidden="true" />;
}
