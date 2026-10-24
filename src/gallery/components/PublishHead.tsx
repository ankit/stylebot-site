import { type PublishDraft } from '@/gallery/lib/bridge';

import { type Translate } from '@/i18n/t';

import Favicon from './Favicon';

import './PublishHead.css';

type Props = {
  title?: string;
  draft?: Pick<PublishDraft, 'site' | 'url'> | null;
  t: Translate;
};

/**
 * The publish page's title and, once the draft is known, the site it's for,
 * linking to the page Stylebot published from.
 */
export default function PublishHead({ title, draft, t }: Props) {
  return (
    <div class="publish-head">
      <h1 class="g-title publish-title">
        {title ?? t('Publish to the Gallery')}
      </h1>

      {draft && (
        <a
          class="publish-site"
          href={draft.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Favicon site={draft.site} />
          {draft.site}
        </a>
      )}
    </div>
  );
}
