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

export default defineConfig({
  site: 'https://stylebot.dev',
  srcDir: './src/www',
  publicDir: './src/www/public',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [
    preact(),
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
  redirects: { '/help': '/manual/' },
});
