import { useState } from 'preact/hooks';

import { usePublish } from '@/gallery/hooks/usePublish';
import { useScreenshotChoices } from '@/gallery/hooks/useScreenshotChoices';
import { useUsernameGate } from '@/gallery/hooks/useUsernameGate';
import { type OwnStyle, type Session } from '@/gallery/lib/api';
import { type PublishDraft } from '@/gallery/lib/bridge';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import ChangeUsernameDialog from './ChangeUsernameDialog';
import PublishedNotice, { type PublishedKind } from './PublishedNotice';
import PublishForm from './PublishForm';
import PublishHead from './PublishHead';
import WelcomeDialog from './WelcomeDialog';

type Props = {
  draft: PublishDraft;
  nonce: string;
  session: Session;
  existing: OwnStyle | null;
  locale: Locale;
  t: Translate;
};

/**
 * The form, then what was published. Publishing with the username made up
 * at sign-in first asks to keep or change it. The screenshot choices live
 * here so the published page shows the same cover.
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
  const choices = useScreenshotChoices(
    draft.screenshot,
    existing?.screenshots ?? [],
  );
  const { account } = session;
  const gate = useUsernameGate(account.usernameConfirmed);
  const [changingName, setChangingName] = useState(false);
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
        screenshot={choices.cover.preview}
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

      <PublishForm
        draft={draft}
        existing={existing}
        publishing={publishing}
        choices={choices}
        guard={gate.guard}
        t={t}
      />

      {gate.asking && !changingName && (
        <WelcomeDialog
          account={account}
          session={session.session}
          onChange={() => setChangingName(true)}
          onClose={gate.cancel}
          t={t}
        />
      )}

      {gate.asking && changingName && (
        <ChangeUsernameDialog
          account={account}
          session={session.session}
          onClose={() => setChangingName(false)}
          t={t}
        />
      )}
    </>
  );
}
