# stylebot-site

Source for [stylebot.dev](https://stylebot.dev/), the website of the [Stylebot](https://github.com/ankit/stylebot) browser extension, built with [Astro](https://astro.build/). The interactive pieces (the hero demo, theme menu and logo) are Preact islands; everything else is static HTML.

Uses Node 24 (see `.nvmrc`).

## Development

```
yarn install
yarn dev
```

## Build

```
yarn build      # outputs to dist/
yarn preview    # serves dist/ locally
yarn run check  # type check, translations against English, and extension wording
```

Use `yarn run check`, not `yarn check`, which is Yarn's own command.

## The extension

The site doesn't depend on the extension's repo, but borrows from it in two ways:

- **Its wording.** Mock UI on the site uses the extension's own translations, which `yarn run check` checks against `scripts/extension-strings.json`, a snapshot of the extension's strings. `yarn sync:extension-strings` refreshes it from github.com/ankit/stylebot (`--from <ref>` for a branch or tag other than `main`); commit the result.
- **Screenshots.** The gallery, manual and phone tour images in `src/assets/` are taken from a build of the extension by its `yarn capture:gallery`, `yarn capture:manual` and `yarn capture:store --phone`, which save them in the extension repo's `captures/`. Copy them here by hand. The extension keeps its own copies of the gallery themes it shoots, in `scripts/capture/themes/`, so a theme's CSS changed here needs changing there too.

Development builds of the extension also run the stylebot.dev bridge on `localhost`, so gallery installs work against `yarn dev`.

## Deployment

```
yarn deploy
```

Builds and pushes `dist/` to the `gh-pages` branch, which GitHub Pages serves at stylebot.dev (`public/CNAME`). `public/.nojekyll` keeps GitHub Pages from dropping the `_astro/` directory, and `public/sw.js` unregisters the service worker left behind by the old Gatsby site.

The extension links to `/help` (now a redirect to `/manual`), `/goodbye` (the uninstall page), `/privacy` and `/releases/<major.minor>`, so keep those URLs working.

## Layout, and the gallery to come

A second site, the style gallery at gallery.stylebot.dev, is planned for this repo, sharing the landing site's components, layouts and i18n. When it lands, the repo becomes a Yarn workspace:

```
sites/landing/    this site (stylebot.dev), moved from the root
sites/gallery/    gallery.stylebot.dev
shared/           components, layouts, styles and i18n both use
```

Until then, keep what the gallery would reuse (the header, footer, `Base` layout, theme and language menus, `src/i18n`) free of landing-page specifics, so it can move into `shared/` as is.
