import { useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';

import { styleHref } from '@/gallery/lib/paths';

import { type Locale } from '@/i18n/locales';

/**
 * Puts the style's current slug in the address once the style with this ID
 * loads.
 */
export function useSlugRedirect(
  style: { id: number; slug: string } | undefined,
  { id, slug }: { id: string; slug?: string },
  locale: Locale,
) {
  const { route } = useLocation();

  useEffect(() => {
    if (style?.id === Number(id) && style.slug !== slug) {
      route(styleHref(locale, style) + location.search, true);
    }
  }, [style, id, slug, locale, route]);
}
