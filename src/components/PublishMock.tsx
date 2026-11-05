import { type Translate } from '@/i18n/t';

import './PublishMock.css';

/**
 * Stylebot's popup with a style's ⋯ menu open on Publish to Gallery.
 */
export default function PublishMock({ t }: { t: Translate }) {
  return (
    <div data-ed class="pub">
      <div class="pub-head">
        <b>news.ycombinator.com</b>
      </div>

      <div class="pub-styles">
        <span class="pub-row">{t('No style')}</span>

        <div class="pub-row pub-active">
          <span>HN Terminal</span>
          <span class="pub-more">⋯</span>
        </div>

        <span class="pub-row">Daily HN Edition</span>

        <span class="pub-row pub-muted">{t('Create profile')}</span>

        <div class="pub-menu">
          <span>{t('Edit')}</span>
          <span>{t('Rename')}</span>
          <span class="pub-highlight">
            {t('Publish to Gallery')}
            <svg class="pub-cursor" width="18" height="22" viewBox="0 0 18 22">
              <path
                d="M1 1 L1 17 L5.5 13 L8.5 20 L11.5 18.8 L8.6 12 L14.5 12 Z"
                fill="#191b1f"
                stroke="#fff"
                stroke-width="1.4"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <hr />
          <span>{t('Delete')}</span>
        </div>
      </div>
    </div>
  );
}
