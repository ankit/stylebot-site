import Button from '@/components/Button';

import { type Translate } from '@/i18n/t';

type Props = { message: string; onRetry: () => void; t: Translate };

/**
 * Says what couldn't load, with a button to try again.
 */
export default function LoadError({ message, onRetry, t }: Props) {
  return (
    <div class="g-note" role="alert">
      {message}
      <Button variant="outline" size="sm" onClick={onRetry}>
        {t('Try again')}
      </Button>
    </div>
  );
}
