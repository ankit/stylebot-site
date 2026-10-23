import { useEffect, useRef } from 'preact/hooks';

import { type Translate } from '@/i18n/t';

import PublishField from './PublishField';

// The API's limit.
const NOTES_MAX = 200;

type Props = { value: string; onInput: (notes: string) => void; t: Translate };

/**
 * What a new version changed, with the cursor in it, since it's what an
 * update asks for first.
 */
export default function VersionNotesField({ value, onInput, t }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <PublishField
      label={
        // i18n: A field for notes on what a new version of a style changed.
        t('What changed')
      }
      optional
      hint={t('Shown in the style’s version history.')}
      length={value.length}
      max={NOTES_MAX}
      t={t}
    >
      <textarea
        ref={ref}
        value={value}
        maxLength={NOTES_MAX}
        rows={2}
        onInput={(e) => onInput(e.currentTarget.value)}
      />
    </PublishField>
  );
}
