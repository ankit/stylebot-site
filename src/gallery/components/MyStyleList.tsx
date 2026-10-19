import { useMyStyles } from '@/gallery/hooks/useMyStyles';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import LoadError from './LoadError';
import MyStyleRow from './MyStyleRow';
import MyStyleRowSkeleton from './MyStyleRowSkeleton';

import './MyStyleList.css';

type Props = { session: string; locale: Locale; t: Translate };

/**
 * The account's styles as rows, with how to publish more.
 */
export default function MyStyleList({ session, locale, t }: Props) {
  const { data: styles, error, loading, reload } = useMyStyles(session);

  if (error) {
    return (
      <LoadError
        message={t('Couldn’t load your styles.')}
        onRetry={reload}
        t={t}
      />
    );
  }

  return (
    <div class="my-style-list">
      <ul aria-busy={loading}>
        {loading && <MyStyleRowSkeleton count={3} />}

        {styles?.map((style) => (
          <MyStyleRow key={style.id} style={style} locale={locale} t={t} />
        ))}
      </ul>

      {!loading && styles?.length === 0 && (
        <p class="my-style-empty">
          {t('You haven’t published any styles yet.')}
        </p>
      )}

      <p
        class="my-style-note"
        dangerouslySetInnerHTML={{
          __html:
            // i18n: "Publish to Gallery" is the menu item's name in the extension, and "⋯" its menu button.
            t(
              'To publish a style, open Stylebot on its site and choose <strong>Publish to Gallery</strong> from the ⋯ menu.',
            ),
        }}
      />
    </div>
  );
}
