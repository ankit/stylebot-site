import { type Locale, localizePath } from '@/i18n/locales';

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
