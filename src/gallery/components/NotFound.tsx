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

      <a class="btn btn-outline btn-sm" href={localizePath(locale, '/')}>
        {t('All styles')}
      </a>
    </div>
  );
}
