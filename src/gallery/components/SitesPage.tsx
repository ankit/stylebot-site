import { useMatchingSites } from '@/gallery/hooks/useMatchingSites';
import { usePageMeta } from '@/gallery/hooks/usePageMeta';
import { useQueryParam } from '@/gallery/hooks/useQueryParam';
import { useRevealed } from '@/gallery/hooks/useRevealed';
import { useSites } from '@/gallery/hooks/useSites';
import { useSiteSort } from '@/gallery/hooks/useSiteSort';
import { fullNumber } from '@/gallery/lib/format';

import { type Locale, localizePath } from '@/i18n/locales';
import { type Catalog, translator } from '@/i18n/t';

import BackLink from './BackLink';
import LoadError from './LoadError';
import ScrollSentinel from './ScrollSentinel';
import SearchBox from './SearchBox';
import SiteLink from './SiteLink';
import SiteLinkSkeleton from './SiteLinkSkeleton';
import Tabs from './Tabs';

import './SitesPage.css';

const STEP = 60;

type Props = { locale: Locale; strings: Catalog };

/**
 * Every site with styles, most installed or by name, narrowed by a filter,
 * showing more as the reader scrolls.
 */
export default function SitesPage({ locale, strings }: Props) {
  const t = translator(strings);
  const { data: sites, error, loading, reload } = useSites();
  const [query, setQuery] = useQueryParam('q');
  const [sort, setSort] = useSiteSort();
  const found = useMatchingSites(sites, query, sort);
  const [shown, showMore] = useRevealed(STEP, `${query}|${sort}`);
  const empty = Boolean(sites) && found.length === 0;
  const title = t('All sites');

  usePageMeta(t('{title} | Stylebot', { title }));

  return (
    <div class="sites-page">
      <BackLink href={localizePath(locale, '/')}>{t('All styles')}</BackLink>

      <div class="sites-page-head">
        <h1 class="g-title">{title}</h1>

        {sites && (
          <p class="sites-page-stats">
            {t('Sites: {count}', { count: fullNumber(locale, sites.length) })}
          </p>
        )}
      </div>

      <SearchBox
        value={query}
        onChange={setQuery}
        label={t('Filter sites')}
        t={t}
      />

      <Tabs
        value={sort}
        tabs={[
          ['popular', t('Most installed')],
          // i18n: Sorts sites alphabetically by name.
          ['name', t('A–Z')],
        ]}
        label={t('Sort sites')}
        onChange={setSort}
      />

      {error && (
        <LoadError
          message={t('Couldn’t load the sites.')}
          onRetry={reload}
          t={t}
        />
      )}

      {empty && (
        <div class="g-note">
          {t('No sites match “{query}”.', { query: query.trim() })}
        </div>
      )}

      <ul class="sites-grid" aria-busy={loading}>
        {loading && <SiteLinkSkeleton count={24} />}

        {found.slice(0, shown).map((site) => (
          <li key={site.site}>
            <SiteLink site={site} locale={locale} t={t} />
          </li>
        ))}
      </ul>

      {shown < found.length && <ScrollSentinel onVisible={showMore} />}
    </div>
  );
}
