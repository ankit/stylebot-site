import { type Translate } from '@/i18n/t';

import UrlPattern from './UrlPattern';

import './UrlPatternNote.css';

type Props = { pattern: string; t: Translate };

// Stands in for the pattern in the translated text, which is split around it.
const SLOT = '\u0000';

/**
 * The Stylebot URL pattern a style applies to, for one that's more than a
 * site, such as `^https://chatgpt\.com/(?!codex)`.
 */
export default function UrlPatternNote({ pattern, t }: Props) {
  const [before, after] =
    // i18n: {pattern} is a URL pattern or regular expression, such as ^https://chatgpt\.com/(?!codex), shown as code.
    t('Applies to pages matching {pattern}', { pattern: SLOT }).split(SLOT);

  return (
    <p class="url-pattern-note">
      {before}
      <UrlPattern pattern={pattern} />
      {after}
    </p>
  );
}
