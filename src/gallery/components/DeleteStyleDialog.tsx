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
  onClose: () => void;
  t: Translate;
};

/**
 * Asks before deleting a style for good, and deletes it.
 */
export default function DeleteStyleDialog({
  style,
  session,
  onDeleted,
  onClose,
  t,
}: Props) {
  const { run, busy, failed } = useAction(
    () => deleteStyle(session, style.id),
    () => {
      void reportDeleted(style.id);
      onDeleted();
    },
  );

  let confirmLabel = t('Delete');

  if (busy) {
    confirmLabel = t('Deleting…');
  }

  return (
    <Dialog
      title={t('Delete {name}?', { name: style.name })}
      onClose={onClose}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t('Cancel')}
          </Button>

          <Button variant="danger" size="sm" onClick={run} disabled={busy}>
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
  );
}
