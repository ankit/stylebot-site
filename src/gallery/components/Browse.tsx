import { usePages } from '@/gallery/hooks/usePages';
import { listStyles } from '@/gallery/lib/api';

import { type Locale } from '@/i18n/locales';
import { type Catalog, translator } from '@/i18n/t';

import LoadError from './LoadError';
import ScrollSentinel from './ScrollSentinel';
import StyleCard from './StyleCard';
import StyleCardSkeleton from './StyleCardSkeleton';

import './Browse.css';

const PAGE = 24;

type Props = { locale: Locale; strings: Catalog };

/**
 * The most-installed styles, as a grid of cards that loads more as the reader
 * scrolls.
 */
export default function Browse({ locale, strings }: Props) {
  const t = translator(strings);
  const feed = usePages((offset) =>
    listStyles({ sort: 'popular', limit: PAGE, offset }).then((page) => ({
      items: page.styles,
      next: page.nextOffset,
    })),
  );

  if (!feed.loading && !feed.error && feed.items.length === 0) {
    return <div class="g-note">{t('No styles yet.')}</div>;
  }

  return (
    <>
      <div class="browse-grid" aria-busy={feed.loading}>
        {feed.items.map((style) => (
          <StyleCard key={style.id} style={style} locale={locale} t={t} />
        ))}

        {feed.loading && (
          <StyleCardSkeleton count={feed.items.length ? 3 : 6} />
        )}
      </div>

      {feed.error && (
        <LoadError
          message={t('Couldn’t load styles.')}
          onRetry={feed.retry}
          t={t}
        />
      )}

      {feed.hasMore && !feed.error && <ScrollSentinel onVisible={feed.more} />}
    </>
  );
}
