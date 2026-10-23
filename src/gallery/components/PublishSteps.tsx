import { usePublish } from '@/gallery/hooks/usePublish';
import { type OwnStyle, type Session } from '@/gallery/lib/api';
import { type PublishDraft } from '@/gallery/lib/bridge';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import ConfirmUsernameCard from './ConfirmUsernameCard';
import PublishedNotice from './PublishedNotice';
import PublishForm from './PublishForm';

type Props = {
  draft: PublishDraft;
  nonce: string;
  session: Session;
  existing: OwnStyle | null;
  locale: Locale;
  t: Translate;
};

/**
 * The form, after the username is confirmed, then what was published.
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
  const { account } = session;

  if (publishing.published) {
    return (
      <PublishedNotice
        style={publishing.published}
        isNewVersion={existing !== null}
        detailsOnly={publishing.detailsOnly}
        link={publishing.link}
        onRetryLink={publishing.retryLink}
        locale={locale}
        t={t}
      />
    );
  }

  return (
    <>
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
        canPublish={account.usernameConfirmed}
        t={t}
      />
    </>
  );
}
