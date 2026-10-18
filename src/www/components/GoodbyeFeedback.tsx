import { useState } from 'preact/hooks';

import Button from '@/components/Button';

import { track } from '@/lib/analytics';

import { type Catalog, translator } from '@/i18n/t';

type Props = { strings: Catalog };

// Same order as `reasons` in every locale, so reports don't split by language.
const REASON_KEYS = [
  'not-needed',
  'hard-to-use',
  'broke-a-site',
  'missing-feature',
  'too-slow',
  'other',
];

/**
 * Optional uninstall survey: pick any reasons, add a note, and send it.
 */
export default function GoodbyeFeedback({ strings }: Props) {
  const t = translator(strings);
  const reasons = [
    t('Didn’t need it anymore'),
    t('Hard to use'),
    t('It broke a site'),
    t('Missing a feature'),
    t('Too slow'),
    t('Something else'),
  ];
  const [picked, setPicked] = useState<Array<string>>([]);
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);
  const ready = picked.length > 0 || note.trim().length > 0;

  const toggle = (reason: string) =>
    setPicked((p) =>
      p.includes(reason) ? p.filter((r) => r !== reason) : [...p, reason],
    );

  const send = () => {
    if (!ready) {
      return;
    }

    picked.forEach((reason) =>
      track('Uninstall reason', {
        reason: REASON_KEYS[reasons.indexOf(reason)],
      }),
    );

    if (note.trim()) {
      track('Uninstall note', { note: note.trim().slice(0, 2000) });
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div class="gb-thanks">{t('Thanks for submitting the feedback.')}</div>
    );
  }

  return (
    <div class="gb-form">
      <div class="gb-q">{t('Why did you uninstall?')}</div>
      <div class="gb-reasons">
        {reasons.map((reason) => (
          <button
            key={reason}
            class={`gb-chip${picked.includes(reason) ? ' is-on' : ''}`}
            aria-pressed={picked.includes(reason)}
            onClick={() => toggle(reason)}
          >
            {reason}
          </button>
        ))}
      </div>
      <textarea
        rows={3}
        placeholder={t('Anything else? (optional)')}
        aria-label={t('Anything else? (optional)')}
        value={note}
        onInput={(e) => setNote((e.target as HTMLTextAreaElement).value)}
      />
      <div class="gb-send">
        <Button disabled={!ready} onClick={send}>
          {t('Send feedback')}
        </Button>
      </div>
    </div>
  );
}
