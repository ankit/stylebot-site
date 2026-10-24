import { useState } from 'preact/hooks';

import { useMyStyles } from '@/gallery/hooks/useMyStyles';
import { type OwnStyle } from '@/gallery/lib/api';
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
 * The account's styles as rows, those in the Gallery first, then those
 * hidden after reports, with how to publish more.
 */
export default function MyStyleList({ session, username, locale, t }: Props) {
  const { data, error, loading, reload } = useMyStyles(session);

  const [deleted, setDeleted] = useState<Array<number>>([]);
  const styles = data?.filter((style) => !deleted.includes(style.id));

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

  const rows = (list: Array<OwnStyle>) =>
    list.map((style) => (
      <MyStyleRow
        key={style.id}
        style={style}
        session={session}
        onDeleted={() => setDeleted((prev) => [...prev, style.id])}
        locale={locale}
        t={t}
      />
    ));

  let empty = '';

  if (!loading && styles?.length === 0) {
    empty = t('You haven’t published any styles yet.');
  } else if (!loading && live.length === 0) {
    empty = t('None of your styles are in the Gallery right now.');
  }

  return (
    <>
      <section class="my-style-section">
        <div class="my-style-section-head">
          <h2 class="my-style-section-title">
            {
              // i18n: Heading over your styles that are listed in the Gallery.
              t('In the Gallery')
            }
          </h2>

          {live.length > 0 && (
            <a class="my-style-page-link" href={authorHref(locale, username)}>
              {
                // i18n: Links to the public page listing your styles.
                t('View your page')
              }
            </a>
          )}
        </div>

        <div class="my-style-list">
          <ul aria-busy={loading}>
            {loading && <MyStyleRowSkeleton count={3} />}

            {rows(live)}
          </ul>

          {empty && <p class="my-style-empty">{empty}</p>}

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

      {away.length > 0 && (
        <section class="my-style-section">
          <h2 class="my-style-section-title">
            {
              // i18n: Heading over your styles that were hidden after reports.
              t('Not in the Gallery')
            }
          </h2>

          <div class="my-style-list">
            <ul>{rows(away)}</ul>
          </div>
        </section>
      )}
    </>
  );
}
