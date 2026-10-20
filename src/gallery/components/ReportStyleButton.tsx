import { useState } from 'preact/hooks';

import { useReport } from '@/gallery/hooks/useReport';
import { useSession } from '@/gallery/hooks/useSession';
import { type Style } from '@/gallery/lib/api';

import { type Translate } from '@/i18n/t';

import ReportDialog from './ReportDialog';

import './ReportStyleButton.css';

type Props = { style: Style; t: Translate };

/**
 * Report, for a style that shouldn't be in the gallery, such as one with an
 * inappropriate screenshot. Reporting signs in first; installing isn't needed.
 * Hidden from the style's author.
 */
export default function ReportStyleButton({ style, t }: Props) {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const { state, send, reset } = useReport(style.id);

  if (session === undefined || session?.account.id === style.author.id) {
    return null;
  }

  const close = () => {
    setOpen(false);

    if (state !== 'sent') {
      reset();
    }
  };

  if (state === 'sent' && !open) {
    return (
      <span class="report-style-button" role="status">
        {t('Reported. Thanks.')}
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        class="report-style-button"
        onClick={() => setOpen(true)}
      >
        {t('Report this style')}
      </button>

      {open && (
        <ReportDialog
          name={style.name}
          state={state}
          signedIn={Boolean(session)}
          onSend={send}
          onClose={close}
          t={t}
        />
      )}
    </>
  );
}
