/**
 * Checks that src/i18n/source.json matches the t() calls under src/, and
 * that every catalog translates each message once, keeping its
 * {placeholders}, HTML tags and [[keys]]. Pass locale codes to check only
 * those; exits non-zero on any problem.
 */
import { readFileSync } from 'node:fs';

import { translatedLocales } from './locales.ts';
import {
  extractMessages,
  json,
  loadCatalog,
  lookup,
  SOURCE_FILE,
} from './messages.ts';

const TOKEN = /\{\w+\}|<[^>]+>|\[\[[^\]]+\]\]/g;

const locales =
  process.argv.length > 2 ? process.argv.slice(2) : translatedLocales();

const tokens = (s: string) => (s.match(TOKEN) ?? []).sort().join(' ');

const messages = extractMessages();
const errors: Array<string> = [];

if (readFileSync(SOURCE_FILE, 'utf8') !== json(messages)) {
  errors.push(
    'src/i18n/source.json is out of date: run node scripts/extract-messages.ts',
  );
}

for (const locale of locales) {
  const catalog = loadCatalog(locale);
  const used = new Set<string>();

  for (const m of messages) {
    const name = m.context ? `${m.text} (${m.context})` : m.text;
    const translation = lookup(catalog, m);

    used.add(JSON.stringify([m.text, m.context ?? null]));

    if (!translation) {
      errors.push(`${locale}: missing ${JSON.stringify(name)}`);
    } else if (tokens(m.text) !== tokens(translation)) {
      errors.push(
        `${locale}: ${JSON.stringify(name)} expected [${tokens(m.text)}], got [${tokens(translation)}]`,
      );
    }
  }

  for (const [text, entry] of Object.entries(catalog)) {
    const contexts = typeof entry === 'object' ? Object.keys(entry) : [null];

    for (const context of contexts) {
      if (!used.has(JSON.stringify([text, context]))) {
        errors.push(
          `${locale}: ${JSON.stringify(text)}${context ? ` (${context})` : ''} isn't used; run node scripts/extract-messages.ts`,
        );
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Checked ${locales.join(', ')}`);
