import { useAction } from '@/gallery/hooks/useAction';
import { type Account, setUsername } from '@/gallery/lib/api';
import { updateAccount } from '@/gallery/lib/auth';

import Button from '@/components/Button';

import { parts } from '@/i18n/format';
import { type Translate } from '@/i18n/t';

import Dialog from './Dialog';

type Props = {
  account: Account;
  session: string;
  onChange: () => void;
  onClose: () => void;
  t: Translate;
};

/**
 * Shown once after the first sign-in: the username made up for the account,
 * to keep or change.
 */
export default function WelcomeDialog({
  account,
  session,
  onChange,
  onClose,
  t,
}: Props) {
  const { run, busy, failed } = useAction(
    () => setUsername(session, account.username),
    updateAccount,
  );

  return (
    <Dialog
      title={t('Welcome to the Gallery')}
      onClose={onClose}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={onChange}>
            {t('Change')}
          </Button>

          <Button size="sm" onClick={run} disabled={busy}>
            {t('Looks good')}
          </Button>
        </>
      }
    >
      <p>
        {parts(
          t(
            'Your username is {username}. It shows on the styles you publish, and you can change it any time.',
          ),
        ).map((part) => {
          if (part === '{username}') {
            return <strong key={part}>{account.username}</strong>;
          }

          return part;
        })}
      </p>

      {failed && (
        <p class="dialog-error" role="alert">
          {t('Couldn’t save. Try again.')}
        </p>
      )}
    </Dialog>
  );
}
