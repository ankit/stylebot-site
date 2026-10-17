import { type Locale, localizePath } from '@/i18n/locales';

export const styleHref = (
  locale: Locale,
  style: { group: string; slug: string },
) =>
  localizePath(
    locale,
    `/s/${encodeURIComponent(style.group)}/${encodeURIComponent(style.slug)}`,
  );

export const faviconUrl = (site: string) =>
  `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(site)}`;
