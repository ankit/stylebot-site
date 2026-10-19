import { useEffect } from 'preact/hooks';

import { localeOf, localizePath, unlocalizedPath } from '@/i18n/locales';

type Options = { noindex?: boolean };

/**
 * Sets the tab's title once it's known, and points the canonical URL, the
 * other languages' links and robots at the route shown, since one built page
 * serves every route.
 */
export function usePageMeta(title: string | undefined, options: Options = {}) {
  const { noindex = false } = options;

  useEffect(() => {
    if (!title) {
      return;
    }

    const url = location.origin + location.pathname;
    const path = unlocalizedPath(location.pathname);

    document.title = title;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute('content', url);

    for (const link of document.querySelectorAll<HTMLLinkElement>(
      'link[rel="alternate"][hreflang]',
    )) {
      const locale = localeOf(new URL(link.href).pathname);

      link.href = location.origin + localizePath(locale, path);
    }

    document.querySelector('meta[name="robots"]')?.remove();

    if (noindex) {
      const robots = document.createElement('meta');

      robots.name = 'robots';
      robots.content = 'noindex';
      document.head.appendChild(robots);
    }
  }, [title, noindex]);
}
