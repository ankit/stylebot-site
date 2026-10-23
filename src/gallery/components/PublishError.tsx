import { ApiError } from '@/gallery/lib/api';

import { type Translate } from '@/i18n/t';

type Props = { error: unknown; t: Translate };

/**
 * Why publishing failed. The API words its 400s for people, naming the field
 * that's wrong, but only in English.
 */
export default function PublishError({ error, t }: Props) {
  let message = t('Couldn’t publish. Try again.');

  if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
    message = t('Couldn’t publish: {reason}', { reason: error.message });
  }

  return (
    <p class="publish-form-problem" role="alert">
      {message}
    </p>
  );
}
