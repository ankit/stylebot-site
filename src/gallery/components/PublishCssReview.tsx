import { useState } from 'preact/hooks';

import { diffLines, toHunks } from '@/gallery/lib/diff';

import { type Translate } from '@/i18n/t';

import CssCode from './CssCode';
import CssDiff from './CssDiff';

import './PublishCssReview.css';

// `before` is the latest published CSS, to show an update as its changes.
type Props = { css: string; before: string | null | undefined; t: Translate };

/**
 * The CSS to publish: for an update, what it changes from the latest version,
 * with the whole CSS a click away; otherwise all of it.
 */
export default function PublishCssReview({ css, before, t }: Props) {
  const [showAll, setShowAll] = useState(false);
  const cssLabel = t('CSS');
  let lines = null;

  if (before) {
    lines = diffLines(before, css);
  }

  const changed = lines?.filter((line) => line.kind !== 'same');

  if (!lines || !changed || changed.length === 0) {
    return (
      <div class="publish-css">
        <div class="publish-css-head">
          {cssLabel}
          <span>{t('Lines: {count}', { count: css.split('\n').length })}</span>
        </div>

        <CssCode css={css} label={cssLabel} />
      </div>
    );
  }

  const added = changed.filter((line) => line.kind === 'added').length;
  const removed = changed.length - added;
  const changesLabel = t('Changes since the latest version');
  let toggle = t('Show all CSS');

  if (showAll) {
    toggle = t('Show changes');
  }

  return (
    <div class="publish-css">
      <div class="publish-css-head">
        {changesLabel}
        <span>
          <span class="publish-css-added">+{added}</span>{' '}
          <span class="publish-css-removed">−{removed}</span>
          <button type="button" onClick={() => setShowAll(!showAll)}>
            {toggle}
          </button>
        </span>
      </div>

      {showAll && <CssCode css={css} label={cssLabel} />}

      {!showAll && <CssDiff hunks={toHunks(lines)} label={changesLabel} />}
    </div>
  );
}
