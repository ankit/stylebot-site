import { ApiError } from '@/gallery/lib/api';

import { type Translate } from '@/i18n/t';

type Props = { error: unknown; t: Translate };

/**
 * Why publishing failed. The API words its 400s for people, naming the field
 * that's wrong, but only in English.
 */
export default function PublishError({ error, t }: Props) {
  let message = t('Couldn’t publish. Try again.');

  if (error instanceof ApiError && error.status === 400) {
    message = t('Couldn’t publish: {reason}', { reason: error.message });
  } else if (error instanceof ApiError && error.status === 403) {
    message = t('This account can’t publish this style.');
  } else if (error instanceof ApiError && error.status === 409) {
    message = t('The style changed while this was publishing. Try again.');
  } else if (error instanceof ApiError && error.status === 413) {
    message = t(
      'The screenshot is too large. Choose Publish in Stylebot again to take a new one.',
    );
  }

  return (
    <p class="publish-form-problem" role="alert">
      {message}
    </p>
  );
}
