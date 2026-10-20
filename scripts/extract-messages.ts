/**
 * Collects every t() message into src/i18n/source.json and drops unused
 * translations from the catalogs. Prints what's left to translate.
 */
import { writeFileSync } from 'node:fs';

import { translatedLocales } from './locales.ts';
import {
  type Catalog,
  catalogFile,
  extractMessages,
  json,
  loadCatalog,
  lookup,
  SOURCE_FILE,
} from './messages.ts';

const messages = extractMessages();

writeFileSync(SOURCE_FILE, json(messages));

const label = (text: string, context?: string) =>
  context ? `${JSON.stringify(text)} (${context})` : JSON.stringify(text);

for (const locale of translatedLocales()) {
  const old = loadCatalog(locale);
  const next: Catalog = {};
  const missing: Array<string> = [];

  for (const m of messages) {
    const translation = lookup(old, m);

    if (!translation) {
      missing.push(label(m.text, m.context));
      continue;
    }

    if (m.context) {
      next[m.text] = {
        ...(next[m.text] as Record<string, string>),
        [m.context]: translation,
      };
    } else {
      next[m.text] = translation;
    }
  }

  const dropped = Object.entries(old).flatMap(([text, entry]) =>
    typeof entry === 'object'
      ? Object.keys(entry)
          .filter((c) => !lookup(next, { text, context: c, files: [] }))
          .map((c) => label(text, c))
      : lookup(next, { text, files: [] })
        ? []
        : [label(text)],
  );

  writeFileSync(catalogFile(locale), json(next));

  if (dropped.length) {
    console.log(
      `${locale}: dropped ${dropped.length}\n  ${dropped.join('\n  ')}`,
    );
  }

  if (missing.length) {
    console.log(`${locale}: to translate\n  ${missing.join('\n  ')}`);
  }
}

console.log(`${messages.length} messages in ${SOURCE_FILE.pathname}`);
