import { type ComponentChildren } from 'preact';

import { type FeedbackState } from '@/www/hooks/useFeedback';

import Button from '@/components/Button';

import { type Translate } from '@/i18n/t';

import './FeedbackForm.css';

type Props = {
  state: FeedbackState;
  ready: boolean;
  // Next to the send button, such as whether the feedback is anonymous.
  hint?: string;
  onSend: () => void;
  t: Translate;
  children: ComponentChildren;
};

/**
 * A feedback form's frame: its fields, why sending failed, and the send
 * button, then a thank-you once it's sent.
 */
export default function FeedbackForm({
  state,
  ready,
  hint,
  onSend,
  t,
  children,
}: Props) {
  const sending = state === 'sending';

  const submit = (e: Event) => {
    e.preventDefault();

    if (ready && !sending) {
      onSend();
    }
  };

  if (state === 'sent') {
    return (
      <div class="fb-thanks">{t('Thanks for submitting the feedback.')}</div>
    );
  }

  const error = errorMessage(state, t);

  return (
    <form class="fb-form" onSubmit={submit}>
      {children}

      {error && (
        <p class="fb-error" role="alert">
          {error}
        </p>
      )}

      <div class="fb-send">
        <Button type="submit" disabled={!ready || sending}>
          {t('Send feedback')}
        </Button>

        {hint && <span class="fb-hint">{hint}</span>}
      </div>
    </form>
  );
}

function errorMessage(state: FeedbackState, t: Translate) {
  switch (state) {
    case 'limited':
      return t('That’s a lot of feedback at once. Try again in a minute.');
    case 'failed':
      return t('Couldn’t send your feedback. Try again.');
    default:
      return null;
  }
}
