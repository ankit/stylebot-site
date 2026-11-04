import { type Translate } from '@/i18n/t';

import './FeedbackDetails.css';

type Props = { version?: string; t: Translate };

/**
 * Shows the extension version sent along with the feedback.
 */
export default function FeedbackDetails({ version, t }: Props) {
  if (!version) {
    return null;
  }

  return (
    <dl class="fb-details">
      <dt>{t('Stylebot version')}</dt>

      <dd>{version}</dd>
    </dl>
  );
}
