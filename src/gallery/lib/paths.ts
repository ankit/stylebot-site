import { type Locale, localizePath } from '@/i18n/locales';

export const styleHref = (
  locale: Locale,
  style: { id: number; slug: string },
) =>
  localizePath(locale, `/style/${style.id}/${encodeURIComponent(style.slug)}`);

export const authorHref = (locale: Locale, username: string) =>
  localizePath(locale, `/author/${encodeURIComponent(username)}`);

export const siteHref = (locale: Locale, site: string) =>
  localizePath(locale, `/site/${encodeURIComponent(site)}`);

export const sitesHref = (locale: Locale) => localizePath(locale, '/sites');

export const editHref = (locale: Locale, style: { id: number }) =>
  localizePath(locale, `/edit/${style.id}`);
