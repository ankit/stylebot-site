import { useLatestCss } from '@/gallery/hooks/useLatestCss';
import { type usePublish } from '@/gallery/hooks/usePublish';
import { usePublishDetails } from '@/gallery/hooks/usePublishDetails';
import { type useScreenshotChoices } from '@/gallery/hooks/useScreenshotChoices';
import { type OwnStyle } from '@/gallery/lib/api';
import { type PublishDraft } from '@/gallery/lib/bridge';
import { sameCss } from '@/gallery/lib/diff';

import { type Translate } from '@/i18n/t';

import CssUnchangedNotice from './CssUnchangedNotice';
import PublishCssReview from './PublishCssReview';
import PublishError from './PublishError';
import PublishFormLayout from './PublishFormLayout';
import PublishSubmit from './PublishSubmit';
import ScreenshotPicker from './ScreenshotPicker';
import StyleDetails from './StyleDetails';
import VersionNotesField from './VersionNotesField';

type Props = {
  draft: PublishDraft;
  existing: OwnStyle | null;
  publishing: ReturnType<typeof usePublish>;
  choices: ReturnType<typeof useScreenshotChoices>;
  // Runs publishing once the username is confirmed.
  guard: (run: () => void) => void;
  t: Translate;
};

function submitLabel(isUpdate: boolean, busy: boolean, t: Translate) {
  if (busy) {
    return t('Publishing…');
  }

  if (isUpdate) {
    return t('Publish update');
  }

  return t('Publish');
}

/**
 * The draft's details and CSS, with Publish last, beside the screenshots.
 */
export default function PublishForm({
  draft,
  existing,
  publishing,
  choices,
  guard,
  t,
}: Props) {
  const fields = usePublishDetails(draft, existing);
  const latestCss = useLatestCss(existing);
  const { details } = fields;
  const { busy } = publishing;
  const isUpdate = existing !== null;
  const unchanged =
    publishing.unchanged || (!!latestCss && sameCss(latestCss, draft.css));

  const submit = (e: Event) => {
    e.preventDefault();
    guard(() => publishing.publish(details, choices.entries));
  };

  return (
    <PublishFormLayout
      onSubmit={submit}
      aside={
        <ScreenshotPicker
          choices={choices}
          alt={t('Screenshot of {name} on {site}', {
            name: details.name,
            site: draft.site,
          })}
          t={t}
        />
      }
      footer={
        !unchanged && (
          <>
            {publishing.error !== undefined && (
              <PublishError error={publishing.error} t={t} />
            )}

            <PublishSubmit
              label={submitLabel(isUpdate, busy, t)}
              disabled={
                busy ||
                choices.pending ||
                !details.name ||
                choices.cover.source === 'none'
              }
            />
          </>
        )
      }
    >
      {isUpdate && !unchanged && (
        <VersionNotesField
          value={fields.notes}
          onInput={fields.setNotes}
          t={t}
        />
      )}

      <StyleDetails
        name={fields.name}
        description={fields.description}
        onName={fields.setName}
        onDescription={fields.setDescription}
        isUpdate={isUpdate}
        open={unchanged}
        t={t}
      />

      <PublishCssReview css={draft.css} before={latestCss} t={t} />

      {unchanged && (
        <CssUnchangedNotice
          busy={busy || choices.pending}
          onSave={() => publishing.saveDetails(details, choices.entries)}
          t={t}
        />
      )}
    </PublishFormLayout>
  );
}
