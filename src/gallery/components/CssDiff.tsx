import { type DiffLine } from '@/gallery/lib/diff';

import './CssDiff.css';

type Props = { hunks: Array<Array<DiffLine>>; label: string };

const SIGNS = { same: ' ', added: '+', removed: '−' };

/**
 * The lines an update adds and removes, with a few unchanged ones around
 * each change and a gap where more are left out.
 */
export default function CssDiff({ hunks, label }: Props) {
  return (
    <div class="css-diff" role="region" aria-label={label} tabIndex={0}>
      {hunks.map((hunk, h) => (
        <div class="css-diff-hunk" key={h}>
          {hunk.map((line, n) => (
            <div class={`css-diff-line is-${line.kind}`} key={n}>
              <span class="css-diff-number" aria-hidden="true">
                {line.number}
              </span>

              <span class="css-diff-sign" aria-hidden="true">
                {SIGNS[line.kind]}
              </span>

              <span class="css-diff-text">{line.text}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
