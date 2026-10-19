import { type OwnStyle, screenshotUrl } from '@/gallery/lib/api';
import { compactNumber, timeAgo } from '@/gallery/lib/format';
import { styleHref } from '@/gallery/lib/paths';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import Favicon from './Favicon';

import './MyStyleRow.css';

type Props = { style: OwnStyle; locale: Locale; t: Translate };

/**
 * One of the account's styles: its screenshot and name, linking to its page
 * while it's live, its site, when it was updated and its installs.
 */
export default function MyStyleRow({ style, locale, t }: Props) {
  const live = style.status === 'live';

  return (
    <li class="my-style-row">
      {live && (
        <a class="my-style-shot" href={styleHref(locale, style)} tabIndex={-1}>
          <img src={screenshotUrl(style)} alt="" loading="lazy" />
        </a>
      )}

      {!live && <span class="my-style-shot" />}

      <div class="my-style-main">
        <div class="my-style-name">
          {live && <a href={styleHref(locale, style)}>{style.name}</a>}

          {!live && <span>{style.name}</span>}

          {!live && (
            <span class="my-style-badge">
              {
                // i18n: A badge on one of your styles that was hidden after people reported it.
                t('Hidden after reports')
              }
            </span>
          )}
        </div>

        <div class="my-style-meta">
          <span class="my-style-site">
            <Favicon site={style.site} />
            {style.site}
          </span>

          <span aria-hidden="true">·</span>

          <span>
            {t('Updated {time}', { time: timeAgo(locale, style.updatedAt) })}
          </span>
        </div>
      </div>

      <div class="my-style-installs">
        <strong>{compactNumber(locale, style.installs)}</strong>
        {t('Installs')}
      </div>
    </li>
  );
}
