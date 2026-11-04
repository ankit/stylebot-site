import { useState } from 'preact/hooks';

import FeedbackDetails from '@/www/components/FeedbackDetails';
import FeedbackForm from '@/www/components/FeedbackForm';
import { useFeedback } from '@/www/hooks/useFeedback';
import { useFeedbackDetails } from '@/www/hooks/useFeedbackDetails';
import { feedbackSource } from '@/www/lib/feedback';

import { sendFeedback } from '@/gallery/lib/api';

import { type Catalog, translator } from '@/i18n/t';

import './SendFeedback.css';

type Props = { strings: Catalog; locale: string };

/**
 * The feedback page's form: a note and, for a reply, an optional email, sent
 * to the styles API with where in the extension it was opened from.
 */
export default function SendFeedback({ strings, locale }: Props) {
  const t = translator(strings);
  const [note, setNote] = useState('');
  const [email, setEmail] = useState('');
  const { state, send } = useFeedback(sendFeedback);
  const { browser, version } = useFeedbackDetails();

  const submit = () =>
    send({
      note: note.trim(),
      email: email.trim() || undefined,
      source: feedbackSource(),
      browser,
      version,
      locale,
    });

  return (
    <FeedbackForm
      state={state}
      ready={note.trim().length > 0}
      onSend={submit}
      t={t}
    >
      <label class="fb-field">
        <span>
          {t('Message')} <span aria-hidden="true">*</span>
        </span>
        <textarea
          rows={5}
          required
          maxLength={2000}
          value={note}
          onInput={(e) => setNote(e.currentTarget.value)}
        />
      </label>

      <label class="fb-field">
        {t('Email (optional)')}
        <input
          type="email"
          autoComplete="email"
          maxLength={254}
          value={email}
          onInput={(e) => setEmail(e.currentTarget.value)}
        />
        <span class="send-feedback-hint">
          {t('If you’d like a reply, please provide your email address')}
        </span>
      </label>

      <FeedbackDetails version={version} t={t} />
    </FeedbackForm>
  );
}
