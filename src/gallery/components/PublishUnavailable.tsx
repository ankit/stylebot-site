import { useStylebotAvailability } from '@/gallery/hooks/useStylebotAvailability';

import ButtonLink from '@/components/ButtonLink';
import PublishMock from '@/components/PublishMock';

import { currentBrowser, LINKS, storeHref, STORES } from '@/lib/links';

import { type Locale, localizePath } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import './PublishUnavailable.css';

type Props = { expired: boolean; locale: Locale; t: Translate };

/**
 * How publishing starts in Stylebot, with how to get it if this browser
 * doesn't have it, or, when `expired`, that the draft Stylebot opened has
 * expired or been published.
 */
export default function PublishUnavailable({ expired, locale, t }: Props) {
  const availability = useStylebotAvailability();
  const browser = currentBrowser();

  if (availability === 'checking') {
    return null;
  }

  if (availability === 'available' && expired) {
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
    <div class="publish-start-layout">
      <section class="publish-start">
        <h2>{t('Publish from Stylebot')}</h2>

        <ol class="publish-start-steps">
          <li>{t('Style a site with Stylebot.')}</li>

          <li>
            <span
              dangerouslySetInnerHTML={{
                __html:
                  // i18n: "Publish to Gallery" is the menu item's name in the extension.
                  t(
                    'Choose <strong>Publish to Gallery</strong> from Stylebot’s popup.',
                  ),
              }}
            />
          </li>

          <li>
            {t('Name your style, check its screenshot and publish it here.')}
          </li>
        </ol>

        {availability === 'unavailable' && browser && (
          <div class="publish-start-actions">
            <ButtonLink href={storeHref(browser, 'publish')}>
              {t('Add Stylebot to {store}', { store: STORES[browser].name })}
            </ButtonLink>
          </div>
        )}

        {availability === 'unavailable' && !browser && (
          <div class="publish-start-actions">
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
        )}
      </section>

      <div class="publish-start-mock" aria-hidden="true">
        <PublishMock t={t} />
      </div>
    </div>
  );
}
