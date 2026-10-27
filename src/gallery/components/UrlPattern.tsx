import { Fragment } from 'preact';

import { patternSegments } from '@/gallery/lib/urlPattern';

import './UrlPattern.css';

type Props = { pattern: string };

/**
 * A URL pattern as code, which wraps only between path segments unless one
 * is too long for a line by itself.
 */
export default function UrlPattern({ pattern }: Props) {
  return (
    <code class="url-pattern">
      {patternSegments(pattern).map((segment, i) => (
        <Fragment key={i}>
          {i > 0 && <wbr />}
          {segment}
        </Fragment>
      ))}
    </code>
  );
}
