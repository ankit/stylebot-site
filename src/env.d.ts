import type { Locale, Messages } from '@/i18n';

declare global {
  namespace App {
    // Astro merges its own fields into this interface, so it can't be a type.
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Locals extends Messages {
      locale: Locale;
      // The page's BCP 47 language tag, such as pt-BR.
      lang: string;
      // A site path in the page's locale: '/manual' → '/de/manual'.
      path: (to: string) => string;
    }
  }
}

export {};
