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
  t,
}: Props) {
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
          value={description}
          maxLength={DESCRIPTION_MAX}
          rows={3}
          placeholder={t(
            'What does it change? For example: serif headlines, a narrower column.',
          )}
          onInput={(e) => onDescription(e.currentTarget.value)}
        />
      </PublishField>
    </>
  );
}
