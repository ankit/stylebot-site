import { usePageMeta } from '@/gallery/hooks/usePageMeta';
import { useSearch } from '@/gallery/hooks/useSearch';
import { useSort } from '@/gallery/hooks/useSort';
import { useStyles } from '@/gallery/hooks/useStyles';

import { type Locale } from '@/i18n/locales';
import { type Catalog, translator } from '@/i18n/t';

import SearchBox from './SearchBox';
import SortTabs from './SortTabs';
import StyleGrid from './StyleGrid';
import TopSites from './TopSites';

type Props = { locale: Locale; strings: Catalog };

/**
 * Every style, or those matching a search, most installed or most recently
 * updated first.
 */
export default function Browse({ locale, strings }: Props) {
  const t = translator(strings);
  const { query, setQuery, search } = useSearch();
  const [sort, setSort] = useSort();
  const feed = useStyles({ search, sort });
  const empty = !feed.loading && !feed.error && feed.items.length === 0;
  const title = t('Browse Styles');

  usePageMeta(t('{title} | Stylebot', { title }));

  return (
    <>
      <h1 class="sr-only">{title}</h1>

      <SearchBox value={query} onChange={setQuery} t={t} />

      <TopSites locale={locale} t={t} />

      <SortTabs sort={sort} onChange={setSort} t={t} />

      {empty && search && (
        <div class="g-note">
          {t('No styles match “{query}”.', { query: search })}
        </div>
      )}

      {empty && !search && <div class="g-note">{t('No styles yet.')}</div>}

      <StyleGrid feed={feed} locale={locale} t={t} />
    </>
  );
}
