import { useState } from 'preact/hooks';

import { type usePublish } from '@/gallery/hooks/usePublish';
import { useScreenshotChoice } from '@/gallery/hooks/useScreenshotChoice';
import { type OwnStyle } from '@/gallery/lib/api';
import { type PublishDraft } from '@/gallery/lib/bridge';

import Button from '@/components/Button';

import { type Translate } from '@/i18n/t';

import CssUnchangedNotice from './CssUnchangedNotice';
import Favicon from './Favicon';
import PublishError from './PublishError';
import ScreenshotPicker from './ScreenshotPicker';
import StyleCss from './StyleCss';

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
 * The draft's screenshot and CSS, with its name, description and, for a new
 * version, what changed. A new version starts from the style's details.
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
  const needsScreenshot = choice.source === 'none';
  const blocked =
    !canPublish ||
    busy ||
    !details.name ||
    needsScreenshot ||
    publishing.unchanged;
  let heading = t('New style for {site}', { site: draft.site });
  let label = t('Publish');

  if (existing) {
    heading = t('New version of {name}', { name: existing.name });
  }

  if (busy) {
    label = t('Publishing…');
  }

  const submit = (e: Event) => {
    e.preventDefault();
    publishing.publish(details, choice.screenshot);
  };

  return (
    <form class="publish-form" onSubmit={submit}>
      <div class="publish-form-top">
        <ScreenshotPicker
          choice={choice}
          alt={t('Screenshot of {name} on {site}', {
            name: details.name,
            site: draft.site,
          })}
          t={t}
        />

        <div class="publish-form-fields">
          <a
            class="publish-form-site"
            href={draft.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Favicon site={draft.site} />
            {heading}
          </a>

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

          {existing && (
            <label>
              {
                // i18n: A field for notes on what a new version of a style changed.
                t('What changed')
              }
              <textarea
                value={notes}
                maxLength={NOTES_MAX}
                rows={2}
                onInput={(e) => setNotes(e.currentTarget.value)}
              />
            </label>
          )}

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

          <Button type="submit" class="publish-form-submit" disabled={blocked}>
            {label}
          </Button>
        </div>
      </div>

      <StyleCss css={draft.css} t={t} />
    </form>
  );
}
