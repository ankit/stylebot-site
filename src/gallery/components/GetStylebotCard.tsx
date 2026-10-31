import ButtonLink from '@/components/ButtonLink';

import { currentBrowser, LINKS, storeHref, STORES } from '@/lib/links';

import { type Locale, localizePath } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import './GetStylebotCard.css';

type Props = { locale: Locale; t: Translate };

/**
 * Offers Stylebot, from this browser's store, to someone who doesn't have it
 * yet, since installing a style needs it. Where Stylebot doesn't run, says
 * where it does.
 */
export default function GetStylebotCard({ locale, t }: Props) {
  const browser = currentBrowser();

  if (!browser) {
    return (
      <div class="get-stylebot-card">
        <p>
          {t(
            'Stylebot works in Chrome, Firefox, Safari and Edge on a computer.',
          )}
        </p>

        <ButtonLink
          href={LINKS.site + localizePath(locale, '/')}
          variant="outline"
        >
          {t('About Stylebot')}
        </ButtonLink>
      </div>
    );
  }

  const store = STORES[browser];

  return (
    <div class="get-stylebot-card">
      <p>{t('Get Stylebot to install this style.')}</p>

      <ButtonLink href={storeHref(browser, 'get-stylebot')}>
        {t('Add Stylebot to {store}', { store: store.name })}
      </ButtonLink>
    </div>
  );
}
