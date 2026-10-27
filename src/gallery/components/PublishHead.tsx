import { type Translate } from '@/i18n/t';

import Favicon from './Favicon';
import UrlPatternNote from './UrlPatternNote';

import './PublishHead.css';

type Draft = { site: string; urlPattern: string | null };

type Props = {
  title?: string;
  draft?: Draft | null;
  t: Translate;
};

/**
 * The publish page's title and, once the draft is known, the site it's for
 * and any URL pattern within it.
 */
export default function PublishHead({ title, draft, t }: Props) {
  return (
    <div class="publish-head">
      <h1 class="g-title publish-title">
        {title ?? t('Publish to the Gallery')}
      </h1>

      {draft && (
        <div class="publish-where">
          <span class="publish-site">
            <Favicon site={draft.site} size={18} />
            {draft.site}
          </span>

          {draft.urlPattern && (
            <UrlPatternNote pattern={draft.urlPattern} t={t} />
          )}
        </div>
      )}
    </div>
  );
}
