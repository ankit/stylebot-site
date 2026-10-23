import { usePublish } from '@/gallery/hooks/usePublish';
import { useScreenshotChoice } from '@/gallery/hooks/useScreenshotChoice';
import { type OwnStyle, type Session } from '@/gallery/lib/api';
import { type PublishDraft } from '@/gallery/lib/bridge';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import ConfirmUsernameCard from './ConfirmUsernameCard';
import PublishedNotice, { type PublishedKind } from './PublishedNotice';
import PublishForm from './PublishForm';
import PublishHead from './PublishHead';

type Props = {
  draft: PublishDraft;
  nonce: string;
  session: Session;
  existing: OwnStyle | null;
  locale: Locale;
  t: Translate;
};

/**
 * The form, after the username is confirmed, then what was published. The
 * screenshot choice lives here so the published page shows the same one.
 */
export default function PublishSteps({
  draft,
  nonce,
  session,
  existing,
  locale,
  t,
}: Props) {
  const publishing = usePublish(session.session, nonce, draft, existing);
  const choice = useScreenshotChoice(draft, existing);
  const { account } = session;
  let kind: PublishedKind = 'new';

  if (publishing.detailsOnly) {
    kind = 'details';
  } else if (existing) {
    kind = 'version';
  }

  if (publishing.published) {
    return (
      <PublishedNotice
        style={publishing.published}
        kind={kind}
        screenshot={choice.preview}
        link={publishing.link}
        onRetryLink={publishing.retryLink}
        locale={locale}
        t={t}
      />
    );
  }

  return (
    <>
      <PublishHead draft={draft} t={t} />

      {!account.usernameConfirmed && (
        <ConfirmUsernameCard
          account={account}
          session={session.session}
          t={t}
        />
      )}

      <PublishForm
        draft={draft}
        existing={existing}
        publishing={publishing}
        choice={choice}
        canPublish={account.usernameConfirmed}
        t={t}
      />
    </>
  );
}
