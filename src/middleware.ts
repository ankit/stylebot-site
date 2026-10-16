import { defineMiddleware } from 'astro:middleware';

import { htmlLang, localeOf, localizePath, messages } from '@/i18n';

/**
 * Puts the page's locale and string catalogs on Astro.locals, read from its
 * locale prefix, with `lang` for <html lang> and Intl and `path` for links.
 */
export const onRequest = defineMiddleware(({ url, locals }, next) => {
  const locale = localeOf(url.pathname);

  Object.assign(locals, {
    locale,
    lang: htmlLang(locale),
    path: (to: string) => localizePath(locale, to),
    ...messages(locale),
  });

  return next();
});
