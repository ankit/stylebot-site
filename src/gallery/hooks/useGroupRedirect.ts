import { useEffect, useState } from 'preact/hooks';

import { listStyles } from '@/gallery/lib/api';
import { galleryRoute, siteHref, styleHref } from '@/gallery/lib/paths';

import { localeOf } from '@/i18n/locales';

/**
 * Sends /s/github.com to /s/github when nothing was found under a hostname.
 * True until it's known there's nowhere to go.
 */
export function useGroupRedirect(missing: boolean) {
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    if (!missing) {
      return;
    }

    const { group, slug } = galleryRoute();

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

        const locale = localeOf(location.pathname);
        let path = siteHref(locale, actual);

        if (slug) {
          path = styleHref(locale, { group: actual, slug });
        }

        location.replace(path + location.search);
      })
      .catch(() => setRedirecting(false));
  }, [missing]);

  return redirecting;
}
