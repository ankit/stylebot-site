import { useState } from 'preact/hooks';

import { type ReportState } from '@/gallery/hooks/useReport';

import Button from '@/components/Button';

import { type Translate } from '@/i18n/t';

import Dialog from './Dialog';

import './ReportDialog.css';

// The API's limit is 500 characters, which includes the reason's label.
const DETAILS_MAX = 400;

type Reason = 'screenshot' | 'spam' | 'broken' | 'other';

// Sent in English, since moderators read them.
const REASON_LABELS: Record<Reason, string> = {
  screenshot: 'Inappropriate screenshot',
  spam: 'Spam or misleading',
  broken: 'Broken or malicious CSS',
  other: 'Other',
};

type Props = {
  name: string;
  state: ReportState;
  signedIn: boolean;
  onSend: (reason: string) => void;
  onClose: () => void;
  t: Translate;
};

/**
 * Asks why a style is being reported, with optional details, then thanks
 * the reporter.
 */
export default function ReportDialog({
  name,
  state,
  signedIn,
  onSend,
  onClose,
  t,
}: Props) {
  const [reason, setReason] = useState<Reason>('screenshot');
  const [details, setDetails] = useState('');

  if (state === 'sent') {
    return (
      <Dialog
        title={t('Thanks for reporting')}
        onClose={onClose}
        actions={
          <Button size="sm" onClick={onClose}>
            {t('Close')}
          </Button>
        }
      >
        <p>
          {t(
            'A moderator will take a look. Styles reported by several people are hidden until then.',
          )}
        </p>
      </Dialog>
    );
  }

  const reasons: Array<{ value: Reason; label: string }> = [
    { value: 'screenshot', label: t('Inappropriate screenshot') },
    { value: 'spam', label: t('Spam or misleading') },
    { value: 'broken', label: t('Broken or malicious CSS') },
    // i18n: A reason for reporting a style, explained in a text box below.
    { value: 'other', label: t('Other') },
  ];
  const sending = state === 'sending';
  const needsDetails = reason === 'other' && !details.trim();

  const submit = (e: Event) => {
    e.preventDefault();

    let text = REASON_LABELS[reason];

    if (details.trim()) {
      text = `${text}: ${details.trim()}`;
    }

    onSend(text);
  };

  let sendLabel = t('Sign in and report');

  if (signedIn) {
    sendLabel = t('Report');
  }

  if (sending) {
    sendLabel = t('Reporting…');
  }

  const error = errorMessage(state, t);

  return (
    <Dialog
      title={t('Report {name}', { name })}
      onClose={onClose}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t('Cancel')}
          </Button>

          <Button
            type="submit"
            form="report-style"
            size="sm"
            disabled={sending || needsDetails}
          >
            {sendLabel}
          </Button>
        </>
      }
    >
      <form id="report-style" class="dialog-form" onSubmit={submit}>
        <fieldset class="report-reasons">
          <legend>{t('What’s wrong with it?')}</legend>

          {reasons.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name="reason"
                value={option.value}
                checked={reason === option.value}
                onChange={() => setReason(option.value)}
              />

              {option.label}
            </label>
          ))}
        </fieldset>

        <label>
          {t('Details')}
          <textarea
            value={details}
            maxLength={DETAILS_MAX}
            rows={3}
            required={reason === 'other'}
            onInput={(e) => setDetails(e.currentTarget.value)}
          />
        </label>

        <p class="dialog-hint">
          {t('Only moderators see reports. Each account counts once.')}
        </p>

        {error && (
          <p class="dialog-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </Dialog>
  );
}

function errorMessage(state: ReportState, t: Translate) {
  switch (state) {
    case 'signInFailed':
      return t('Couldn’t sign in. Try again.');
    case 'signedOut':
      return t('You’ve been signed out. Sign in again to report it.');
    case 'forbidden':
      return t('Sign in to report this style.');
    case 'gone':
      return t('This style is no longer published.');
    case 'failed':
      return t('Couldn’t send the report. Try again.');
    default:
      return null;
  }
}
