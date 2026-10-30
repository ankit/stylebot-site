import { useRoute } from 'preact-iso';

import { usePageMeta } from '@/gallery/hooks/usePageMeta';
import { useSort } from '@/gallery/hooks/useSort';
import { useStyles } from '@/gallery/hooks/useStyles';
import { ApiError } from '@/gallery/lib/api';
import { siteName } from '@/gallery/lib/siteNames';
import { pageTitle, siteTitle } from '@/gallery/lib/titles';

import { type Locale, localizePath } from '@/i18n/locales';
import { type Catalog, translator } from '@/i18n/t';

import BackLink from './BackLink';
import Favicon from './Favicon';
import NotFound from './NotFound';
import SortTabs from './SortTabs';
import StyleGrid from './StyleGrid';

import './SitePage.css';

type Props = { locale: Locale; strings: Catalog };

/**
 * The styles for the hostname this page's address names, most installed
 * or most recently updated first.
 */
export default function SitePage({ locale, strings }: Props) {
  const t = translator(strings);
  const { site } = useRoute().params;
  const [sort, setSort] = useSort();
  const feed = useStyles({ search: '', sort, site });

  // The API turns down a site that isn't a hostname, such as an old group.
  const invalid = feed.error instanceof ApiError && feed.error.status === 400;
  const empty = !feed.loading && !feed.error && !feed.items.length;
  const missing = invalid || empty;
  let heading = t('Styles for {site}', { site: siteName(site) });
  let title = siteTitle(t, site);

  if (missing) {
    heading = t('No styles for {site} yet', { site });
    title = heading;
  }

  usePageMeta(pageTitle(t, title), {
    noindex: missing,
  });

  if (missing) {
    return <NotFound title={heading} locale={locale} t={t} />;
  }

  return (
    <div class="site-page">
      <BackLink href={localizePath(locale, '/')}>{t('All styles')}</BackLink>

      <div class="site-page-head">
        <Favicon site={site} size={22} />
        <h1 class="g-title">{heading}</h1>
      </div>

      <SortTabs sort={sort} onChange={setSort} t={t} />

      <StyleGrid feed={feed} showSite={false} locale={locale} t={t} />
    </div>
  );
}
