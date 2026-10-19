import { useRoute } from 'preact-iso';

import { useGroupRedirect } from '@/gallery/hooks/useGroupRedirect';
import { usePageMeta } from '@/gallery/hooks/usePageMeta';
import { useSort } from '@/gallery/hooks/useSort';
import { useStyles } from '@/gallery/hooks/useStyles';

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
 * The styles for the site group this page's address names, most installed
 * or most recently updated first.
 */
export default function SitePage({ locale, strings }: Props) {
  const t = translator(strings);
  const { group } = useRoute().params;
  const [sort, setSort] = useSort();
  const feed = useStyles({ search: '', sort, group });
  const site = feed.items[0]?.site;
  const missing = !feed.loading && !feed.error && feed.items.length === 0;
  const redirecting = useGroupRedirect(missing, { group }, locale);
  let heading = t('Styles for {site}', { site: group });

  if (missing) {
    heading = t('No styles for {site} yet', { site: group });
  }

  usePageMeta(t('{title} | Stylebot', { title: heading }));

  if (missing && redirecting) {
    return null;
  }

  if (missing) {
    return <NotFound title={heading} locale={locale} t={t} />;
  }

  return (
    <div class="site-page">
      <BackLink href={localizePath(locale, '/')}>{t('All styles')}</BackLink>

      <div class="site-page-head">
        {site && <Favicon site={site} size={28} />}
        <h1 class="g-title">{heading}</h1>
      </div>

      <SortTabs sort={sort} onChange={setSort} t={t} />

      <StyleGrid feed={feed} showSite={false} locale={locale} t={t} />
    </div>
  );
}
