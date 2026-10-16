import { readdirSync } from 'node:fs';

export const I18N_DIR = new URL('../src/i18n/', import.meta.url);

export const CATALOG_DIR = new URL('catalogs/', I18N_DIR);

/**
 * Every locale with a catalog in src/i18n/catalogs, read from disk so a
 * locale being added is picked up before it's in LOCALES.
 */
export const translatedLocales = () =>
  readdirSync(CATALOG_DIR)
    .filter((name) => name.endsWith('.json'))
    .map((name) => name.slice(0, -'.json'.length))
    .sort();

export const allLocales = () => ['en', ...translatedLocales()].sort();
