import { useLatestCss } from '@/gallery/hooks/useLatestCss';
import { type usePublish } from '@/gallery/hooks/usePublish';
import { usePublishDetails } from '@/gallery/hooks/usePublishDetails';
import { type useScreenshotChoice } from '@/gallery/hooks/useScreenshotChoice';
import { type OwnStyle } from '@/gallery/lib/api';
import { type PublishDraft } from '@/gallery/lib/bridge';
import { sameCss } from '@/gallery/lib/diff';

import { type Translate } from '@/i18n/t';

import CssUnchangedNotice from './CssUnchangedNotice';
import PublishCssReview from './PublishCssReview';
import PublishError from './PublishError';
import PublishSubmit from './PublishSubmit';
import ScreenshotPicker from './ScreenshotPicker';
import StyleDetails from './StyleDetails';
import VersionNotesField from './VersionNotesField';

import './PublishForm.css';

type Props = {
  draft: PublishDraft;
  existing: OwnStyle | null;
  publishing: ReturnType<typeof usePublish>;
  choice: ReturnType<typeof useScreenshotChoice>;
  // Runs publishing once the username is confirmed.
  guard: (run: () => void) => void;
  t: Translate;
};

/**
 * The draft's details and CSS, with Publish last, beside the screenshot.
 */
export default function PublishForm({
  draft,
  existing,
  publishing,
  choice,
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
    guard(() => publishing.publish(details, choice.screenshot));
  };

  return (
    <form class="publish-form" onSubmit={submit}>
      <div class="publish-form-main">
        {existing && (
          <p class="publish-form-update">
            {t('Publishing a new version of {name}. Installs get the update.', {
              name: existing.name,
            })}
          </p>
        )}

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
            busy={busy}
            onSave={() => publishing.saveDetails(details)}
            t={t}
          />
        )}

        {!unchanged && publishing.error !== undefined && (
          <PublishError error={publishing.error} t={t} />
        )}

        {!unchanged && (
          <PublishSubmit
            isUpdate={isUpdate}
            busy={busy}
            disabled={busy || !details.name || choice.source === 'none'}
            t={t}
          />
        )}
      </div>

      <ScreenshotPicker
        choice={choice}
        alt={t('Screenshot of {name} on {site}', {
          name: details.name,
          site: draft.site,
        })}
        t={t}
      />
    </form>
  );
}
