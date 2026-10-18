import { type Translate } from '@/i18n/t';

import CopyButton from './CopyButton';
import CssCode from './CssCode';

import './StyleCss.css';

type Props = { css: string; t: Translate };

/**
 * A style's CSS, with a button to copy it.
 */
export default function StyleCss({ css, t }: Props) {
  const heading = t('CSS');

  return (
    <section class="style-css">
      <div class="style-css-head">
        <h2>{heading}</h2>

        <CopyButton text={css} label={t('Copy CSS')} t={t} />
      </div>

      <CssCode css={css} label={heading} />
    </section>
  );
}
