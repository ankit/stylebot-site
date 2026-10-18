import ButtonLink from '@/components/ButtonLink';

import { type Locale, localizePath } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

type Props = {
  title: string;
  message?: string;
  locale: Locale;
  t: Translate;
};

/**
 * Says something doesn't exist, with a way back to all styles.
 */
export default function NotFound({ title, message, locale, t }: Props) {
  return (
    <div class="g-empty">
      <h1 class="g-title">{title}</h1>

      {message && <p>{message}</p>}

      <ButtonLink href={localizePath(locale, '/')} variant="outline" size="sm">
        {t('All styles')}
      </ButtonLink>
    </div>
  );
}
