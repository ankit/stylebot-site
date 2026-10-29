# Deployment

## stylebot.dev

```
yarn deploy
```

Builds `dist/` and uploads it to the `stylebot-www` Cloudflare Pages project, which serves stylebot.dev. It runs `wrangler` from inside `dist/`, since run from the repository root it would upload the gallery's `functions/` too. The build writes `_headers`, with the same `Content-Security-Policy: frame-ancestors 'none'` and `X-Content-Type-Options: nosniff` the gallery sends, and `_redirects`, which turns the redirects in `astro.config.mjs` into 301s. `src/www/public/sw.js` unregisters the service worker left behind by the old Gatsby site.

The extension links to `/help` (now a redirect to `/manual`), `/goodbye` (the uninstall page), `/privacy` and `/releases/<major.minor>`, so keep those URLs working.

## gallery.stylebot.dev

```
yarn deploy:gallery
```

Builds `dist-gallery/` and uploads it, with the Pages Functions in `functions/`, to the `stylebot-gallery` Cloudflare Pages project, which serves gallery.stylebot.dev. Connecting the project to this repository instead (build command `yarn build:gallery`, output `dist-gallery`, Node 24) deploys every push to `main` the same way.
