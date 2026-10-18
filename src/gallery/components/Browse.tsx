import { useSearch } from '@/gallery/hooks/useSearch';
import { useSort } from '@/gallery/hooks/useSort';
import { useStyles } from '@/gallery/hooks/useStyles';

import { type Locale } from '@/i18n/locales';
import { type Catalog, translator } from '@/i18n/t';

import LoadError from './LoadError';
import ScrollSentinel from './ScrollSentinel';
import SearchBox from './SearchBox';
import SortTabs from './SortTabs';
import StyleCard from './StyleCard';
import StyleCardSkeleton from './StyleCardSkeleton';

import './Browse.css';

type Props = { locale: Locale; strings: Catalog };

/**
 * Every style, or those matching a search, most installed or most recently
 * updated first, as a grid of cards that loads more as the reader scrolls.
 */
export default function Browse({ locale, strings }: Props) {
  const t = translator(strings);
  const { query, setQuery, search } = useSearch();
  const [sort, setSort] = useSort();
  const feed = useStyles(search, sort);
  const empty = !feed.loading && !feed.error && feed.items.length === 0;

  return (
    <>
      <SearchBox value={query ?? ''} onChange={setQuery} t={t} />

      <SortTabs sort={sort} onChange={setSort} t={t} />

      {empty && search && (
        <div class="g-note">
          {t('No styles match “{query}”.', { query: search })}
        </div>
      )}

      {empty && !search && <div class="g-note">{t('No styles yet.')}</div>}

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
