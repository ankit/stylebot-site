import { useState } from 'preact/hooks';

import { useAction } from '@/gallery/hooks/useAction';
import { type OwnStyle, unpublishStyle } from '@/gallery/lib/api';

import Button from '@/components/Button';

import { type Translate } from '@/i18n/t';

import Dialog from './Dialog';

type Props = {
  style: OwnStyle;
  session: string;
  onChange: (style: OwnStyle) => void;
  t: Translate;
};

/**
 * Unpublish, asking first. It can be published again later.
 */
export default function UnpublishButton({
  style,
  session,
  onChange,
  t,
}: Props) {
  const [confirming, setConfirming] = useState(false);
  const { run, busy, failed, reset } = useAction(
    () => unpublishStyle(session, style.id),
    () => onChange({ ...style, status: 'unpublished' }),
  );

  const close = () => {
    setConfirming(false);
    reset();
  };

  let confirmLabel = t('Unpublish');

  if (busy) {
    confirmLabel = t('Unpublishing…');
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>
        {t('Unpublish')}
      </Button>

      {confirming && (
        <Dialog
          title={t('Unpublish {name}?', { name: style.name })}
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
              'It leaves the Gallery until you publish it again. Existing installs keep working but don’t get updates meanwhile.',
            )}
          </p>

          {failed && (
            <p class="dialog-error" role="alert">
              {t('Couldn’t unpublish. Try again.')}
            </p>
          )}
        </Dialog>
      )}
    </>
  );
}
