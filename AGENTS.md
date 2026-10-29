# stylebot-site

The [stylebot.dev](https://stylebot.dev) site for the Stylebot browser extension (github.com/ankit/stylebot): Astro, with Preact islands for the interactive pieces. Node 24 (`.nvmrc`).

## Structure

- `src/www/` — the stylebot.dev site: its `pages/[...lang]/` (every page, once per locale; English has no prefix), the components, lib and styles only it uses (`components/demo` and `components/cli` are the landing page's demos), and `public/`, copied as is
- `functions/` — Cloudflare Pages Functions for gallery.stylebot.dev, whose Pages project builds `yarn build:gallery` into `dist-gallery/` (stylebot.dev, the `stylebot-www` project, doesn't use them): they serve the sitemaps and give the sites, site, style and author pages their own title, description and preview image from the styles API, for crawlers that don't run the app. The `_routes.json` the gallery build writes sends only those paths to them. They have their own `tsconfig.json`, with the Workers types; `yarn preview:pages` builds the gallery and serves it with them through `wrangler pages dev`
- `src/components/`, `src/layouts/`, `src/styles/`, `src/lib/` — pieces shared by every site: the header, footer, base layout, tokens and links
- `src/theme/` — the site themes: their tokens, the menu that switches them, and the head script that applies the saved one before first paint
- `src/i18n/` — `t()`, the locales and the middleware that puts them on `Astro.locals`; `catalogs/<locale>.json` holds each locale's translations keyed by the English text, and `source.json`, generated, lists every message with its note and the files that use it
- `src/assets/` — images; `gallery/`, `manual/` and `tour/` are screenshots taken with the extension repo's capture scripts and copied here (see docs/extension.md)
- `scripts/` — `extract-messages.ts`, `check-messages.ts` and `extension-terms.ts`, for the catalogs; `extension-strings.json` is a snapshot of the extension's strings, refreshed with `yarn sync:extension-strings`

## Commands

- `yarn dev` — dev server
- `yarn run check` — type check, catalogs against the code's messages, and extension wording (not `yarn check`, Yarn's own command)
- `yarn extract:messages` — refresh `src/i18n/source.json` after adding or changing a `t()` string
- `yarn format` — format everything with Prettier; `yarn format:check` checks it, as CI does
- `yarn lint` — ESLint, as CI runs it; `yarn lint --fix` fixes what it can, such as import order
- `yarn build` — build into `dist/`
- `yarn deploy` — build and upload `dist/` to the `stylebot-www` Cloudflare Pages project, which serves stylebot.dev
- `yarn deploy:gallery` — build the gallery and upload it to its Cloudflare Pages project; it tells search engines to skip it until `GALLERY_PUBLIC=true`

## i18n

Never hardcode user-facing strings: write the English inline as `t('Text with {name}', { name })`, with `t` from `Astro.locals` (islands get theirs from a `strings` prop, `strings={strings('www/components/demo/')}`). A note for translators goes in a `// i18n: …` or `{/* i18n: … */}` comment before the call; text with two meanings takes `context`. Then run `yarn extract:messages` and translate the new messages into every locale with the `translate` skill. `yarn run check` fails until every locale has them; until then pages show the English.

## CSS

A component's styles go in a stylesheet beside it named after it: `Logo.tsx` imports `./Logo.css` (ESLint checks this). Astro components can use a `<style>` block instead. Use the tokens in `src/styles/tokens.css` and the theme's colors and fonts rather than literal sizes.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/): `<type>[optional scope]: <description>`, e.g. `fix: keep the header on one line in German`.

## Comments

Avoid comments by default. Only add one to state something non-obvious — a hidden constraint, a workaround, a reason that isn't clear from the code itself. Never add comments in CSS. Keep a comment to 1-2 lines.
