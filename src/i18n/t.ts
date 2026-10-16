import { fmt } from './format';

/**
 * A locale's translations, keyed by the English text. Text used with more
 * than one meaning maps each `context` to its own translation.
 */
export type Catalog = Record<string, string | Record<string, string>>;

export type Vars = Record<string, string | number>;

export type Translate = (
  text: string,
  vars?: Vars & { context?: string },
) => string;

/**
 * A `t()` for a catalog: looks up English text and fills its `{name}`
 * placeholders. Text the catalog lacks, as in English, is used as is.
 */
export function translator(catalog: Catalog = {}): Translate {
  return (text, { context, ...vars } = {}) => {
    const entry = catalog[text];
    const message = typeof entry === 'object' ? entry[context ?? ''] : entry;

    return fmt(message || text, vars);
  };
}
