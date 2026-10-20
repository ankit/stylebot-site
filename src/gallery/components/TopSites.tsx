import { useSites } from '@/gallery/hooks/useSites';
import { siteHref, sitesHref } from '@/gallery/lib/paths';

import ChevronRightIcon from '@/components/icons/ChevronRightIcon';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import Favicon from './Favicon';
import TopSitesSkeleton from './TopSitesSkeleton';

import './TopSites.css';

const COUNT = 7;

type Props = { locale: Locale; t: Translate };

/**
 * The sites with the most installs, each linking to its page, then a link to
 * every site. Nothing shows if they don't load, since browsing works without
 * them.
 */
export default function TopSites({ locale, t }: Props) {
  const { data, loading } = useSites();
  const sites = data?.slice(0, COUNT);

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

      <a class="top-sites-all" href={sitesHref(locale)}>
        {
          // i18n: Links to the page listing every site that has styles.
          t('All sites')
        }
        <ChevronRightIcon />
      </a>
    </nav>
  );
}
