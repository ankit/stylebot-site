import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';

import { listStyles } from '@/gallery/lib/api';
import { siteHref, styleHref } from '@/gallery/lib/paths';

import { type Locale } from '@/i18n/locales';

type Route = { group: string; slug?: string };

/**
 * Sends /s/github.com to /s/github when nothing was found under a hostname.
 * True until it's known there's nowhere to go.
 */
export function useGroupRedirect(
  missing: boolean,
  { group, slug }: Route,
  locale: Locale,
) {
  const { route } = useLocation();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    if (!missing) {
      return;
    }

    if (!group.includes('.')) {
      setRedirecting(false);

      return;
    }

    listStyles({ site: group, limit: 1 })
      .then(({ styles }) => {
        const actual = styles[0]?.group;

        if (!actual || actual === group) {
          setRedirecting(false);

          return;
        }

        let path = siteHref(locale, actual);

        if (slug) {
          path = styleHref(locale, { group: actual, slug });
        }

        route(path + location.search, true);
      })
      .catch(() => setRedirecting(false));
  }, [missing, group, slug, locale, route]);

  return redirecting;
}
