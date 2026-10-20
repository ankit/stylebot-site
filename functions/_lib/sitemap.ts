import {
  authorHref,
  siteHref,
  sitesHref,
  styleHref,
} from '@/gallery/lib/paths';

import { type Locale, LOCALES, localizePath } from '@/i18n';

import { api, type Env, listStyles, type Site, type Style } from './api';

// Each function call may make 50 requests; this leaves room for /sites.
const MAX_PAGES = 45;
const PAGE_SIZE = 50;
const TIMEOUT = 5000;

const CACHE_CONTROL = 'public, max-age=3600';

const escape = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;',
      })[c]!,
  );

function xml(body: string) {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}\n`, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': CACHE_CONTROL,
    },
  });
}

/**
 * Every live style, a page of the API's list at a time.
 */
async function allStyles(env: Env) {
  const styles: Array<Style> = [];
  let offset: number | null = 0;

  for (let i = 0; i < MAX_PAGES && offset !== null; i++) {
    const page = await listStyles(
      env,
      { sort: 'new', limit: PAGE_SIZE, offset },
      TIMEOUT,
    );

    styles.push(...(page?.styles ?? []));
    offset = page?.nextOffset ?? null;
  }

  return styles;
}

/**
 * The sitemap index: one sitemap per locale, since each lists every page.
 */
export function sitemapIndex(request: Request) {
  const { origin } = new URL(request.url);
  const sitemaps = LOCALES.map(
    ({ code }) =>
      `  <sitemap><loc>${origin}/sitemap-${code}.xml</loc></sitemap>`,
  );

  return xml(
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemaps.join('\n')}\n</sitemapindex>`,
  );
}

/**
 * A locale's home, sites, site, style and author pages. The pages themselves
 * link to their other languages.
 */
export async function localeSitemap(
  request: Request,
  env: Env,
  locale: Locale,
) {
  const { origin } = new URL(request.url);
  const [sites, styles] = await Promise.all([
    api<{ sites: Array<Site> }>(env, '/sites', TIMEOUT),
    allStyles(env),
  ]);
  const authors = new Set(styles.map((s) => s.author.username));
  const entry = (path: string, updatedAt?: number) => {
    const lastmod = updatedAt
      ? `<lastmod>${new Date(updatedAt).toISOString()}</lastmod>`
      : '';

    return `  <url><loc>${escape(origin + path)}</loc>${lastmod}</url>`;
  };

  const urls = [
    entry(localizePath(locale, '/')),
    entry(sitesHref(locale)),
    ...(sites?.sites ?? []).map((s) => entry(siteHref(locale, s.group))),
    ...styles.map((s) => entry(styleHref(locale, s), s.updatedAt)),
    ...[...authors].map((a) => entry(authorHref(locale, a))),
  ];

  return xml(
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`,
  );
}

/**
 * The response from the edge cache, or a fresh one, cached for next time.
 */
export async function cached(
  context: EventContext<Env, string, unknown>,
  make: () => Promise<Response> | Response,
) {
  const cache = caches.default;
  const hit = await cache.match(context.request);

  if (hit) {
    return hit;
  }

  const response = await make();

  if (response.ok) {
    context.waitUntil(cache.put(context.request, response.clone()));
  }

  return response;
}
