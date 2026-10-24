import { useState } from 'preact/hooks';

import { useAction } from '@/gallery/hooks/useAction';
import { deleteStyle, type OwnStyle } from '@/gallery/lib/api';
import { reportDeleted } from '@/gallery/lib/bridge';

import Button from '@/components/Button';

import { type Translate } from '@/i18n/t';

import Dialog from './Dialog';

type Props = {
  style: OwnStyle;
  session: string;
  onDeleted: () => void;
  t: Translate;
};

/**
 * Deletes an unpublished style for good, asking first.
 */
export default function DeleteStyleButton({
  style,
  session,
  onDeleted,
  t,
}: Props) {
  const [confirming, setConfirming] = useState(false);
  const { run, busy, failed, reset } = useAction(
    () => deleteStyle(session, style.id),
    () => {
      void reportDeleted(style.id);
      onDeleted();
    },
  );

  const close = () => {
    setConfirming(false);
    reset();
  };

  let confirmLabel = t('Delete');

  if (busy) {
    confirmLabel = t('Deleting…');
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>
        {t('Delete')}
      </Button>

      {confirming && (
        <Dialog
          title={t('Delete {name}?', { name: style.name })}
          onClose={close}
          actions={
            <>
              <Button variant="outline" size="sm" onClick={close}>
                {t('Cancel')}
              </Button>

              <Button size="sm" onClick={run} disabled={busy}>
                {confirmLabel}
              </Button>
            </>
          }
        >
          <p>
            {t(
              'This can’t be undone. Existing installs keep working but won’t get updates.',
            )}
          </p>

          {failed && (
            <p class="dialog-error" role="alert">
              {t('Couldn’t delete. Try again.')}
            </p>
          )}
        </Dialog>
      )}
    </>
  );
}
