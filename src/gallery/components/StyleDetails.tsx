import { useState } from 'preact/hooks';

import { type Translate } from '@/i18n/t';

import PublishDetailsSummary from './PublishDetailsSummary';
import StyleDetailsFields from './StyleDetailsFields';

type Props = {
  name: string;
  description: string;
  onName: (name: string) => void;
  onDescription: (description: string) => void;
  isUpdate: boolean;
  // Shows the fields even for an update, when they're all it can change.
  open: boolean;
  t: Translate;
};

/**
 * A style's name and description: fields for a new style, and a summary to
 * edit for an update, where they rarely change.
 */
export default function StyleDetails({
  name,
  description,
  onName,
  onDescription,
  isUpdate,
  open,
  t,
}: Props) {
  const [editing, setEditing] = useState(!isUpdate);

  if (editing || open) {
    return (
      <StyleDetailsFields
        name={name}
        description={description}
        onName={onName}
        onDescription={onDescription}
        focusDescription={!isUpdate}
        t={t}
      />
    );
  }

  return (
    <PublishDetailsSummary
      name={name}
      description={description}
      onEdit={() => setEditing(true)}
      t={t}
    />
  );
}
