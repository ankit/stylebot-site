import { useRequest } from '@/gallery/hooks/useRequest';
import { listSites } from '@/gallery/lib/api';
import { siteHref } from '@/gallery/lib/paths';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import Favicon from './Favicon';
import TopSitesSkeleton from './TopSitesSkeleton';

import './TopSites.css';

const COUNT = 8;

type Props = { locale: Locale; t: Translate };

/**
 * The sites with the most installs, each linking to its page. Nothing shows if
 * they don't load, since browsing works without them.
 */
export default function TopSites({ locale, t }: Props) {
  const { data: sites, loading } = useRequest(
    () => listSites().then((r) => r.sites.slice(0, COUNT)),
    [],
    'top-sites',
  );

  if (loading) {
    return <TopSitesSkeleton />;
  }

  if (!sites?.length) {
    return null;
  }

  return (
    <nav class="top-sites" aria-label={t('Top sites')}>
      {sites.map((site) => (
        <a key={site.group} href={siteHref(locale, site.group)}>
          <Favicon site={site.site} />
          {site.group}
        </a>
      ))}
    </nav>
  );
}
