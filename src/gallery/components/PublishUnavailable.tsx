import { useStylebotAvailability } from '@/gallery/hooks/useStylebotAvailability';

import ButtonLink from '@/components/ButtonLink';

import { currentBrowser, LINKS, STORES } from '@/lib/links';

import { type Locale, localizePath } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import './PublishUnavailable.css';

type Props = { locale: Locale; t: Translate };

/**
 * Why there's nothing to publish: publishing starts in Stylebot, which this
 * browser doesn't have, or the draft it opened has expired or been published.
 */
export default function PublishUnavailable({ locale, t }: Props) {
  const availability = useStylebotAvailability();
  const browser = currentBrowser();

  if (availability === 'checking') {
    return null;
  }

  if (availability === 'available') {
    return (
      <section class="publish-start">
        <h2>{t('Nothing to publish')}</h2>

        <p>
          {t(
            'The style may already be published, or Stylebot opened this page more than 10 minutes ago. Choose Publish in Stylebot again to start over.',
          )}
        </p>

        <div class="publish-start-actions">
          <ButtonLink href={localizePath(locale, '/mine')} variant="outline">
            {t('Your styles')}
          </ButtonLink>
        </div>
      </section>
    );
  }

  return (
    <section class="publish-start">
      <h2>{t('Publish from Stylebot')}</h2>

      <ol class="publish-start-steps">
        <li>{t('Style a site with Stylebot.')}</li>

        <li>{t('Choose Publish in Stylebot’s editor or popup.')}</li>

        <li>
          {t('Name your style, check its screenshot and publish it here.')}
        </li>
      </ol>

      {browser && (
        <div class="publish-start-actions">
          <ButtonLink href={STORES[browser].href}>
            {t('Add Stylebot to {store}', { store: STORES[browser].name })}
          </ButtonLink>
        </div>
      )}

      {!browser && (
        <div class="publish-start-actions">
          <p>
            {t('Stylebot works in Chrome, Firefox and Edge on a computer.')}
          </p>

          <ButtonLink
            href={LINKS.site + localizePath(locale, '/')}
            variant="outline"
          >
            {t('About Stylebot')}
          </ButtonLink>
        </div>
      )}
    </section>
  );
}
