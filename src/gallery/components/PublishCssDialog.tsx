import { useState } from 'preact/hooks';

import { type DiffLine, toHunks } from '@/gallery/lib/diff';

import Button from '@/components/Button';

import { type Translate } from '@/i18n/t';

import CssCode from './CssCode';
import CssDiff from './CssDiff';
import Dialog from './Dialog';

import './PublishCssDialog.css';

// `diff` is an update's lines against the latest version, or null for a new
// style or one whose CSS is unchanged.
type Props = {
  css: string;
  diff: Array<DiffLine> | null;
  onClose: () => void;
  t: Translate;
};

/**
 * The CSS to publish: an update's changes, with all of it a click away, or
 * all of it for a new style.
 */
export default function PublishCssDialog({ css, diff, onClose, t }: Props) {
  const [showAll, setShowAll] = useState(false);
  const cssLabel = t('CSS');
  let toggle = t('Show all CSS');

  if (showAll) {
    toggle = t('Show changes');
  }

  return (
    <Dialog
      title={cssLabel}
      wide
      onClose={onClose}
      actions={
        <>
          {diff && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              class="publish-css-dialog-toggle"
              onClick={() => setShowAll(!showAll)}
            >
              {toggle}
            </Button>
          )}

          <Button type="button" size="sm" onClick={onClose}>
            {t('Close')}
          </Button>
        </>
      }
    >
      <div class="publish-css-dialog">
        {diff && !showAll && <CssDiff hunks={toHunks(diff)} label={cssLabel} />}

        {(!diff || showAll) && <CssCode css={css} label={cssLabel} />}
      </div>
    </Dialog>
  );
}
