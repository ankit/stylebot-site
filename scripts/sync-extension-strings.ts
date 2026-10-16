/**
 * Refreshes extension-strings.json, the extension's UI strings in every site
 * locale, from github.com/ankit/stylebot, for extension-terms.ts to check
 * against. Pass --from <ref> for a branch or tag other than main.
 */
import { writeFileSync } from 'node:fs';

import { allLocales } from './locales.ts';

const args = process.argv.slice(2);
const ref = args[0] === '--from' && args[1] ? args[1] : 'main';
const base = `https://raw.githubusercontent.com/ankit/stylebot/${ref}/src/assets/_locales/`;

const locales = allLocales();

/**
 * The messages in an extension .config file by key: `@key` on its own line
 * and the text up to the next `@`, with `#` comment lines dropped.
 */
const parse = (raw: string) => {
  const content = raw.replace(/^#.*?$/gm, '');
  const messages: Record<string, string> = {};

  for (const match of content.matchAll(/@([a-z0-9_]+)/gi)) {
    const start = match.index + match[0].length;
    const end = content.indexOf('@', start);

    messages[match[1]] = content
      .substring(start, end < 0 ? content.length : end)
      .trim();
  }

  return messages;
};

const strings: Record<string, Record<string, string>> = {};

for (const locale of locales) {
  const [lang, region] = locale.split('-');
  const file = region ? `${lang}_${region.toUpperCase()}` : lang;
  const response = await fetch(`${base}${file}.config`);

  if (!response.ok) {
    console.error(`${file}.config: ${response.status} ${response.statusText}`);
    process.exit(1);
  }

  strings[locale] = parse(await response.text());
}

writeFileSync(
  new URL('extension-strings.json', import.meta.url),
  `${JSON.stringify(strings, null, 2)}\n`,
);
console.log(`Synced ${locales.join(', ')} from ankit/stylebot@${ref}`);
