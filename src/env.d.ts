import type { Catalog, Locale, Translate } from '@/i18n';

declare global {
  namespace App {
    // Astro merges its own fields into this interface, so it can't be a type.
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Locals {
      locale: Locale;
      // The page's BCP 47 language tag, such as pt-BR.
      lang: string;
      // A site path in the page's locale: '/manual' → '/de/manual'.
      path: (to: string) => string;
      // Translates the page's English text, filling {name} placeholders.
      t: Translate;
      // The translations an island needs, for the files under these src/ paths.
      strings: (...paths: Array<string>) => Catalog;
    }
  }
}

export {};
