import { defineMiddleware } from 'astro:middleware';

import {
  catalog,
  htmlLang,
  islandStrings,
  localeOf,
  localizePath,
  translator,
} from '@/i18n';

/**
 * Puts the page's locale on Astro.locals, read from its locale prefix, with
 * `t` for its strings, `strings` for an island's, `lang` for <html lang> and
 * Intl, and `path` for links.
 */
export const onRequest = defineMiddleware(({ url, locals }, next) => {
  const locale = localeOf(url.pathname);

  Object.assign(locals, {
    locale,
    lang: htmlLang(locale),
    path: (to: string) => localizePath(locale, to),
    t: translator(catalog(locale)),
    strings: (...paths: Array<string>) => islandStrings(locale, ...paths),
  });

  return next();
});
