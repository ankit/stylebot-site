import { type Locale, localizePath, unlocalizedPath } from '@/i18n/locales';

export const styleHref = (
  locale: Locale,
  style: { group: string; slug: string },
) =>
  localizePath(
    locale,
    `/s/${encodeURIComponent(style.group)}/${encodeURIComponent(style.slug)}`,
  );

export const siteHref = (locale: Locale, group: string) =>
  localizePath(locale, `/s/${encodeURIComponent(group)}`);

/**
 * The group and slug in this page's address, /s/<group>[/<slug>].
 */
export function galleryRoute() {
  const [, , group = '', slug = ''] = unlocalizedPath(location.pathname).split(
    '/',
  );

  return { group: decodeURIComponent(group), slug: decodeURIComponent(slug) };
}
