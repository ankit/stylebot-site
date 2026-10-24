import { useEffect, useRef } from 'preact/hooks';

import { useAutoResize } from '@/gallery/hooks/useAutoResize';

import { type Translate } from '@/i18n/t';

type Props = {
  value: string;
  max: number;
  rows: number;
  focus?: boolean;
  onInput: (value: string) => void;
  t: Translate;
};

/**
 * A publish form textarea that grows with its text and stops the form
 * submitting while the text is over `max`.
 */
export default function PublishTextarea({
  value,
  max,
  rows,
  focus = false,
  onInput,
  t,
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const over = value.length > max;

  useAutoResize(ref, value);

  useEffect(() => {
    if (focus) {
      ref.current?.focus();
    }
  }, [focus]);

  useEffect(() => {
    let message = '';

    if (over) {
      // i18n: Shown when a form field has more characters than it allows.
      message = t('Shorten this to {max} characters or fewer.', { max });
    }

    ref.current?.setCustomValidity(message);
  }, [over, max, t]);

  return (
    <textarea
      ref={ref}
      value={value}
      rows={rows}
      aria-invalid={over}
      onInput={(e) => onInput(e.currentTarget.value)}
    />
  );
}
