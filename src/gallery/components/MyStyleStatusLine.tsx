import { type OwnStyle } from '@/gallery/lib/api';

import { type Translate } from '@/i18n/t';

import './MyStyleStatusLine.css';

type Props = {
  style: OwnStyle;
  changed: boolean;
  t: Translate;
};

/**
 * One of the account's styles' status in the Gallery: hidden after reports,
 * with unpublished changes, or published.
 */
export default function MyStyleStatusLine({ style, changed, t }: Props) {
  if (style.status === 'hidden') {
    return (
      <span class="my-style-badge">
        {
          // i18n: A badge on one of your styles that was hidden after people reported it.
          t('Hidden after reports')
        }
      </span>
    );
  }

  if (changed) {
    return (
      <span class="my-style-badge">
        {
          // i18n: A badge on one of your styles whose profile in Stylebot has changes you haven't published.
          t('Unpublished changes')
        }
      </span>
    );
  }

  return (
    <span class="my-style-status-state">
      {
        // i18n: The status of one of your styles that's listed in the Gallery.
        t('Published')
      }
    </span>
  );
}
