import { useInstalledStyles } from '@/gallery/hooks/useInstalledStyles';
import { useMoreForSite } from '@/gallery/hooks/useMoreForSite';
import { type Style } from '@/gallery/lib/api';
import { siteHref } from '@/gallery/lib/paths';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import StyleCard from './StyleCard';

import './MoreForSite.css';

type Props = { style: Style; locale: Locale; t: Translate };

/**
 * A few other styles for the same site, with a link to all of them. Nothing
 * when the site has no others.
 */
export default function MoreForSite({ style, locale, t }: Props) {
  const { data: others } = useMoreForSite(style);
  const installed = useInstalledStyles((others ?? []).map((other) => other.id));

  if (!others?.length) {
    return null;
  }

  return (
    <section class="more-for-site">
      <div class="more-for-site-head">
        <h2>{t('More for {site}', { site: style.group })}</h2>

        <a href={siteHref(locale, style.group)}>{t('See all')}</a>
      </div>

      <div class="more-for-site-grid">
        {others.map((other) => (
          <StyleCard
            key={other.id}
            style={other}
            installed={other.id in installed}
            showSite={false}
            locale={locale}
            t={t}
          />
        ))}
      </div>
    </section>
  );
}
