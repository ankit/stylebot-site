import { writeFileSync } from 'node:fs';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import { API_ORIGIN } from './src/gallery/lib/api.ts';
import {
  DEFAULT_LOCALE,
  LOCALES,
  unlocalizedPath,
} from './src/i18n/locales.ts';

const UNLISTED = ['/welcome/', '/goodbye/', '/404/'];

const REDIRECTS = { '/help': '/manual/' };

// Cloudflare Pages reads these from dist/. Astro's own redirect pages stay as
// a fallback for the dev server.
const pages = {
  name: 'pages-config',
  hooks: {
    'astro:build:done': ({ dir }) => {
      writeFileSync(
        new URL('_headers', dir),
        "/*\n  Content-Security-Policy: frame-ancestors 'none'\n  X-Content-Type-Options: nosniff\n",
      );

      writeFileSync(
        new URL('_redirects', dir),
        Object.entries(REDIRECTS)
          .map(([from, to]) => `${from} ${to} 301\n${from}/ ${to} 301\n`)
          .join(''),
      );
    },
  },
};

export default defineConfig({
  site: 'https://stylebot.dev',
  srcDir: './src/www',
  publicDir: './src/www/public',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [
    preact(),
    pages,
    sitemap({
      filter: (page) =>
        !UNLISTED.includes(unlocalizedPath(new URL(page).pathname)),
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: Object.fromEntries(LOCALES.map((l) => [l.code, l.lang])),
      },
    }),
  ],
  image: { domains: [new URL(API_ORIGIN).hostname] },
  redirects: REDIRECTS,
});
