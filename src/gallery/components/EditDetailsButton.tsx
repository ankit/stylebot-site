import { useState } from 'preact/hooks';

import { useAction } from '@/gallery/hooks/useAction';
import { type OwnStyle, updateStyle } from '@/gallery/lib/api';

import Button from '@/components/Button';

import { type Translate } from '@/i18n/t';

import Dialog from './Dialog';

// The API's limits.
const NAME_MAX = 60;
const DESCRIPTION_MAX = 200;

type Props = {
  style: OwnStyle;
  session: string;
  onChange: (style: OwnStyle) => void;
  t: Translate;
};

/**
 * Edit, opening a form for the style's name and description. Saving doesn't
 * publish a new version, so installs aren't updated.
 */
export default function EditDetailsButton({
  style,
  session,
  onChange,
  t,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(style.name);
  const [description, setDescription] = useState(style.description ?? '');
  const { run, busy, failed, reset } = useAction(
    () => updateStyle(session, style.id, { name: name.trim(), description }),
    (saved) => {
      setEditing(false);
      onChange({ ...style, name: saved.name, description: saved.description });
    },
  );
  const formId = `edit-details-${style.id}`;

  const open = () => {
    setName(style.name);
    setDescription(style.description ?? '');
    setEditing(true);
  };

  const close = () => {
    setEditing(false);
    reset();
  };

  const submit = (e: Event) => {
    e.preventDefault();
    run();
  };

  let saveLabel = t('Save');

  if (busy) {
    saveLabel = t('Saving…');
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={open}>
        {t('Edit')}
      </Button>

      {editing && (
        <Dialog
          title={t('Edit {name}', { name: style.name })}
          onClose={close}
          actions={
            <>
              <Button variant="outline" size="sm" onClick={close}>
                {t('Cancel')}
              </Button>

              <Button
                type="submit"
                form={formId}
                size="sm"
                disabled={busy || !name.trim()}
              >
                {saveLabel}
              </Button>
            </>
          }
        >
          <form id={formId} class="dialog-form" onSubmit={submit}>
            <label>
              {t('Name')}
              <input
                value={name}
                maxLength={NAME_MAX}
                required
                onInput={(e) => setName(e.currentTarget.value)}
              />
            </label>

            <label>
              {t('Description')}
              <textarea
                value={description}
                maxLength={DESCRIPTION_MAX}
                rows={3}
                onInput={(e) => setDescription(e.currentTarget.value)}
              />
            </label>

            <p class="dialog-hint">
              {t('Changes show right away. Installs aren’t updated.')}
            </p>

            {failed && (
              <p class="dialog-error" role="alert">
                {t('Couldn’t save. Try again.')}
              </p>
            )}
          </form>
        </Dialog>
      )}
    </>
  );
}
