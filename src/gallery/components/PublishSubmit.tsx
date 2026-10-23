import Button from '@/components/Button';

import { type Translate } from '@/i18n/t';

import './PublishSubmit.css';

type Props = {
  isUpdate: boolean;
  busy: boolean;
  disabled: boolean;
  t: Translate;
};

/**
 * Publish, or Publish update, with a line on what publishing means.
 */
export default function PublishSubmit({ isUpdate, busy, disabled, t }: Props) {
  let label = t('Publish');

  if (isUpdate) {
    label = t('Publish update');
  }

  if (busy) {
    label = t('Publishing…');
  }

  return (
    <div class="publish-submit">
      <Button type="submit" disabled={disabled}>
        {label}
      </Button>

      <p>
        {t(
          'Anyone can find and install published styles. You can update or unpublish later.',
        )}
      </p>
    </div>
  );
}
