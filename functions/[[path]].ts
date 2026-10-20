import { LOCALES } from '@/i18n';

import { type Env } from './_lib/api';
import { preview } from './_lib/preview';
import { cached, localeSitemap, sitemapIndex } from './_lib/sitemap';

/**
 * The sitemaps and the sites, site, style and author pages. _routes.json,
 * written by the build, keeps every other request on the static files.
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const { pathname } = new URL(request.url);

  if (pathname === '/sitemap.xml') {
    return cached(context, () => sitemapIndex(request));
  }

  const locale = LOCALES.find((l) => pathname === `/sitemap-${l.code}.xml`);

  if (locale) {
    return cached(context, () => localeSitemap(request, env, locale.code));
  }

  return (await preview(request, env)) ?? context.next();
};
