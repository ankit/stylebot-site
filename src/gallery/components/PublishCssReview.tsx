import { useState } from 'preact/hooks';

import { diffLines } from '@/gallery/lib/diff';

import Button from '@/components/Button';

import { type Translate } from '@/i18n/t';

import PublishCssDialog from './PublishCssDialog';

import './PublishCssReview.css';

// `before` is the latest published CSS, to show an update as its changes.
type Props = { css: string; before: string | null | undefined; t: Translate };

/**
 * A button that opens the CSS to publish in a dialog: for an update, its
 * changes, with how many lines it adds and removes on the button; otherwise
 * all of it.
 */
export default function PublishCssReview({ css, before, t }: Props) {
  const [open, setOpen] = useState(false);
  let lines = null;

  if (before) {
    lines = diffLines(before, css);
  }

  const changed = lines?.filter((line) => line.kind !== 'same') ?? [];
  const added = changed.filter((line) => line.kind === 'added').length;
  const removed = changed.length - added;
  let diff = null;
  let view = t('View CSS');

  if (lines && changed.length > 0) {
    diff = lines;
    view = t('View changes');
  }

  return (
    <div class="publish-css">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
      >
        {view}

        {diff && (
          <span class="publish-css-counts">
            {added > 0 && <span class="publish-css-added">+{added}</span>}

            {removed > 0 && <span class="publish-css-removed">−{removed}</span>}
          </span>
        )}
      </Button>

      {open && (
        <PublishCssDialog
          css={css}
          diff={diff}
          onClose={() => setOpen(false)}
          t={t}
        />
      )}
    </div>
  );
}
