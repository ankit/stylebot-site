import { useCopy } from '@/gallery/hooks/useCopy';

import Button from '@/components/Button';

import { type Translate } from '@/i18n/t';

type Props = { text: string; label: string; t: Translate };

/**
 * Copies `text`, and says Copied for a moment after.
 */
export default function CopyButton({ text, label, t }: Props) {
  const { copied, copy } = useCopy();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => copy(text)}
      aria-live="polite"
    >
      {copied && t('Copied')}
      {!copied && label}
    </Button>
  );
}
