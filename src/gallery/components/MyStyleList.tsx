import { useState } from 'preact/hooks';

import { useMyStyles } from '@/gallery/hooks/useMyStyles';
import { usePublishedStyles } from '@/gallery/hooks/usePublishedStyles';
import { authorHref } from '@/gallery/lib/paths';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import LoadError from './LoadError';
import MyStyleRow from './MyStyleRow';
import MyStyleRowSkeleton from './MyStyleRowSkeleton';

import './MyStyleList.css';

type Props = {
  session: string;
  username: string;
  locale: Locale;
  t: Translate;
};

/**
 * The account's styles as a table, those in the Gallery first, then those
 * hidden after reports, with how to publish more.
 */
export default function MyStyleList({ session, username, locale, t }: Props) {
  const { data, error, loading, reload } = useMyStyles(session);

  const [deleted, setDeleted] = useState<Array<number>>([]);
  const styles = data?.filter((style) => !deleted.includes(style.id));
  const published = usePublishedStyles((data ?? []).map((style) => style.id));

  if (error) {
    return (
      <LoadError
        message={t('Couldn’t load your styles.')}
        onRetry={reload}
        t={t}
      />
    );
  }

  const live = styles?.filter((style) => style.status === 'live') ?? [];
  const away = styles?.filter((style) => style.status !== 'live') ?? [];

  return (
    <section class="my-style-section">
      {live.length > 0 && (
        <a class="my-style-page-link" href={authorHref(locale, username)}>
          {
            // i18n: Links to the public page listing your styles.
            t('View your page')
          }
        </a>
      )}

      <div class="my-style-list">
        <ul aria-busy={loading}>
          <li class="my-style-head" aria-hidden="true">
            <span class="my-style-head-style">
              {
                // i18n: Column heading over your styles' names on Your styles.
                t('Style')
              }
            </span>

            <span>
              {
                // i18n: Column heading over where each of your styles stands in the Gallery.
                t('Gallery')
              }
            </span>
          </li>

          {loading && <MyStyleRowSkeleton count={3} />}

          {[...live, ...away].map((style) => (
            <MyStyleRow
              key={style.id}
              style={style}
              published={published[style.id]}
              session={session}
              onDeleted={() => setDeleted((prev) => [...prev, style.id])}
              locale={locale}
              t={t}
            />
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
    </section>
  );
}
