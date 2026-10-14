# stylebot-site

The [stylebot.dev](https://stylebot.dev) site for the Stylebot browser extension (github.com/ankit/stylebot): Astro, with Preact islands for the interactive pieces. Node 24 (`.nvmrc`).

## Structure

- `src/pages/[...lang]/` — every page, once per locale; English has no prefix
- `src/components/`, `src/layouts/`, `src/styles/`, `src/lib/` — shared pieces; `components/demo` and `components/cli` are the landing page's demos
- `src/i18n/<locale>/` — the string catalogs: `site.ts` for pages, `demo.ts` for the hero demo
- `src/assets/` — images; `gallery/`, `manual/` and `tour/` are screenshots taken with the extension repo's capture scripts and copied here (see README)
- `scripts/` — `check-messages.ts`, `extension-terms.ts` and `migrate-messages.ts`, for the catalogs; `extension-strings.json` is a snapshot of the extension's strings, refreshed with `yarn sync:extension-strings`
- `public/` — copied as is; `CNAME` keeps the stylebot.dev domain on GitHub Pages

## Commands

- `yarn dev` — dev server
- `yarn run check` — type check, catalogs against English, and extension wording (not `yarn check`, Yarn's own command)
- `npx prettier --check "src/**/*.{ts,tsx,astro}" "scripts/*.ts" astro.config.mjs` — formatting, as CI checks it
- `yarn build` — build into `dist/`
- `yarn deploy` — build and publish to the `gh-pages` branch, which serves stylebot.dev

## i18n

Never hardcode user-facing strings: add them to `src/i18n/en/` and translate them into every locale with the `translate` skill. `yarn run check` fails until every locale has them.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/): `<type>[optional scope]: <description>`, e.g. `fix: keep the header on one line in German`.

## Comments

Avoid comments by default. Only add one to state something non-obvious — a hidden constraint, a workaround, a reason that isn't clear from the code itself. Never add comments in CSS. Keep a comment to 1-2 lines.
