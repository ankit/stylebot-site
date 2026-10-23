import { useStylebotAvailability } from '@/gallery/hooks/useStylebotAvailability';

import ButtonLink from '@/components/ButtonLink';

import { type Locale, localizePath } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import GetStylebotCard from './GetStylebotCard';

type Props = { locale: Locale; t: Translate };

/**
 * Why there's nothing to publish: publishing starts in Stylebot, which this
 * browser doesn't have, or the draft it opened has expired or been published.
 */
export default function PublishUnavailable({ locale, t }: Props) {
  const availability = useStylebotAvailability();

  if (availability === 'checking') {
    return null;
  }

  if (availability === 'unavailable') {
    return (
      <div class="g-empty">
        <p>
          {t(
            'Publishing starts in Stylebot: style a site, then choose Publish in its editor or popup.',
          )}
        </p>

        <GetStylebotCard
          message={t('Get Stylebot to style a site and publish it here.')}
          locale={locale}
          t={t}
        />
      </div>
    );
  }

  return (
    <div class="g-empty">
      <p>
        {t(
          'There’s nothing to publish here. The style may already be published, or it’s been more than 10 minutes. Choose Publish in Stylebot’s editor or popup to start again.',
        )}
      </p>

      <ButtonLink href={localizePath(locale, '/mine')} variant="outline">
        {t('Your styles')}
      </ButtonLink>
    </div>
  );
}
