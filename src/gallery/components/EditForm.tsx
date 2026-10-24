import { type useStyleEdit } from '@/gallery/hooks/useStyleEdit';

import { type Translate } from '@/i18n/t';

import PublishFormLayout from './PublishFormLayout';
import PublishSubmit from './PublishSubmit';
import ScreenshotPicker from './ScreenshotPicker';
import StyleDetailsFields from './StyleDetailsFields';

type Props = { edit: ReturnType<typeof useStyleEdit>; t: Translate };

/**
 * The style's name and description beside its screenshot, with Save under
 * both, which reads Saved until the next change. Messages go below it, so it
 * stays put.
 */
export default function EditForm({ edit, t }: Props) {
  const { style, saved } = edit;
  const { busy, failed } = edit.save;
  let label = t('Save');

  if (busy) {
    label = t('Saving…');
  } else if (saved) {
    label = t('Saved');
  }

  const submit = (e: Event) => {
    e.preventDefault();
    edit.save.run();
  };

  return (
    <PublishFormLayout
      onSubmit={submit}
      aside={
        <ScreenshotPicker
          choice={edit.choice}
          alt={t('Screenshot of {name} on {site}', {
            name: edit.name,
            site: style.site,
          })}
          t={t}
        />
      }
      footer={
        <>
          <PublishSubmit
            label={label}
            hint={t(
              'Changes show right away. To change the CSS, publish an update from Stylebot.',
            )}
            disabled={busy || !!saved || !edit.name.trim()}
          />

          {failed && (
            <p class="publish-form-problem" role="alert">
              {t('Couldn’t save. Try again.')}
            </p>
          )}

          {saved === 'hidden' && (
            <p class="publish-form-problem" role="status">
              {t(
                'It’s hidden from the Gallery until a moderator has looked at its screenshot.',
              )}
            </p>
          )}
        </>
      }
    >
      <StyleDetailsFields
        name={edit.name}
        description={edit.description}
        onName={edit.setName}
        onDescription={edit.setDescription}
        t={t}
      />
    </PublishFormLayout>
  );
}
