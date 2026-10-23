import { useState } from 'preact/hooks';

import { type usePublish } from '@/gallery/hooks/usePublish';
import { useScreenshotChoice } from '@/gallery/hooks/useScreenshotChoice';
import { type OwnStyle } from '@/gallery/lib/api';
import { type PublishDraft } from '@/gallery/lib/bridge';

import Button from '@/components/Button';

import { type Translate } from '@/i18n/t';

import CssCode from './CssCode';
import CssUnchangedNotice from './CssUnchangedNotice';
import PublishError from './PublishError';
import PublishField from './PublishField';
import ScreenshotPicker from './ScreenshotPicker';

import './PublishForm.css';

// The API's limits.
const NAME_MAX = 60;
const DESCRIPTION_MAX = 200;
const NOTES_MAX = 200;

type Props = {
  draft: PublishDraft;
  existing: OwnStyle | null;
  publishing: ReturnType<typeof usePublish>;
  canPublish: boolean;
  t: Translate;
};

/**
 * The draft's name, description and, for a new version, what changed, then
 * its CSS and Publish last, beside the screenshot. A new version starts from
 * the style's details.
 */
export default function PublishForm({
  draft,
  existing,
  publishing,
  canPublish,
  t,
}: Props) {
  const [name, setName] = useState(existing?.name ?? draft.name);
  const [description, setDescription] = useState(existing?.description ?? '');
  const [notes, setNotes] = useState('');
  const choice = useScreenshotChoice(draft, existing);
  const { busy } = publishing;
  const details = {
    name: name.trim(),
    description: description.trim(),
    notes: notes.trim(),
  };
  const blocked =
    !canPublish ||
    busy ||
    !details.name ||
    choice.source === 'none' ||
    publishing.unchanged;
  const cssLabel = t('CSS');
  let label = t('Publish');

  if (busy) {
    label = t('Publishing…');
  }

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

        <PublishField label={t('Name')} t={t}>
          <input
            value={name}
            maxLength={NAME_MAX}
            required
            onInput={(e) => setName(e.currentTarget.value)}
          />
        </PublishField>

        <PublishField
          label={t('Description')}
          optional
          hint={t('Shown on the style’s Gallery page.')}
          length={description.length}
          max={DESCRIPTION_MAX}
          t={t}
        >
          <textarea
            value={description}
            maxLength={DESCRIPTION_MAX}
            rows={3}
            placeholder={t(
              'What does it change? For example: serif headlines, a narrower column.',
            )}
            onInput={(e) => setDescription(e.currentTarget.value)}
          />
        </PublishField>

        {existing && (
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
              value={notes}
              maxLength={NOTES_MAX}
              rows={2}
              onInput={(e) => setNotes(e.currentTarget.value)}
            />
          </PublishField>
        )}

        <div class="publish-form-css">
          <div class="publish-form-css-head">
            {cssLabel}
            <span>
              {t('Lines: {count}', { count: draft.css.split('\n').length })}
            </span>
          </div>

          <CssCode css={draft.css} label={cssLabel} />
        </div>

        <hr class="publish-form-rule" />

        {publishing.unchanged && (
          <CssUnchangedNotice
            busy={busy}
            onSave={() => publishing.saveDetails(details)}
            t={t}
          />
        )}

        {!publishing.unchanged && publishing.error !== undefined && (
          <PublishError error={publishing.error} t={t} />
        )}

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
