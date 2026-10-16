# stylebot-site

The [stylebot.dev](https://stylebot.dev) site for the Stylebot browser extension (github.com/ankit/stylebot): Astro, with Preact islands for the interactive pieces. Node 24 (`.nvmrc`).

## Structure

- `src/pages/[...lang]/` — every page, once per locale; English has no prefix
- `src/components/`, `src/layouts/`, `src/styles/`, `src/lib/` — shared pieces; `components/demo` and `components/cli` are the landing page's demos
- `src/theme/` — the site themes: their tokens, the menu that switches them, and the head script that applies the saved one before first paint
- `src/i18n/` — `t()` and the locales; `catalogs/<locale>.json` holds each locale's translations keyed by the English text, and `source.json`, generated, lists every message with its note and the files that use it
- `src/assets/` — images; `gallery/`, `manual/` and `tour/` are screenshots taken with the extension repo's capture scripts and copied here (see README)
- `scripts/` — `extract-messages.ts`, `check-messages.ts` and `extension-terms.ts`, for the catalogs; `extension-strings.json` is a snapshot of the extension's strings, refreshed with `yarn sync:extension-strings`
- `public/` — copied as is; `CNAME` keeps the stylebot.dev domain on GitHub Pages

## Commands

- `yarn dev` — dev server
- `yarn run check` — type check, catalogs against the code's messages, and extension wording (not `yarn check`, Yarn's own command)
- `yarn extract:messages` — refresh `src/i18n/source.json` after adding or changing a `t()` string
- `yarn format` — format everything with Prettier; `yarn format:check` checks it, as CI does
- `yarn lint` — ESLint, as CI runs it; `yarn lint --fix` fixes what it can, such as import order
- `yarn build` — build into `dist/`
- `yarn deploy` — build and publish to the `gh-pages` branch, which serves stylebot.dev

## Styling

Tailwind v4, being adopted file by file; its preflight stays off until the old CSS is gone. The theme in `src/styles/global.css` maps the site's tokens: colors (`bg-surface`, `text-ink`, `border-border`, `text-acc`…), fonts (`font-ui`, `font-display`, `font-mono`) and `px-gutter`. Breakpoints are the site's own, mobile-first like Tailwind: `xs` 421px, `sm` 640px, `md` 761px, `lg` 821px, `xl` 1100px, so the old `max-width: 639px` is `max-sm:`. Class scanning is off while old class names could collide with utilities: when a file or folder moves to Tailwind, add it with `@source` in `global.css`.

## i18n

Never hardcode user-facing strings: write the English inline as `t('Text with {name}', { name })`, with `t` from `Astro.locals` (islands get theirs from a `strings` prop, `strings={strings('components/demo/')}`). A note for translators goes in a `// i18n: …` or `{/* i18n: … */}` comment before the call; text with two meanings takes `context`. Then run `yarn extract:messages` and translate the new messages into every locale with the `translate` skill. `yarn run check` fails until every locale has them; until then pages show the English.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/): `<type>[optional scope]: <description>`, e.g. `fix: keep the header on one line in German`.

## Comments

Avoid comments by default. Only add one to state something non-obvious — a hidden constraint, a workaround, a reason that isn't clear from the code itself. Never add comments in CSS. Keep a comment to 1-2 lines.
