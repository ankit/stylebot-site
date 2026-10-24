import { type Translate } from '@/i18n/t';

import PublishField from './PublishField';
import PublishTextarea from './PublishTextarea';

// The API's limits.
const NAME_MAX = 60;
const DESCRIPTION_MAX = 1000;

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
        length={description.length}
        max={DESCRIPTION_MAX}
        t={t}
      >
        <PublishTextarea
          value={description}
          max={DESCRIPTION_MAX}
          rows={3}
          focus={focusDescription}
          onInput={onDescription}
          t={t}
        />
      </PublishField>
    </>
  );
}
