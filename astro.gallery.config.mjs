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
 * /sites, /s/<group>, /s/<group>/<slug>, /u/<username> and /mine.
 */
const rewrite = (path) => {
  const match = path.match(
    /^(\/[a-z-]+)?\/(s\/[^/]+(\/[^/]+)?|u\/[^/]+|mine|sites)\/?$/,
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
    // Cloudflare Pages rewrites, which keep the address and a 200 status.
    'astro:build:done': ({ dir }) => {
      const lines = PREFIXES.flatMap((p) => [
        `${p}/s/* ${p}/ 200`,
        `${p}/u/* ${p}/ 200`,
        `${p}/mine ${p}/ 200`,
        `${p}/sites ${p}/ 200`,
      ]);

      writeFileSync(new URL('_redirects', dir), `${lines.join('\n')}\n`);
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
