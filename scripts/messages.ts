/**
 * Finds every `t('…')` call under src/ and reads the locale catalogs, for
 * extract-messages.ts and check-messages.ts.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CATALOG_DIR, I18N_DIR } from './locales.ts';

export type Message = {
  text: string;
  context?: string;
  note?: string;
  files: Array<string>;
};

export type Catalog = Record<string, string | Record<string, string>>;

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src');
const SKIP = join(SRC, 'i18n');

export const SOURCE_FILE = new URL('source.json', I18N_DIR);

const QUOTES = new Set(["'", '"', '`']);

function sourceFiles(dir: string): Array<string> {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name);

    if (e.isDirectory()) {
      return path === SKIP ? [] : sourceFiles(path);
    }

    return /\.(astro|ts|tsx)$/.test(e.name) ? [path] : [];
  });
}

/**
 * The string literal starting at `start`, and the index just past it.
 */
function readLiteral(src: string, start: number) {
  const quote = src[start];
  let i = start + 1;

  while (src[i] !== quote) {
    if (src[i] === '\\') {
      i++;
    }

    if (i >= src.length) {
      throw new Error('unterminated string');
    }

    i++;
  }

  const literal = src.slice(start, i + 1);

  if (quote === '`' && literal.includes('${')) {
    throw new Error('t() takes a plain string, not a template with ${}');
  }

  return { value: new Function(`return ${literal}`)() as string, end: i + 1 };
}

/**
 * The rest of a call's arguments after its first, up to the closing paren.
 */
function readArgs(src: string, start: number) {
  let depth = 0;
  let i = start;

  while (i < src.length) {
    const c = src[i];

    if (QUOTES.has(c)) {
      i = readLiteral(src, i).end;
      continue;
    }

    if (c === '(' || c === '{' || c === '[') {
      depth++;
    } else if (c === ')' || c === '}' || c === ']') {
      if (depth === 0) {
        return src.slice(start, i);
      }

      depth--;
    }

    i++;
  }

  throw new Error('unclosed t() call');
}

const NOTE =
  /\/\/\s*i18n:\s*(.*(?:\n[ \t]*\/\/(?!\s*i18n:).*)*)|\/\*\s*i18n:\s*([\s\S]*?)\*\//g;

/**
 * Translator notes, `// i18n: …` or `{/* i18n: … *\/}`, by where they end;
 * each one belongs to the next t() call after it.
 */
function notes(src: string) {
  return [...src.matchAll(NOTE)].map((m) => ({
    end: m.index + m[0].length,
    text: (m[1] ?? m[2])
      .split('\n')
      .map((line) => line.replace(/^\s*(\/\/)?\s*/, '').trim())
      .join(' ')
      .trim(),
  }));
}

/**
 * Every message the site's code passes to t(), merged by text and context.
 */
export function extractMessages(): Array<Message> {
  const found = new Map<string, Message>();
  const errors: Array<string> = [];

  for (const file of sourceFiles(SRC)) {
    const src = readFileSync(file, 'utf8');
    const rel = relative(ROOT, file);
    const pending = notes(src);

    for (const call of src.matchAll(
      /(?<![\w$.])(?<!get )(?<!function )t\(\s*/g,
    )) {
      const at = call.index + call[0].length;
      const line = src.slice(0, call.index).split('\n').length;

      if (!QUOTES.has(src[at])) {
        errors.push(`${rel}:${line}: t() needs a string literal`);
        continue;
      }

      try {
        const { value: text, end } = readLiteral(src, at);
        const rest = src.slice(end).match(/^\s*,/)
          ? readArgs(src, end + src.slice(end).indexOf(',') + 1)
          : '';
        const context = rest.match(/\bcontext:\s*(['"])(.+?)\1/)?.[2];
        const note = pending
          .filter((n) => n.end <= call.index)
          .findLast(
            (n) =>
              !src.slice(n.end, call.index).match(/(?<![\w$.])t\(\s*['"`]/),
          )?.text;
        const key = JSON.stringify([text, context ?? null]);
        const message = found.get(key) ?? {
          text,
          ...(context && { context }),
          files: [],
        };

        if (note && !message.note?.includes(note)) {
          message.note = message.note ? `${message.note} ${note}` : note;
        }

        if (!message.files.includes(rel)) {
          message.files.push(rel);
        }

        found.set(key, message);
      } catch (e) {
        errors.push(`${rel}:${line}: ${(e as Error).message}`);
      }
    }
  }

  const messages = [...found.values()]
    .map(({ text, context, note, files }) => ({
      text,
      ...(context && { context }),
      ...(note && { note }),
      files,
    }))
    .sort(
      (a, b) =>
        a.text.localeCompare(b.text, 'en') ||
        (a.context ?? '').localeCompare(b.context ?? '', 'en'),
    );

  for (const m of messages) {
    m.files.sort();

    const plain = messages.some((o) => o.text === m.text && !o.context);
    const contexts = messages.some((o) => o.text === m.text && o.context);

    if (plain && contexts && !m.context) {
      errors.push(
        `${JSON.stringify(m.text)} is used with and without a context; give every use one`,
      );
    }
  }

  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }

  return messages;
}

export const catalogFile = (locale: string) =>
  new URL(`${locale}.json`, CATALOG_DIR);

export const loadCatalog = (locale: string): Catalog =>
  JSON.parse(readFileSync(catalogFile(locale), 'utf8'));

/**
 * A message's translation in a catalog, or undefined when it has none.
 */
export function lookup(catalog: Catalog, { text, context }: Message) {
  const entry = catalog[text];

  return typeof entry === 'object' ? entry[context ?? ''] : entry;
}

export const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;
