import { useEffect } from 'preact/hooks';

/**
 * Sets the tab's title once it's known, and points the canonical URL at the
 * address the page is shown at, since one built page serves every style.
 */
export function usePageMeta(title: string | undefined) {
  useEffect(() => {
    if (!title) {
      return;
    }

    const url = location.origin + location.pathname;

    document.title = title;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute('content', url);
  }, [title]);
}
