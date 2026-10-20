import { type Site } from '@/gallery/lib/api';
import { fullNumber } from '@/gallery/lib/format';
import { siteHref } from '@/gallery/lib/paths';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import Favicon from './Favicon';

import './SiteLink.css';

type Props = { site: Site; locale: Locale; t: Translate };

/**
 * A site's name and icon, with how many styles it has, linking to its page.
 */
export default function SiteLink({ site, locale, t }: Props) {
  const count = fullNumber(locale, site.styles);

  return (
    <a class="site-link" href={siteHref(locale, site.site)}>
      <Favicon site={site.site} size={16} />

      <span class="site-link-name">{site.site}</span>

      <span class="site-link-count" aria-hidden="true">
        {count}
      </span>

      <span class="sr-only">{t('Styles: {count}', { count })}</span>
    </a>
  );
}
