/**
 * Checks every translated catalog against English: the same keys and list
 * lengths, and the same {placeholders}, HTML tags and [[keys]] in each string,
 * and plural forms for exactly the categories each language uses.
 * Pass locale codes to check only those; exits non-zero on any mismatch.
 */
import { readdirSync } from 'node:fs';
import { LOCALES } from '../src/i18n/locales.ts';

const CATALOGS = ['site', 'demo', 'gallery'];
const TOKEN = /\{\w+\}|<[^>]+>|\[\[[^\]]+\]\]/g;

const dir = new URL('../src/i18n/', import.meta.url);
const locales =
  process.argv.length > 2
    ? process.argv.slice(2)
    : readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isDirectory() && e.name !== 'en')
        .map((e) => e.name);

const load = async (locale: string, catalog: string) =>
  (await import(new URL(`${locale}/${catalog}.ts`, dir).href)).default;

const tokens = (s: string) => (s.match(TOKEN) ?? []).sort().join(' ');

const PLURAL_FORMS = new Set(['zero', 'one', 'two', 'few', 'many', 'other']);

/**
 * Plural forms, `{ one, other }` in English: each language lists the forms it
 * needs, so they're compared with English `other` instead of key by key.
 */
const pluralCategories = (locale: string) =>
  new Intl.PluralRules(
    LOCALES.find((l) => l.code === locale)?.lang ?? locale,
  ).resolvedOptions().pluralCategories;

const isPlural = (value: unknown): value is Record<string, string> =>
  !!value &&
  typeof value === 'object' &&
  'other' in value &&
  Object.keys(value).every((k) => PLURAL_FORMS.has(k));

const errors: string[] = [];

/**
 * Compares a translated value with the English one at the same path.
 */
function compare(en: unknown, tr: unknown, path: string) {
  if (typeof en === 'string') {
    if (typeof tr !== 'string') return errors.push(`${path}: not a string`);
    if (en === '' && tr !== '') errors.push(`${path}: should stay empty`);
    if (en !== '' && tr === '') errors.push(`${path}: empty`);
    if (tokens(en) !== tokens(tr))
      errors.push(`${path}: expected [${tokens(en)}], got [${tokens(tr)}]`);
    return;
  }
  if (Array.isArray(en)) {
    if (!Array.isArray(tr) || tr.length !== en.length)
      return errors.push(`${path}: expected a list of ${en.length}`);
    en.forEach((v, i) => compare(v, tr[i], `${path}[${i}]`));
    return;
  }
  if (isPlural(en)) {
    if (!isPlural(tr))
      return errors.push(`${path}: expected plural forms with "other"`);
    const needed: string[] = pluralCategories(path.split('/')[0]);
    const forms = Object.keys(tr);
    const missing = needed.filter((f) => !forms.includes(f));
    const unused = forms.filter((f) => !needed.includes(f));
    if (missing.length) errors.push(`${path}: missing ${missing.join(', ')}`);
    if (unused.length) errors.push(`${path}: unused ${unused.join(', ')}`);
    for (const [form, text] of Object.entries(tr)) {
      compare(en.other, text, `${path}.${form}`);
    }
    return;
  }
  if (en && typeof en === 'object') {
    if (!tr || typeof tr !== 'object') return errors.push(`${path}: missing`);
    const keys = new Set([...Object.keys(en), ...Object.keys(tr)]);
    for (const key of keys) {
      if (!(key in en)) errors.push(`${path}.${key}: not in English`);
      else
        compare(
          (en as Record<string, unknown>)[key],
          (tr as Record<string, unknown>)[key],
          `${path}.${key}`,
        );
    }
  }
}

for (const catalog of CATALOGS) {
  const en = await load('en', catalog);
  for (const locale of locales) {
    compare(en, await load(locale, catalog), `${locale}/${catalog}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Checked ${locales.join(', ')}`);
