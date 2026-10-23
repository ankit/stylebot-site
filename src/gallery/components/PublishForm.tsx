import { useEffect, useRef, useState } from 'preact/hooks';

import { useLatestCss } from '@/gallery/hooks/useLatestCss';
import { type usePublish } from '@/gallery/hooks/usePublish';
import { type useScreenshotChoice } from '@/gallery/hooks/useScreenshotChoice';
import { type OwnStyle } from '@/gallery/lib/api';
import { type PublishDraft } from '@/gallery/lib/bridge';
import { sameCss } from '@/gallery/lib/diff';

import Button from '@/components/Button';

import { type Translate } from '@/i18n/t';

import CssUnchangedNotice from './CssUnchangedNotice';
import PublishCssReview from './PublishCssReview';
import PublishDetailsSummary from './PublishDetailsSummary';
import PublishError from './PublishError';
import PublishField from './PublishField';
import ScreenshotPicker from './ScreenshotPicker';
import StyleDetailsFields from './StyleDetailsFields';

import './PublishForm.css';

// The API's limit.
const NOTES_MAX = 200;

type Props = {
  draft: PublishDraft;
  existing: OwnStyle | null;
  publishing: ReturnType<typeof usePublish>;
  choice: ReturnType<typeof useScreenshotChoice>;
  canPublish: boolean;
  t: Translate;
};

/**
 * The draft's details, its CSS and Publish last, beside the screenshot. A new
 * style starts with its name and description; an update with what changed,
 * its details kept unless edited, and its CSS as changes from the latest
 * version, saying up front when there are none.
 */
export default function PublishForm({
  draft,
  existing,
  publishing,
  choice,
  canPublish,
  t,
}: Props) {
  const [name, setName] = useState(existing?.name ?? draft.name);
  const [description, setDescription] = useState(existing?.description ?? '');
  const [notes, setNotes] = useState('');
  const [editingDetails, setEditingDetails] = useState(!existing);
  const latestCss = useLatestCss(existing);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const { busy } = publishing;
  const details = {
    name: name.trim(),
    description: description.trim(),
    notes: notes.trim(),
  };
  const unchanged =
    publishing.unchanged || (!!latestCss && sameCss(latestCss, draft.css));
  const showFields = editingDetails || unchanged;
  const blocked =
    !canPublish ||
    busy ||
    !details.name ||
    choice.source === 'none' ||
    unchanged;
  let label = t('Publish');

  if (existing) {
    label = t('Publish update');
  }

  if (busy) {
    label = t('Publishing…');
  }

  useEffect(() => {
    notesRef.current?.focus();
  }, []);

  const submit = (e: Event) => {
    e.preventDefault();
    publishing.publish(details, choice.screenshot);
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

        {existing && !unchanged && (
          <PublishField
            label={
              // i18n: A field for notes on what a new version of a style changed.
              t('What changed')
            }
            optional
            hint={t('Shown in the style’s version history.')}
            length={notes.length}
            max={NOTES_MAX}
            t={t}
          >
            <textarea
              ref={notesRef}
              value={notes}
              maxLength={NOTES_MAX}
              rows={2}
              onInput={(e) => setNotes(e.currentTarget.value)}
            />
          </PublishField>
        )}

        {showFields && (
          <StyleDetailsFields
            name={name}
            description={description}
            onName={setName}
            onDescription={setDescription}
            focusDescription={!existing}
            t={t}
          />
        )}

        {!showFields && (
          <PublishDetailsSummary
            name={name}
            description={description}
            onEdit={() => setEditingDetails(true)}
            t={t}
          />
        )}

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
          <div class="publish-form-submit">
            <Button type="submit" disabled={blocked}>
              {label}
            </Button>

            <p>
              {t(
                'Anyone can find and install published styles. You can update or unpublish later.',
              )}
            </p>
          </div>
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
