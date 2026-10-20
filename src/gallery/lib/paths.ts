import { type Locale, localizePath } from '@/i18n/locales';

export const styleHref = (
  locale: Locale,
  style: { group: string; slug: string },
) =>
  localizePath(
    locale,
    `/s/${encodeURIComponent(style.group)}/${encodeURIComponent(style.slug)}`,
  );

export const authorHref = (locale: Locale, username: string) =>
  localizePath(locale, `/u/${encodeURIComponent(username)}`);

export const siteHref = (locale: Locale, group: string) =>
  localizePath(locale, `/s/${encodeURIComponent(group)}`);

export const sitesHref = (locale: Locale) => localizePath(locale, '/sites');
