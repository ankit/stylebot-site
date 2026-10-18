import { cssLines } from '@/gallery/lib/css';

import './CssCode.css';

type Props = { css: string; label: string };

/**
 * CSS with colored syntax and line numbers, wrapped so it never scrolls
 * sideways.
 */
export default function CssCode({ css, label }: Props) {
  return (
    <div class="css-code" role="region" aria-label={label} tabIndex={0}>
      <code>
        {cssLines(css).map((line, n) => (
          <div class="css-code-line" key={n}>
            <span class="css-code-number" aria-hidden="true">
              {n + 1}
            </span>

            <span class="css-code-text">
              {line.map((run, i) => (
                <span key={i} class={`css-${run.kind}`}>
                  {run.text}
                </span>
              ))}
            </span>
          </div>
        ))}
      </code>
    </div>
  );
}
