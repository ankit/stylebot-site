import { useState } from 'preact/hooks';

import { useAction } from '@/gallery/hooks/useAction';
import { type Account, setName } from '@/gallery/lib/api';
import { updateAccount } from '@/gallery/lib/auth';

import Button from '@/components/Button';

import { type Translate } from '@/i18n/t';

import Dialog from './Dialog';

// The API's limit.
const NAME_MAX = 40;

type Props = {
  account: Account;
  session: string;
  onClose: () => void;
  t: Translate;
};

/**
 * Sets the name shown as the author of the account's styles. Left blank,
 * they show as anonymous.
 */
export default function ChangeNameDialog({
  account,
  session,
  onClose,
  t,
}: Props) {
  const [name, setNameValue] = useState(account.name ?? '');
  const { run, busy, failed } = useAction(
    () => setName(session, name),
    (saved) => {
      updateAccount(saved);
      onClose();
    },
  );

  const submit = (e: Event) => {
    e.preventDefault();
    run();
  };

  let saveLabel = t('Save');

  if (busy) {
    saveLabel = t('Saving…');
  }

  return (
    <Dialog
      title={t('Change name')}
      onClose={onClose}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t('Cancel')}
          </Button>

          <Button type="submit" form="change-name" size="sm" disabled={busy}>
            {saveLabel}
          </Button>
        </>
      }
    >
      <form id="change-name" class="dialog-form" onSubmit={submit}>
        <label>
          {t('Author')}
          <input
            value={name}
            maxLength={NAME_MAX}
            placeholder={t('Anonymous')}
            onInput={(e) => setNameValue(e.currentTarget.value)}
          />
        </label>

        <p class="dialog-hint">
          {t('Changes the name on all your published styles.')}
        </p>

        {failed && (
          <p class="dialog-error" role="alert">
            {t('Couldn’t save. Try again.')}
          </p>
        )}
      </form>
    </Dialog>
  );
}
