---
name: translate
description: Translate stylebot.dev's strings — fill in messages the code uses that a locale lacks, retranslate English that changed, or add a whole new locale. Use after adding or changing any t() string under src/, when `yarn run check` reports missing or mismatched translations, or when the user asks to add or improve a language on the site.
---

# Translate stylebot.dev

stylebot.dev's English lives in the code, in `t('…')` calls. Each locale's
translations are in `src/i18n/catalogs/<code>.json`, keyed by the English
text; a text with two meanings maps each `context` to its own translation:

```json
"Default": { "font": "Standard", "profile": "Standard" }
```

`src/i18n/source.json`, generated, lists every message with its translator
note and the files that use it. Strings may carry inline HTML (`<strong>`,
`<a>`, `<code>`, `<q>`), `{name}` placeholders and key combinations as
`[[alt+shift+M]]`; a translation keeps all three intact. Run the scripts with
Node 24 (`.nvmrc`).

1. **After changing English**, in the same change, run
   `yarn extract:messages`. It refreshes `source.json`, drops translations of
   messages the code no longer uses, and prints, per locale, the messages to
   translate. Changed English is a new message, so its old translation is
   dropped; the script lists it so the new one can start from it.
2. **Translate only the listed messages**, in each locale's catalog. One
   subagent per locale works well. Reuse the terms that locale's catalog
   already uses, and the extension's wording:
   `node scripts/extension-terms.ts --glossary <code>` lists every site
   string that matches an extension string, with the extension's
   translation, from the snapshot in `scripts/extension-strings.json`; run
   `yarn sync:extension-strings` first if the extension's strings changed
   since it was taken. Mock UI in the demo and feature cards must use it
   exactly.
3. **Site-specific rules:**
   - The demos' sample news story is translated the same way in both demos
     (`components/demo/` and `components/cli/CliDemo.tsx`). The paper's name,
     The Harbour Post, stays, as do CLI output, commands, theme and site
     names, and profile names that appear in screenshots.
   - The title word ("Restyle") is a button that cycles through decorative
     fonts: keep it one short word, and put `{word}` first in the title
     where the language allows, since wider fonts grow it to the left. A new
     script may need its own font set in `[...lang]/index.astro`.
   - Numbers, dates and times follow the locale (`200.000+`, `23:41`).
   - Localized pages tell browsers not to translate them, so a mistranslation
     there is what visitors see.
4. **Adding a locale:** add it to `LOCALES` in `src/i18n/locales.ts`, create
   `src/i18n/catalogs/<code>.json` with every message translated, and
   register it in `CATALOGS` in `src/i18n/index.ts`. In the extension repo,
   add it to `SITE_LOCALES` in `src/core/utils/site-url.ts` so the extension
   links to it.
5. **Finish:** `yarn run check` (not `yarn check`, Yarn's own command) runs
   the type check, `scripts/check-messages.ts` (every message translated,
   placeholders and tags kept, `source.json` up to date) and
   `scripts/extension-terms.ts` (extension wording); CI runs the same checks.
   Then `npx astro build`, and look at a long language (German, Russian) at
   375px for overflow in buttons, the header and the demo. For a new locale,
   read the ten longest translations against their components and shorten
   any that would crowd their control.

## How to translate well

- **Look at where a string is used** before translating a short or ambiguous
  one: `source.json` lists its files; read the page or component. "Light" is a
  theme name in one place and a font weight in another; "Style" may be a noun
  (a site's CSS) or a verb.
- **UI register:** short, plain, the way the platform's own UI says it in that
  language. Sentence case where the language has case. Buttons and menu items
  are actions ("Copy CSS"), not descriptions.
- **Length:** many strings sit in tight buttons, tabs, segmented controls and
  menus. Prefer the shorter natural wording; check the component when a
  translation runs much longer than the English.
- **Punctuation:** use the language's own quotes (« », „ “, 「」, “ ”), ellipsis
  "…", and spacing rules (a space before ? ! : ; in French).
- **Consistency:** reuse the wording the locale already uses for the same
  concept — search that locale's catalog before writing.

## Sound native

Write what a native speaker would put in this spot of a well-made app in
their language, not the English sentence in other words. Translate the
meaning, then let the language's own grammar and word order carry it.

- **Read it back as a native user.** If a sentence would only make sense to
  someone who knows the English behind it, rewrite it.
- **No articles or filler the language doesn't use.** English "a/an" becomes
  nothing in most languages; don't render it as "one" (Vietnamese "một",
  Chinese "一个") unless something is being counted.
- **Name the subject.** English "it" for a feature or "you" in every sentence
  sounds foreign in many languages. Restructure, or name the thing ("this
  feature", "AI", "Stylebot").
- **Feature names aren't sentence subjects** unless that's natural in the
  language: "Sync keeps your styles in Drive" becomes "this feature keeps…", not
  the tab label used as a noun.
- **Follow the platform's wording.** For common actions and settings (save,
  undo, sign in, dark mode, shortcut), use the terms Chrome and the OS use in
  that language.
- **Keep one register per locale.** Match the formality the file already
  uses and keep to it.

Per language (what each file already does; when touching a string that
breaks it, bring it in line):

- **Vietnamese:** "bạn" for the user; drop "một" unless counting; avoid "nó"
  for features; "Hãy …" is natural for instructions in messages, not on
  buttons.
- **Japanese:** sentences in です/ます; buttons and labels as short nouns or
  verb stems (保存, 削除); leave out あなた, which a few strings still use.
- **Chinese (Simplified and Traditional):** 你, not 您 (a few strings still
  use 您); leave the pronoun out where context makes it clear. Traditional
  uses Taiwan's terms (檔案, 網站, 設定), not Mainland ones.
- **Korean:** 합니다 in statements, 하세요 in requests; short nouns on
  buttons; never 당신.
- **German:** "Sie" (some strings still use "du"/"dein").
- **French:** "vous". **Spanish, Italian, Romanian:** informal "tú/tu".
  **Portuguese (both):** "você".
- **Russian:** "вы", lowercase.
- **Indonesian:** "Anda", capitalized; Chrome's terms ("Setelan", "Urungkan",
  "Pintasan keyboard"); "gaya" for a style, "Mode baca" for the reader.

## Glossary

Never translated: Stylebot, CSS, HTML, URL, Google Drive, Google Fonts,
Claude, Gemini, OpenAI, model names (Sonnet 5, GPT-5.6 Luna…), keyboard keys
(Esc, Alt, Shift, ⌘).

Keep the meaning, translate the word:

| English                       | Meaning in Stylebot                                      |
| ----------------------------- | -------------------------------------------------------- |
| style                         | the CSS a user saved for one site (noun)                 |
| styling                       | Stylebot's CSS being applied on a page                   |
| selector                      | a CSS selector, as in CSS documentation in that language |
| preset                        | a ready-made set of styles (dark mode, grayscale…)       |
| readability / reader          | the reading view that strips a page to its article       |
| panel / editor                | Stylebot's side panel where styles are edited            |
| Light / Dark / Sepia / System | theme names, as the OS or browser names its themes       |
| provider                      | an AI company whose API key the user adds                |
