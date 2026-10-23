import Button from '@/components/Button';

import { type Translate } from '@/i18n/t';

import './CssUnchangedNotice.css';

type Props = { busy: boolean; onSave: () => void; t: Translate };

/**
 * Says a new version needs changed CSS, offering to save the name and
 * description without one.
 */
export default function CssUnchangedNotice({ busy, onSave, t }: Props) {
  let label = t('Save name and description');

  if (busy) {
    label = t('Saving…');
  }

  return (
    <div class="css-unchanged" role="alert">
      <p>
        {t(
          'The CSS is the same as the latest version’s, so there’s no new version to publish. You can still save the name and description; installs aren’t updated.',
        )}
      </p>

      <Button variant="outline" size="sm" onClick={onSave} disabled={busy}>
        {label}
      </Button>
    </div>
  );
}
