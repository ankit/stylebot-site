import { useState } from 'preact/hooks';

import {
  type FeedbackState,
  useUninstallFeedback,
} from '@/www/hooks/useUninstallFeedback';

import {
  type UninstallFeedback,
  type UninstallReason,
} from '@/gallery/lib/api';

import Button from '@/components/Button';

import { currentBrowser } from '@/lib/links';

import { type Catalog, type Translate, translator } from '@/i18n/t';

import './GoodbyeFeedback.css';

type Props = { strings: Catalog; locale: string };

type Reason = {
  key: UninstallReason;
  label: string;
  // What the note asks when this is the last reason picked.
  prompt?: string;
};

const HOSTNAME =
  /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

/**
 * Optional uninstall survey: pick any reasons, answer a question about the
 * last one, and send it to the styles API.
 */
export default function GoodbyeFeedback({ strings, locale }: Props) {
  const t = translator(strings);
  const reasons: Array<Reason> = [
    {
      key: 'not-needed',
      label: t('Didn’t need it anymore'),
      prompt: t('What did you use Stylebot for?'),
    },
    {
      key: 'hard-to-use',
      label: t('Hard to use'),
      prompt: t('What was hard to do?'),
    },
    { key: 'broke-a-site', label: t('It broke a site') },
    { key: 'missing-feature', label: t('Missing a feature') },
    {
      key: 'too-slow',
      label: t('Too slow'),
      prompt: t('What felt slow?'),
    },
    {
      key: 'other',
      label: t('Something else'),
      prompt: t('What made you uninstall it?'),
    },
  ];
  const [picked, setPicked] = useState<Array<UninstallReason>>([]);
  const [site, setSite] = useState('');
  const [feature, setFeature] = useState('');
  const [note, setNote] = useState('');
  const { state, send } = useUninstallFeedback();
  const ready = picked.length > 0 || note.trim().length > 0;
  const sending = state === 'sending';

  const toggle = (reason: UninstallReason) =>
    setPicked((p) =>
      p.includes(reason) ? p.filter((r) => r !== reason) : [...p, reason],
    );

  const submit = (e: Event) => {
    e.preventDefault();

    if (!ready || sending) {
      return;
    }

    const feedback: UninstallFeedback = {
      reasons: picked,
      note: note.trim() || undefined,
      browser: currentBrowser() ?? undefined,
      version: extensionVersion(),
      locale,
    };

    if (picked.includes('broke-a-site')) {
      feedback.site = hostname(site);
    }

    if (picked.includes('missing-feature')) {
      feedback.feature = feature.trim() || undefined;
    }

    send(feedback);
  };

  if (state === 'sent') {
    return (
      <div class="gb-thanks">{t('Thanks for submitting the feedback.')}</div>
    );
  }

  const prompt = [...picked]
    .reverse()
    .map((key) => reasons.find((r) => r.key === key)?.prompt)
    .find(Boolean);
  const error = errorMessage(state, t);

  return (
    <form class="gb-form" onSubmit={submit}>
      <fieldset class="gb-reasons">
        <legend class="gb-q">{t('Why did you uninstall?')}</legend>

        {reasons.map((reason) => (
          <button
            key={reason.key}
            type="button"
            class={`gb-chip${picked.includes(reason.key) ? ' is-on' : ''}`}
            aria-pressed={picked.includes(reason.key)}
            onClick={() => toggle(reason.key)}
          >
            {reason.label}
          </button>
        ))}
      </fieldset>

      {picked.includes('broke-a-site') && (
        <label class="gb-field">
          {t('Which site did it break?')}
          <input
            type="text"
            inputMode="url"
            autoComplete="off"
            spellcheck={false}
            placeholder="example.com"
            maxLength={253}
            value={site}
            onInput={(e) => setSite(e.currentTarget.value)}
          />
        </label>
      )}

      {picked.includes('missing-feature') && (
        <label class="gb-field">
          {t('What were you looking for?')}
          <input
            type="text"
            maxLength={500}
            value={feature}
            onInput={(e) => setFeature(e.currentTarget.value)}
          />
        </label>
      )}

      <label class="gb-field">
        {prompt ?? t('Anything else? (optional)')}
        <textarea
          rows={3}
          maxLength={2000}
          value={note}
          onInput={(e) => setNote(e.currentTarget.value)}
        />
      </label>

      {error && (
        <p class="gb-error" role="alert">
          {error}
        </p>
      )}

      <div class="gb-send">
        <Button type="submit" disabled={!ready || sending}>
          {t('Send feedback')}
        </Button>

        <span class="gb-hint">{t('Feedback is anonymous')}</span>
      </div>
    </form>
  );
}

/**
 * The bare hostname in what was typed, `https://www.github.com/x` as
 * `github.com`, or nothing if it isn't one, which the API would turn away.
 */
function hostname(typed: string) {
  let text = typed.trim().toLowerCase();

  if (!text.includes('://')) {
    text = `https://${text}`;
  }

  try {
    const host = new URL(text).hostname.replace(/^www\./, '');

    if (HOSTNAME.test(host)) {
      return host;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

// The extension can add its version to the goodbye page's URL.
function extensionVersion() {
  const version = new URLSearchParams(location.search).get('version');

  if (version && /^[0-9]+(\.[0-9]+)*$/.test(version)) {
    return version;
  }

  return undefined;
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
