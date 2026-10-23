import { useState } from 'preact/hooks';

import { useAction } from '@/gallery/hooks/useAction';
import { type Account, setUsername } from '@/gallery/lib/api';
import { updateAccount } from '@/gallery/lib/auth';

import Button from '@/components/Button';

import { type Translate } from '@/i18n/t';

import ChangeUsernameDialog from './ChangeUsernameDialog';

import './ConfirmUsernameCard.css';

type Props = { account: Account; session: string; t: Translate };

/**
 * The username made up at sign-in, to keep or change before it shows on a
 * published style.
 */
export default function ConfirmUsernameCard({ account, session, t }: Props) {
  const [changing, setChanging] = useState(false);
  const { run, busy, failed } = useAction(
    () => setUsername(session, account.username),
    updateAccount,
  );

  return (
    <div class="confirm-username">
      <p
        dangerouslySetInnerHTML={{
          __html: t(
            'Your styles show <strong>{username}</strong> as their author. Keep it or change it before you publish.',
            { username: account.username },
          ),
        }}
      />

      {failed && (
        <p class="confirm-username-error" role="alert">
          {t('Couldn’t save. Try again.')}
        </p>
      )}

      <div class="confirm-username-actions">
        <Button variant="outline" size="sm" onClick={() => setChanging(true)}>
          {t('Change')}
        </Button>

        <Button size="sm" onClick={run} disabled={busy}>
          {t('Keep {username}', { username: account.username })}
        </Button>
      </div>

      {changing && (
        <ChangeUsernameDialog
          account={account}
          session={session}
          onClose={() => setChanging(false)}
          t={t}
        />
      )}
    </div>
  );
}
