import { usePublishFromStylebot } from '@/gallery/hooks/usePublishFromStylebot';

import { type Translate } from '@/i18n/t';

import './PublishUpdateLink.css';

type Props = { styleId: number; t: Translate };

/**
 * Asks Stylebot to publish its unpublished changes to the style, with an
 * error when it can't.
 */
export default function PublishUpdateLink({ styleId, t }: Props) {
  const { publish, busy, failed } = usePublishFromStylebot(styleId);

  return (
    <>
      <button class="publish-update-link" onClick={publish} disabled={busy}>
        {t('Publish update')}
      </button>

      {failed && (
        <p class="publish-update-error" role="alert">
          {
            // i18n: Shown when Stylebot couldn't open your unpublished changes to publish them.
            t('Couldn’t open your changes from Stylebot. Try again.')
          }
        </p>
      )}
    </>
  );
}
