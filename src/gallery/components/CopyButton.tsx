import { useCopy } from '@/gallery/hooks/useCopy';

import { type Translate } from '@/i18n/t';

type Props = { text: string; label: string; t: Translate };

/**
 * Copies `text`, and says Copied for a moment after.
 */
export default function CopyButton({ text, label, t }: Props) {
  const { copied, copy } = useCopy();

  return (
    <button
      class="btn btn-outline btn-sm"
      onClick={() => copy(text)}
      aria-live="polite"
    >
      {copied && t('Copied')}
      {!copied && label}
    </button>
  );
}
