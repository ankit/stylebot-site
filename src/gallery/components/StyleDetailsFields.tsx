import { useEffect, useRef } from 'preact/hooks';

import { type Translate } from '@/i18n/t';

import PublishField from './PublishField';

// The API's limits.
const NAME_MAX = 60;
const DESCRIPTION_MAX = 200;

type Props = {
  name: string;
  description: string;
  onName: (name: string) => void;
  onDescription: (description: string) => void;
  // Puts the cursor in the description, since the name comes filled in.
  focusDescription?: boolean;
  t: Translate;
};

/**
 * A style's name and description, as the publish form edits them.
 */
export default function StyleDetailsFields({
  name,
  description,
  onName,
  onDescription,
  focusDescription = false,
  t,
}: Props) {
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (focusDescription) {
      descriptionRef.current?.focus();
    }
  }, [focusDescription]);

  return (
    <>
      <PublishField label={t('Name')} t={t}>
        <input
          value={name}
          maxLength={NAME_MAX}
          required
          onInput={(e) => onName(e.currentTarget.value)}
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
          ref={descriptionRef}
          value={description}
          maxLength={DESCRIPTION_MAX}
          rows={3}
          placeholder={t('What does it change?')}
          onInput={(e) => onDescription(e.currentTarget.value)}
        />
      </PublishField>
    </>
  );
}
