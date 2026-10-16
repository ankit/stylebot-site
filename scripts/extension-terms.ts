/**
 * Checks that site strings matching an extension string in English use the
 * extension's own translation, so mock UI labels match the real extension.
 * With --glossary <code>, prints those strings and their translations instead.
 */
import { readFileSync } from 'node:fs';

import { translatedLocales } from './locales.ts';
import { extractMessages, loadCatalog, lookup } from './messages.ts';

// The extension's strings, from `node scripts/sync-extension-strings.ts`.
const extensionStrings: Record<string, Record<string, string>> = JSON.parse(
  readFileSync(new URL('extension-strings.json', import.meta.url), 'utf8'),
);

// Walkthrough step headings word "Pick an element" as an instruction, unlike
// the button; "Sign in" is the sample news site's link, not Stylebot's UI.
const EXCEPTIONS = [
  { text: 'Pick an element', context: 'step' },
  { text: 'Sign in' },
];

const config = (locale: string) => {
  if (!extensionStrings[locale]) {
    console.error(
      `No extension strings for ${locale}; run node scripts/sync-extension-strings.ts`,
    );
    process.exit(1);
  }

  return extensionStrings[locale];
};

const normalize = (s: string) => s.replace(/\.\.\.$/, '…');

const messages = extractMessages().filter(
  (m) => !EXCEPTIONS.some((e) => e.text === m.text && e.context === m.context),
);
const extensionKeys = new Map<string, Array<string>>();

for (const [key, message] of Object.entries(config('en'))) {
  const text = normalize(message);

  extensionKeys.set(text, [...(extensionKeys.get(text) ?? []), key]);
}

const args = process.argv.slice(2);
const glossary = args[0] === '--glossary' ? args[1] : null;
const locales = glossary ? [glossary] : translatedLocales();

const errors: Array<string> = [];

for (const locale of locales) {
  const catalog = loadCatalog(locale);
  const strings = config(locale);

  for (const m of messages) {
    const keys = extensionKeys.get(m.text);

    if (!keys) {
      continue;
    }

    const name = m.context
      ? `${JSON.stringify(m.text)} (${m.context})`
      : JSON.stringify(m.text);
    const expected = keys.map((key) => strings[key]).filter(Boolean);

    if (glossary) {
      console.log(
        `${name} => ${expected.map((e) => JSON.stringify(e)).join(' / ')}  (@${keys.join(', @')})`,
      );
      continue;
    }

    const actual = lookup(catalog, m) ?? '';

    if (expected.some((e) => normalize(e) === actual)) {
      continue;
    }

    errors.push(
      `${locale} ${name}: ${JSON.stringify(actual)}, extension has ${expected
        .map((e) => JSON.stringify(e))
        .join(' or ')} (@${keys.join(', @')})`,
    );
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

if (!glossary) {
  console.log(`Extension terms match in ${locales.join(', ')}`);
}
