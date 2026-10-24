import { type Translate } from '@/i18n/t';

import PublishField from './PublishField';
import PublishTextarea from './PublishTextarea';

// The API's limit.
const NOTES_MAX = 200;

type Props = { value: string; onInput: (notes: string) => void; t: Translate };

/**
 * What a new version changed, with the cursor in it, since it's what an
 * update asks for first.
 */
export default function VersionNotesField({ value, onInput, t }: Props) {
  return (
    <PublishField
      label={
        // i18n: A field for notes on what a new version of a style changed.
        t('What changed')
      }
      optional
      length={value.length}
      max={NOTES_MAX}
      t={t}
    >
      <PublishTextarea
        value={value}
        max={NOTES_MAX}
        rows={2}
        focus
        onInput={onInput}
        t={t}
      />
    </PublishField>
  );
}
