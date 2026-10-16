import { readdirSync } from 'node:fs';

export const I18N_DIR = new URL('../src/i18n/', import.meta.url);

/**
 * Every locale with a folder in src/i18n, read from disk so a locale being
 * added is picked up before it's in LOCALES.
 */
export const allLocales = () =>
  readdirSync(I18N_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

export const translatedLocales = () =>
  allLocales().filter((locale) => locale !== 'en');
