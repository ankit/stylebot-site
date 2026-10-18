import { type Locale, localizePath, unlocalizedPath } from '@/i18n/locales';

export const styleHref = (
  locale: Locale,
  style: { group: string; slug: string },
) =>
  localizePath(
    locale,
    `/s/${encodeURIComponent(style.group)}/${encodeURIComponent(style.slug)}`,
  );

/**
 * The site group and style slug in this page's address, /s/<group>/<slug>,
 * which the host serves the style page for.
 */
export function styleRoute() {
  const [, , group = '', slug = ''] = unlocalizedPath(location.pathname).split(
    '/',
  );

  return { group: decodeURIComponent(group), slug: decodeURIComponent(slug) };
}
