import { writeFileSync } from 'node:fs';
import preact from '@astrojs/preact';
import { defineConfig } from 'astro/config';

import { DEFAULT_LOCALE, LOCALES } from './src/i18n/locales.ts';

const PREFIXES = [
  '',
  ...LOCALES.filter((l) => l.code !== DEFAULT_LOCALE).map((l) => `/${l.code}`),
];

/**
 * The gallery is one app per locale, served at every route it handles:
 * /sites, /site/<hostname>, /style/<id>/<slug>, /author/<username>, /mine,
 * /publish and /edit/<id>.
 */
const rewrite = (path) => {
  const match = path.match(
    /^(\/[a-z-]+)?\/(site\/[^/]+|style\/[^/]+(\/[^/]+)?|author\/[^/]+|edit\/[^/]+|mine|publish|sites)\/?$/,
  );

  if (!match || (match[1] && !PREFIXES.includes(match[1]))) {
    return null;
  }

  return `${match[1] ?? ''}/`;
};

const routes = {
  name: 'gallery-routes',
  hooks: {
    'astro:server:setup': ({ server }) => {
      server.middlewares.use((req, _res, next) => {
        const [path, query] = req.url.split('?');
        const target = rewrite(path);

        if (target) {
          req.url = target + (query ? `?${query}` : '');
        }

        next();
      });
    },
    // On Cloudflare Pages, functions/ serves the sites, site, style and author
    // pages and the sitemaps; rewrites, which keep the address, serve /mine,
    // /publish and /edit.
    'astro:build:done': ({ dir }) => {
      const routes = {
        version: 1,
        include: [
          '/sitemap.xml',
          '/sitemap-*',
          ...PREFIXES.flatMap((p) => [
            `${p}/site/*`,
            `${p}/style/*`,
            `${p}/author/*`,
            `${p}/sites`,
          ]),
        ],
        exclude: [],
      };

      writeFileSync(new URL('_routes.json', dir), JSON.stringify(routes));

      // Until launch, search engines skip the static files too; the functions
      // add the same header to the pages they serve.
      if (process.env.GALLERY_PUBLIC !== 'true') {
        writeFileSync(
          new URL('_headers', dir),
          '/*\n  X-Robots-Tag: noindex\n',
        );
      }

      writeFileSync(
        new URL('_redirects', dir),
        `${PREFIXES.flatMap((p) => [`${p}/mine ${p}/ 200`, `${p}/publish ${p}/ 200`, `${p}/edit/* ${p}/ 200`]).join('\n')}\n`,
      );
    },
  },
};

// gallery.stylebot.dev: its own pages in src/gallery/, built with the landing
// site's components, layouts, styles and i18n from src/.
export default defineConfig({
  site: 'https://gallery.stylebot.dev',
  srcDir: './src/gallery',
  publicDir: './src/gallery/public',
  outDir: './dist-gallery',
  cacheDir: './node_modules/.astro-gallery',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  // Fixed, since Google sign-in only works on origins listed on the OAuth client.
  server: { port: 4400 },
  vite: { server: { strictPort: true } },
  integrations: [preact(), routes],
});
