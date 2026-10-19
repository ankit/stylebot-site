import { useAction } from '@/gallery/hooks/useAction';
import { type OwnStyle, publishStyle } from '@/gallery/lib/api';

import Button from '@/components/Button';

import { type Translate } from '@/i18n/t';

type Props = {
  style: OwnStyle;
  session: string;
  onChange: (style: OwnStyle) => void;
  t: Translate;
};

/**
 * Publishes an unpublished style again, as it was.
 */
export default function PublishButton({ style, session, onChange, t }: Props) {
  const { run, busy, failed } = useAction(
    () => publishStyle(session, style.id),
    onChange,
  );
  let label = t('Publish');

  if (busy) {
    label = t('Publishing…');
  } else if (failed) {
    // i18n: On the Publish button after it failed.
    label = t('Couldn’t publish. Try again');
  }

  return (
    <Button variant="outline" size="sm" onClick={run} disabled={busy}>
      {label}
    </Button>
  );
}
