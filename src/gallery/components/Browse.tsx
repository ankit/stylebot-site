import { usePages } from '@/gallery/hooks/usePages';
import { useSort } from '@/gallery/hooks/useSort';
import { listStyles } from '@/gallery/lib/api';

import { type Locale } from '@/i18n/locales';
import { type Catalog, translator } from '@/i18n/t';

import LoadError from './LoadError';
import ScrollSentinel from './ScrollSentinel';
import SortTabs from './SortTabs';
import StyleCard from './StyleCard';
import StyleCardSkeleton from './StyleCardSkeleton';

import './Browse.css';

const PAGE = 24;

type Props = { locale: Locale; strings: Catalog };

/**
 * Every style, most installed or most recently updated first, as a grid of
 * cards that loads more as the reader scrolls.
 */
export default function Browse({ locale, strings }: Props) {
  const t = translator(strings);
  const [sort, setSort] = useSort();
  const feed = usePages(
    (offset) =>
      listStyles({ sort: sort ?? 'popular', limit: PAGE, offset }).then(
        (page) => ({ items: page.styles, next: page.nextOffset }),
      ),
    [sort],
    sort !== null,
  );

  if (!feed.loading && !feed.error && feed.items.length === 0) {
    return <div class="g-note">{t('No styles yet.')}</div>;
  }

  return (
    <>
      <SortTabs sort={sort} onChange={setSort} t={t} />

      <div class="browse-grid" aria-busy={feed.loading}>
        {feed.items.map((style) => (
          <StyleCard key={style.id} style={style} locale={locale} t={t} />
        ))}

        {feed.loading && <StyleCardSkeleton count={6} />}
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
