import Button from '@/components/Button';

import { type Translate } from '@/i18n/t';

import './PublishDetailsSummary.css';

type Props = {
  name: string;
  description: string;
  onEdit: () => void;
  t: Translate;
};

/**
 * A style's name and description as they'll stay, with Edit to change them,
 * for an update, where they rarely change.
 */
export default function PublishDetailsSummary({
  name,
  description,
  onEdit,
  t,
}: Props) {
  return (
    <div class="publish-details">
      <div class="publish-details-text">
        <strong>{name}</strong>

        {description && <p>{description}</p>}

        {!description && <p>{t('No description')}</p>}
      </div>

      <Button variant="outline" size="sm" onClick={onEdit}>
        {t('Edit')}
      </Button>
    </div>
  );
}
