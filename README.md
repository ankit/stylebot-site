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
- **Screenshots.** The screenshots in `src/assets/` are taken from a build of the extension by its `capture:*` scripts, which save them in the extension repo's `captures/`. Copy them here by hand. The gallery's themes live only here, in `src/assets/gallery/<site>/<theme>.css`. The extension's `yarn capture:gallery` reads them from this checkout when it sits beside the extension's, or from the directory after `--themes`; pointing `--out` at the same directory saves each image beside its CSS.

## Deployment

```
yarn deploy
```

Builds and pushes `dist/` to the `gh-pages` branch, which GitHub Pages serves at stylebot.dev (`public/CNAME`). `public/.nojekyll` keeps GitHub Pages from dropping the `_astro/` directory, and `public/sw.js` unregisters the service worker left behind by the old Gatsby site.

The extension links to `/help` (now a redirect to `/manual`), `/goodbye` (the uninstall page), `/privacy` and `/releases/<major.minor>`, so keep those URLs working.
