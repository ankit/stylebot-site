import { useOwnStyle } from '@/gallery/hooks/useOwnStyle';

import { type Translate } from '@/i18n/t';

import EditSteps from './EditSteps';
import LoadError from './LoadError';
import PublishHead from './PublishHead';

type Props = { id: number; session: string; t: Translate };

/**
 * The account's style to edit, once it's loaded.
 */
export default function EditFlow({ id, session, t }: Props) {
  const own = useOwnStyle(session, id);
  const title = t('Edit style');

  if (own.failed) {
    return (
      <>
        <PublishHead title={title} t={t} />

        <LoadError
          message={t('Couldn’t load this style.')}
          onRetry={own.reload}
          t={t}
        />
      </>
    );
  }

  if (own.style === undefined) {
    return <PublishHead title={title} t={t} />;
  }

  if (own.style === null) {
    return (
      <>
        <PublishHead title={title} t={t} />

        <div class="g-note" role="alert">
          {t(
            'This style isn’t one of yours. It may have been deleted, or published from another account.',
          )}
        </div>
      </>
    );
  }

  return <EditSteps style={own.style} session={session} t={t} />;
}
