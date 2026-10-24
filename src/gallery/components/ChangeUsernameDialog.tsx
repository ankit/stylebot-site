import { useState } from 'preact/hooks';

import { useAction } from '@/gallery/hooks/useAction';
import { useUsernameCheck } from '@/gallery/hooks/useUsernameCheck';
import { type Account, setUsername } from '@/gallery/lib/api';
import { updateAccount } from '@/gallery/lib/auth';

import Button from '@/components/Button';

import { type Translate } from '@/i18n/t';

import Dialog from './Dialog';
import UsernameStatus from './UsernameStatus';

type Props = {
  account: Account;
  session: string;
  onClose: () => void;
  t: Translate;
};

/**
 * Changes the account's username, saying as it's typed whether it's free.
 */
export default function ChangeUsernameDialog({
  account,
  session,
  onClose,
  t,
}: Props) {
  const [username, setValue] = useState(account.username);
  const check = useUsernameCheck(session, username, account.username);
  const { run, busy, failed } = useAction(
    () => setUsername(session, username),
    (saved) => {
      updateAccount(saved);
      onClose();
    },
  );

  const submit = (e: Event) => {
    e.preventDefault();

    if (check?.available) {
      run();
    }
  };

  let saveLabel = t('Save');

  if (busy) {
    saveLabel = t('Saving…');
  }

  return (
    <Dialog
      title={t('Change username')}
      onClose={onClose}
      dismissible={false}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t('Cancel')}
          </Button>

          <Button
            type="submit"
            form="change-username"
            size="sm"
            disabled={busy || !check?.available}
          >
            {saveLabel}
          </Button>
        </>
      }
    >
      <form id="change-username" class="dialog-form" onSubmit={submit}>
        <label>
          {t('Username')}
          <input
            type="search"
            value={username}
            maxLength={30}
            autoCapitalize="off"
            autoComplete="off"
            spellcheck={false}
            // Password managers offer to fill fields labeled Username; this isn't
            // a login. Bitwarden ignores the attributes but skips search fields.
            data-bwignore
            data-1p-ignore
            data-lpignore="true"
            data-form-type="other"
            onInput={(e) => setValue(e.currentTarget.value.toLowerCase())}
          />
        </label>

        <UsernameStatus check={check} onUse={setValue} t={t} />

        {failed && (
          <p class="dialog-error" role="alert">
            {t('Couldn’t save. Try again.')}
          </p>
        )}
      </form>
    </Dialog>
  );
}
