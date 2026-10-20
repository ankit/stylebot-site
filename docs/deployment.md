# Deployment

## stylebot.dev

```
yarn deploy
```

Builds and pushes `dist/` to the `gh-pages` branch, which GitHub Pages serves at stylebot.dev (`src/www/public/CNAME`). `src/www/public/.nojekyll` keeps GitHub Pages from dropping the `_astro/` directory, and `src/www/public/sw.js` unregisters the service worker left behind by the old Gatsby site.

The extension links to `/help` (now a redirect to `/manual`), `/goodbye` (the uninstall page), `/privacy` and `/releases/<major.minor>`, so keep those URLs working.

## gallery.stylebot.dev

```
yarn deploy:gallery
```

Builds `dist-gallery/` and uploads it, with the Pages Functions in `functions/`, to the `stylebot-gallery` Cloudflare Pages project, which serves gallery.stylebot.dev. Connecting the project to this repository instead (build command `yarn build:gallery`, output `dist-gallery`, Node 24) deploys every push to `main` the same way.

Until launch the gallery stays private:

- A Cloudflare Access application covers `gallery.stylebot.dev` and `*.stylebot-gallery.pages.dev`, letting in only the emails on its policy.
- Every response carries `X-Robots-Tag: noindex`: the build writes it to `_headers` for the static files, and `functions/_middleware.ts` adds it to the pages the functions serve.

To launch, set the Pages environment variable `GALLERY_PUBLIC` to `true` (for the build and the functions) and redeploy, then delete the Access application and submit `https://gallery.stylebot.dev/sitemap.xml` to search engines.
