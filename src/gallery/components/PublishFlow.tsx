import { useState } from 'preact/hooks';

import { useOwnStyle } from '@/gallery/hooks/useOwnStyle';
import { type Session } from '@/gallery/lib/api';
import { type PublishDraft } from '@/gallery/lib/bridge';

import Button from '@/components/Button';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import LoadError from './LoadError';
import PublishHead from './PublishHead';
import PublishSteps from './PublishSteps';

type Props = {
  draft: PublishDraft;
  nonce: string;
  session: Session;
  locale: Locale;
  t: Translate;
};

/**
 * A signed-in draft, once the style it updates is loaded. When that style
 * isn't the account's, it can go out as a new one instead.
 */
export default function PublishFlow({
  draft,
  nonce,
  session,
  locale,
  t,
}: Props) {
  const [asNew, setAsNew] = useState(false);
  const own = useOwnStyle(session.session, draft.styleId);

  if (own.failed) {
    return (
      <>
        <PublishHead draft={draft} t={t} />

        <LoadError
          message={t('Couldn’t load this style.')}
          onRetry={own.reload}
          t={t}
        />
      </>
    );
  }

  if (own.style === undefined) {
    return <PublishHead draft={draft} t={t} />;
  }

  if (draft.styleId !== null && own.style === null && !asNew) {
    return (
      <>
        <PublishHead draft={draft} t={t} />

        <div class="g-note" role="alert">
          {t(
            'The style this updates isn’t one of yours. It may have been deleted, or published from another account.',
          )}
          <Button variant="outline" size="sm" onClick={() => setAsNew(true)}>
            {t('Publish as a new style')}
          </Button>
        </div>
      </>
    );
  }

  return (
    <PublishSteps
      draft={draft}
      nonce={nonce}
      session={session}
      existing={own.style}
      locale={locale}
      t={t}
    />
  );
}
